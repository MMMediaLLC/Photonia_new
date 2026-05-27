import type { Metadata } from "next";
import Link from "next/link";
import { Package, Mail, CheckCircle, Building2, Newspaper, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "За медиуми и агенции — Photonia",
  description:
    "Прес пакети, ретајнер договори и custom понуди за редакции, општини, агенции и политички партии.",
};

const BENEFITS = [
  "Оригинални HD фотографии со Комерцијална лиценца",
  "Прес пакети со 5, 10 или 20 снимки со намален износ",
  "Годишен ретајнер за неограничен пристап до категорија",
  "Приоритетна испорака со директни линкови за преземање",
  "Custom понуди за масовни нарачки на редакции",
  "Invoice и формална документација за буџетски купувачи",
];

const CLIENTS = [
  { icon: Newspaper, title: "Медиуми и редакции", desc: "Дневни портали, новинарски агенции, телевизии. Пристап до настани снимени на лице место." },
  { icon: Building2, title: "Општини и институции", desc: "Документирање на јавни настани, прес конференции, официјални церемонии." },
  { icon: Users, title: "Агенции и партии", desc: "Маркетинг агенции, политички партии, НВО. Editorial употреба со јасни ограничувања." },
  { icon: Package, title: "Корпоративни клиенти", desc: "Компании кои бараат документарна фотографија од јавниот контекст во кој работат." },
];

export default function PressPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#e8c97e]/10 border border-[#e8c97e]/30 mb-4">
          <Package size={14} className="text-[#e8c97e]" />
          <span className="text-xs font-semibold tracking-widest uppercase text-[#e8c97e]">
            За медиуми и агенции
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Прес пакети и B2B понуди</h1>
        <p className="text-[#888] text-lg max-w-2xl mx-auto leading-relaxed">
          Оригинални HD снимки од македонски јавни настани, достапни за редакции,
          агенции, општини и организации. Флексибилни пакети со invoice и формална документација.
        </p>
      </div>

      {/* Who is this for */}
      <div className="grid sm:grid-cols-2 gap-4 mb-14">
        {CLIENTS.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-[#141414] border border-white/[0.08] rounded-card p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#e8c97e]/10 flex items-center justify-center">
                <Icon size={15} className="text-[#e8c97e]" />
              </div>
              <p className="font-semibold text-[#f0f0f0]">{title}</p>
            </div>
            <p className="text-sm text-[#888] leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* Benefits */}
      <div className="bg-[#141414] border border-white/[0.08] rounded-card p-6 sm:p-8 mb-10">
        <h2 className="text-lg font-bold mb-5">Што добиваш со B2B понуда:</h2>
        <ul className="grid sm:grid-cols-2 gap-3">
          {BENEFITS.map((b, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <CheckCircle size={15} className="text-[#4caf7d] shrink-0 mt-0.5" />
              <span className="text-[#ccc]">{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Retainer model */}
      <div className="border border-[#e8c97e]/20 bg-[#e8c97e]/[0.03] rounded-card p-6 mb-10">
        <h2 className="text-lg font-bold text-[#f0f0f0] mb-3">Годишен ретајнер</h2>
        <p className="text-sm text-[#ccc] leading-relaxed mb-4">
          За редакции и организации кои редовно бараат фотографии, нудиме годишен ретајнер
          со неограничен пристап до избрана категорија снимки (на пример: сите политички настани,
          или сите спортски настани во текот на годината). Цената на ретајнерот се договара
          индивидуално во зависност од категоријата и обемот на употреба.
        </p>
        <p className="text-sm text-[#888]">
          Ретајнерот вклучува invoice, формален договор и приоритетна поддршка.
        </p>
      </div>

      {/* Editorial notice */}
      <div className="border border-amber-700/30 bg-amber-950/10 rounded-card p-5 mb-10">
        <p className="text-sm text-amber-300 font-medium mb-2">Важна напомена за Editorial употреба</p>
        <p className="text-sm text-[#ccc]">
          Поголемиот дел од фотографиите содржат препознатливи лица снимени на јавни настани
          и се означени со ознаката <span className="text-amber-400 font-medium">Editorial Only</span>.
          Ваквите слики не смеат да се употребат во рекламен контекст кој имплицира поддршка
          од прикажаното лице. Подетално во{" "}
          <Link href="/legal/editorial-notice" className="text-amber-400 hover:underline">
            Editorial напомената
          </Link>
          .
        </p>
      </div>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-xl font-bold mb-3">Испрати барање за понуда</h2>
        <p className="text-[#888] text-sm mb-6 max-w-md mx-auto">
          Опиши ги твоите потреби: каква содржина барате, колку снимки, за каква употреба.
          Одговараме во рок од 24 часа со конкретна понуда.
        </p>
        <a
          href="mailto:info@photonia.mk?subject=B2B%20понуда%20-%20Photonia"
          className="inline-flex items-center gap-2 bg-[#e8c97e] text-[#0a0a0a] font-bold px-8 py-3.5 rounded-card hover:bg-[#d4b46a] transition-colors"
        >
          <Mail size={16} />
          info@photonia.mk
        </a>
        <p className="text-xs text-[#555] mt-3">Одговараме во рок од 24 часа</p>
      </div>

      <div className="text-center mt-10">
        <Link href="/galleries" className="text-sm text-[#888] hover:text-[#e8c97e] transition-colors">
          Прегледај галерии
        </Link>
      </div>
    </div>
  );
}
