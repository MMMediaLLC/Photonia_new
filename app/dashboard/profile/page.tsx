"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/components/ui/Toaster";
import { Loader2 } from "lucide-react";

export default function DashboardProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    display_name: "",
    bio: "",
    website: "",
    instagram: "",
    name: "",
  });

  const inputClass = "w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-[#f0f0f0] placeholder:text-[#555] focus:outline-none focus:border-[#e8c97e]/50 transition-colors";

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [{ data: profile }, { data: userRow }] = await Promise.all([
        supabase.from("photographer_profiles").select("*").eq("user_id", user.id).single(),
        supabase.from("users").select("name").eq("id", user.id).single(),
      ]);

      setForm({
        display_name: profile?.display_name ?? "",
        bio: profile?.bio ?? "",
        website: profile?.website ?? "",
        instagram: profile?.instagram ?? "",
        name: userRow?.name ?? "",
      });
      setLoading(false);
    }
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [r1, r2] = await Promise.all([
      supabase.from("photographer_profiles").upsert({
        user_id: user.id,
        display_name: form.display_name,
        bio: form.bio || null,
        website: form.website || null,
        instagram: form.instagram || null,
      }),
      supabase.from("users").update({ name: form.name }).eq("id", user.id),
    ]);

    if (r1.error || r2.error) toast(r1.error?.message ?? r2.error?.message ?? "Грешка", "error");
    else toast("Профилот е зачуван!", "success");
    setSaving(false);
  }

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="animate-spin text-[#e8c97e]" size={32} />
    </div>
  );

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-2">Мој профил</h1>
      <p className="text-[#888] text-sm mb-8">Информации видливи за купувачите</p>

      <form onSubmit={handleSubmit} className="bg-[#141414] border border-white/[0.08] rounded-card p-6 flex flex-col gap-5">
        <div>
          <label className="text-xs text-[#888] mb-1.5 block">Целосно ime</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="Ана Петровска" />
        </div>

        <div>
          <label className="text-xs text-[#888] mb-1.5 block">Прикажано ime (јавно)</label>
          <input value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} required className={inputClass} placeholder="Ana Photography" />
        </div>

        <div>
          <label className="text-xs text-[#888] mb-1.5 block">Bio</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            rows={4}
            className={inputClass + " resize-none"}
            placeholder="Кажи нешто за себе и твојот стил на фотографија..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-[#888] mb-1.5 block">Website</label>
            <input
              type="url"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              className={inputClass}
              placeholder="https://anaPhoto.mk"
            />
          </div>
          <div>
            <label className="text-xs text-[#888] mb-1.5 block">Instagram</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888] text-sm">@</span>
              <input
                value={form.instagram}
                onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                className={inputClass + " pl-7"}
                placeholder="ana.photo"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-2 bg-[#e8c97e] text-[#0a0a0a] font-semibold py-3 rounded-card hover:bg-[#d4b46a] transition-colors disabled:opacity-50"
        >
          {saving && <Loader2 size={14} className="animate-spin" />}
          {saving ? "Зачувување..." : "Зачувај профил"}
        </button>
      </form>
    </div>
  );
}
