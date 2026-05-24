import type { Metadata } from "next";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import GalleryCard from "@/components/gallery/GalleryCard";
import type { Gallery } from "@/lib/types";

export const metadata: Metadata = {
  title: "Photonia — Фото Пазар",
  description:
    "Купи уникатни фотографии директно од македонски фотографи.",
};

async function getFeaturedGalleries(): Promise<Gallery[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("galleries")
    .select(
      `*, photographer_profiles(display_name, user_id), cover_photo:photos!galleries_cover_photo_id_fkey(id, cloudinary_public_id, width, height)`
    )
    .eq("is_public", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(6);
  return (data as Gallery[]) ?? [];
}

async function getLatestGalleries(): Promise<Gallery[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("galleries")
    .select(
      `*, photographer_profiles(display_name, user_id), cover_photo:photos!galleries_cover_photo_id_fkey(id, cloudinary_public_id, width, height)`
    )
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(9);
  return (data as Gallery[]) ?? [];
}

export default async function HomePage() {
  const [featured, latest] = await Promise.all([
    getFeaturedGalleries(),
    getLatestGalleries(),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a] z-10" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #e8c97e 0%, transparent 70%)" }}
        />
        <div className="relative z-20 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-4 leading-tight">
            Уникатни фотографии од{" "}
            <span className="text-[#e8c97e]">македонски фотографи</span>
          </h1>
          <p className="text-lg text-[#888] mb-10 max-w-xl mx-auto">
            Прегледај галерии, избери фотографија, купи лиценца и преземи оригинал.
          </p>

          {/* Search bar */}
          <form action="/search" className="flex items-center gap-2 max-w-lg mx-auto">
            <div className="flex-1 relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888]"
              />
              <input
                type="text"
                name="q"
                placeholder="Пребарај галерии, фотографи..."
                className="w-full bg-[#141414] border border-white/[0.08] rounded-card pl-9 pr-4 py-3 text-sm text-[#f0f0f0] placeholder:text-[#888] focus:outline-none focus:border-[#e8c97e]/50 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="bg-[#e8c97e] text-[#0a0a0a] font-semibold px-5 py-3 rounded-card hover:bg-[#d4b46a] transition-colors whitespace-nowrap"
            >
              Пребарај
            </button>
          </form>
        </div>
      </section>

      {/* Featured galleries */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Избрани галерии</h2>
            <Link
              href="/galleries?featured=true"
              className="text-sm text-[#888] hover:text-[#e8c97e] transition-colors flex items-center gap-1"
            >
              Сите <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((g) => (
              <GalleryCard key={g.id} gallery={g} />
            ))}
          </div>
        </section>
      )}

      {/* Latest galleries */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Најнови галерии</h2>
          <Link
            href="/galleries"
            className="text-sm text-[#888] hover:text-[#e8c97e] transition-colors flex items-center gap-1"
          >
            Сите галерии <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {latest.map((g) => (
            <GalleryCard key={g.id} gallery={g} />
          ))}
        </div>
        {latest.length === 0 && (
          <p className="text-center text-[#888] py-16">
            Сè уште нема галерии. Наскоро!
          </p>
        )}
      </section>

      {/* CTA banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <div className="rounded-card bg-[#141414] border border-white/[0.08] p-10 text-center">
          <h2 className="text-2xl font-bold mb-3">Ти си фотограф?</h2>
          <p className="text-[#888] mb-6 max-w-md mx-auto">
            Придружи се на Photonia, продавај твои фотографии и задржи 80% од приходот.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-[#e8c97e] text-[#0a0a0a] font-semibold px-6 py-3 rounded-card hover:bg-[#d4b46a] transition-colors"
          >
            Стани фотограф <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
