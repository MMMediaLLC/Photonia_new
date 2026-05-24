import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { Download, ShoppingBag } from "lucide-react";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Sub-nav */}
        <nav className="flex gap-4 mb-8 border-b border-white/[0.08] pb-4">
          <Link href="/account/downloads" className="flex items-center gap-1.5 text-sm text-[#888] hover:text-[#f0f0f0] transition-colors">
            <Download size={14} /> Преземања
          </Link>
          <Link href="/account/orders" className="flex items-center gap-1.5 text-sm text-[#888] hover:text-[#f0f0f0] transition-colors">
            <ShoppingBag size={14} /> Нарачки
          </Link>
        </nav>
        {children}
      </div>
      <Footer />
    </>
  );
}
