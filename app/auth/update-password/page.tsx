"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/components/ui/Toaster";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      toast("Лозинките не се совпаѓаат", "error");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast(error.message, "error");
      setLoading(false);
      return;
    }
    toast("Лозинката е успешно променета!", "success");
    router.push("/account/downloads");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-[#e8c97e]">PHOTONIA</Link>
          <p className="text-[#888] mt-2 text-sm">Постави нова лозинка</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#141414] border border-white/[0.08] rounded-card p-6 flex flex-col gap-4"
        >
          <div>
            <label className="text-xs text-[#888] mb-1.5 block">Нова лозинка</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoFocus
              className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-[#f0f0f0] placeholder:text-[#888] focus:outline-none focus:border-[#e8c97e]/50"
              placeholder="Минимум 8 карактери"
            />
          </div>
          <div>
            <label className="text-xs text-[#888] mb-1.5 block">Потврди лозинка</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={8}
              className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-[#f0f0f0] placeholder:text-[#888] focus:outline-none focus:border-[#e8c97e]/50"
              placeholder="Повтори ја лозинката"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#e8c97e] text-[#0a0a0a] font-semibold py-2.5 rounded-card hover:bg-[#d4b46a] transition-colors disabled:opacity-50 mt-1"
          >
            {loading ? "Зачувување..." : "Зачувај нова лозинка"}
          </button>
        </form>
      </div>
    </div>
  );
}
