import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const legalLinks = [
  { href: "/legal/terms", label: "Услови за користење" },
  { href: "/legal/license", label: "Договор за лиценца" },
  { href: "/legal/privacy", label: "Политика за приватност" },
  { href: "/legal/cookies", label: "Политика за колачиња" },
  { href: "/legal/editorial-notice", label: "Editorial напомена" },
  { href: "/legal/takedown", label: "Барање за бришење" },
  { href: "/legal/refund", label: "Поврат на средства" },
  { href: "/legal/dmca", label: "DMCA и авторски права" },
];

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-10">
            <aside className="lg:w-64 shrink-0">
              <p className="text-xs uppercase tracking-widest text-[#888] mb-4">Правни документи</p>
              <nav className="flex flex-col gap-1">
                {legalLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-[#aaa] hover:text-[#e8c97e] py-1.5 px-3 rounded-md hover:bg-white/[0.04] transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </aside>
            <div className="flex-1 min-w-0">
              {children}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
