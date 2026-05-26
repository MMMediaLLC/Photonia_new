import type { Metadata } from "next";
import Link from "next/link";
import { Package, Mail, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Press пакети — Photonia",
  description:
    "Пакети од 5+ професионални фотографии со намалена цена — наменети за медиуми, агенции и редакции.",
};

const BENEFITS = [
  "5, 10 или 20 слики во еден пакет",
  "До 40% попуст во споредба со поединечни цени",
  "Комерцијална лиценца вклучена",
  "Брза испорака преку email со директни линкови",
  "Прилагодени пакети по барање",
];

export default function PressPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#e8c97e]/10 border border-[#e8c97e]/30 mb-4">
          <Package size={14} className="text-[#e8c97e]" />
          <span className="text-xs font-semibold tracking-widest uppercase text-[#e8c97e]">
            За медиуми
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Press пакети</h1>
        <p className="text-[#888] text-lg max-w-2xl mx-auto leading-relaxed">
          Bundle понуди со <strong className="text-[#f0f0f0]">5 или повеќе слики</strong> со
          намалена цена — наменети за редакции, портaли и медиумски куќи.
        </p>
      </div>

      {/* Benefits */}
      <div className="bg-[#141414] border border-white/[0.08] rounded-card p-6 sm:p-8 mb-10">
        <h2 className="text-lg font-bold mb-5">Што добиваш:</h2>
        <ul className="flex flex-col gap-3">
          {BENEFITS.map((b, i) => (
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
          Press пакетите наскоро ќе бидат достапни за директна купи.
        </p>
        <p className="text-sm text-[#666]">
          Засега, за нарачка контактирaj не директно.
        </p>
      </div>

      {/* CTA */}
      <div className="text-center">
        <a
          href="mailto:info@photonia.mk?subject=Press%20%D0%BF%D0%B0%D0%BA%D0%B5%D1%82%20-%20%D0%B7%D0%B0%D0%BF%D1%80%D0%B0%D1%88%D1%83%D0%B2%D0%B0%D1%9A%D0%B5"
          className="inline-flex items-center gap-2 bg-[#e8c97e] text-[#0a0a0a] font-bold px-8 py-3.5 rounded-card hover:bg-[#d4b46a] transition-colors"
        >
          <Mail size={16} /> Прати барaње
        </a>
        <p className="text-xs text-[#888] mt-3">
          Одговараме во рок од 24 часа
        </p>
      </div>

      <div className="text-center mt-10">
        <Link href="/galleries" className="text-sm text-[#888] hover:text-[#e8c97e] transition-colors">
          ← Назад на галерии
        </Link>
      </div>
    </div>
  );
}
