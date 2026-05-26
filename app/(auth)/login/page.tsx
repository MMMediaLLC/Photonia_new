"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/components/ui/Toaster";

type View = "login" | "forgot";

export default function LoginPage() {
  const router = useRouter();
  const [view, setView] = useState<View>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // ── Email / password login ──────────────────────────────────────────
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast(error.message, "error");
      setLoading(false);
      return;
    }
    let destination = "/account/downloads";
    if (data.user) {
      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", data.user.id)
        .single();
      if (profile?.role === "admin") destination = "/admin";
      else if (profile?.role === "photographer") destination = "/dashboard";
    }
    router.refresh();
    router.push(destination);
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

  // ── Forgot password ─────────────────────────────────────────────────
  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const origin = window.location.origin;
    await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${origin}/auth/callback?next=${encodeURIComponent("/auth/update-password")}`,
    });
    setLoading(false);
    setResetSent(true);
  }

  // ── Forgot password view ────────────────────────────────────────────
  if (view === "forgot") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <Link href="/" className="text-2xl font-bold text-[#e8c97e]">PHOTONIA</Link>
            <p className="text-[#888] mt-2 text-sm">Ресетирање на лозинка</p>
          </div>

          {resetSent ? (
            <div className="bg-[#141414] border border-white/[0.08] rounded-card p-6 text-center">
              <div className="text-4xl mb-3">📧</div>
              <p className="text-[#f0f0f0] font-medium mb-1">Испративме мејл</p>
              <p className="text-[#888] text-sm">
                Ако постои профил со <strong>{resetEmail}</strong>, ќе добиеш линк за ресетирање.
              </p>
              <p className="text-[#555] text-xs mt-2">Провери ja и Spam папката.</p>
            </div>
          ) : (
            <form
              onSubmit={handleForgotPassword}
              className="bg-[#141414] border border-white/[0.08] rounded-card p-6 flex flex-col gap-4"
            >
              <div>
                <label className="text-xs text-[#888] mb-1.5 block">Е-пошта на профилот</label>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  autoFocus
                  className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-[#f0f0f0] placeholder:text-[#888] focus:outline-none focus:border-[#e8c97e]/50"
                  placeholder="tvojata@eposta.mk"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !resetEmail}
                className="bg-[#e8c97e] text-[#0a0a0a] font-semibold py-2.5 rounded-card hover:bg-[#d4b46a] transition-colors disabled:opacity-50"
              >
                {loading ? "Праќам..." : "Испрати линк за ресетирање"}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-[#888] mt-4">
            <button
              onClick={() => { setView("login"); setResetSent(false); }}
              className="text-[#e8c97e] hover:underline"
            >
              ← Назад на најава
            </button>
          </p>
        </div>
      </div>
    );
  }

  // ── Main login view ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-[#e8c97e]">PHOTONIA</Link>
          <p className="text-[#888] mt-2 text-sm">Најави се на твојот профил</p>
        </div>

        <div className="bg-[#141414] border border-white/[0.08] rounded-card p-6 flex flex-col gap-4">
          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-2.5 rounded-lg border border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.08] transition-colors text-sm font-medium text-[#f0f0f0] disabled:opacity-50"
          >
            <GoogleIcon />
            Продолжи со Google
          </button>

          <div className="flex items-center gap-3 text-[#444] text-xs">
            <div className="flex-1 h-px bg-white/[0.08]" />
            или со е-пошта
            <div className="flex-1 h-px bg-white/[0.08]" />
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-3">
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs text-[#888]">Лозинка</label>
                <button
                  type="button"
                  onClick={() => setView("forgot")}
                  className="text-xs text-[#555] hover:text-[#e8c97e] transition-colors"
                >
                  Заборавена лозинка?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-[#f0f0f0] placeholder:text-[#888] focus:outline-none focus:border-[#e8c97e]/50"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#e8c97e] text-[#0a0a0a] font-semibold py-2.5 rounded-card hover:bg-[#d4b46a] transition-colors disabled:opacity-50 mt-1"
            >
              {loading ? "Најавување..." : "Најави се"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[#888] mt-4">
          Немаш профил?{" "}
          <Link href="/register" className="text-[#e8c97e] hover:underline">
            Регистрирај се
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
