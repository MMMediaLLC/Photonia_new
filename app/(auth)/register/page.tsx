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
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
      toast("Регистрацијата е успешна! Провери ја е-поштата.", "success");
      router.push("/login");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-[#e8c97e]">PHOTONIA</Link>
          <p className="text-[#888] mt-2 text-sm">Создај нов профил</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#141414] border border-white/[0.08] rounded-card p-6 flex flex-col gap-4"
        >
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
              minLength={6}
              className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-[#f0f0f0] placeholder:text-[#888] focus:outline-none focus:border-[#e8c97e]/50"
              placeholder="Минимум 6 карактери"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#e8c97e] text-[#0a0a0a] font-semibold py-2.5 rounded-card hover:bg-[#d4b46a] transition-colors disabled:opacity-50 mt-1"
          >
            {loading ? "Регистрирање..." : "Регистрирај се"}
          </button>
        </form>

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
