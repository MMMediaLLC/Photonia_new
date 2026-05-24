import Link from "next/link";
import Image from "next/image";
import { Calendar, Images } from "lucide-react";
import type { Gallery } from "@/lib/types";
import { getCloudinaryWatermarkedUrl } from "@/lib/utils";

interface Props {
  gallery: Gallery;
}

export default function GalleryCard({ gallery }: Props) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
  const coverUrl = gallery.cover_photo
    ? getCloudinaryWatermarkedUrl(gallery.cover_photo.cloudinary_public_id, cloudName)
    : null;

  const galleryData = gallery as Gallery & {
    photographer_profiles?: { display_name: string };
  };
  const photographerName =
    galleryData.photographer_profiles?.display_name ??
    galleryData.photographer?.display_name ??
    "Фотограф";

  return (
    <Link href={`/gallery/${gallery.slug}`} className="group block">
      <article className="bg-[#141414] rounded-card border border-white/[0.08] overflow-hidden hover:border-white/[0.15] transition-all duration-200">
        {/* Cover image */}
        <div className="relative aspect-[4/3] bg-white/[0.03] overflow-hidden">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={gallery.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Images size={32} className="text-[#888]" />
            </div>
          )}
          {gallery.is_featured && (
            <span className="absolute top-3 left-3 bg-[#e8c97e] text-[#0a0a0a] text-xs font-bold px-2 py-1 rounded-lg">
              Избрано
            </span>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-[#888] mb-1">{photographerName}</p>
          <h3 className="font-semibold text-[#f0f0f0] truncate group-hover:text-[#e8c97e] transition-colors">
            {gallery.title}
          </h3>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-[#888] bg-white/[0.05] px-2 py-1 rounded-lg">
              {gallery.category}
            </span>
            {gallery.event_date && (
              <span className="text-xs text-[#888] flex items-center gap-1">
                <Calendar size={11} />
                {new Date(gallery.event_date).toLocaleDateString("mk-MK", {
                  year: "numeric",
                  month: "short",
                })}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
