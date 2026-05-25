"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  User as UserIcon,
  LayoutDashboard,
  ShieldCheck,
  Download,
  ShoppingBag,
  LogOut,
  LogIn,
  UserPlus,
} from "lucide-react";

type Role = "admin" | "photographer" | "buyer" | null;

export default function UserMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      setEmail(user.email ?? null);

      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();
      setRole((profile?.role as Role) ?? "buyer");
      setLoading(false);
    }
    load();

    const supabase = createClient();
    const { data: sub } = supabase.auth.onAuthStateChange(() => load());
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    setEmail(null);
    setRole(null);
    router.push("/");
    router.refresh();
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg hover:bg-white/5 transition-colors"
        aria-label="Профил"
      >
        <UserIcon size={20} className="text-[#f0f0f0]" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-[#141414] border border-white/[0.08] rounded-card shadow-2xl py-2 z-50">
          {loading ? (
            <div className="px-4 py-2 text-xs text-[#888]">Се вчитува...</div>
          ) : !email ? (
            <>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#f0f0f0] hover:bg-white/5 transition-colors"
              >
                <LogIn size={14} /> Најава
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#f0f0f0] hover:bg-white/5 transition-colors"
              >
                <UserPlus size={14} /> Регистрација
              </Link>
            </>
          ) : (
            <>
              <div className="px-4 py-2 border-b border-white/[0.06] mb-1">
                <p className="text-xs text-[#888]">Најавен/а како</p>
                <p className="text-sm text-[#f0f0f0] truncate">{email}</p>
                <p className="text-xs text-[#e8c97e] capitalize mt-0.5">{role}</p>
              </div>

              {role === "admin" && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#f0f0f0] hover:bg-white/5 transition-colors"
                >
                  <ShieldCheck size={14} className="text-[#e8c97e]" /> Admin панел
                </Link>
              )}

              {(role === "photographer" || role === "admin") && (
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#f0f0f0] hover:bg-white/5 transition-colors"
                >
                  <LayoutDashboard size={14} /> Dashboard
                </Link>
              )}

              <Link
                href="/account/downloads"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#f0f0f0] hover:bg-white/5 transition-colors"
              >
                <Download size={14} /> Мои преземања
              </Link>

              <Link
                href="/account/orders"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#f0f0f0] hover:bg-white/5 transition-colors"
              >
                <ShoppingBag size={14} /> Мои нарачки
              </Link>

              <div className="border-t border-white/[0.06] mt-1 pt-1">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#e05555] hover:bg-[#e05555]/10 transition-colors w-full text-left"
                >
                  <LogOut size={14} /> Одјави се
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
