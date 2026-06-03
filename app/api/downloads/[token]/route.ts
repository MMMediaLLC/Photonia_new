import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { getDownloadUrl } from "@/lib/cloudinary";

/**
 * Public download route — no session required.
 *
 * The token in the email is the permanent (1-year) access right.
 * On each request we mint a fresh short-lived (1h) signed Cloudinary URL
 * and 302 to it, so the raw asset is never permanently exposed.
 *
 * Token validity: 1 year from order creation. NO download-count limit.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { token: string } }
) {
  // ── Env sanity — fail fast & loud, never a raw 500 ──────────────────
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_SECRET) {
    console.error(
      "[downloads] Cloudinary not configured on this environment",
      {
        hasCloud: !!process.env.CLOUDINARY_CLOUD_NAME,
        hasSecret: !!process.env.CLOUDINARY_API_SECRET,
      }
    );
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
      // Genuinely unknown token — not an error condition.
      return NextResponse.json({ error: "Линкот не е валиден." }, { status: 404 });
    }

    if (new Date(item.download_expires_at) < new Date()) {
      return NextResponse.json({ error: "Линкот истече." }, { status: 410 });
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

    // Mint a fresh, short-lived signed URL for the actual file.
    const signedUrl = getDownloadUrl(publicId, 3600);

    // Best-effort analytics increment — never blocks the download.
    supabase
      .from("order_items")
      .update({ download_count: (item.download_count ?? 0) + 1 })
      .eq("id", item.id)
      .then(({ error }) => {
        if (error) console.warn("[downloads] count update failed:", error.message);
      });

    console.log("[downloads] success", {
      token: params.token.slice(0, 6) + "…",
      photoId: publicId,
    });

    return NextResponse.redirect(signedUrl);
  } catch (err) {
    // Surface the REAL cause in logs; return a clean error to the client.
    console.error("[downloads] unhandled error:", err);
    return NextResponse.json(
      { error: "Грешка при подготовка на преземањето. Обиди се повторно." },
      { status: 500 }
    );
  }
}
