import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { getDownloadUrl } from "@/lib/cloudinary";

/**
 * Public download route — no session required. Direct link: click → download.
 *
 * The file is streamed THROUGH this route (not a redirect) so we can count a
 * download only when the transfer actually completes. The counter is bumped
 * exactly once, when the whole file has been read and handed to the client.
 *   - Interrupted / aborted transfer  → stream `cancel` fires → NOT counted.
 *   - Prefetch / mailbox link-scanner → 204, never streamed, NOT counted.
 *   - Over the limit / expired / bad  → clean JSON message, never a 500.
 *
 * The two downloads are a buyer's second chance, not a trap — so anything
 * short of a genuine completed download leaves the count untouched.
 */
export const maxDuration = 60;

const DOWNLOAD_LIMIT = 2;

function isPrefetch(req: NextRequest): boolean {
  const h = req.headers;
  return (
    (h.get("sec-purpose")?.includes("prefetch") ?? false) ||
    h.get("purpose") === "prefetch" ||
    h.get("x-purpose") === "preview" ||
    h.get("x-moz") === "prefetch"
  );
}

function safeFilename(title: string | null | undefined): string {
  // Strip only filesystem-unsafe characters; keep Cyrillic/Latin letters.
  const base = (title ?? "")
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 80);
  return base || "photonia-photo";
}

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  // ── Env sanity — fail fast & loud, never a raw 500 ──────────────────
  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME ?? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName || !process.env.CLOUDINARY_API_SECRET) {
    console.error("[downloads] Cloudinary not configured", {
      hasCloud: !!cloudName,
      hasSecret: !!process.env.CLOUDINARY_API_SECRET,
    });
    return NextResponse.json(
      { error: "Услугата за преземање привремено е недостапна. Обиди се повторно." },
      { status: 503 }
    );
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("[downloads] SUPABASE_SERVICE_ROLE_KEY missing — RLS will hide order_items");
    return NextResponse.json(
      { error: "Услугата за преземање привремено е недостапна. Обиди се повторно." },
      { status: 503 }
    );
  }

  try {
    const supabase = createAdminClient();

    const { data: item, error: lookupError } = await supabase
      .from("order_items")
      .select("id, download_token, download_expires_at, download_count, photo:photos(cloudinary_public_id, title)")
      .eq("download_token", params.token)
      .maybeSingle();

    if (lookupError) {
      console.error("[downloads] lookup failed:", lookupError.message);
      return NextResponse.json({ error: "Внатрешна грешка при пребарување." }, { status: 500 });
    }
    if (!item) {
      return NextResponse.json({ error: "Линкот не е валиден." }, { status: 404 });
    }
    if (new Date(item.download_expires_at) < new Date()) {
      return NextResponse.json({ error: "Линкот истече." }, { status: 410 });
    }

    // Hard cap — checked before any transfer, never climbs past the limit.
    const used = item.download_count ?? 0;
    if (used >= DOWNLOAD_LIMIT) {
      return NextResponse.json(
        {
          error:
            "Достигнат е лимитот на преземања за оваа фотографија. За повторно преземање контактирајте support@photonia.mk.",
        },
        { status: 429 }
      );
    }

    // Supabase types embedded relations as an array; tolerate both shapes.
    const photoRel = item.photo as
      | { cloudinary_public_id: string; title: string | null }
      | { cloudinary_public_id: string; title: string | null }[]
      | null;
    const photo = Array.isArray(photoRel) ? photoRel[0] : photoRel;
    const publicId = photo?.cloudinary_public_id;
    if (!publicId) {
      console.error("[downloads] order_item has no photo/public_id:", item.id);
      return NextResponse.json({ error: "Фотографијата не е достапна." }, { status: 404 });
    }

    // Mailbox scanners / browser prefetch: never stream, never count.
    if (isPrefetch(req)) {
      console.log("[downloads] prefetch ignored (not counted):", params.token.slice(0, 6) + "…");
      return new NextResponse(null, { status: 204 });
    }

    // Fetch the actual file from a short-lived signed Cloudinary URL.
    const signedUrl = getDownloadUrl(publicId, 3600);
    const upstream = await fetch(signedUrl);
    if (!upstream.ok || !upstream.body) {
      console.error("[downloads] upstream fetch failed:", upstream.status);
      return NextResponse.json(
        { error: "Грешка при подготовка на преземањето. Обиди се повторно." },
        { status: 502 }
      );
    }

    const contentType = upstream.headers.get("content-type") ?? "application/octet-stream";
    const ext = contentType.includes("png")
      ? "png"
      : contentType.includes("webp")
      ? "webp"
      : "jpg";
    const filename = `${safeFilename(photo?.title)}.${ext}`;
    // ASCII fallback for legacy clients + RFC 5987 UTF-8 for the rest.
    const asciiName = filename.replace(/[^\x20-\x7E]/g, "_");
    const dispo = `attachment; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(filename)}`;

    // Pass the body through, incrementing the counter ONLY when the whole
    // file has been read (done). A client abort triggers `cancel` instead,
    // which leaves the count untouched.
    const reader = upstream.body.getReader();
    let counted = false;

    const stream = new ReadableStream<Uint8Array>({
      async pull(controller) {
        const { done, value } = await reader.read();
        if (done) {
          controller.close();
          if (!counted) {
            counted = true;
            // Fire-and-forget: the transfer is already complete for the client.
            supabase
              .from("order_items")
              .update({ download_count: used + 1 })
              .eq("id", item.id)
              .then(({ error }) => {
                if (error) console.error("[downloads] count update failed:", error.message);
                else
                  console.log("[downloads] completed", {
                    token: params.token.slice(0, 6) + "…",
                    use: `${used + 1}/${DOWNLOAD_LIMIT}`,
                  });
              });
          }
          return;
        }
        controller.enqueue(value);
      },
      cancel(reason) {
        // Client aborted before finishing — do NOT count this attempt.
        console.log("[downloads] transfer cancelled (not counted):", params.token.slice(0, 6) + "…");
        reader.cancel(reason).catch(() => {});
      },
    });

    const contentLength = upstream.headers.get("content-length");
    const headers: Record<string, string> = {
      "Content-Type": contentType,
      "Content-Disposition": dispo,
      "Cache-Control": "no-store",
    };
    if (contentLength) headers["Content-Length"] = contentLength;

    return new NextResponse(stream, { status: 200, headers });
  } catch (err) {
    console.error("[downloads] unhandled error:", err);
    return NextResponse.json(
      { error: "Грешка при подготовка на преземањето. Обиди се повторно." },
      { status: 500 }
    );
  }
}
