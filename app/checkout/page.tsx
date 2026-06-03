"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice } from "@/lib/utils";
import { getCloudinaryWatermarkedUrl } from "@/lib/utils";
import { toast } from "@/components/ui/Toaster";
import { Loader2, ShoppingBag, ArrowLeft } from "lucide-react";
import PaymentLogos from "@/components/layout/PaymentLogos";
import type { User } from "@supabase/supabase-js";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, openCart } = useCart();
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";

  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setAuthLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function proceedToPayment(buyerEmail?: string) {
    if (!items.length) return;
    setPaying(true);

    const payload = {
      email: buyerEmail || user?.email || "",
      items: items.map((i) => ({
        photoId: i.photo.id,
        license: i.license,
        price: i.license === "personal" ? i.photo.price_personal : i.photo.price_commercial,
      })),
    };

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!res.ok) {
      toast(json.error ?? "Грешка при плаќање. Обиди се повторно.", "error");
      setPaying(false);
      return;
    }

    if (json.url) {
      window.location.href = json.url;
    } else {
      router.push("/checkout/success");
    }
  }

  // Empty cart
  if (!authLoading && items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-[#888] px-4">
        <ShoppingBag size={40} className="opacity-30" />
        <p className="text-lg font-medium text-[#f0f0f0]">Кошничката е празна</p>
        <p className="text-sm">Додај фотографии пред да продолжиш</p>
        <Link
          href="/galleries"
          className="mt-2 px-5 py-2.5 bg-[#e8c97e] text-[#0a0a0a] font-semibold rounded-card hover:bg-[#d4b46a] transition-colors text-sm"
        >
          Прегледај галерии
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Top bar: back to cart + logo */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={openCart}
            className="flex items-center gap-1.5 text-sm text-[#888] hover:text-[#f0f0f0] transition-colors"
          >
            <ArrowLeft size={14} /> Кошничка
          </button>
          <Link href="/" className="text-xl font-bold text-[#e8c97e]">
            PHOTONIA
          </Link>
          <span className="w-[88px]" /> {/* spacer to centre logo */}
        </div>

        <div className="grid md:grid-cols-[1fr_340px] gap-6">
          {/* Left: license note + payment panel */}
          <div className="flex flex-col gap-4">
            <LicenseNoteCard items={items} />

            {authLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={28} className="animate-spin text-[#e8c97e]" />
              </div>
            ) : user ? (
              <LoggedInPanel
                email={user.email ?? ""}
                paying={paying}
                onPay={() => proceedToPayment()}
              />
            ) : (
              <GuestPanel
                paying={paying}
                onPay={proceedToPayment}
              />
            )}
          </div>

          {/* Right: Order summary */}
          <div className="order-first md:order-last">
            <OrderSummary items={items} total={total} cloudName={cloudName} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── License note (shared) ────────────────────────────────────────────
// Informational only — does NOT gate the Pay button. Editorial-use limits
// live in /legal/license as buyer responsibility.
function LicenseNoteCard({
  items,
}: {
  items: ReturnType<typeof useCart>["items"];
}) {
  const hasPersonal = items.some((i) => i.license === "personal");
  const hasCommercial = items.some((i) => i.license === "commercial");

  return (
    <div className="bg-[#141414] border border-white/[0.08] rounded-card p-5 flex flex-col gap-2.5">
      {hasPersonal && (
        <p className="text-xs text-[#aaa] leading-relaxed">
          <span className="font-semibold text-[#e8c97e]">Лична лиценца</span>
          {" "}— за приватна употреба: лично печатење, лични профили, домашна архива.
        </p>
      )}
      {hasCommercial && (
        <p className="text-xs text-[#aaa] leading-relaxed">
          <span className="font-semibold text-[#e8c97e]">Комерцијална лиценца</span>
          {" "}— за деловна употреба: веб, реклами, маркетинг, печатени материјали.
        </p>
      )}
      <Link
        href="/legal/license"
        target="_blank"
        className="text-[11px] text-[#888] hover:text-[#e8c97e] transition-colors mt-1"
      >
        Повеќе за лиценците →
      </Link>
    </div>
  );
}

// ── Logged-in panel ──────────────────────────────────────────────────
function LoggedInPanel({
  email,
  paying,
  onPay,
}: {
  email: string;
  paying: boolean;
  onPay: () => void;
}) {
  return (
    <div className="bg-[#141414] border border-white/[0.08] rounded-card p-6 flex flex-col gap-5">
      <h2 className="text-lg font-semibold">Потврди нарачка</h2>
      <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-lg px-4 py-3">
        <p className="text-xs text-[#888] mb-0.5">Купуваш како</p>
        <p className="text-sm font-medium text-[#f0f0f0]">{email}</p>
      </div>
      <button
        onClick={onPay}
        disabled={paying}
        className="w-full flex items-center justify-center gap-2 bg-[#e8c97e] text-[#0a0a0a] font-semibold py-3 rounded-card hover:bg-[#d4b46a] transition-colors disabled:opacity-40 text-sm"
      >
        {paying ? (
          <>
            <Loader2 size={14} className="animate-spin" /> Пренасочување...
          </>
        ) : (
          "🔒 Плати безбедно"
        )}
      </button>
      <p className="text-xs text-[#555] text-center">
        Плаќањето се обработува безбедно · SSL шифрирано
      </p>
      <PaymentLogos size={22} className="justify-center" />
    </div>
  );
}

// ── Guest panel — email field, no auth wall ──────────────────────────
function GuestPanel({
  paying,
  onPay,
}: {
  paying: boolean;
  onPay: (email: string) => void;
}) {
  const [email, setEmail] = useState("");

  async function handleGoogle() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/checkout")}`,
      },
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !/.+@.+\..+/.test(email)) {
      toast("Внеси валидна е-пошта.", "error");
      return;
    }
    onPay(email.trim().toLowerCase());
  }

  return (
    <div className="bg-[#141414] border border-white/[0.08] rounded-card p-6 flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold">Е-пошта за нарачката</h2>
        <p className="text-xs text-[#888] mt-1 leading-relaxed">
          Линковите за преземање ќе бидат испратени на оваа адреса. Сметката се создава автоматски
          — не треба регистрација.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="tvojata@eposta.mk"
          className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-3 py-3 text-sm text-[#f0f0f0] placeholder:text-[#555] focus:outline-none focus:border-[#e8c97e]/50"
        />
        <button
          type="submit"
          disabled={paying || !email.trim()}
          className="w-full flex items-center justify-center gap-2 bg-[#e8c97e] text-[#0a0a0a] font-semibold py-3 rounded-card hover:bg-[#d4b46a] transition-colors disabled:opacity-40 text-sm"
        >
          {paying ? (
            <>
              <Loader2 size={14} className="animate-spin" /> Пренасочување...
            </>
          ) : (
            "🔒 Плати безбедно"
          )}
        </button>
        <p className="text-xs text-[#555] text-center leading-relaxed">
          Плаќањето се обработува безбедно · SSL шифрирано
        </p>
      </form>

      <div className="flex items-center gap-3 text-[#444] text-xs">
        <div className="flex-1 h-px bg-white/[0.08]" />
        или
        <div className="flex-1 h-px bg-white/[0.08]" />
      </div>

      <button
        onClick={handleGoogle}
        disabled={paying}
        className="w-full flex items-center justify-center gap-3 py-2.5 rounded-lg border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] transition-colors text-sm font-medium text-[#f0f0f0] disabled:opacity-50"
      >
        <GoogleIcon />
        Продолжи со Google
      </button>

      <p className="text-[11px] text-[#555] leading-relaxed text-center">
        Линковите за преземање ќе ти бидат испратени на оваа е-пошта.
      </p>
    </div>
  );
}

