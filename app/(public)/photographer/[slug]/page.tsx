import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import GalleryCard from "@/components/gallery/GalleryCard";
import { Globe, Instagram, Images } from "lucide-react";
import type { Gallery } from "@/lib/types";

interface Props { params: { slug: string } }

async function getPhotographer(slug: string) {
  const supabase = createClient();
  const { data: user } = await supabase
    .from("users")
    .select("*, photographer_profiles(*)")
    .eq("slug", slug)
    .eq("role", "photographer")
    .single();
  return user;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const ph = await getPhotographer(params.slug);
  if (!ph) return { title: "Фотограф не е најден" };
  const profile = (ph as any).photographer_profiles;
  return {
    title: profile?.display_name ?? ph.name,
    description: profile?.bio ?? undefined,
  };
}

export default async function PhotographerPage({ params }: Props) {
  const ph = await getPhotographer(params.slug);
  if (!ph) notFound();

  const supabase = createClient();
  const profile = (ph as any).photographer_profiles;

  const { data: galleries } = await supabase
    .from("galleries")
    .select(`*, photographer_profiles(display_name, user_id), cover_photo:photos!galleries_cover_photo_id_fkey(id, cloudinary_public_id, width, height)`)
    .eq("photographer_id", ph.id)
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Profile header */}
      <div className="flex flex-col sm:flex-row items-start gap-6 mb-12 pb-12 border-b border-white/[0.08]">
        <div className="w-20 h-20 rounded-full bg-[#e8c97e]/10 flex items-center justify-center text-2xl font-bold text-[#e8c97e] flex-shrink-0 overflow-hidden">
          {ph.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={ph.avatar_url} alt={profile?.display_name} className="w-full h-full object-cover" />
          ) : (
            (profile?.display_name ?? ph.name)?.charAt(0)
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{profile?.display_name ?? ph.name}</h1>
          {profile?.bio && (
            <p className="text-[#888] max-w-xl mb-4 leading-relaxed">{profile.bio}</p>
          )}
          <div className="flex flex-wrap gap-4">
            {profile?.website && (
              <a href={profile.website} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-[#888] hover:text-[#e8c97e] transition-colors">
                <Globe size={14} /> {profile.website.replace(/^https?:\/\//, "")}
              </a>
            )}
            {profile?.instagram && (
              <a href={`https://instagram.com/${profile.instagram}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-[#888] hover:text-[#e8c97e] transition-colors">
                <Instagram size={14} /> @{profile.instagram}
              </a>
            )}
            <span className="flex items-center gap-1.5 text-sm text-[#888]">
              <Images size={14} /> {galleries?.length ?? 0} галерии
            </span>
          </div>
        </div>
      </div>

      {/* Galleries */}
      <h2 className="text-xl font-bold mb-6">Галерии</h2>
      {galleries?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(galleries as Gallery[]).map((g) => <GalleryCard key={g.id} gallery={g} />)}
        </div>
      ) : (
        <p className="text-[#888] text-center py-16">Нема јавни галерии уште.</p>
      )}
    </div>
  );
}
