import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import GalleryCard from "@/components/gallery/GalleryCard";
import type { Gallery } from "@/lib/types";
import { Search } from "lucide-react";

export const metadata: Metadata = { title: "Пребарување" };

interface Props {
  searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: Props) {
  const q = searchParams.q?.trim() ?? "";
  let galleries: Gallery[] = [];

  if (q) {
    const supabase = createClient();
    const { data } = await supabase
      .from("galleries")
      .select(
        `*, photographer_profiles(display_name, user_id), cover_photo:photos!galleries_cover_photo_id_fkey(id, cloudinary_public_id, width, height)`
      )
      .eq("is_public", true)
      .or(`title.ilike.%${q}%,description.ilike.%${q}%,category.ilike.%${q}%`)
      .order("created_at", { ascending: false })
      .limit(24);
    galleries = (data as Gallery[]) ?? [];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Пребарување</h1>

      <form action="/search" className="flex gap-2 mb-10 max-w-xl">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888]" />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Пребарај галерии..."
            className="w-full bg-[#141414] border border-white/[0.08] rounded-card pl-9 pr-4 py-3 text-sm text-[#f0f0f0] placeholder:text-[#888] focus:outline-none focus:border-[#e8c97e]/50"
          />
        </div>
        <button
          type="submit"
          className="bg-[#e8c97e] text-[#0a0a0a] font-semibold px-5 py-3 rounded-card hover:bg-[#d4b46a] transition-colors"
        >
          Пребарај
        </button>
      </form>

      {q && (
        <p className="text-sm text-[#888] mb-6">
          {galleries.length} резултати за &bdquo;{q}&ldquo;
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {galleries.map((g) => (
          <GalleryCard key={g.id} gallery={g} />
        ))}
      </div>

      {q && galleries.length === 0 && (
        <p className="text-center text-[#888] py-16">Нема резултати за &bdquo;{q}&ldquo;.</p>
      )}
    </div>
  );
}
