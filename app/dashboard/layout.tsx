import Link from "next/link";
import { LayoutDashboard, Images, ShoppingBag, CreditCard, User, ArrowLeft } from "lucide-react";
import LogoutButton from "@/components/auth/LogoutButton";

const navItems = [
  { href: "/dashboard", label: "Преглед", icon: LayoutDashboard },
  { href: "/dashboard/galleries", label: "Галерии", icon: Images },
  { href: "/dashboard/sales", label: "Продажби", icon: ShoppingBag },
  { href: "/dashboard/payouts", label: "Исплати", icon: CreditCard },
  { href: "/dashboard/profile", label: "Профил", icon: User },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 flex-col border-r border-white/[0.08] bg-[#0a0a0a] px-4 py-6 fixed h-full">
        <div className="mb-8">
          <Link href="/" className="text-lg font-bold text-[#e8c97e]">PHOTONIA</Link>
          <p className="text-xs text-[#888] mt-0.5">Dashboard</p>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#888] hover:text-[#f0f0f0] hover:bg-white/5 transition-colors"
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-4 pt-4 border-t border-white/[0.06] flex flex-col gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-[#888] hover:text-[#f0f0f0] transition-colors"
          >
            <ArrowLeft size={12} /> Назад на сајтот
          </Link>
          <LogoutButton
            className="flex items-center gap-2 text-xs text-[#e05555] hover:text-[#ff7777] transition-colors w-full text-left"
            iconSize={12}
          />
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 md:ml-60">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between px-4 py-4 border-b border-white/[0.08]">
          <Link href="/" className="text-lg font-bold text-[#e8c97e]">PHOTONIA</Link>
          <nav className="flex gap-3 text-xs">
            {navItems.slice(0, 3).map(({ href, label }) => (
              <Link key={href} href={href} className="text-[#888] hover:text-[#f0f0f0]">
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <main className="px-4 sm:px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
