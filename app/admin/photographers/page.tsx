"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Mail, UserCheck, Send, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/Toaster";

interface Photographer {
  id: string;
  name: string;
  email: string;
  created_at: string;
  photographer_profiles: { display_name: string | null } | null;
}

interface Invite {
  id: string;
  email: string;
  used: boolean;
  created_at: string;
}

export default function AdminPhotographersPage() {
  const [photographers, setPhotographers] = useState<Photographer[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const [{ data: ph }, { data: inv }] = await Promise.all([
        supabase
          .from("users")
          .select("*, photographer_profiles(display_name)")
          .eq("role", "photographer")
          .order("created_at", { ascending: false }),
        supabase
          .from("photographer_invites")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(20),
      ]);
      setPhotographers((ph as Photographer[]) ?? []);
      setInvites((inv as Invite[]) ?? []);
      setLoading(false);
    }
    load();
  }, []);

  async function sendInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteEmail) return;
    setSending(true);
    const res = await fetch("/api/admin/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: inviteEmail }),
    });
    const json = await res.json();
    if (!res.ok) {
      toast(json.error ?? "Грешка", "error");
    } else {
      toast("Поканата е испратена!", "success");
      setInviteEmail("");
      setInvites((prev) => [json.invite, ...prev]);
    }
    setSending(false);
  }

  const inputClass = "w-full bg-[#0a0a0a] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-[#f0f0f0] placeholder:text-[#555] focus:outline-none focus:border-[#e8c97e]/50 transition-colors";

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="animate-spin text-[#e8c97e]" size={32} />
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Фотографи</h1>
      <p className="text-[#888] text-sm mb-8">Управување со фотографи и покани</p>

      {/* Invite form */}
      <div className="bg-[#141414] border border-white/[0.08] rounded-card p-5 mb-8">
        <p className="font-semibold text-sm mb-4 flex items-center gap-2">
          <Mail size={15} className="text-[#e8c97e]" /> Покани нов фотограф
        </p>
        <form onSubmit={sendInvite} className="flex gap-3">
          <input
            type="email"
            required
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className={inputClass}
            placeholder="email@primer.mk"
          />
          <button
            type="submit"
            disabled={sending}
            className="flex items-center gap-2 bg-[#e8c97e] text-[#0a0a0a] font-semibold px-5 py-2.5 rounded-card hover:bg-[#d4b46a] transition-colors text-sm disabled:opacity-50 flex-shrink-0"
          >
            {sending ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
            Испрати
          </button>
        </form>
      </div>

      {/* Active photographers */}
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <UserCheck size={18} className="text-[#4caf7d]" /> Активни фотографи ({photographers.length})
      </h2>
      <div className="bg-[#141414] border border-white/[0.08] rounded-card overflow-hidden mb-8">
        {!photographers.length ? (
          <p className="text-center text-[#888] py-10 text-sm">Нема регистрирани фотографи.</p>
        ) : (
          <>
            <div className="grid grid-cols-[1fr_1fr_auto] gap-4 px-5 py-3 text-xs text-[#888] border-b border-white/[0.06]">
              <span>Ime</span>
              <span>Е-маил</span>
              <span>Датум</span>
            </div>
            {photographers.map((ph) => (
              <div key={ph.id} className="grid grid-cols-[1fr_1fr_auto] gap-4 px-5 py-4 border-b border-white/[0.04] last:border-0 text-sm items-center">
                <div>
                  <p className="font-medium">{ph.photographer_profiles?.display_name ?? ph.name}</p>
                  {ph.photographer_profiles?.display_name && (
                    <p className="text-xs text-[#888]">{ph.name}</p>
                  )}
                </div>
                <span className="text-[#888] truncate">{ph.email}</span>
                <span className="text-xs text-[#888]">
                  {new Date(ph.created_at).toLocaleDateString("mk-MK")}
                </span>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Pending invites */}
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Mail size={18} className="text-[#e8c97e]" /> Покани
      </h2>
      <div className="bg-[#141414] border border-white/[0.08] rounded-card overflow-hidden">
        {!invites.length ? (
          <p className="text-center text-[#888] py-10 text-sm">Нема испратени покани.</p>
        ) : (
          <>
            <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-3 text-xs text-[#888] border-b border-white/[0.06]">
              <span>Е-маил</span>
              <span>Статус</span>
              <span>Датум</span>
            </div>
            {invites.map((inv) => (
              <div key={inv.id} className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-4 border-b border-white/[0.04] last:border-0 text-sm items-center">
                <span>{inv.email}</span>
                <span className={`text-xs px-2 py-0.5 rounded-lg font-medium ${
                  inv.used
                    ? "bg-[#4caf7d]/15 text-[#4caf7d]"
                    : "bg-[#e8c97e]/15 text-[#e8c97e]"
                }`}>
                  {inv.used ? "Прифатена" : "Чека"}
                </span>
                <span className="text-xs text-[#888]">
                  {new Date(inv.created_at).toLocaleDateString("mk-MK")}
                </span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
