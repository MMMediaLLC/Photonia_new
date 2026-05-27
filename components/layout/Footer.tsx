import Link from "next/link";

const legalLinks = [
  { href: "/legal/terms", label: "Услови за користење" },
  { href: "/legal/license", label: "Договор за лиценца" },
  { href: "/legal/privacy", label: "Политика за приватност" },
  { href: "/legal/cookies", label: "Политика за колачиња" },
  { href: "/legal/editorial-notice", label: "Editorial напомена" },
  { href: "/legal/takedown", label: "Барање за бришење" },
  { href: "/legal/refund", label: "Поврат на средства" },
  { href: "/legal/dmca", label: "DMCA" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08] mt-24 py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <p className="text-lg font-bold text-[#e8c97e] mb-2">PHOTONIA</p>
          <p className="text-sm text-[#888] leading-relaxed">
            Уникатни фотографии од настани, спорт и култура. Купи HD оригинал без watermark, без претплата, веднаш достапно.
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
            <Link href="/press" className="text-[#f0f0f0] hover:text-[#e8c97e] transition-colors">
              За медиуми
            </Link>
            <Link href="/about" className="text-[#f0f0f0] hover:text-[#e8c97e] transition-colors">
              За нас
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

        <div>
          <p className="text-xs uppercase tracking-widest text-[#888] mb-3">Правни документи</p>
          <div className="flex flex-col gap-2 text-sm">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-[#888] hover:text-[#f0f0f0] transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-white/[0.08] text-xs text-[#888] flex flex-wrap gap-4 justify-between items-center">
        <p>© {new Date().getFullYear()} Photonia. Сите права задржани. M&M Media.</p>
        <div className="flex gap-4 flex-wrap">
          <Link href="/legal/privacy" className="hover:text-[#f0f0f0]">Приватност</Link>
          <Link href="/legal/terms" className="hover:text-[#f0f0f0]">Услови</Link>
          <Link href="/legal/cookies" className="hover:text-[#f0f0f0]">Колачиња</Link>
          <Link href="/legal/takedown" className="hover:text-[#f0f0f0]">Барање за бришење</Link>
        </div>
      </div>
    </footer>
  );
}
