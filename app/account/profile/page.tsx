"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/components/ui/Toaster";
import { Loader2, User, Lock, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwSaving, setPwSaving] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.replace("/login"); return; }
      setEmail(data.user.email ?? "");
      setName((data.user.user_metadata?.name as string) ?? "");
      setLoading(false);
    });
  }, [router]);

  async function handleNameSave(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ data: { name } });
    if (error) { toast(error.message, "error"); return; }
    toast("Името е зачувано.", "success");
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    if (pwNew !== pwConfirm) { toast("Лозинките не се совпаѓаат.", "error"); return; }
    if (pwNew.length < 8) { toast("Лозинката мора да има најмалку 8 карактери.", "error"); return; }
    setPwSaving(true);
    const supabase = createClient();
    // Re-authenticate with current password first
    const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password: pwCurrent });
    if (signInErr) { toast("Тековната лозинка е погрешна.", "error"); setPwSaving(false); return; }
    const { error } = await supabase.auth.updateUser({ password: pwNew });
    setPwSaving(false);
    if (error) { toast(error.message, "error"); return; }
    toast("Лозинката е сменета.", "success");
    setPwCurrent(""); setPwNew(""); setPwConfirm("");
  }

  async function handleDeleteAccount() {
    if (deleteConfirm !== email) {
      toast("Внеси ја е-поштата за потврда.", "error");
      return;
    }
    setDeleting(true);
    const res = await fetch("/api/account/delete", { method: "DELETE" });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      toast(j.error ?? "Грешка при бришење.", "error");
      setDeleting(false);
      return;
    }
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={28} className="animate-spin text-[#e8c97e]" />
      </div>
    );
  }

  return (
    <div className="max-w-lg flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Мој профил</h1>
        <p className="text-[#888] text-sm">Управувај со твоите податоци и безбедност</p>
      </div>

      {/* Name */}
      <form onSubmit={handleNameSave} className="bg-[#141414] border border-white/[0.08] rounded-card p-5 flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-1">
          <User size={15} className="text-[#e8c97e]" />
          <h2 className="text-sm font-semibold">Основни податоци</h2>
        </div>
        <div>
          <label className="text-xs text-[#888] mb-1 block">Е-пошта</label>
          <p className="text-sm text-[#f0f0f0] bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2.5 select-all">
            {email}
          </p>
        </div>
        <div>
          <label className="text-xs text-[#888] mb-1 block">Ime и Презиме</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Твоето ime"
            className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-[#f0f0f0] placeholder:text-[#555] focus:outline-none focus:border-[#e8c97e]/50"
          />
        </div>
        <button
          type="submit"
          className="self-start bg-[#e8c97e] text-[#0a0a0a] font-semibold text-sm px-5 py-2 rounded-card hover:bg-[#d4b46a] transition-colors"
        >
          Зачувај
        </button>
      </form>

      {/* Password */}
      <form onSubmit={handlePasswordChange} className="bg-[#141414] border border-white/[0.08] rounded-card p-5 flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-1">
          <Lock size={15} className="text-[#e8c97e]" />
          <h2 className="text-sm font-semibold">Промени лозинка</h2>
        </div>
        <input
          type="password"
          value={pwCurrent}
          onChange={(e) => setPwCurrent(e.target.value)}
          required
          placeholder="Тековна лозинка"
          className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-[#f0f0f0] placeholder:text-[#555] focus:outline-none focus:border-[#e8c97e]/50"
        />
        <input
          type="password"
          value={pwNew}
          onChange={(e) => setPwNew(e.target.value)}
          required
          minLength={8}
          placeholder="Нова лозинка (мин. 8 карактери)"
          className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-[#f0f0f0] placeholder:text-[#555] focus:outline-none focus:border-[#e8c97e]/50"
        />
        <input
          type="password"
          value={pwConfirm}
          onChange={(e) => setPwConfirm(e.target.value)}
          required
          placeholder="Потврди нова лозинка"
          className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-[#f0f0f0] placeholder:text-[#555] focus:outline-none focus:border-[#e8c97e]/50"
        />
        <button
          type="submit"
          disabled={pwSaving}
          className="self-start flex items-center gap-2 bg-[#e8c97e] text-[#0a0a0a] font-semibold text-sm px-5 py-2 rounded-card hover:bg-[#d4b46a] transition-colors disabled:opacity-50"
        >
          {pwSaving && <Loader2 size={13} className="animate-spin" />}
          Смени лозинка
        </button>
      </form>

      {/* Delete account */}
      <div className="bg-[#141414] border border-[#e05555]/20 rounded-card p-5 flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-1">
          <Trash2 size={15} className="text-[#e05555]" />
          <h2 className="text-sm font-semibold text-[#e05555]">Избриши акаунт</h2>
        </div>
        <p className="text-xs text-[#888] leading-relaxed">
          Бришењето на акаунтот е трајно и неповратно. Сите лични податоци се бришат
          согласно чл. 17 од ЗЗЛП. Пристапот до купените фотографии се губи.
        </p>
        <input
          type="email"
          value={deleteConfirm}
          onChange={(e) => setDeleteConfirm(e.target.value)}
          placeholder={`Внеси ${email} за потврда`}
          className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-[#f0f0f0] placeholder:text-[#555] focus:outline-none focus:border-[#e05555]/50"
        />
        <button
          onClick={handleDeleteAccount}
          disabled={deleting || deleteConfirm !== email}
          className="self-start flex items-center gap-2 bg-[#e05555]/10 text-[#e05555] border border-[#e05555]/30 font-semibold text-sm px-5 py-2 rounded-card hover:bg-[#e05555]/20 transition-colors disabled:opacity-40"
        >
          {deleting && <Loader2 size={13} className="animate-spin" />}
          Избриши акаунт
        </button>
      </div>
    </div>
  );
}
