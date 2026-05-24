"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { GALLERY_CATEGORIES } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { toast } from "@/components/ui/Toaster";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewGalleryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Настан",
    event_date: "",
    price_personal: "500",
    price_commercial: "1500",
    price_extended: "3000",
  });

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast("Најави се прво", "error"); setLoading(false); return; }

    const slug = slugify(form.title) + "-" + Date.now();

    const { data: gallery, error } = await supabase
      .from("galleries")
      .insert({
        photographer_id: user.id,
        title: form.title,
        slug,
        description: form.description || null,
        category: form.category,
        event_date: form.event_date || null,
        is_public: false,
      })
      .select()
      .single();

    if (error || !gallery) {
      toast(error?.message ?? "Грешка", "error");
      setLoading(false);
      return;
    }

    toast("Галеријата е создадена!", "success");
    router.push(`/dashboard/galleries/${gallery.id}`);
  }

  const inputClass =
    "w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-[#f0f0f0] placeholder:text-[#555] focus:outline-none focus:border-[#e8c97e]/50 transition-colors";

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/dashboard/galleries" className="p-2 rounded-lg hover:bg-white/5 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Нова галерија</h1>
          <p className="text-[#888] text-sm">Создај галерија па додај фотографии</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#141414] border border-white/[0.08] rounded-card p-6 flex flex-col gap-5">
        <div>
          <label className="text-xs text-[#888] mb-1.5 block">Наслов *</label>
          <input
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            required
            placeholder="пр. Свадба Ана & Марко — јуни 2025"
            className={inputClass}
          />
        </div>

        <div>
          <label className="text-xs text-[#888] mb-1.5 block">Опис</label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={3}
            placeholder="Кратко опиши ја галеријата..."
            className={inputClass + " resize-none"}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-[#888] mb-1.5 block">Категорија *</label>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className={inputClass}
            >
              {GALLERY_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-[#888] mb-1.5 block">Датум на настан</label>
            <input
              type="date"
              value={form.event_date}
              onChange={(e) => set("event_date", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="border-t border-white/[0.06] pt-5">
          <p className="text-sm font-medium mb-3">Стандардни цени (МКД)</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: "price_personal", label: "Лична" },
              { key: "price_commercial", label: "Комерцијална" },
              { key: "price_extended", label: "Проширена" },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="text-xs text-[#888] mb-1.5 block">{label}</label>
                <input
                  type="number"
                  value={form[key as keyof typeof form]}
                  onChange={(e) => set(key, e.target.value)}
                  min="0"
                  className={inputClass}
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-[#888] mt-2">Можеш да ги промениш цените по фотографија подоцна.</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#e8c97e] text-[#0a0a0a] font-semibold py-3 rounded-card hover:bg-[#d4b46a] transition-colors disabled:opacity-50 mt-1"
        >
          {loading ? "Создавање..." : "Создај галерија и додај фотографии →"}
        </button>
      </form>
    </div>
  );
}
