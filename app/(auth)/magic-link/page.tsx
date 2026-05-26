"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Mail, CheckCircle } from "lucide-react";

export default function MagicLinkPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/auth/magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 rounded-full bg-[#4caf7d]/15 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-[#4caf7d]" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Провери го е-маилот</h1>
          <p className="text-[#888] text-sm mb-6">
            Ако постои профил со <strong>{email}</strong>, веднаш ќе ти стасa линк за најава.
          </p>
          <p className="text-[#888] text-xs mb-6">
            Не гледаш email? Провери ja Spam папката. Линкот важи 1 час.
          </p>
          <Link href="/login" className="text-[#e8c97e] hover:underline text-sm">
            ← Назад на најава
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-[#e8c97e]">PHOTONIA</Link>
          <p className="text-[#888] mt-2 text-sm">Влез без лозинка</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#141414] border border-white/[0.08] rounded-card p-6 flex flex-col gap-4"
        >
          <div>
            <label className="text-xs text-[#888] mb-1.5 block">Е-пошта</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-[#f0f0f0] placeholder:text-[#555] focus:outline-none focus:border-[#e8c97e]/50"
              placeholder="tvojata@eposta.mk"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !email}
            className="flex items-center justify-center gap-2 bg-[#e8c97e] text-[#0a0a0a] font-semibold py-2.5 rounded-card hover:bg-[#d4b46a] transition-colors disabled:opacity-50 mt-1"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
            {loading ? "Праќам..." : "Прати магичен линк"}
          </button>

          <p className="text-xs text-[#888] text-center leading-relaxed mt-2">
            Ќе ти испратиме email со линк за автоматска најава. Без потреба од лозинка.
          </p>
        </form>

        <p className="text-center text-sm text-[#888] mt-4">
          Имаш лозинка?{" "}
          <Link href="/login" className="text-[#e8c97e] hover:underline">
            Најави се со лозинка
          </Link>
        </p>
      </div>
    </div>
  );
}