// ── Order summary sidebar ────────────────────────────────────────────
function OrderSummary({
  items,
  total,
  cloudName,
}: {
  items: ReturnType<typeof useCart>["items"];
  total: number;
  cloudName: string;
}) {
  return (
    <div className="bg-[#141414] border border-white/[0.08] rounded-card p-5 flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-[#888] uppercase tracking-wide">
        Нарачка ({items.length})
      </h3>
      <div className="flex flex-col gap-3.5">
        {items.map((item) => {
          const price =
            item.license === "personal" ? item.photo.price_personal : item.photo.price_commercial;
          const photoTitle = item.photo.title?.trim() || "Фотографија";
          const galleryTitle = item.gallery?.title?.trim();
          return (
            <div key={item.photo.id} className="flex gap-3 items-start">
              <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                <Image
                  src={getCloudinaryWatermarkedUrl(item.photo.cloudinary_public_id, cloudName)}
                  alt={photoTitle}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate text-[#f0f0f0]">
                  {photoTitle}
                </p>
                {galleryTitle && (
                  <p className="text-[10px] text-[#888] truncate">
                    {galleryTitle}
                  </p>
                )}
                <p className="text-[10px] text-[#555] mt-0.5">
                  {item.license === "personal" ? "Лична лиценца" : "Комерцијална лиценца"}
                </p>
              </div>
              <span className="text-xs font-semibold text-[#e8c97e] flex-shrink-0 mt-0.5">
                {formatPrice(price)}
              </span>
            </div>
          );
        })}
      </div>
      <div className="border-t border-white/[0.06] pt-3 flex justify-between items-center">
        <span className="text-sm text-[#888]">Вкупно</span>
        <span className="text-lg font-bold text-[#e8c97e]">{formatPrice(total)}</span>
      </div>
      <p className="text-[10px] text-[#555] text-center leading-relaxed">
        HD без воден жиг · <strong className="text-[#888]">2 преземања</strong> во рок од <strong className="text-[#888]">1 година</strong>
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}
