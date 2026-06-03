import Link from "next/link";
import PaymentLogos from "@/components/layout/PaymentLogos";

const exploreLinks = [
  { href: "/galleries", label: "Галерии" },
  { href: "/search", label: "Пребарај" },
  { href: "/faq", label: "Често прашања" },
  { href: "/press", label: "За медиуми" },
  { href: "/about", label: "За нас" },
];

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
    <footer className="border-t border-white/[0.08] mt-24 pt-12 pb-8 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
        {/* Brand — wider column */}
        <div className="md:col-span-5">
          <p className="text-lg font-bold text-[#e8c97e] mb-3">PHOTONIA</p>
          <p className="text-xs text-[#888] leading-relaxed max-w-sm">
            Платформа за фотографии од настани, спорт, култура и јавни случувања.
            Купи безбедно и преземи во висока резолуција, без воден жиг.
          </p>
        </div>

        {/* Explore */}
        <div className="md:col-span-3">
          <p className="text-[10px] uppercase tracking-widest text-[#666] mb-3 font-medium">
            Истражи
          </p>
          <ul className="flex flex-col gap-1.5">
            {exploreLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-xs text-[#bbb] hover:text-[#e8c97e] transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal — compact 2-col grid */}
        <div className="md:col-span-4">
          <p className="text-[10px] uppercase tracking-widest text-[#666] mb-3 font-medium">
            Правни документи
          </p>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[11px] text-[#888] hover:text-[#f0f0f0] transition-colors leading-snug"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom row: copyright + accepted payments */}
      <div className="max-w-7xl mx-auto mt-10 pt-5 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[11px] text-[#666]">
          © {new Date().getFullYear()} Photonia · M&amp;M Media · Сите права задржани.
        </p>
        <PaymentLogos size={22} />
      </div>
    </footer>
  );
}
