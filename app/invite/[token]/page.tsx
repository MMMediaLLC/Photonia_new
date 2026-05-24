"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Camera } from "lucide-react";

export default function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const router = useRouter();

  const [invite, setInvite] = useState<{ email: string } | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", password: "", confirm: "" });

  const inputClass = "w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-3 py-3 text-sm text-[#f0f0f0] placeholder:text-[#555] focus:outline-none focus:border-[#e8c97e]/50 transition-colors";

  useEffect(() => {
    async function check() {
      const supabase = createClient();
      const { data } = await supabase
        .from("photographer_invites")
        .select("email, used")
        .eq("token", token)
        .single();

      if (!data || data.used) {
        setNotFound(true);
      } else {
        setInvite({ email: data.email });
      }
      setLoading(false);
    }
    check();
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError("Лозинките не се совпаѓаат");
      return;
    }
    if (form.password.length < 8) {
      setError("Лозинката мора да има најмалку 8 знаци");
      return;
    }
    setError("");
    setSubmitting(true);

    const res = await fetch("/api/invite/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, name: form.name, password: form.password }),
    });

    const json = await res.json();
    if (!res.ok) {
      setError(json.error ?? "Грешка при регистрација");
      setSubmitting(false);
      return;
    }

    const supabase = createClient();
    await supabase.auth.signInWithPassword({ email: invite!.email, password: form.password });
    router.push("/dashboard");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#e8c97e]" size={32} />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-2xl font-bold mb-3">Поканата не е валидна</p>
          <p className="text-[#888]">Оваа покана е веќе искористена или не постои.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-[#e8c97e]/10 flex items-center justify-center mx-auto mb-4">
            <Camera size={28} className="text-[#e8c97e]" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Добредојде во Photonia!</h1>
          <p className="text-[#888] text-sm">
            Поканет/а си како фотограф на <span className="text-[#e8c97e]">{invite?.email}</span>.
            Постави лозинка за да го активираш профилот.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#141414] border border-white/[0.08] rounded-card p-6 flex flex-col gap-4">
          <div>
            <label className="text-xs text-[#888] mb-1.5 block">Целосно ime</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className={inputClass}
              placeholder="Ана Петровска"
            />
          </div>

          <div>
            <label className="text-xs text-[#888] mb-1.5 block">Лозинка</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className={inputClass}
              placeholder="Минимум 8 знаци"
            />
          </div>

          <div>
            <label className="text-xs text-[#888] mb-1.5 block">Потврди лозинка</label>
            <input
              type="password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              required
              className={inputClass}
              placeholder="Повтори ја лозинката"
            />
          </div>

          {error && (
            <p className="text-sm text-[#e05555] bg-[#e05555]/10 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 bg-[#e8c97e] text-[#0a0a0a] font-semibold py-3 rounded-card hover:bg-[#d4b46a] transition-colors disabled:opacity-50 mt-2"
          >
            {submitting && <Loader2 size={14} className="animate-spin" />}
            {submitting ? "Активирање..." : "Активирај профил"}
          </button>
        </form>
      </div>
    </div>
  );
}
