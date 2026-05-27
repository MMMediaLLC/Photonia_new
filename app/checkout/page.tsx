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
import { Loader2, ShoppingBag } from "lucide-react";
import type { User } from "@supabase/supabase-js";

type AuthTab = "register" | "login";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total } = useCart();
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";

  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [tab, setTab] = useState<AuthTab>("register");
  const [paying, setPaying] = useState(false);
  const [refundAgreed, setRefundAgreed] = useState(false);
  const [editorialAgreed, setEditorialAgreed] = useState(false);

  const canPay = refundAgreed && editorialAgreed;

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setAuthLoading(false);
    });
  }, []);

  async function proceedToPayment() {
    if (!items.length) return;
    if (!canPay) {
      toast("Прифати ги двете изјави за да продолжиш.", "error");
      return;
    }
    setPaying(true);

    const payload = {
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
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-xl font-bold text-[#e8c97e] block text-center mb-10">
          PHOTONIA
        </Link>

        <div className="grid md:grid-cols-[1fr_340px] gap-6">
          {/* Left: Auth or Logged-in payment */}
          <div className="flex flex-col gap-4">
            {/* Legal disclosures — shown to all users before payment */}
            <div className="bg-[#141414] border border-white/[0.08] rounded-card p-5 flex flex-col gap-4">
              <div className="border border-amber-700/30 bg-amber-950/10 rounded-lg p-4">
                <p className="text-xs font-semibold text-amber-400 mb-2">Editorial напомена</p>
                <p className="text-xs text-[#aaa] leading-relaxed mb-3">
                  Фотографиите со ознака Editorial Only не смеат да се употребат во рекламен
                  контекст кој имплицира поддршка од прикажаното лице. Важи за двете лиценци.{" "}
                  <Link href="/legal/editorial-notice" target="_blank" className="text-amber-400 hover:underline">
                    Прочитај повеќе
                  </Link>.
                </p>
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input type="checkbox" checked={editorialAgreed}
                    onChange={(e) => setEditorialAgreed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-[#e8c97e] cursor-pointer" />
                  <span className="text-xs text-[#ccc]">
                    Ги прочитав и ги прифаќам editorial ограничувањата.
                  </span>
                </label>
              </div>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" checked={refundAgreed}
                  onChange={(e) => setRefundAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-[#e8c97e] cursor-pointer" />
                <span className="text-xs text-[#888] leading-relaxed">
                  Се согласувам дека со преземање на фотографијата, откажувам од правото
                  на одустанок во рок од 14 дена, согласно членот 16(м) од EU Consumer Rights Directive.{" "}
                  <Link href="/legal/refund" target="_blank" className="text-[#e8c97e] hover:underline">
                    Политика за поврат
                  </Link>.
                </span>
              </label>
            </div>

            {authLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={28} className="animate-spin text-[#e8c97e]" />
              </div>
            ) : user ? (
              <LoggedInPanel
                email={user.email ?? ""}
                paying={paying}
                canPay={canPay}
                onPay={proceedToPayment}
              />
            ) : (
              <AuthPanel
                tab={tab}
                setTab={setTab}
                canPay={canPay}
                onSuccess={proceedToPayment}
                paying={paying}
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

// ── Logged-in panel ──────────────────────────────────────────────────
function LoggedInPanel({
  email,
  paying,
  canPay,
  onPay,
}: {
  email: string;
  paying: boolean;
  canPay: boolean;
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
        disabled={paying || !canPay}
        className="w-full flex items-center justify-center gap-2 bg-[#e8c97e] text-[#0a0a0a] font-semibold py-3 rounded-card hover:bg-[#d4b46a] transition-colors disabled:opacity-40 text-sm"
      >
        {paying ? <><Loader2 size={14} className="animate-spin" /> Пренасочување...</> : "🔒 Плати безбедно"}
      </button>
      <p className="text-xs text-[#555] text-center">Плаќањето го обработува LemonSqueezy · SSL шифрирано</p>
    </div>
  );
}

// ── Auth panel (register + login tabs) ──────────────────────────────
function AuthPanel({
  tab,
  setTab,
  canPay,
  onSuccess,
  paying,
}: {
  tab: AuthTab;
  setTab: (t: AuthTab) => void;
  canPay: boolean;
  onSuccess: () => void;
  paying: boolean;
}) {
  return (
    <div className="bg-[#141414] border border-white/[0.08] rounded-card p-6 flex flex-col gap-4">
      <h2 className="text-lg font-semibold mb-1">За да платиш, влез во профилот</h2>

      {/* Tabs */}
      <div className="flex rounded-lg bg-[#0a0a0a] p-0.5 gap-0.5">
        {(["register", "login"] as AuthTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              tab === t
                ? "bg-[#e8c97e] text-[#0a0a0a]"
                : "text-[#888] hover:text-[#f0f0f0]"
            }`}
          >
            {t === "register" ? "Нов корисник" : "Веќе имам профил"}
          </button>
        ))}
      </div>

      {tab === "register" ? (
        <RegisterForm onSuccess={onSuccess} paying={paying} />
      ) : (
        <LoginForm onSuccess={onSuccess} paying={paying} />
      )}
    </div>
  );
}

// ── Register form ────────────────────────────────────────────────────
function RegisterForm({ onSuccess, paying }: { onSuccess: () => void; paying: boolean }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleGoogle() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/checkout")}`,
      },
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agreed) { toast("Прифати ги условите за да продолжиш", "error"); return; }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role: "buyer" } },
    });
    if (error) {
      toast(error.message, "error");
      setLoading(false);
      return;
    }
    // User is now logged in — proceed to payment
    onSuccess();
  }

  const busy = loading || paying;

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handleGoogle}
        disabled={busy}
        className="w-full flex items-center justify-center gap-3 py-2.5 rounded-lg border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] transition-colors text-sm font-medium text-[#f0f0f0] disabled:opacity-50"
      >
        <GoogleIcon />
        Регистрирај се со Google
      </button>
      <div className="flex items-center gap-3 text-[#444] text-xs">
        <div className="flex-1 h-px bg-white/[0.08]" />или<div className="flex-1 h-px bg-white/[0.08]" />
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Ime и Презиме"
          className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-[#f0f0f0] placeholder:text-[#555] focus:outline-none focus:border-[#e8c97e]/50" />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Е-пошта"
          className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-[#f0f0f0] placeholder:text-[#555] focus:outline-none focus:border-[#e8c97e]/50" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} placeholder="Лозинка (мин. 8 карактери)"
          className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-[#f0f0f0] placeholder:text-[#555] focus:outline-none focus:border-[#e8c97e]/50" />
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-[#e8c97e] cursor-pointer" />
          <span className="text-xs text-[#888] leading-relaxed">
            Прифаќам ги{" "}
            <Link href="/legal/terms" target="_blank" className="text-[#e8c97e] hover:underline">Условите</Link>
            {" "}и{" "}
            <Link href="/legal/privacy" target="_blank" className="text-[#e8c97e] hover:underline">Приватноста</Link>
          </span>
        </label>
        <button type="submit" disabled={busy || !agreed}
          className="w-full flex items-center justify-center gap-2 bg-[#e8c97e] text-[#0a0a0a] font-semibold py-2.5 rounded-card hover:bg-[#d4b46a] transition-colors disabled:opacity-50 text-sm">
          {busy ? <><Loader2 size={14} className="animate-spin" /> Обработување...</> : "Регистрирај се и плати"}
        </button>
      </form>
    </div>
  );
}

// ── Login form ───────────────────────────────────────────────────────
function LoginForm({ onSuccess, paying }: { onSuccess: () => void; paying: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGoogle() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/checkout")}`,
      },
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast(error.message, "error");
      setLoading(false);
      return;
    }
    onSuccess();
  }

  const busy = loading || paying;

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handleGoogle}
        disabled={busy}
        className="w-full flex items-center justify-center gap-3 py-2.5 rounded-lg border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] transition-colors text-sm font-medium text-[#f0f0f0] disabled:opacity-50"
      >
        <GoogleIcon />
        Најави се со Google
      </button>
      <div className="flex items-center gap-3 text-[#444] text-xs">
        <div className="flex-1 h-px bg-white/[0.08]" />или<div className="flex-1 h-px bg-white/[0.08]" />
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Е-пошта"
          className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-[#f0f0f0] placeholder:text-[#555] focus:outline-none focus:border-[#e8c97e]/50" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Лозинка"
          className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-[#f0f0f0] placeholder:text-[#555] focus:outline-none focus:border-[#e8c97e]/50" />
        <button type="submit" disabled={busy}
          className="w-full flex items-center justify-center gap-2 bg-[#e8c97e] text-[#0a0a0a] font-semibold py-2.5 rounded-card hover:bg-[#d4b46a] transition-colors disabled:opacity-50 text-sm">
          {busy ? <><Loader2 size={14} className="animate-spin" /> Обработување...</> : "Најави се и плати"}
        </button>
      </form>
      <p className="text-xs text-center text-[#555]">
        <Link href="/login" className="hover:text-[#888] transition-colors">Заборавена лозинка?</Link>
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
      <div className="flex flex-col gap-3">
        {items.map((item) => {
          const price = item.license === "personal" ? item.photo.price_personal : item.photo.price_commercial;
          return (
            <div key={item.photo.id} className="flex gap-3 items-center">
              <div className="relative w-14 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                <Image
                  src={getCloudinaryWatermarkedUrl(item.photo.cloudinary_public_id, cloudName)}
                  alt={item.photo.title || ""}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate text-[#f0f0f0]">
                  {item.photo.title || "Фотографија"}
                </p>
                <p className="text-[10px] text-[#555]">
                  {item.license === "personal" ? "Лична лиценца" : "Комерцијална лиценца"}
                </p>
              </div>
              <span className="text-xs font-semibold text-[#e8c97e] flex-shrink-0">
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
      <p className="text-[10px] text-[#555] text-center">
        HD без watermark · Постојано достапно во профилот
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}
