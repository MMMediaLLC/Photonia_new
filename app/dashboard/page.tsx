import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { TrendingUp, Images, ShoppingBag, DollarSign } from "lucide-react";

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: userProfile } = await supabase
    .from("users")
    .select("*, photographer_profiles(*)")
    .eq("id", user.id)
    .single();

  const { data: galleries } = await supabase
    .from("galleries")
    .select("id, title, is_public")
    .eq("photographer_id", user.id);

  const galleryIds = galleries?.map((g) => g.id) ?? [];

  const { data: photos } = await supabase
    .from("photos")
    .select("id")
    .in("gallery_id", galleryIds.length ? galleryIds : ["__none__"]);

  const { data: sales } = await supabase
    .from("order_items")
    .select("price, photographer_amount, photo:photos(gallery_id)")
    .in(
      "photo.gallery_id",
      galleryIds.length ? galleryIds : ["__none__"]
    );

  const totalRevenue = sales?.reduce((s, i) => s + (i.photographer_amount ?? 0), 0) ?? 0;
  const totalSales = sales?.length ?? 0;

  const stats = [
    { label: "Вкупен приход", value: formatPrice(totalRevenue), icon: DollarSign, color: "text-[#e8c97e]" },
    { label: "Продажби", value: totalSales, icon: ShoppingBag, color: "text-[#4caf7d]" },
    { label: "Галерии", value: galleries?.length ?? 0, icon: Images, color: "text-[#888]" },
    { label: "Фотографии", value: photos?.length ?? 0, icon: TrendingUp, color: "text-[#888]" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">
        Добредојде, {(userProfile as { photographer_profiles?: { display_name?: string }; name?: string })?.photographer_profiles?.display_name || userProfile?.name || "Фотограф"}
      </h1>
      <p className="text-[#888] text-sm mb-8">Преглед на твоите активности</p>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-[#141414] rounded-card border border-white/[0.08] p-5">
            <div className={`mb-3 ${color}`}>
              <Icon size={20} />
            </div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-[#888] mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent galleries */}
      <div className="bg-[#141414] rounded-card border border-white/[0.08] p-6">
        <h2 className="font-semibold mb-4">Мои галерии</h2>
        {galleries && galleries.length > 0 ? (
          <div className="flex flex-col gap-2">
            {galleries.slice(0, 5).map((g) => (
              <div key={g.id} className="flex items-center justify-between py-2 border-b border-white/[0.06] last:border-0">
                <span className="text-sm">{g.title}</span>
                <span className={`text-xs px-2 py-0.5 rounded-lg ${g.is_public ? "bg-[#4caf7d]/20 text-[#4caf7d]" : "bg-white/5 text-[#888]"}`}>
                  {g.is_public ? "Јавна" : "Скриена"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#888]">Сè уште немаш галерии. <a href="/dashboard/galleries/new" className="text-[#e8c97e] hover:underline">Создај прва</a></p>
        )}
      </div>
    </div>
  );
}
