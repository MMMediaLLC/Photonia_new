import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { Users, Images, ShoppingBag, TrendingUp } from "lucide-react";

export default async function AdminPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: userRow } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (userRow?.role !== "admin") redirect("/");

  const [
    { count: photographerCount },
    { count: galleryCount },
    { count: orderCount },
    { data: revenue },
  ] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }).eq("role", "photographer"),
    supabase.from("galleries").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "paid"),
    supabase.from("orders").select("total").eq("status", "paid"),
  ]);

  const totalRevenue = revenue?.reduce((s, o) => s + o.total, 0) ?? 0;
  const platformRevenue = totalRevenue * 0.2;

  const { data: recentOrders } = await supabase
    .from("orders")
    .select("id, total, created_at, buyer:users!orders_buyer_id_fkey(name, email)")
    .eq("status", "paid")
    .order("created_at", { ascending: false })
    .limit(5);

  const stats = [
    { label: "Фотографи", value: photographerCount ?? 0, icon: Users, color: "text-[#e8c97e]" },
    { label: "Галерии", value: galleryCount ?? 0, icon: Images, color: "text-[#4caf7d]" },
    { label: "Нарачки", value: orderCount ?? 0, icon: ShoppingBag, color: "text-[#e8c97e]" },
    { label: "Приход (20%)", value: formatPrice(platformRevenue), icon: TrendingUp, color: "text-[#4caf7d]" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Преглед</h1>
      <p className="text-[#888] text-sm mb-8">Статистики на платформата</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-[#141414] border border-white/[0.08] rounded-card p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-[#888]">{label}</p>
              <Icon size={16} className={color} />
            </div>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-bold mb-4">Последни нарачки</h2>
      <div className="bg-[#141414] border border-white/[0.08] rounded-card overflow-hidden">
        {!recentOrders?.length ? (
          <p className="text-center text-[#888] py-10 text-sm">Нема нарачки уште.</p>
        ) : (
          <>
            <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-3 text-xs text-[#888] border-b border-white/[0.06]">
              <span>Купувач</span>
              <span>Вкупно</span>
              <span>Датум</span>
            </div>
            {recentOrders.map((order) => {
              const buyer = order.buyer as unknown as { name: string; email: string } | null;
              return (
                <div key={order.id} className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-4 border-b border-white/[0.04] last:border-0 text-sm items-center">
                  <div>
                    <p className="font-medium">{buyer?.name ?? "—"}</p>
                    <p className="text-xs text-[#888]">{buyer?.email}</p>
                  </div>
                  <span className="font-bold text-[#e8c97e]">{formatPrice(order.total)}</span>
                  <span className="text-xs text-[#888]">
                    {new Date(order.created_at).toLocaleDateString("mk-MK")}
                  </span>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
