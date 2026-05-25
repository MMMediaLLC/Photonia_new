import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import GalleryCard from "@/components/gallery/GalleryCard";
import { GALLERY_CATEGORIES, type Gallery } from "@/lib/types";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Галерии",
  description: "Прегледај ги сите галерии на Photonia",
};

interface Props {
  searchParams: { category?: string; featured?: string };
}

export default async function GalleriesPage({ searchParams }: Props) {
  const supabase = createClient();

  let query = supabase
    .from("galleries")
    .select("*")
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  if (searchParams.category) {
    query = query.eq("category", searchParams.category);
  }
  if (searchParams.featured === "true") {
    query = query.eq("is_featured", true);
  }

  const { data: galleries } = await query;

  // Enrich with cover photos + photographer profiles
  const coverIds = (galleries ?? []).map((g) => g.cover_photo_id).filter(Boolean) as string[];
  const photographerIds = (galleries ?? []).map((g) => g.photographer_id);

  const [{ data: covers }, { data: profiles }] = await Promise.all([
    coverIds.length
      ? supabase.from("photos").select("id, cloudinary_public_id, width, height").in("id", coverIds)
      : Promise.resolve({ data: [] as { id: string; cloudinary_public_id: string; width: number; height: number }[] }),
    photographerIds.length
      ? supabase.from("photographer_profiles").select("user_id, display_name").in("user_id", photographerIds)
      : Promise.resolve({ data: [] as { user_id: string; display_name: string }[] }),
  ]);

  const enriched: Gallery[] = (galleries ?? []).map((g) => ({
    ...g,
    cover_photo: covers?.find((c) => c.id === g.cover_photo_id) ?? null,
    photographer_profiles: profiles?.find((p) => p.user_id === g.photographer_id) ?? null,
  })) as Gallery[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Галерии</h1>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href="/galleries"
          className={cn(
            "px-3 py-1.5 rounded-lg text-sm transition-colors",
            !searchParams.category
              ? "bg-[#e8c97e] text-[#0a0a0a] font-semibold"
              : "bg-[#141414] border border-white/[0.08] text-[#888] hover:text-[#f0f0f0]"
          )}
        >
          Сите
        </Link>
        {GALLERY_CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={`/galleries?category=${encodeURIComponent(cat)}`}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm transition-colors",
              searchParams.category === cat
                ? "bg-[#e8c97e] text-[#0a0a0a] font-semibold"
                : "bg-[#141414] border border-white/[0.08] text-[#888] hover:text-[#f0f0f0]"
            )}
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {enriched.map((g) => (
          <GalleryCard key={g.id} gallery={g} />
        ))}
      </div>

      {enriched.length === 0 && (
        <p className="text-center text-[#888] py-24">Нема галерии за избраниот филтер.</p>
      )}
    </div>
  );
}
