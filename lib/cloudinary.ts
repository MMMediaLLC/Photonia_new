import { v2 as cloudinary } from "cloudinary";

// cloud_name is NOT a secret — it appears in every delivery URL — so we
// safely fall back to the public var. On Vercel only NEXT_PUBLIC_… is set,
// which is why server-side signed downloads were failing.
const CLOUD_NAME =
  process.env.CLOUDINARY_CLOUD_NAME ?? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const WATERMARK_TEXT = "PHOTONIA|photonia.mk";
const PREVIEW_MAX_WIDTH = 1200;
const PREVIEW_QUALITY = 60;
const SIGNED_URL_TTL = 300; // 5 минути за preview

export function getPreviewUrl(publicId: string): string {
  return cloudinary.url(publicId, {
    secure: true,
    sign_url: true,
    expires_at: Math.floor(Date.now() / 1000) + SIGNED_URL_TTL,
    resource_type: "image",
    transformation: [
      { width: PREVIEW_MAX_WIDTH, crop: "limit", quality: PREVIEW_QUALITY },
      {
        overlay: {
          font_family: "Arial",
          font_size: 32,
          font_weight: "bold",
          text: WATERMARK_TEXT,
        },
        color: "#FFFFFF",
        opacity: 35,
        angle: -30,
        effect: "shadow:10",
      },
      { flags: "layer_apply", tile: true },
    ],
  });
}

export function getDownloadUrl(publicId: string, ttlSeconds = 3600): string {
  return cloudinary.url(publicId, {
    secure: true,
    sign_url: true,
    expires_at: Math.floor(Date.now() / 1000) + ttlSeconds,
    resource_type: "image",
    flags: "attachment",
  });
}

export function getThumbnailUrl(publicId: string, width = 400): string {
  return cloudinary.url(publicId, {
    secure: true,
    sign_url: true,
    expires_at: Math.floor(Date.now() / 1000) + SIGNED_URL_TTL,
    resource_type: "image",
    transformation: [
      { width, crop: "fill", quality: 70 },
      {
        overlay: {
          font_family: "Arial",
          font_size: 16,
          font_weight: "bold",
          text: "PHOTONIA",
        },
        color: "#FFFFFF",
        opacity: 30,
        gravity: "center",
      },
      { flags: "layer_apply" },
    ],
  });
}

export default cloudinary;
