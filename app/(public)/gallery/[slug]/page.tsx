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

async function getGallery(slug: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("galleries")
    .select(
      `*, photographer_profiles(display_name, user_id, instagram, website), photos(*, gallery:galleries(slug))`
    )
    .eq("slug", slug)
    .eq("is_public", true)
    .single();
  return data as Gallery | null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const gallery = await getGallery(params.slug);
  if (!gallery) return { title: "Галерија не е најдена" };
  return {
    title: gallery.title,
    description: gallery.description ?? undefined,
    openGraph: {
      title: gallery.title,
      description: gallery.description ?? undefined,
      type: "website",
    },
  };
}

export default async function GalleryPage({ params }: Props) {
  const gallery = await getGallery(params.slug);
  if (!gallery) notFound();

  const galleryData = gallery as Gallery & {
    photographer_profiles?: { display_name: string; user_id: string; instagram?: string; website?: string };
    photos?: (Photo & { gallery: { slug: string } })[];
  };
  const photographer = galleryData.photographer_profiles;
  const photos = (galleryData.photos ?? []).sort(
    (a, b) => a.order_index - b.order_index
  );

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
          {photographer && (
            <div className="flex items-center gap-1.5">
              <User size={14} />
              <Link
                href={`/photographer/${photographer.user_id}`}
                className="hover:text-[#e8c97e] transition-colors"
              >
                {photographer.display_name}
              </Link>
            </div>
          )}
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
