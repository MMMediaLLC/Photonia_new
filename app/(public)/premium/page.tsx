import type { Metadata } from "next";
import Link from "next/link";
import { Star, CheckCircle, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Премиум селекција — Photonia",
  description:
    "Ексклузивни, ретко достапни професионални фотографии со највисок квалитет и уникатна вредност.",
};

const FEATURES = [
  "Ексклузивни фотографии — само едно копирaње во продажба",
  "Највисока резолуција и квалитет",
  "Уникатни моменти кои не се повторуваат",
  "Целосна комерцијална лиценца вклучена",
  "Сертификат за автентичност",
];

export default function PremiumPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#e8c97e]/10 border border-[#e8c97e]/30 mb-4">
          <Star size={14} className="text-[#e8c97e] fill-[#e8c97e]" />
          <span className="text-xs font-semibold tracking-widest uppercase text-[#e8c97e]">
            Премиум селекција
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
          Ексклузивни единечни фотографии
        </h1>
        <p className="text-[#888] text-lg max-w-2xl mx-auto leading-relaxed">
          Уникатни, високo-квалитетни професионални слики — селектирани за оние кои бараат
          нешто <strong className="text-[#f0f0f0]">посебно</strong>.
        </p>
      </div>

      {/* Features */}
      <div className="bg-gradient-to-br from-[#141414] to-[#1a1612] border border-[#e8c97e]/20 rounded-card p-6 sm:p-8 mb-10">
        <div className="flex items-center gap-2 mb-5">
          <Sparkles size={18} className="text-[#e8c97e]" />
          <h2 className="text-lg font-bold">Што добивaш со премиум:</h2>
        </div>
        <ul className="flex flex-col gap-3">
          {FEATURES.map((b, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <CheckCircle size={16} className="text-[#4caf7d] flex-shrink-0 mt-0.5" />
              <span className="text-[#ccc]">{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Coming soon */}
      <div className="text-center py-12 border border-dashed border-white/10 rounded-card mb-10">
        <p className="text-[#888] mb-4">
          Премиум селекцијата наскоро ќе биде достапна за директна купи.
        </p>
        <p className="text-sm text-[#666]">
          Засега, за интерес контактирaj не директно.
        </p>
      </div>

      <div className="text-center">
        <Link
          href="/galleries"
          className="inline-flex items-center gap-2 border border-white/[0.12] text-[#f0f0f0] font-medium px-6 py-3 rounded-card hover:border-white/25 transition-colors"
        >
          Прегледај стандардни галерии
        </Link>
      </div>
    </div>
  );
}
