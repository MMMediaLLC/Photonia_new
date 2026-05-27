import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency = "MKD") {
  return new Intl.NumberFormat("mk-MK", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Macedonian Cyrillic → Latin transliteration map
const CYRILLIC_MAP: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", ѓ: "gj", е: "e", ж: "zh",
  з: "z", ѕ: "dz", и: "i", ј: "j", к: "k", л: "l", љ: "lj", м: "m",
  н: "n", њ: "nj", о: "o", п: "p", р: "r", с: "s", т: "t", ќ: "kj",
  у: "u", ф: "f", х: "h", ц: "c", ч: "ch", џ: "dj", ш: "sh",
};

function transliterate(text: string): string {
  return text
    .split("")
    .map((ch) => CYRILLIC_MAP[ch.toLowerCase()] ?? ch)
    .join("");
}

export function slugify(text: string) {
  const ascii = transliterate(text.toLowerCase());
  return ascii
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateToken(length = 32) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export function getCloudinaryWatermarkedUrl(publicId: string, cloudName: string) {
  const wm = "l_text:Arial_60_bold:PHOTONIA%20photonia.mk,o_35,co_white,a_-30,e_shadow:10";
  const resize = "w_1200,q_60,c_limit";
  return `https://res.cloudinary.com/${cloudName}/image/upload/${resize}/${wm}/fl_layer_apply,fl_tiled/${publicId}`;
}
