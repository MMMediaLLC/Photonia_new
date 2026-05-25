"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useState } from "react";

interface Props {
  className?: string;
  iconSize?: number;
  showLabel?: boolean;
}

export default function LogoutButton({ className, iconSize = 14, showLabel = true }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={
        className ??
        "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-[#e05555] hover:bg-[#e05555]/10 transition-colors w-full text-left disabled:opacity-50"
      }
    >
      <LogOut size={iconSize} />
      {showLabel && (loading ? "Одјавување..." : "Одјави се")}
    </button>
  );
}
