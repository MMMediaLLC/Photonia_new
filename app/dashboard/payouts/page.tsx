import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { CheckCircle, Clock } from "lucide-react";

export default async function DashboardPayoutsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: payouts } = await supabase
    .from("payouts")
    .select("*")
    .eq("photographer_id", user.id)
    .order("created_at", { ascending: false });

  const totalPaid = payouts?.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0) ?? 0;
  const totalPending = payouts?.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0) ?? 0;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Исплати</h1>
      <p className="text-[#888] text-sm mb-8">Месечни исплати од Photonia</p>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-[#141414] border border-white/[0.08] rounded-card p-5">
          <p className="text-xs text-[#888] mb-2">Вкупно исплатено</p>
          <p className="text-2xl font-bold text-[#4caf7d]">{formatPrice(totalPaid)}</p>
        </div>
        <div className="bg-[#141414] border border-white/[0.08] rounded-card p-5">
          <p className="text-xs text-[#888] mb-2">Во обработка</p>
          <p className="text-2xl font-bold text-[#e8c97e]">{formatPrice(totalPending)}</p>
        </div>
      </div>

      <div className="bg-[#141414] border border-white/[0.08] rounded-card p-5 mb-8 text-sm text-[#888]">
        <p>💡 Исплатите се вршат рачно од администраторот на крај на секој месец. За прашања контактирај не на <span className="text-[#e8c97e]">payouts@photonia.mk</span></p>
      </div>

      {!payouts?.length ? (
        <div className="text-center py-20 text-[#888]">
          <p>Сè уште нема исплати. Продај фотографии и очекувај прва исплата!</p>
        </div>
      ) : (
        <div className="bg-[#141414] border border-white/[0.08] rounded-card overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-3 text-xs text-[#888] border-b border-white/[0.06]">
            <span>Период</span>
            <span>Износ</span>
            <span>Статус</span>
          </div>
          {payouts.map((payout) => (
            <div
              key={payout.id}
              className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-4 border-b border-white/[0.04] last:border-0 items-center text-sm"
            >
              <span className="font-medium">{payout.period}</span>
              <span className="font-bold">{formatPrice(payout.amount)}</span>
              <span
                className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg font-medium ${
                  payout.status === "paid"
                    ? "bg-[#4caf7d]/15 text-[#4caf7d]"
                    : "bg-[#e8c97e]/15 text-[#e8c97e]"
                }`}
              >
                {payout.status === "paid" ? (
                  <><CheckCircle size={11} /> Исплатено</>
                ) : (
                  <><Clock size={11} /> Во тек</>
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
