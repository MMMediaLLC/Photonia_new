import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { CheckCircle, Clock } from "lucide-react";

export default async function AdminOrdersPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: userRow } = await supabase.from("users").select("role").eq("id", user.id).single();
  if (userRow?.role !== "admin") redirect("/");

  const { data: orders } = await supabase
    .from("orders")
    .select(`
      id, status, total, created_at,
      buyer:users!orders_buyer_id_fkey(name, email),
      order_items(count)
    `)
    .order("created_at", { ascending: false })
    .limit(100);

  const totalRevenue = orders?.filter((o) => o.status === "paid").reduce((s, o) => s + o.total, 0) ?? 0;
  const platformRevenue = totalRevenue * 0.2;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Нарачки</h1>
      <p className="text-[#888] text-sm mb-8">Сите нарачки на платформата</p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-[#141414] border border-white/[0.08] rounded-card p-5">
          <p className="text-xs text-[#888] mb-2">Вкупен промет</p>
          <p className="text-2xl font-bold text-[#e8c97e]">{formatPrice(totalRevenue)}</p>
        </div>
        <div className="bg-[#141414] border border-white/[0.08] rounded-card p-5">
          <p className="text-xs text-[#888] mb-2">Приход на платформата (20%)</p>
          <p className="text-2xl font-bold text-[#4caf7d]">{formatPrice(platformRevenue)}</p>
        </div>
      </div>

      <div className="bg-[#141414] border border-white/[0.08] rounded-card overflow-hidden">
        {!orders?.length ? (
          <p className="text-center text-[#888] py-16 text-sm">Нема нарачки уште.</p>
        ) : (
          <>
            <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3 text-xs text-[#888] border-b border-white/[0.06]">
              <span>Купувач</span>
              <span>Ставки</span>
              <span>Вкупно</span>
              <span>Статус</span>
              <span>Датум</span>
            </div>
            {orders.map((order) => {
              const buyer = order.buyer as unknown as { name: string; email: string } | null;
              const itemCount = (order.order_items as unknown as { count: number }[])?.[0]?.count ?? 0;

              return (
                <div
                  key={order.id}
                  className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-4 border-b border-white/[0.04] last:border-0 text-sm items-center"
                >
                  <div className="min-w-0">
                    <p className="font-medium truncate">{buyer?.name ?? "—"}</p>
                    <p className="text-xs text-[#888] truncate">{buyer?.email}</p>
                  </div>
                  <span className="text-center text-[#888]">{itemCount}</span>
                  <span className="font-bold text-[#e8c97e]">{formatPrice(order.total)}</span>
                  <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-lg font-medium whitespace-nowrap ${
                    order.status === "paid"
                      ? "bg-[#4caf7d]/15 text-[#4caf7d]"
                      : "bg-[#e8c97e]/15 text-[#e8c97e]"
                  }`}>
                    {order.status === "paid"
                      ? <><CheckCircle size={10} /> Платено</>
                      : <><Clock size={10} /> Во тек</>
                    }
                  </span>
                  <span className="text-xs text-[#888] whitespace-nowrap">
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
