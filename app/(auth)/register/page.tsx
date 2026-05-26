"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/components/ui/Toaster";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  // ── Email register ──────────────────────────────────────────────────
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!agreed) {
      toast("Прифати ги условите за да продолжиш", "error");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role: "buyer" } },
    });
    if (error) {
      toast(error.message, "error");
    } else {
      toast("Регистрацијата е успешна! Провери ја е-поштата за потврда.", "success");
      router.push("/login");
    }
    setLoading(false);
  }

  // ── Google OAuth ────────────────────────────────────────────────────
  async function handleGoogle() {
    setLoading(true);
    const supabase = createClient();
    const origin = window.location.origin;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent("/account/downloads")}`,
      },
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-[#e8c97e]">PHOTONIA</Link>
          <p className="text-[#888] mt-2 text-sm">Создај нов профил</p>
        </div>

        <div className="bg-[#141414] border border-white/[0.08] rounded-card p-6 flex flex-col gap-4">
          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-2.5 rounded-lg border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] transition-colors text-sm font-medium text-[#f0f0f0] disabled:opacity-50"
          >
            <GoogleIcon />
            Регистрирај се со Google
          </button>

          <div className="flex items-center gap-3 text-[#444] text-xs">
            <div className="flex-1 h-px bg-white/[0.08]" />
            или со е-пошта
            <div className="flex-1 h-px bg-white/[0.08]" />
          </div>

          <form onSubmit={handleRegister} className="flex flex-col gap-3">
            <div>
              <label className="text-xs text-[#888] mb-1.5 block">Ime и Презиме</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-[#f0f0f0] placeholder:text-[#888] focus:outline-none focus:border-[#e8c97e]/50"
                placeholder="Ана Петровска"
              />
            </div>
            <div>
              <label className="text-xs text-[#888] mb-1.5 block">Е-пошта</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-[#f0f0f0] placeholder:text-[#888] focus:outline-none focus:border-[#e8c97e]/50"
                placeholder="tvojata@eposta.mk"
              />
            </div>
            <div>
              <label className="text-xs text-[#888] mb-1.5 block">Лозинка</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-[#f0f0f0] placeholder:text-[#888] focus:outline-none focus:border-[#e8c97e]/50"
                placeholder="Минимум 8 карактери"
              />
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#e8c97e] cursor-pointer"
              />
              <span className="text-xs text-[#888] leading-relaxed">
                Прифаќам ги{" "}
                <Link href="/terms" className="text-[#e8c97e] hover:underline" target="_blank">
                  Условите за користење
                </Link>{" "}
                и{" "}
                <Link href="/privacy" className="text-[#e8c97e] hover:underline" target="_blank">
                  Политиката за приватност
                </Link>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading || !agreed}
              className="bg-[#e8c97e] text-[#0a0a0a] font-semibold py-2.5 rounded-card hover:bg-[#d4b46a] transition-colors disabled:opacity-50 mt-1"
            >
              {loading ? "Регистрирање..." : "Регистрирај се"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[#888] mt-4">
          Веќе имаш профил?{" "}
          <Link href="/login" className="text-[#e8c97e] hover:underline">
            Најави се
          </Link>
        </p>
      </div>
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
