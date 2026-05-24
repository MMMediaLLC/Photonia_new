import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Eye, EyeOff, Pencil, Images } from "lucide-react";

export default async function DashboardGalleriesPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: galleries } = await supabase
    .from("galleries")
    .select(`*, photos(count)`)
    .eq("photographer_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Мои галерии</h1>
          <p className="text-[#888] text-sm mt-1">{galleries?.length ?? 0} вкупно</p>
        </div>
        <Link
          href="/dashboard/galleries/new"
          className="flex items-center gap-2 bg-[#e8c97e] text-[#0a0a0a] font-semibold px-4 py-2.5 rounded-card hover:bg-[#d4b46a] transition-colors text-sm"
        >
          <Plus size={16} /> Нова галерија
        </Link>
      </div>

      {!galleries?.length && (
        <div className="text-center py-24 border border-dashed border-white/10 rounded-card">
          <Images size={40} className="mx-auto mb-4 text-[#888] opacity-50" />
          <p className="text-[#888] mb-4">Немаш галерии уште.</p>
          <Link
            href="/dashboard/galleries/new"
            className="inline-flex items-center gap-2 bg-[#e8c97e] text-[#0a0a0a] font-semibold px-4 py-2 rounded-card hover:bg-[#d4b46a] transition-colors text-sm"
          >
            <Plus size={14} /> Создај прва галерија
          </Link>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {galleries?.map((g) => {
          const photoCount = (g.photos as unknown as { count: number }[])?.[0]?.count ?? 0;
          return (
            <div
              key={g.id}
              className="flex items-center gap-4 bg-[#141414] border border-white/[0.08] rounded-card px-5 py-4"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{g.title}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-[#888]">
                  <span>{g.category}</span>
                  <span>·</span>
                  <span>{photoCount} фотографии</span>
                  {g.event_date && (
                    <>
                      <span>·</span>
                      <span>{new Date(g.event_date).toLocaleDateString("mk-MK")}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium ${
                    g.is_public
                      ? "bg-[#4caf7d]/15 text-[#4caf7d]"
                      : "bg-white/5 text-[#888]"
                  }`}
                >
                  {g.is_public ? (
                    <span className="flex items-center gap-1"><Eye size={11} /> Јавна</span>
                  ) : (
                    <span className="flex items-center gap-1"><EyeOff size={11} /> Скриена</span>
                  )}
                </span>

                <Link
                  href={`/dashboard/galleries/${g.id}`}
                  className="p-2 rounded-lg border border-white/[0.08] hover:border-white/20 hover:bg-white/5 transition-colors"
                >
                  <Pencil size={14} />
                </Link>

                {g.is_public && (
                  <Link
                    href={`/gallery/${g.slug}`}
                    target="_blank"
                    className="p-2 rounded-lg border border-white/[0.08] hover:border-white/20 hover:bg-white/5 transition-colors"
                  >
                    <Eye size={14} />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
