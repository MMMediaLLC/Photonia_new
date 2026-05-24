import Link from "next/link";
import { LayoutDashboard, Users, Images, ShoppingBag, Banknote } from "lucide-react";

const nav = [
  { href: "/admin", label: "Преглед", icon: LayoutDashboard },
  { href: "/admin/photographers", label: "Фотографи", icon: Users },
  { href: "/admin/galleries", label: "Галерии", icon: Images },
  { href: "/admin/orders", label: "Нарачки", icon: ShoppingBag },
  { href: "/admin/payouts", label: "Исплати", icon: Banknote },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-[#0d0d0d] border-r border-white/[0.06] flex flex-col py-6 px-3 gap-1">
        <div className="px-3 mb-6">
          <p className="text-xs text-[#888] uppercase tracking-widest font-medium">Admin</p>
          <p className="text-lg font-bold text-[#e8c97e]">Photonia</p>
        </div>
        {nav.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-[#888] hover:text-[#f0f0f0] hover:bg-white/5 transition-colors"
          >
            <Icon size={15} />
            {label}
          </Link>
        ))}
      </aside>

      {/* Content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
