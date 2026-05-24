import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Images } from "lucide-react";

export default async function AdminGalleriesPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: userRow } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (userRow?.role !== "admin") redirect("/");

  const { data: galleries } = await supabase
    .from("galleries")
    .select(`
      id, title, category, is_public, created_at,
      photographer:users!galleries_photographer_id_fkey(name, email),
      photos(count)
    `)
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Галерии</h1>
      <p className="text-[#888] text-sm mb-8">Сите галерии на платформата</p>

      <div className="bg-[#141414] border border-white/[0.08] rounded-card overflow-hidden">
        {!galleries?.length ? (
          <div className="text-center py-16 text-[#888]">
            <Images size={32} className="mx-auto mb-3 opacity-30" />
            <p>Нема галерии уште.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3 text-xs text-[#888] border-b border-white/[0.06]">
              <span>Наслов</span>
              <span>Фотограф</span>
              <span>Категорија</span>
              <span>Фотографии</span>
              <span>Статус</span>
            </div>
            {galleries.map((g) => {
              const photographer = g.photographer as unknown as { name: string; email: string } | null;
              const photoCount = (g.photos as unknown as { count: number }[])?.[0]?.count ?? 0;

              return (
                <div
                  key={g.id}
                  className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-4 border-b border-white/[0.04] last:border-0 text-sm items-center"
                >
                  <div className="min-w-0">
                    <p className="font-medium truncate">{g.title}</p>
                    <p className="text-xs text-[#888]">
                      {new Date(g.created_at).toLocaleDateString("mk-MK")}
                    </p>
                  </div>
                  <span className="text-[#888] text-xs whitespace-nowrap">{photographer?.name ?? "—"}</span>
                  <span className="text-xs bg-white/5 px-2 py-1 rounded-lg whitespace-nowrap">{g.category}</span>
                  <span className="text-center text-[#888]">{photoCount}</span>
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-lg ${
                      g.is_public
                        ? "bg-[#4caf7d]/15 text-[#4caf7d]"
                        : "bg-white/5 text-[#888]"
                    }`}>
                      {g.is_public ? <Eye size={10} /> : <EyeOff size={10} />}
                      {g.is_public ? "Јавна" : "Скриена"}
                    </span>
                    {g.is_public && (
                      <Link
                        href={`/gallery/${g.id}`}
                        className="text-xs text-[#888] hover:text-[#e8c97e] transition-colors"
                        target="_blank"
                      >
                        Прегледај
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
