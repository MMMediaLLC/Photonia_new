import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { getDownloadUrl } from "@/lib/cloudinary";

/**
 * Public download route — no session required.
 * Token validity: 1 year from order creation. NO download-count limit.
 * Each successful redirect bumps a counter purely for analytics.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { token: string } }
) {
  const supabase = createAdminClient();

  const { data: item } = await supabase
    .from("order_items")
    .select("*, photo:photos(cloudinary_public_id)")
    .eq("download_token", params.token)
    .single();

  if (!item) {
    return NextResponse.json({ error: "Token not found" }, { status: 404 });
  }

  if (new Date(item.download_expires_at) < new Date()) {
    return NextResponse.json({ error: "Token expired" }, { status: 410 });
  }

  const publicId = (item.photo as { cloudinary_public_id: string } | null)?.cloudinary_public_id;
  if (!publicId) {
    return NextResponse.json({ error: "Photo not found" }, { status: 404 });
  }

  const signedUrl = getDownloadUrl(publicId, 3600);

  // Best-effort analytics increment — never blocks the download
  supabase
    .from("order_items")
    .update({ download_count: (item.download_count ?? 0) + 1 })
    .eq("id", item.id)
    .then(({ error }) => {
      if (error) console.warn("[download] count update failed:", error.message);
    });

  return NextResponse.redirect(signedUrl);
}
