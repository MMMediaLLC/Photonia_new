import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ArrowRight,
  Leaf,
  Briefcase,
  Trophy,
  CalendarDays,
  Newspaper,
  Plane,
  ShoppingCart,
  Download,
  CheckCircle,
  Package,
  Star,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import GalleryCard from "@/components/gallery/GalleryCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { Gallery } from "@/lib/types";

export const metadata: Metadata = {
  title: "Photonia — Купи професионални фотографии во HD",
  description:
    "Купи оригинални фотографии во висока резолуција — без воден жиг, веднаш достапни за преземање. Лична и комерцијална лиценца.",
};

const CATEGORIES = [
  { label: "Настани", icon: CalendarDays, href: "/galleries?category=Настани" },
  { label: "Спорт", icon: Trophy, href: "/galleries?category=Спорт" },
  { label: "Репортажи", icon: Newspaper, href: "/galleries?category=Репортажи" },
  { label: "Природа", icon: Leaf, href: "/galleries?category=Природа" },
  { label: "Корпоративни", icon: Briefcase, href: "/galleries?category=Корпоративни" },
  { label: "Патувања", icon: Plane, href: "/galleries?category=Патувања" },
  { label: "Press пакети", icon: Package, href: "/press" },
  { label: "Премиум", icon: Star, href: "/premium" },
];

const HOW_IT_WORKS = [
  {
    icon: Search,
    step: "01",
    title: "Прегледај",
    desc: "Истражи галерии и пронајди ја сликата што ти треба.",
  },
  {
    icon: ShoppingCart,
    step: "02",
    title: "Избери лиценца",
    desc: "Лична за приватна употреба или Комерцијална за бизнис.",
  },
  {
    icon: CheckCircle,
    step: "03",
    title: "Регистрирај се и плати",
    desc: "Создади профил и плати безбедно со картичка преку LemonSqueezy.",
  },
  {
    icon: Download,
    step: "04",
    title: "Преземи HD оригинал",
    desc: "Веднаш ја симнуваш фотографијата во висока резолуција, без воден жиг.",
  },
];

const supabaseReady =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith("http") &&
  (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length ?? 0) > 10;

type RawGallery = Record<string, unknown> & {
  id: string;
  cover_photo_id: string | null;
  photographer_id: string;
};

async function enrichGalleries(galleries: RawGallery[]): Promise<Gallery[]> {
  if (!galleries.length) return [];
  const supabase = createClient();
  const coverIds = galleries.map((g) => g.cover_photo_id).filter(Boolean) as string[];
  const photographerIds = galleries.map((g) => g.photographer_id);

  const [{ data: covers }, { data: profiles }] = await Promise.all([
    coverIds.length
      ? supabase.from("photos").select("id, cloudinary_public_id, width, height").in("id", coverIds)
      : Promise.resolve({ data: [] as { id: string; cloudinary_public_id: string; width: number; height: number }[] }),
    photographerIds.length
      ? supabase.from("photographer_profiles").select("user_id, display_name").in("user_id", photographerIds)
      : Promise.resolve({ data: [] as { user_id: string; display_name: string }[] }),
  ]);

  return galleries.map((g) => ({
    ...g,
    cover_photo: covers?.find((c) => c.id === g.cover_photo_id) ?? null,
    photographer_profiles: profiles?.find((p) => p.user_id === g.photographer_id) ?? null,
  })) as unknown as Gallery[];
}

