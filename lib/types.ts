export type UserRole = "admin" | "photographer" | "buyer";
export type OrderStatus = "pending" | "paid" | "refunded";
export type LicenseType = "personal" | "commercial";
export type PayoutStatus = "pending" | "paid";

export const LICENSE_TYPES = {
  personal: {
    key: "personal" as const,
    label: "Лична",
    shortDescription: "За лична, некомерцијална употреба",
    icon: "📷",
  },
  commercial: {
    key: "commercial" as const,
    label: "Комерцијална",
    shortDescription: "За бизнис, реклами, медиуми",
    icon: "💼",
  },
} as const;

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  slug: string;
  avatar_url: string | null;
  created_at: string;
}

export interface PhotographerProfile {
  user_id: string;
  display_name: string;
  bio: string | null;
  website: string | null;
  instagram: string | null;
  commission_rate: number;
}

export interface Gallery {
  id: string;
  photographer_id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_photo_id: string | null;
  category: string;
  event_date: string | null;
  is_public: boolean;
  is_featured: boolean;
  created_at: string;
  photographer?: PhotographerProfile & { user?: User };
  cover_photo?: Photo;
  photos?: Photo[];
  _count?: { photos: number };
}

export interface Photo {
  id: string;
  gallery_id: string;
  title: string;
  cloudinary_public_id: string;
  width: number;
  height: number;
  price_personal: number;
  price_commercial: number;
  ls_product_id: string | null;
  tags: string[];
  order_index: number;
  created_at: string;
  gallery?: Gallery;
}

export interface Order {
  id: string;
  buyer_id: string | null;
  buyer_email: string;
  ls_order_id: string;
  status: OrderStatus;
  total: number;
  created_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  photo_id: string;
  license: LicenseType;
  price: number;
  photographer_amount: number;
  platform_amount: number;
  download_token: string;
  download_expires_at: string;
  download_count: number;
  photo?: Photo;
}

export interface Payout {
  id: string;
  photographer_id: string;
  amount: number;
  status: PayoutStatus;
  period: string;
  created_at: string;
}

export interface CartItem {
  photo: Photo;
  license: LicenseType;
  gallery?: Gallery;
}

export const GALLERY_CATEGORIES = [
  "Настани",
  "Спорт",
  "Репортажи",
  "Природа",
  "Корпоративни",
  "Патувања",
] as const;

export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];
