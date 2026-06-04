import { v2 as cloudinary } from "cloudinary";

// cloud_name is not a secret — it appears in every delivery URL — so we
// safely fall back to the public var. On Vercel only NEXT_PUBLIC_… is set.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ?? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Short-lived signed URL for the original (un-watermarked) file.
 * Used server-side by the download route, which streams the bytes back.
 * Watermarked previews are produced by getCloudinaryWatermarkedUrl in lib/utils.
 */
export function getDownloadUrl(publicId: string, ttlSeconds = 3600): string {
  return cloudinary.url(publicId, {
    secure: true,
    sign_url: true,
    expires_at: Math.floor(Date.now() / 1000) + ttlSeconds,
    resource_type: "image",
    flags: "attachment",
  });
}
