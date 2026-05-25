"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";
import CartDrawer from "@/components/cart/CartDrawer";
import UserMenu from "@/components/auth/UserMenu";

export default function Navbar() {
  const { items, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#0a0a0a]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold tracking-tight text-[#e8c97e]">
            PHOTONIA
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/galleries" className="text-[#888] hover:text-[#f0f0f0] transition-colors">
              Галерии
            </Link>
            <Link href="/search" className="text-[#888] hover:text-[#f0f0f0] transition-colors">
              Пребарај
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={openCart}
              className="relative p-2 rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Кошничка"
            >
              <ShoppingCart size={20} className="text-[#f0f0f0]" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#e8c97e] text-[#0a0a0a] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </button>

            <UserMenu />

            <button
              className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/[0.08] px-4 py-4 flex flex-col gap-4 text-sm">
            <Link href="/galleries" onClick={() => setMenuOpen(false)} className="text-[#f0f0f0]">
              Галерии
            </Link>
            <Link href="/search" onClick={() => setMenuOpen(false)} className="text-[#f0f0f0]">
              Пребарај
            </Link>
          </div>
        )}
      </header>

      <CartDrawer />
    </>
  );
}
