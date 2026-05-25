import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PhotoGrid from "@/components/gallery/PhotoGrid";
import type { Gallery, Photo } from "@/lib/types";
import { Calendar, User } from "lucide-react";
import Link from "next/link";

interface Props {
  params: { slug: string };
}

async function getGalleryData(slug: string) {
  const supabase = createClient();

  const { data: gallery } = await supabase
    .from("galleries")
    .select("*")
    .eq("slug", slug)
    .eq("is_public", true)
    .single();

  if (!gallery) return null;

  const [{ data: photos }, { data: photographerUser }, { data: photographerProfile }] =
    await Promise.all([
      supabase
        .from("photos")
        .select("*")
        .eq("gallery_id", gallery.id)
        .order("order_index"),
      supabase
        .from("users")
        .select("id, name, slug")
        .eq("id", gallery.photographer_id)
        .single(),
      supabase
        .from("photographer_profiles")
        .select("display_name, user_id, instagram, website")
        .eq("user_id", gallery.photographer_id)
        .maybeSingle(),
    ]);

  return {
    gallery: gallery as Gallery,
    photos: (photos as Photo[]) ?? [],
    photographer: {
      user_id: gallery.photographer_id,
      slug: photographerUser?.slug ?? gallery.photographer_id,
      display_name:
        photographerProfile?.display_name || photographerUser?.name || "Фотограф",
      instagram: photographerProfile?.instagram ?? null,
      website: photographerProfile?.website ?? null,
    },
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getGalleryData(params.slug);
  if (!data) return { title: "Галерија не е најдена" };
  return {
    title: data.gallery.title,
    description: data.gallery.description ?? undefined,
    openGraph: {
      title: data.gallery.title,
      description: data.gallery.description ?? undefined,
      type: "website",
    },
  };
}

export default async function GalleryPage({ params }: Props) {
  const data = await getGalleryData(params.slug);
  if (!data) notFound();

  const { gallery, photos, photographer } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Gallery header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-sm text-[#888] mb-3">
          <Link href="/galleries" className="hover:text-[#f0f0f0]">Галерии</Link>
          <span>/</span>
          <span>{gallery.title}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold mb-3">{gallery.title}</h1>

        {gallery.description && (
          <p className="text-[#888] max-w-2xl mb-4">{gallery.description}</p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-sm text-[#888]">
          <div className="flex items-center gap-1.5">
            <User size={14} />
            <Link
              href={`/photographer/${photographer.slug}`}
              className="hover:text-[#e8c97e] transition-colors"
            >
              {photographer.display_name}
            </Link>
          </div>
          {gallery.event_date && (
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              {new Date(gallery.event_date).toLocaleDateString("mk-MK", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          )}
          <span className="bg-white/[0.05] px-2 py-1 rounded-lg">{gallery.category}</span>
          <span>{photos.length} фотографии</span>
        </div>
      </div>

      {/* Photo grid */}
      <PhotoGrid photos={photos} gallery={gallery} />
    </div>
  );
}
