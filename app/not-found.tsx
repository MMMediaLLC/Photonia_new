import Link from "next/link";
import { Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <p className="text-[#e8c97e] text-xs uppercase tracking-widest mb-4">404</p>
      <h1 className="text-3xl font-bold text-[#f0f0f0] mb-3">Страницата не постои</h1>
      <p className="text-[#888] text-sm mb-8 max-w-sm">
        Линкот може да е застарен или содржината е отстранета.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/galleries"
          className="px-5 py-2.5 bg-[#e8c97e] text-[#0a0a0a] font-semibold rounded-card hover:bg-[#d4b46a] transition-colors text-sm"
        >
          Прегледај галерии
        </Link>
        <Link
          href="/search"
          className="px-5 py-2.5 border border-white/[0.08] text-[#f0f0f0] rounded-card hover:bg-white/[0.04] transition-colors text-sm flex items-center gap-2"
        >
          <Search size={14} />
          Пребарај
        </Link>
      </div>
      <Link href="/" className="mt-8 text-xs text-[#555] hover:text-[#888] transition-colors">
        Почетна страница
      </Link>
    </div>
  );
}
