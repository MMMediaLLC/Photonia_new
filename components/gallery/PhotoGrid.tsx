"use client";

import Image from "next/image";
import { ShoppingCart, ZoomIn } from "lucide-react";
import type { Gallery, Photo } from "@/lib/types";
import { getCloudinaryWatermarkedUrl, formatPrice } from "@/lib/utils";
import { useCart } from "@/components/cart/CartProvider";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  photos: Photo[];
  gallery: Gallery;
}

export default function PhotoGrid({ photos, gallery }: Props) {
  const { addItem, items } = useCart();
  const [lightbox, setLightbox] = useState<Photo | null>(null);
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {photos.map((photo) => {
          const inCart = items.some((i) => i.photo.id === photo.id);
          const url = getCloudinaryWatermarkedUrl(photo.cloudinary_public_id, cloudName);

          return (
            <div
              key={photo.id}
              className="group relative aspect-square rounded-card overflow-hidden bg-white/[0.03] cursor-pointer"
              onClick={() => setLightbox(photo)}
            >
              <Image
                src={url}
                alt={photo.title || "Фотографија"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                <div className="flex justify-end">
                  <button
                    onClick={(e) => { e.stopPropagation(); setLightbox(photo); }}
                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <ZoomIn size={16} />
                  </button>
                </div>
                <div>
                  <p className="text-xs text-white/80 mb-1">
                    Од {formatPrice(photo.price_personal)}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addItem(photo, gallery);
                    }}
                    className={cn(
                      "w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-colors",
                      inCart
                        ? "bg-[#4caf7d] text-white"
                        : "bg-[#e8c97e] text-[#0a0a0a] hover:bg-[#d4b46a]"
                    )}
                  >
                    <ShoppingCart size={14} />
                    {inCart ? "Во кошничката" : "Додај"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={getCloudinaryWatermarkedUrl(lightbox.cloudinary_public_id, cloudName)}
              alt={lightbox.title || "Фотографија"}
              fill
              className="object-contain"
              sizes="100vw"
            />
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-0 right-0 p-3 text-white/70 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
