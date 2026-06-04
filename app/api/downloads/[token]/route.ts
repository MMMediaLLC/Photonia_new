import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { getDownloadUrl } from "@/lib/cloudinary";

/**
 * Public download route — no session required.
 *
 * The token in the email is the access right. Each purchased item may be
 * downloaded a maximum of DOWNLOAD_LIMIT times within a 1-year window.
 *
 * The counter is bumped ONLY on a genuine delivery — i.e. after the signed
 * Cloudinary URL is successfully generated, right before the redirect.
 * Error paths (unknown / expired / over-limit / misconfig) never count, and
 * link-scanner / prefetch hits are served without consuming a download, so a
 * mailbox provider scanning the link doesn't exhaust it.
 */
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

    // Lookup via service-role client so RLS never hides a valid row.
    const { data: item, error: lookupError } = await supabase
      .from("order_items")
      .select("id, download_token, download_expires_at, download_count, photo:photos(cloudinary_public_id)")
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

    // Hard cap — checked BEFORE any increment, so an over-limit token never
    // climbs past the limit no matter how many times it's hit.
    const used = item.download_count ?? 0;
    if (used >= DOWNLOAD_LIMIT) {
      return NextResponse.json(
        {
          error:
            "Достигнавте лимит од 2 преземања за оваа фотографија. За повторно преземање контактирајте support@photonia.mk.",
        },
        { status: 429 }
      );
    }

    // Supabase types embedded relations as an array; tolerate both shapes.
    const photoRel = item.photo as
      | { cloudinary_public_id: string }
      | { cloudinary_public_id: string }[]
      | null;
    const photo = Array.isArray(photoRel) ? photoRel[0] : photoRel;
    const publicId = photo?.cloudinary_public_id;
    if (!publicId) {
      console.error("[downloads] order_item has no photo/public_id:", item.id);
      return NextResponse.json({ error: "Фотографијата не е достапна." }, { status: 404 });
    }

    // Mint the signed URL first — if this throws, no download is consumed.
    const signedUrl = getDownloadUrl(publicId, 3600);

    // Mailbox link-scanners / browser prefetch: serve the redirect target is
    // NOT what we want (it would let them fetch the file). Return a no-content
    // response WITHOUT counting. A real user navigation re-requests normally.
    if (isPrefetch(req)) {
      console.log("[downloads] prefetch ignored (not counted):", params.token.slice(0, 6) + "…");
      return new NextResponse(null, { status: 204 });
    }

    // Genuine delivery — bump the counter now, then redirect to the file.
    const { error: updErr } = await supabase
      .from("order_items")
      .update({ download_count: used + 1 })
      .eq("id", item.id);
    if (updErr) {
      console.error("[downloads] count update failed:", updErr.message);
      return NextResponse.json(
        { error: "Внатрешна грешка. Обиди се повторно." },
        { status: 500 }
      );
    }

    console.log("[downloads] delivered", {
      token: params.token.slice(0, 6) + "…",
      use: `${used + 1}/${DOWNLOAD_LIMIT}`,
    });

    return NextResponse.redirect(signedUrl);
  } catch (err) {
    console.error("[downloads] unhandled error:", err);
    return NextResponse.json(
      { error: "Грешка при подготовка на преземањето. Обиди се повторно." },
      { status: 500 }
    );
  }
}
