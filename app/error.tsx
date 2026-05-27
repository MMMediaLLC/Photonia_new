"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <p className="text-[#e8c97e] text-xs uppercase tracking-widest mb-4">500</p>
      <h1 className="text-3xl font-bold text-[#f0f0f0] mb-3">Нешто тргна наопаку</h1>
      <p className="text-[#888] text-sm mb-8 max-w-sm">
        Настана техничка грешка. Нашиот тим е известен автоматски.
        Обиди се повторно или контактирај нè ако проблемот продолжи.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={reset}
          className="px-5 py-2.5 bg-[#e8c97e] text-[#0a0a0a] font-semibold rounded-card hover:bg-[#d4b46a] transition-colors text-sm"
        >
          Обиди се повторно
        </button>
        <a
          href="mailto:support@photonia.mk"
          className="px-5 py-2.5 border border-white/[0.08] text-[#f0f0f0] rounded-card hover:bg-white/[0.04] transition-colors text-sm"
        >
          support@photonia.mk
        </a>
      </div>
      <Link href="/" className="mt-8 text-xs text-[#555] hover:text-[#888] transition-colors">
        Почетна страница
      </Link>
    </div>
  );
}
