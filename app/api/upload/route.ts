import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { createClient } from "@/lib/supabase/server";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const galleryId = formData.get("galleryId") as string | null;

  if (!file || !galleryId) {
    return NextResponse.json({ error: "Missing file or galleryId" }, { status: 400 });
  }

  // Verify gallery belongs to this photographer
  const { data: gallery } = await supabase
    .from("galleries")
    .select("id")
    .eq("id", galleryId)
    .eq("photographer_id", user.id)
    .single();

  if (!gallery) return NextResponse.json({ error: "Gallery not found" }, { status: 404 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const result = await new Promise<{ public_id: string; width: number; height: number }>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: `photonia/private/${galleryId}`,
            resource_type: "image",
          },
          (error, result) => {
            if (error || !result) reject(error);
            else resolve(result as { public_id: string; width: number; height: number });
          }
        )
        .end(buffer);
    }
  );

  // Get current max order_index
  const { data: lastPhoto } = await supabase
    .from("photos")
    .select("order_index")
    .eq("gallery_id", galleryId)
    .order("order_index", { ascending: false })
    .limit(1)
    .single();

  const orderIndex = (lastPhoto?.order_index ?? -1) + 1;

  const { data: photo, error } = await supabase
    .from("photos")
    .insert({
      gallery_id: galleryId,
      cloudinary_public_id: result.public_id,
      width: result.width,
      height: result.height,
      order_index: orderIndex,
      price_personal: 500,
      price_commercial: 1500,
      price_extended: 3000,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ photo });
}
