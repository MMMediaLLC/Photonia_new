import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatPrice } from "@/lib/utils";

const LICENSE_LABELS: Record<string, string> = {
  personal: "Лична",
  commercial: "Комерцијална",
};

export default async function DashboardSalesPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: galleries } = await supabase
    .from("galleries")
    .select("id")
    .eq("photographer_id", user.id);

  const galleryIds = galleries?.map((g) => g.id) ?? [];

  const { data: photos } = await supabase
    .from("photos")
    .select("id")
    .in("gallery_id", galleryIds.length ? galleryIds : ["__none__"]);

  const photoIds = photos?.map((p) => p.id) ?? [];

  const { data: sales } = await supabase
    .from("order_items")
    .select(`
      id, license, price, photographer_amount, created_at:orders(created_at),
      photo:photos(title, gallery:galleries(title, slug))
    `)
    .in("photo_id", photoIds.length ? photoIds : ["__none__"])
    .order("id", { ascending: false })
    .limit(100);

  const totalRevenue = sales?.reduce((s, i) => s + (i.photographer_amount ?? 0), 0) ?? 0;
  const thisMonth = sales?.filter((i) => {
    const d = new Date((i.created_at as unknown as { created_at: string })?.created_at ?? "");
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }) ?? [];
  const monthRevenue = thisMonth.reduce((s, i) => s + (i.photographer_amount ?? 0), 0);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Продажби</h1>
      <p className="text-[#888] text-sm mb-8">Историја на сите продажби на твоите фотографии</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: "Вкупен приход", value: formatPrice(totalRevenue), sub: "80% од секоја продажба" },
          { label: "Овој месец", value: formatPrice(monthRevenue), sub: `${thisMonth.length} продажби` },
          { label: "Вкупно продадено", value: sales?.length ?? 0, sub: "фотографии" },
        ].map(({ label, value, sub }) => (
          <div key={label} className="bg-[#141414] border border-white/[0.08] rounded-card p-5">
            <p className="text-xs text-[#888] mb-2">{label}</p>
            <p className="text-2xl font-bold text-[#e8c97e]">{value}</p>
            <p className="text-xs text-[#888] mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      {!sales?.length ? (
        <div className="text-center py-20 text-[#888]">
          <p>Сè уште нема продажби.</p>
        </div>
      ) : (
        <div className="bg-[#141414] border border-white/[0.08] rounded-card overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 text-xs text-[#888] border-b border-white/[0.06]">
            <span>Фотографија</span>
            <span>Лиценца</span>
            <span>Приход</span>
            <span>Вкупно</span>
          </div>
          {sales.map((item) => {
            const photo = item.photo as unknown as { title: string; gallery: { title: string } } | null;
            return (
              <div
                key={item.id}
                className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3.5 border-b border-white/[0.04] last:border-0 text-sm items-center"
              >
                <div className="min-w-0">
                  <p className="truncate">{photo?.title || "Фотографија"}</p>
                  <p className="text-xs text-[#888] truncate">{photo?.gallery?.title}</p>
                </div>
                <span className="text-xs bg-white/5 px-2 py-1 rounded-lg whitespace-nowrap">
                  {LICENSE_LABELS[item.license] ?? item.license}
                </span>
                <span className="text-[#4caf7d] font-medium whitespace-nowrap">
                  {formatPrice(item.photographer_amount)}
                </span>
                <span className="text-[#888] text-xs whitespace-nowrap">
                  {formatPrice(item.price)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
