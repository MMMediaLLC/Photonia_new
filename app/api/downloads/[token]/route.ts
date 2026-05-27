import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { getDownloadUrl } from "@/lib/cloudinary";

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

  if (item.download_count >= 3) {
    return NextResponse.json({ error: "Download limit reached" }, { status: 429 });
  }

  const publicId = (item.photo as { cloudinary_public_id: string } | null)?.cloudinary_public_id;
  if (!publicId) {
    return NextResponse.json({ error: "Photo not found" }, { status: 404 });
  }

  const signedUrl = getDownloadUrl(publicId, 3600);

  await supabase
    .from("order_items")
    .update({ download_count: item.download_count + 1 })
    .eq("id", item.id);

  return NextResponse.redirect(signedUrl);
}
