"use client";

import { useEffect, useState, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { GALLERY_CATEGORIES } from "@/lib/types";
import { toast } from "@/components/ui/Toaster";
import { getCloudinaryWatermarkedUrl } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, Upload, Trash2, Eye, EyeOff, Save, X, Loader2
} from "lucide-react";
import type { Photo, Gallery } from "@/lib/types";

interface UploadingFile {
  id: string;
  name: string;
  progress: number;
  done: boolean;
  error?: string;
}

export default function EditGalleryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";

  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState<UploadingFile[]>([]);
  const [saving, setSaving] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", category: "Настан",
    event_date: "", is_public: false,
  });

  const inputClass = "w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-[#f0f0f0] placeholder:text-[#555] focus:outline-none focus:border-[#e8c97e]/50 transition-colors";

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: g } = await supabase
        .from("galleries")
        .select("*")
        .eq("id", id)
        .single();
      if (!g) { router.push("/dashboard/galleries"); return; }
      setGallery(g as Gallery);
      setForm({
        title: g.title,
        description: g.description ?? "",
        category: g.category,
        event_date: g.event_date ?? "",
        is_public: g.is_public,
      });
      const { data: ph } = await supabase
        .from("photos")
        .select("*")
        .eq("gallery_id", id)
        .order("order_index");
      setPhotos((ph as Photo[]) ?? []);
    }
    load();
  }, [id, router]);

  async function uploadFiles(files: FileList | File[]) {
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!arr.length) return;

    const tasks: UploadingFile[] = arr.map((f) => ({
      id: Math.random().toString(36).slice(2),
      name: f.name,
      progress: 0,
      done: false,
    }));
    setUploading((prev) => [...prev, ...tasks]);

    for (let i = 0; i < arr.length; i++) {
      const file = arr[i];
      const task = tasks[i];
      const fd = new FormData();
      fd.append("file", file);
      fd.append("galleryId", id);

      setUploading((prev) =>
        prev.map((u) => (u.id === task.id ? { ...u, progress: 30 } : u))
      );

      try {
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        setPhotos((prev) => [...prev, json.photo as Photo]);
        setUploading((prev) =>
          prev.map((u) => (u.id === task.id ? { ...u, progress: 100, done: true } : u))
        );
      } catch (err) {
        setUploading((prev) =>
          prev.map((u) =>
            u.id === task.id ? { ...u, error: (err as Error).message, done: true } : u
          )
        );
      }
    }
    setTimeout(() => setUploading((prev) => prev.filter((u) => !u.done)), 2500);
  }

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      uploadFiles(e.dataTransfer.files);
    },
    [id]
  );

  async function deletePhoto(photoId: string) {
    const supabase = createClient();
    await supabase.from("photos").delete().eq("id", photoId);
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    toast("Фотографијата е избришана", "success");
  }

  async function updatePhotoPrice(
    photoId: string,
    field: "price_personal" | "price_commercial" | "price_extended",
    value: number
  ) {
    const supabase = createClient();
    await supabase.from("photos").update({ [field]: value }).eq("id", photoId);
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, [field]: value } : p))
    );
  }

  async function saveGallery() {
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("galleries")
      .update({
        title: form.title,
        description: form.description || null,
        category: form.category,
        event_date: form.event_date || null,
        is_public: form.is_public,
      })
      .eq("id", id);
    if (error) toast(error.message, "error");
    else toast("Зачувано!", "success");
    setSaving(false);
  }

  async function setCover(photoId: string) {
    const supabase = createClient();
    await supabase.from("galleries").update({ cover_photo_id: photoId }).eq("id", id);
    toast("Cover фото е поставено", "success");
  }

  if (!gallery) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="animate-spin text-[#e8c97e]" size={32} />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/dashboard/galleries" className="p-2 rounded-lg hover:bg-white/5 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold truncate">{gallery.title}</h1>
          <p className="text-[#888] text-sm">{photos.length} фотографии</p>
        </div>
        <button
          onClick={saveGallery}
          disabled={saving}
          className="flex items-center gap-2 bg-[#e8c97e] text-[#0a0a0a] font-semibold px-4 py-2.5 rounded-card hover:bg-[#d4b46a] transition-colors text-sm disabled:opacity-50"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          Зачувај
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT — Settings */}
        <div className="lg:col-span-1 flex flex-col gap-5">
          <div className="bg-[#141414] border border-white/[0.08] rounded-card p-5 flex flex-col gap-4">
            <p className="font-semibold text-sm">Поставки</p>

            <div>
              <label className="text-xs text-[#888] mb-1.5 block">Наслов</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-[#888] mb-1.5 block">Опис</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={inputClass + " resize-none"} />
            </div>
            <div>
              <label className="text-xs text-[#888] mb-1.5 block">Категорија</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass}>
                {GALLERY_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-[#888] mb-1.5 block">Датум на настан</label>
              <input type="date" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} className={inputClass} />
            </div>

            <button
              onClick={() => setForm({ ...form, is_public: !form.is_public })}
              className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-card text-sm font-semibold transition-colors border ${
                form.is_public
                  ? "border-[#4caf7d]/40 bg-[#4caf7d]/10 text-[#4caf7d]"
                  : "border-white/10 text-[#888] hover:border-white/20"
              }`}
            >
              {form.is_public ? <><Eye size={14} /> Јавна галерија</> : <><EyeOff size={14} /> Скриена галерија</>}
            </button>
          </div>
        </div>

        {/* RIGHT — Photos */}
        <div className="lg:col-span-2">
          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`relative border-2 border-dashed rounded-card p-8 text-center mb-6 transition-colors ${
              dragging ? "border-[#e8c97e] bg-[#e8c97e]/5" : "border-white/10 hover:border-white/20"
            }`}
          >
            <Upload size={28} className="mx-auto mb-3 text-[#888]" />
            <p className="font-medium mb-1">Повлечи фотографии тука</p>
            <p className="text-sm text-[#888] mb-4">или</p>
            <label className="cursor-pointer bg-[#e8c97e] text-[#0a0a0a] font-semibold px-5 py-2.5 rounded-card hover:bg-[#d4b46a] transition-colors text-sm">
              Избери фотографии
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files && uploadFiles(e.target.files)}
              />
            </label>

            {/* Upload progress */}
            {uploading.length > 0 && (
              <div className="mt-4 flex flex-col gap-2 text-left">
                {uploading.map((u) => (
                  <div key={u.id} className="flex items-center gap-3 text-xs">
                    <div className="flex-1 bg-white/5 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${u.error ? "bg-[#e05555]" : "bg-[#e8c97e]"}`}
                        style={{ width: `${u.progress}%` }}
                      />
                    </div>
                    <span className="text-[#888] truncate max-w-[140px]">{u.name}</span>
                    {u.done && !u.error && <span className="text-[#4caf7d]">✓</span>}
                    {u.error && <span className="text-[#e05555]">✗</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Photo grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {photos.map((photo) => (
              <div key={photo.id} className="group relative bg-[#141414] rounded-card overflow-hidden border border-white/[0.06]">
                <div className="relative aspect-square">
                  <Image
                    src={getCloudinaryWatermarkedUrl(photo.cloudinary_public_id, cloudName)}
                    alt={photo.title || "Фото"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, 33vw"
                  />
                  {/* Hover actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => setCover(photo.id)}
                      className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded-lg transition-colors"
                      title="Постави како cover"
                    >
                      Cover
                    </button>
                    <button
                      onClick={() => deletePhoto(photo.id)}
                      className="p-1.5 bg-[#e05555]/80 hover:bg-[#e05555] rounded-lg transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Price inputs */}
                <div className="p-2 flex flex-col gap-1">
                  {(["price_personal", "price_commercial", "price_extended"] as const).map((field) => (
                    <div key={field} className="flex items-center gap-1 text-xs">
                      <span className="text-[#888] w-5 flex-shrink-0">
                        {field === "price_personal" ? "L" : field === "price_commercial" ? "K" : "P"}
                      </span>
                      <input
                        type="number"
                        defaultValue={photo[field]}
                        onBlur={(e) => updatePhotoPrice(photo.id, field, Number(e.target.value))}
                        className="w-full bg-[#0a0a0a] border border-white/[0.06] rounded px-1.5 py-0.5 text-xs text-[#f0f0f0] focus:outline-none focus:border-[#e8c97e]/40"
                      />
                      <span className="text-[#555]">ден</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {photos.length === 0 && uploading.length === 0 && (
            <p className="text-center text-[#888] py-8 text-sm">Нема фотографии. Прикачи погоре.</p>
          )}
        </div>
      </div>
    </div>
  );
}
