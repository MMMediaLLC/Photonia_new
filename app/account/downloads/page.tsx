import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Download, Clock } from "lucide-react";
import Image from "next/image";
import { getCloudinaryWatermarkedUrl, formatPrice } from "@/lib/utils";

interface DownloadItem {
  id: string;
  license: string;
  price: number;
  download_token: string;
  download_expires_at: string;
  download_count: number;
  photo: {
    title: string;
    cloudinary_public_id: string;
    gallery: { title: string; slug: string } | null;
  } | null;
}

export default async function DownloadsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: orders } = await supabase
    .from("orders")
    .select(`*, order_items(*, photo:photos(title, cloudinary_public_id, gallery:galleries(title, slug)))`)
    .or(`buyer_id.eq.${user.id},buyer_email.eq.${user.email}`)
    .eq("status", "paid")
    .order("created_at", { ascending: false });

  const allItems: DownloadItem[] =
    orders?.flatMap((o) => (o.order_items as DownloadItem[]) ?? []) ?? [];
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-2">Мои преземања</h1>
      <p className="text-[#888] text-sm mb-8">
        Фотографии купени со активен линк за преземање
      </p>

      {allItems.length === 0 && (
        <div className="text-center py-24 text-[#888]">
          <Download size={40} className="mx-auto mb-4 opacity-30" />
          <p>Сè уште немаш купено фотографии.</p>
          <a
            href="/galleries"
            className="text-[#e8c97e] hover:underline mt-2 inline-block"
          >
            Прегледај галерии
          </a>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {allItems.map((item) => {
          const photo = item.photo;
          const isExpired = new Date(item.download_expires_at) < new Date();
          const canDownload = !isExpired;
          const expiresAt = new Date(item.download_expires_at);
          const daysLeft = Math.max(
            0,
            Math.ceil((expiresAt.getTime() - Date.now()) / (24 * 60 * 60 * 1000))
          );
          const url = photo?.cloudinary_public_id
            ? getCloudinaryWatermarkedUrl(photo.cloudinary_public_id, cloudName)
            : "";

          return (
            <div
              key={item.id}
              className="flex items-center gap-4 bg-[#141414] border border-white/[0.08] rounded-card p-4"
            >
              <div className="relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                {url && (
                  <Image
                    src={url}
                    alt={photo?.title ?? "Фото"}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {photo?.title || "Фотографија"}
                </p>
                <p className="text-xs text-[#888] truncate">
                  {photo?.gallery?.title}
                </p>
                <div className="flex items-center gap-3 mt-1 text-xs text-[#888]">
                  <span className="capitalize">{item.license} лиценца</span>
                  <span>·</span>
                  <span>{formatPrice(item.price)}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock size={10} />
                    {isExpired
                      ? "Истечен"
                      : daysLeft > 30
                        ? `Активен · уште ${daysLeft} дена`
                        : `Истекува за ${daysLeft} дена`}
                  </span>
                </div>
              </div>

              <a
                href={canDownload ? `/api/downloads/${item.download_token}` : undefined}
                className={`flex items-center gap-2 px-4 py-2 rounded-card text-sm font-semibold transition-colors flex-shrink-0 ${
                  canDownload
                    ? "bg-[#e8c97e] text-[#0a0a0a] hover:bg-[#d4b46a]"
                    : "bg-white/5 text-[#888] cursor-not-allowed"
                }`}
              >
                <Download size={14} />
                {isExpired ? "Истечен" : "Преземи"}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
