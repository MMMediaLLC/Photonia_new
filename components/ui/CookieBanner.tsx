"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
  }

  function reject() {
    localStorage.setItem("cookie_consent", "rejected");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-3xl mx-auto bg-[#1a1a1a] border border-white/[0.12] rounded-card shadow-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-[#ccc] flex-1 leading-relaxed">
          Photonia.mk користи минимален број суштински колачиња за автентикација и кошничка.
          За аналитика користиме Plausible без колачиња.{" "}
          <Link href="/legal/cookies" className="text-[#e8c97e] hover:underline">
            Политика за колачиња
          </Link>
          .
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={reject}
            className="px-4 py-2 text-xs font-semibold text-[#888] border border-white/10 rounded-lg hover:bg-white/[0.04] transition-colors"
          >
            Одбиј
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 text-xs font-semibold bg-[#e8c97e] text-[#0a0a0a] rounded-lg hover:bg-[#d4b46a] transition-colors"
          >
            Прифати
          </button>
        </div>
      </div>
    </div>
  );
}
