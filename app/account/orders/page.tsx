import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

const LICENSE_LABELS: Record<string, string> = {
  personal: "Лична",
  commercial: "Комерцијална",
  extended: "Проширена",
};

export default async function AccountOrdersPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: orders } = await supabase
    .from("orders")
    .select(`
      id, status, total, created_at,
      order_items(
        id, license, price,
        photo:photos(title, gallery:galleries(title, slug))
      )
    `)
    .eq("buyer_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-2">Мои нарачки</h1>
      <p className="text-[#888] text-sm mb-8">Историја на сите купувања</p>

      {!orders?.length ? (
        <div className="text-center py-24 text-[#888]">
          <ShoppingBag size={40} className="mx-auto mb-4 opacity-30" />
          <p>Сè уште немаш нарачки.</p>
          <Link href="/galleries" className="text-[#e8c97e] hover:underline mt-2 inline-block">
            Прегледај галерии
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => {
            const items = (order.order_items as unknown as Array<{
              id: string;
              license: string;
              price: number;
              photo: { title: string; gallery: { title: string; slug: string } | null } | null;
            }>) ?? [];

            return (
              <div key={order.id} className="bg-[#141414] border border-white/[0.08] rounded-card overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.02]">
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-[#888]">
                      {new Date(order.created_at).toLocaleDateString("mk-MK", {
                        day: "2-digit", month: "long", year: "numeric"
                      })}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-lg font-medium ${
                      order.status === "paid"
                        ? "bg-[#4caf7d]/15 text-[#4caf7d]"
                        : "bg-[#e8c97e]/15 text-[#e8c97e]"
                    }`}>
                      {order.status === "paid" ? "Платено" : "Во обработка"}
                    </span>
                  </div>
                  <span className="font-bold text-[#e8c97e]">{formatPrice(order.total)}</span>
                </div>

                <div className="divide-y divide-white/[0.04]">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between px-5 py-3.5 text-sm">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{item.photo?.title || "Фотографија"}</p>
                        {item.photo?.gallery && (
                          <Link
                            href={`/gallery/${item.photo.gallery.slug}`}
                            className="text-xs text-[#888] hover:text-[#e8c97e] transition-colors truncate block"
                          >
                            {item.photo.gallery.title}
                          </Link>
                        )}
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                        <span className="text-xs bg-white/5 px-2 py-1 rounded-lg whitespace-nowrap">
                          {LICENSE_LABELS[item.license] ?? item.license}
                        </span>
                        <span className="font-semibold">{formatPrice(item.price)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
