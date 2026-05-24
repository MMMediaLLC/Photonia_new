"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import { CheckCircle, Clock, Loader2, Plus } from "lucide-react";
import { toast } from "@/components/ui/Toaster";

interface PayoutRow {
  id: string;
  photographer_id: string;
  amount: number;
  period: string;
  status: "pending" | "paid";
  photographer: { name: string; email: string } | null;
}

interface PhotographerRevenue {
  photographer_id: string;
  name: string;
  email: string;
  unpaid: number;
}

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState<PayoutRow[]>([]);
  const [pending, setPending] = useState<PhotographerRevenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingId, setMarkingId] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const supabase = createClient();
    const { data: pays } = await supabase
      .from("payouts")
      .select("*, photographer:users!payouts_photographer_id_fkey(name, email)")
      .order("created_at", { ascending: false })
      .limit(50);
    setPayouts((pays as PayoutRow[]) ?? []);

    const { data: items } = await supabase
      .from("order_items")
      .select("photographer_amount, photo:photos(gallery:galleries(photographer_id))")
      .not("photographer_amount", "is", null);

    const { data: photographers } = await supabase
      .from("users")
      .select("id, name, email")
      .eq("role", "photographer");

    if (items && photographers) {
      const revenueMap: Record<string, number> = {};
      for (const item of items) {
        const gallery = (item.photo as unknown as { gallery: { photographer_id: string } | null })?.gallery;
        if (gallery?.photographer_id) {
          revenueMap[gallery.photographer_id] = (revenueMap[gallery.photographer_id] ?? 0) + (item.photographer_amount ?? 0);
        }
      }

      const paidMap: Record<string, number> = {};
      for (const p of (pays as PayoutRow[]) ?? []) {
        if (p.status === "paid") {
          paidMap[p.photographer_id] = (paidMap[p.photographer_id] ?? 0) + p.amount;
        }
      }

      const pendingRevs: PhotographerRevenue[] = photographers
        .filter((ph) => revenueMap[ph.id] && revenueMap[ph.id] > (paidMap[ph.id] ?? 0))
        .map((ph) => ({
          photographer_id: ph.id,
          name: ph.name,
          email: ph.email,
          unpaid: revenueMap[ph.id] - (paidMap[ph.id] ?? 0),
        }));

      setPending(pendingRevs);
    }

    setLoading(false);
  }

  async function markPaid(payoutId: string) {
    setMarkingId(payoutId);
    const res = await fetch(`/api/admin/payouts/${payoutId}`, { method: "PATCH" });
    if (res.ok) {
      toast("Исплатата е означена како платена", "success");
      setPayouts((prev) => prev.map((p) => p.id === payoutId ? { ...p, status: "paid" } : p));
    } else {
      toast("Грешка", "error");
    }
    setMarkingId(null);
  }

  async function createPayout(rev: PhotographerRevenue) {
    const period = new Date().toLocaleDateString("mk-MK", { month: "long", year: "numeric" });
    const supabase = createClient();
    const { data, error } = await supabase
      .from("payouts")
      .insert({
        photographer_id: rev.photographer_id,
        amount: rev.unpaid,
        period,
        status: "pending",
      })
      .select("*, photographer:users!payouts_photographer_id_fkey(name, email)")
      .single();

    if (error) {
      toast(error.message, "error");
    } else {
      toast("Исплатата е креирана", "success");
      setPayouts((prev) => [data as PayoutRow, ...prev]);
      setPending((prev) => prev.filter((p) => p.photographer_id !== rev.photographer_id));
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="animate-spin text-[#e8c97e]" size={32} />
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Исплати</h1>
      <p className="text-[#888] text-sm mb-8">Управување со месечни исплати кон фотографи</p>

      {pending.length > 0 && (
        <>
          <h2 className="text-lg font-bold mb-4 text-[#e8c97e]">Неисплатен приход</h2>
          <div className="bg-[#141414] border border-[#e8c97e]/20 rounded-card overflow-hidden mb-8">
            <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-3 text-xs text-[#888] border-b border-white/[0.06]">
              <span>Фотограф</span>
              <span>Износ (80%)</span>
              <span></span>
            </div>
            {pending.map((rev) => (
              <div key={rev.photographer_id} className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-4 border-b border-white/[0.04] last:border-0 text-sm items-center">
                <div>
                  <p className="font-medium">{rev.name}</p>
                  <p className="text-xs text-[#888]">{rev.email}</p>
                </div>
                <span className="font-bold text-[#e8c97e]">{formatPrice(rev.unpaid)}</span>
                <button
                  onClick={() => createPayout(rev)}
                  className="flex items-center gap-1.5 bg-[#e8c97e]/10 text-[#e8c97e] hover:bg-[#e8c97e]/20 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                >
                  <Plus size={12} /> Креирај исплата
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      <h2 className="text-lg font-bold mb-4">Историја на исплати</h2>
      <div className="bg-[#141414] border border-white/[0.08] rounded-card overflow-hidden">
        {!payouts.length ? (
          <p className="text-center text-[#888] py-16 text-sm">Нема исплати уште.</p>
        ) : (
          <>
            <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3 text-xs text-[#888] border-b border-white/[0.06]">
              <span>Фотограф</span>
              <span>Период</span>
              <span>Износ</span>
              <span>Статус</span>
              <span></span>
            </div>
            {payouts.map((payout) => (
              <div key={payout.id} className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-4 border-b border-white/[0.04] last:border-0 text-sm items-center">
                <div>
                  <p className="font-medium">{payout.photographer?.name ?? "—"}</p>
                  <p className="text-xs text-[#888]">{payout.photographer?.email}</p>
                </div>
                <span className="text-[#888] whitespace-nowrap text-xs">{payout.period}</span>
                <span className="font-bold whitespace-nowrap">{formatPrice(payout.amount)}</span>
                <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-lg font-medium whitespace-nowrap ${
                  payout.status === "paid"
                    ? "bg-[#4caf7d]/15 text-[#4caf7d]"
                    : "bg-[#e8c97e]/15 text-[#e8c97e]"
                }`}>
                  {payout.status === "paid"
                    ? <><CheckCircle size={10} /> Исплатено</>
                    : <><Clock size={10} /> Во тек</>
                  }
                </span>
                {payout.status === "pending" && (
                  <button
                    onClick={() => markPaid(payout.id)}
                    disabled={markingId === payout.id}
                    className="flex items-center gap-1.5 bg-[#4caf7d]/10 text-[#4caf7d] hover:bg-[#4caf7d]/20 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                  >
                    {markingId === payout.id ? <Loader2 size={10} className="animate-spin" /> : <CheckCircle size={10} />}
                    Означи платено
                  </button>
                )}
                {payout.status === "paid" && <span />}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
