"use client";

import { useCart } from "./CartProvider";
import { X, ShoppingCart, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { LicenseType } from "@/lib/types";
import { LICENSE_TYPES } from "@/lib/types";
import Image from "next/image";
import { getCloudinaryWatermarkedUrl } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateLicense, total } = useCart();
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
  const router = useRouter();

  function handleCheckout() {
    if (!items.length) return;
    closeCart();
    router.push("/checkout");
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={closeCart}
      />

      {/* Drawer */}
      <aside className="fixed right-0 top-0 h-full w-full max-w-md bg-[#141414] border-l border-white/[0.08] z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <ShoppingCart size={18} className="text-[#e8c97e]" />
            <span className="font-semibold">Кошничка ({items.length})</span>
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-16 text-[#888]">
              <ShoppingCart size={40} className="mb-4 opacity-30" />
              <p>Кошничката е празна</p>
              <p className="text-sm mt-1">Прегледај галерии и додај фотографии</p>
            </div>
          ) : (
            items.map((item) => {
              const price =
                item.license === "personal"
                  ? item.photo.price_personal
                  : item.photo.price_commercial;

              return (
                <div
                  key={item.photo.id}
                  className="flex gap-3 p-3 rounded-card bg-[#0a0a0a] border border-white/[0.06]"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                    <Image
                      src={getCloudinaryWatermarkedUrl(item.photo.cloudinary_public_id, cloudName)}
                      alt={item.photo.title || "Фото"}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {item.photo.title || "Фотографија"}
                    </p>
                    {item.gallery && (
                      <p className="text-xs text-[#888] truncate">{item.gallery.title}</p>
                    )}

                    {/* License selector */}
                    <select
                      value={item.license}
                      onChange={(e) =>
                        updateLicense(item.photo.id, e.target.value as LicenseType)
                      }
                      className="mt-2 text-xs bg-[#141414] border border-white/[0.08] rounded-lg px-2 py-1 text-[#f0f0f0] cursor-pointer w-full"
                      title="Сите лиценци даваат HD слика без watermark"
                    >
                      <option value="personal">
                        {LICENSE_TYPES.personal.label} — {formatPrice(item.photo.price_personal)}
                      </option>
                      <option value="commercial">
                        {LICENSE_TYPES.commercial.label} — {formatPrice(item.photo.price_commercial)}
                      </option>
                    </select>
                  </div>

                  {/* Price + remove */}
                  <div className="flex flex-col items-end justify-between flex-shrink-0">
                    <span className="text-sm font-semibold text-[#e8c97e]">
                      {formatPrice(price)}
                    </span>
                    <button
                      onClick={() => removeItem(item.photo.id)}
                      className="text-[#888] hover:text-[#e05555] transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-white/[0.08]">
            <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-lg p-3 mb-4 text-xs text-[#888] leading-relaxed">
              <p className="text-[#f0f0f0] font-medium mb-1">✓ Што добиваш:</p>
              <p>HD оригинал во висока резолуција, без watermark, веднаш достапно за преземање.</p>
            </div>

            <div className="flex justify-between items-center mb-4">
              <span className="text-[#888] text-sm">Вкупно</span>
              <span className="text-xl font-bold text-[#e8c97e]">{formatPrice(total)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2 bg-[#e8c97e] text-[#0a0a0a] font-semibold py-3 rounded-card hover:bg-[#d4b46a] transition-colors"
            >
              Заврши купување
            </button>
            <p className="text-xs text-[#888] text-center mt-3">
              🔒 Безбедна наплата · Без претплата · Веднаш преземаш
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