async function getFeaturedGalleries(): Promise<Gallery[]> {
  if (!supabaseReady) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from("galleries")
    .select("*")
    .eq("is_public", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(6);
  return enrichGalleries(data ?? []);
}

async function getLatestGalleries(): Promise<Gallery[]> {
  if (!supabaseReady) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from("galleries")
    .select("*")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(9);
  return enrichGalleries(data ?? []);
}

async function getFeaturedPhotographers() {
  if (!supabaseReady) return [];
  const supabase = createClient();
  const { data } = await supabase
    .from("photographer_profiles")
    .select(`*, user:users(id, name, slug, avatar_url)`)
    .limit(4);
  return data ?? [];
}

export default async function HomePage() {
  const [featured, latest, photographers] = await Promise.all([
    getFeaturedGalleries(),
    getLatestGalleries(),
    getFeaturedPhotographers(),
  ]);

  return (
    <>
      <Navbar />
      <main>
        {/* ═══ HERO ═══ */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#0a0a0a]" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e8c97e' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(ellipse 80% 60% at 50% 40%, #e8c97e 0%, transparent 70%)",
            }}
          />

          {/* Content */}
          <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-[#e8c97e] mb-5 px-3 py-1.5 border border-[#e8c97e]/30 rounded-full">
              HD фотографии · Без воден жиг
            </span>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.05]">
              Уникатни фотографии
              <br />
              <span className="text-[#e8c97e]">во висока резолуција</span>
            </h1>
            <p className="text-lg sm:text-xl text-[#888] mb-10 max-w-2xl mx-auto leading-relaxed">
              Најди ја сликата што ти треба, плати безбедно и веднаш преземи ја
              во оригинална HD резолуција — <strong className="text-[#f0f0f0]">без воден жиг</strong>.
            </p>

            {/* Search */}
            <form
              action="/search"
              className="flex items-center gap-2 max-w-xl mx-auto mb-8"
            >
              <div className="flex-1 relative">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#888]"
                />
                <input
                  type="text"
                  name="q"
                  placeholder="Пребарај галерии, настани, клучни зборови..."
                  className="w-full bg-[#141414]/90 backdrop-blur border border-white/[0.1] rounded-card pl-10 pr-4 py-4 text-sm text-[#f0f0f0] placeholder:text-[#555] focus:outline-none focus:border-[#e8c97e]/50 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="bg-[#e8c97e] text-[#0a0a0a] font-bold px-6 py-4 rounded-card hover:bg-[#d4b46a] transition-colors whitespace-nowrap"
              >
                Пребарај
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[#888]">
              <span className="flex items-center gap-1.5">
                <CheckCircle size={13} className="text-[#e8c97e]" />
                HD оригинал без воден жиг
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle size={13} className="text-[#e8c97e]" />
                Веднаш достапно
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle size={13} className="text-[#e8c97e]" />
                Без претплата
              </span>
            </div>
          </div>

          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
        </section>

        {/* ═══ КАТЕГОРИИ ═══ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-2">Прегледај по тема</h2>
            <p className="text-[#888] text-sm">
              Слики подредени по категории и посебни понуди
            </p>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-8 snap-x snap-mandatory">
            {CATEGORIES.map(({ label, icon: Icon, href }) => (
              <Link
                key={href}
                href={href}
                className="group flex flex-col items-center gap-2.5 p-4 rounded-card bg-[#141414] border border-white/[0.06] hover:border-[#e8c97e]/40 hover:bg-[#1a1a1a] transition-all duration-200 flex-shrink-0 w-[calc((100vw-2rem)/4.5)] sm:w-auto snap-start"
              >
                <div className="w-10 h-10 rounded-xl bg-[#e8c97e]/10 flex items-center justify-center group-hover:bg-[#e8c97e]/20 transition-colors">
                  <Icon size={18} className="text-[#e8c97e]" />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wide transition-colors text-center leading-tight text-[#888] group-hover:text-[#f0f0f0]">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ═══ ИЗБРАНИ ГАЛЕРИИ ═══ */}
        {featured.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#e8c97e] mb-1">
                  Избрано
                </p>
                <h2 className="text-2xl font-bold">Препорачани галерии</h2>
              </div>
              <Link
                href="/galleries?featured=true"
                className="text-sm text-[#888] hover:text-[#e8c97e] transition-colors flex items-center gap-1.5 pb-1"
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

        {/* ═══ НАЈНОВИ ГАЛЕРИИ ═══ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#888] mb-1">
                Галерии
              </p>
              <h2 className="text-2xl font-bold">Најнови галерии</h2>
            </div>
            <Link
              href="/galleries"
              className="text-sm text-[#888] hover:text-[#e8c97e] transition-colors flex items-center gap-1.5 pb-1"
            >
              Погледај ги сите <ArrowRight size={14} />
            </Link>
          </div>

          {latest.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {latest.map((g) => (
                <GalleryCard key={g.id} gallery={g} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-[#888]">
              <p>Наскоро — галериите се во подготовка.</p>
            </div>
          )}
        </section>

        {/* ═══ КАК ФУНКЦИОНИРА ═══ */}
        <section className="py-24 border-y border-white/[0.06] mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <p className="text-xs uppercase tracking-widest text-[#e8c97e] mb-2">
                Како функционира
              </p>
              <h2 className="text-2xl font-bold mb-3">Од клик до HD слика — за 2 минути</h2>
              <p className="text-[#888] text-sm max-w-lg mx-auto">
                Едноставно, безбедно и без месечна претплата.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {/* connector line — desktop only */}
              <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              {HOW_IT_WORKS.map(({ icon: Icon, step, title, desc }) => (
                <div key={step} className="relative flex flex-col items-center text-center p-6">
                  <div className="relative mb-5">
                    <div className="w-16 h-16 rounded-2xl bg-[#141414] border border-white/[0.08] flex items-center justify-center">
                      <Icon size={24} className="text-[#e8c97e]" />
                    </div>
                    <span className="absolute -top-2 -right-2 text-[10px] font-bold bg-[#e8c97e] text-[#0a0a0a] w-5 h-5 rounded-full flex items-center justify-center">
                      {step}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-2">{title}</h3>
                  <p className="text-sm text-[#888] leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ ФОТОГРАФИ ═══ */}
        {photographers.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#888] mb-1">
                  Тим
                </p>
                <h2 className="text-2xl font-bold">Наши фотографи</h2>
              </div>
              <Link
                href="/galleries"
                className="text-sm text-[#888] hover:text-[#e8c97e] transition-colors flex items-center gap-1.5 pb-1"
              >
                Сите галерии <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {photographers.map((ph: { user_id: string; display_name: string; bio?: string; user?: { slug?: string; avatar_url?: string } }) => (
                <Link
                  key={ph.user_id}
                  href={`/photographer/${ph.user?.slug ?? ph.user_id}`}
                  className="group flex flex-col items-center text-center p-6 rounded-card bg-[#141414] border border-white/[0.06] hover:border-white/[0.14] transition-all"
                >
                  {/* Avatar */}
                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-[#e8c97e]/10 mb-4 flex-shrink-0">
                    {ph.user?.avatar_url ? (
                      <Image
                        src={ph.user.avatar_url}
                        alt={ph.display_name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-[#e8c97e]">
                        {ph.display_name?.charAt(0) ?? "F"}
                      </div>
                    )}
                  </div>
                  <p className="font-semibold text-sm group-hover:text-[#e8c97e] transition-colors">
                    {ph.display_name}
                  </p>
                  {ph.bio && (
                    <p className="text-xs text-[#888] mt-1 line-clamp-2">{ph.bio}</p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ═══ CTA BANNER ═══ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
          <div
            className="relative rounded-card overflow-hidden p-10 sm:p-16 text-center"
            style={{
              background:
                "linear-gradient(135deg, #1a1507 0%, #141414 50%, #0f1a0f 100%)",
            }}
          >
            <div className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "radial-gradient(ellipse 60% 80% at 50% 100%, #e8c97e 0%, transparent 60%)",
              }}
            />
            <div className="relative z-10">
              <p className="text-xs uppercase tracking-widest text-[#e8c97e] mb-3">
                За тебе
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Се препозна на некоја слика?
              </h2>
              <p className="text-[#888] mb-8 max-w-lg mx-auto leading-relaxed">
                Купи ја својата фотографија од настан, концерт или спортска средба
                во <strong className="text-[#f0f0f0]">HD резолуција без воден жиг</strong>.
                Без претплата, без сложени услови.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/galleries"
                  className="inline-flex items-center gap-2 bg-[#e8c97e] text-[#0a0a0a] font-bold px-8 py-3.5 rounded-card hover:bg-[#d4b46a] transition-colors"
                >
                  Прегледај галерии <ArrowRight size={16} />
                </Link>
                <Link
                  href="/search"
                  className="inline-flex items-center gap-2 border border-white/[0.12] text-[#f0f0f0] font-medium px-8 py-3.5 rounded-card hover:border-white/25 transition-colors"
                >
                  Пребарај по име/настан
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
