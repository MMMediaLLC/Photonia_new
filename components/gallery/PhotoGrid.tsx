"use client";

import Image from "next/image";
import { ShoppingCart, ZoomIn, ChevronLeft, ChevronRight, X, Check } from "lucide-react";
import type { Gallery, Photo, LicenseType } from "@/lib/types";
import { getCloudinaryWatermarkedUrl, formatPrice } from "@/lib/utils";
import { useCart } from "@/components/cart/CartProvider";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  photos: Photo[];
  gallery: Gallery;
}

export default function PhotoGrid({ photos, gallery }: Props) {
  const { addItem, items } = useCart();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [selectedLicense, setSelectedLicense] = useState<LicenseType>("personal");
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";

  const touchStartX = useRef<number | null>(null);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const goPrev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
    setSelectedLicense("personal");
  }, [photos.length]);

  const goNext = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % photos.length));
    setSelectedLicense("personal");
  }, [photos.length]);

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, closeLightbox, goPrev, goNext]);

  // Lock body scroll while lightbox is open
  useEffect(() => {
    if (lightboxIndex === null) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxIndex]);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 60) {
      if (diff > 0) goPrev();
      else goNext();
    }
    touchStartX.current = null;
  }

  const lightboxPhoto = lightboxIndex !== null ? photos[lightboxIndex] : null;
  const lightboxInCart = lightboxPhoto
    ? items.some((i) => i.photo.id === lightboxPhoto.id)
    : false;

  function priceForLicense(p: Photo, license: LicenseType) {
    return license === "personal"
      ? p.price_personal
      : license === "commercial"
      ? p.price_commercial
      : p.price_extended;
  }

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {photos.map((photo, idx) => {
          const inCart = items.some((i) => i.photo.id === photo.id);
          const url = getCloudinaryWatermarkedUrl(photo.cloudinary_public_id, cloudName);

          return (
            <div
              key={photo.id}
              className="group relative aspect-square rounded-card overflow-hidden bg-white/[0.03] cursor-pointer"
              onClick={() => setLightboxIndex(idx)}
            >
              <Image
                src={url}
                alt={photo.title || "Фотографија"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />

              {/* Price badge — always visible */}
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-lg">
                од {formatPrice(photo.price_personal)}
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                <div className="flex justify-end">
                  <button
                    onClick={(e) => { e.stopPropagation(); setLightboxIndex(idx); }}
                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    aria-label="Зголеми"
                  >
                    <ZoomIn size={16} />
                  </button>
                </div>
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
                  {inCart ? <><Check size={14} /> Во кошничката</> : <><ShoppingCart size={14} /> Додај</>}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox */}
      {lightboxPhoto && lightboxIndex !== null && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex flex-col"
          onClick={closeLightbox}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Top bar */}
          <div
            className="flex items-center justify-between px-4 sm:px-6 py-4 text-white/80"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">
                {lightboxIndex + 1} / {photos.length}
              </span>
              {lightboxPhoto.title && (
                <span className="text-sm text-white/60 hidden sm:inline">
                  · {lightboxPhoto.title}
                </span>
              )}
            </div>
            <button
              onClick={closeLightbox}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Затвори"
            >
              <X size={20} />
            </button>
          </div>

          {/* Image area */}
          <div
            className="flex-1 relative flex items-center justify-center px-2 sm:px-12"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              key={lightboxPhoto.id}
              src={getCloudinaryWatermarkedUrl(lightboxPhoto.cloudinary_public_id, cloudName)}
              alt={lightboxPhoto.title || "Фотографија"}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />

            {/* Prev/Next arrows */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); goPrev(); }}
                  className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors"
                  aria-label="Претходна"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); goNext(); }}
                  className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-3 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors"
                  aria-label="Следна"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>

          {/* Bottom: license selector + buy */}
          <div
            className="px-4 sm:px-6 py-4 bg-gradient-to-t from-black/80 to-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* License pills */}
              <div className="flex gap-2 flex-1 overflow-x-auto pb-1">
                {(["personal", "commercial", "extended"] as const).map((lic) => (
                  <button
                    key={lic}
                    onClick={() => setSelectedLicense(lic)}
                    className={cn(
                      "flex-1 min-w-[110px] px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors border whitespace-nowrap",
                      selectedLicense === lic
                        ? "bg-[#e8c97e]/15 border-[#e8c97e] text-[#e8c97e]"
                        : "bg-white/[0.04] border-white/[0.08] text-white/70 hover:bg-white/[0.08]"
                    )}
                  >
                    <div className="capitalize">
                      {lic === "personal" ? "Лична" : lic === "commercial" ? "Комерцијална" : "Проширена"}
                    </div>
                    <div className="text-[11px] opacity-80">
                      {formatPrice(priceForLicense(lightboxPhoto, lic))}
                    </div>
                  </button>
                ))}
              </div>

              {/* Buy button */}
              <button
                onClick={() => {
                  addItem(lightboxPhoto, gallery, selectedLicense);
                }}
                disabled={lightboxInCart}
                className={cn(
                  "flex items-center justify-center gap-2 px-5 py-3 rounded-card text-sm font-semibold transition-colors flex-shrink-0",
                  lightboxInCart
                    ? "bg-[#4caf7d]/20 text-[#4caf7d] cursor-default"
                    : "bg-[#e8c97e] text-[#0a0a0a] hover:bg-[#d4b46a]"
                )}
              >
                {lightboxInCart ? (
                  <><Check size={16} /> Веќе во кошничка</>
                ) : (
                  <><ShoppingCart size={16} /> Додај — {formatPrice(priceForLicense(lightboxPhoto, selectedLicense))}</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
