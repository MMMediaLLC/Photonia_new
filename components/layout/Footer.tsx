import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08] mt-24 py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <p className="text-lg font-bold text-[#e8c97e] mb-2">PHOTONIA</p>
          <p className="text-sm text-[#888] leading-relaxed">
            Уникатни фотографии од настани, спорт и култура. Купи HD оригинал без watermark — без претплата, веднаш достапно.
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-[#888] mb-3">Истражи</p>
          <div className="flex flex-col gap-2 text-sm">
            <Link href="/galleries" className="text-[#f0f0f0] hover:text-[#e8c97e] transition-colors">
              Галерии
            </Link>
            <Link href="/search" className="text-[#f0f0f0] hover:text-[#e8c97e] transition-colors">
              Пребарај
            </Link>
            <Link href="/faq" className="text-[#f0f0f0] hover:text-[#e8c97e] transition-colors">
              Често прашања
            </Link>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-[#888] mb-3">Сметка</p>
          <div className="flex flex-col gap-2 text-sm">
            <Link href="/login" className="text-[#f0f0f0] hover:text-[#e8c97e] transition-colors">
              Најава
            </Link>
            <Link href="/register" className="text-[#f0f0f0] hover:text-[#e8c97e] transition-colors">
              Регистрација
            </Link>
            <Link href="/account/downloads" className="text-[#f0f0f0] hover:text-[#e8c97e] transition-colors">
              Мои преземања
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-white/[0.08] text-xs text-[#888] flex flex-wrap gap-4 justify-between">
        <p>© {new Date().getFullYear()} Photonia. Сите права задржани.</p>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-[#f0f0f0]">Приватност</Link>
          <Link href="/terms" className="hover:text-[#f0f0f0]">Услови</Link>
        </div>
      </div>
    </footer>
  );
}
