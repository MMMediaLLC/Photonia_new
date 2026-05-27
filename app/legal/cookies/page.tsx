import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Политика за колачиња",
  description: "Политика за употреба на колачиња на платформата Photonia.mk",
};

export default function CookiesPage() {
  return (
    <article className="text-[#ccc] leading-relaxed">
      <h1 className="text-3xl font-bold text-[#f0f0f0] mb-2">Политика за колачиња</h1>
      <p className="text-[#666] text-sm mb-12">Последно ажурирање: мај 2026</p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#f0f0f0] mb-4">1. Што се колачиња</h2>
        <p className="mb-4">
          Колачињата (cookies) се мали текстуални датотеки кои веб-сајтот ги зачувува на уредот на
          посетителот при посета. Тие му помагаат на сајтот да ги запамети поставувањата и активностите на
          корисникот при повторни посети.
        </p>
        <p>
          Photonia.mk ги користи колачињата во минимална мерка, единствено кога се неопходни за
          функционирањето на Платформата. За аналитика се употребува Plausible Analytics во cookieless
          режим, кој не поставува колачиња и не следи индивидуални корисници.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#f0f0f0] mb-4">2. Колачиња кои ги користиме</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 pr-4 text-xs uppercase tracking-widest text-[#888] font-normal">Назив</th>
                <th className="text-left py-3 pr-4 text-xs uppercase tracking-widest text-[#888] font-normal">Тип</th>
                <th className="text-left py-3 pr-4 text-xs uppercase tracking-widest text-[#888] font-normal">Цел</th>
                <th className="text-left py-3 pr-4 text-xs uppercase tracking-widest text-[#888] font-normal">Траење</th>
                <th className="text-left py-3 text-xs uppercase tracking-widest text-[#888] font-normal">Поставувач</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  name: "sb-access-token",
                  type: "Суштинско",
                  purpose: "Сесија за автентикација на корисникот (Supabase)",
                  duration: "Сесија",
                  provider: "Photonia.mk",
                },
                {
                  name: "sb-refresh-token",
                  type: "Суштинско",
                  purpose: "Освежување на автентикациска сесија",
                  duration: "1 ден",
                  provider: "Photonia.mk",
                },
                {
                  name: "cart",
                  type: "Функционално",
                  purpose: "Зачувување на содржината на кошничката за купување",
                  duration: "Сесија",
                  provider: "Photonia.mk",
                },
              ].map((row, i) => (
                <tr key={i} className="border-b border-white/[0.05]">
                  <td className="py-3 pr-4 font-mono text-xs text-[#e8c97e] align-top">{row.name}</td>
                  <td className="py-3 pr-4 text-[#ccc] align-top whitespace-nowrap">{row.type}</td>
                  <td className="py-3 pr-4 text-[#ccc] align-top">{row.purpose}</td>
                  <td className="py-3 pr-4 text-[#ccc] align-top whitespace-nowrap">{row.duration}</td>
                  <td className="py-3 text-[#ccc] align-top">{row.provider}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-[#888] mt-4">
          Платформата не користи колачиња за рекламирање, профилирање или следење на однесувањето на
          корисниците на трети сајтови.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#f0f0f0] mb-4">3. Аналитика без колачиња</h2>
        <p className="mb-4">
          За мерење на посетеноста на Платформата се користи{" "}
          <span className="text-[#f0f0f0] font-medium">Plausible Analytics</span>, алатка за приватност
          ориентирана аналитика со седиште во Европската Унија (Германија). Plausible:
        </p>
        <ul className="space-y-2 pl-0">
          {[
            "Не поставува колачиња на уредот на посетителот.",
            "Не собира лични идентификувачки информации.",
            "Не следи поединечни корисници низ различни сајтови.",
            "Не споделува податоци со трети страни за рекламни цели.",
            "Е целосно усогласен со GDPR, ЗЗЛП и ePrivacy Directive.",
          ].map((item, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-green-400 shrink-0 mt-0.5">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#f0f0f0] mb-4">4. Управување со колачиња</h2>
        <p className="mb-4">
          Суштинските колачиња се неопходни за функционирањето на Платформата и не можат да се
          исклучат без нарушување на основните функции (автентикација, купување).
        </p>
        <p className="mb-4">
          Функционалните колачиња можете да ги исклучите преку поставувањата на вашиот прелистувач.
          Упатства за управување со колачиња за најчестите прелистувачи:
        </p>
        <ul className="space-y-1 text-sm pl-0">
          {[
            "Google Chrome: Поставки › Приватност и безбедност › Колачиња",
            "Mozilla Firefox: Поставки › Приватност и безбедност › Колачиња",
            "Safari: Поставки › Приватност › Управување со колачиња",
            "Microsoft Edge: Поставки › Колачиња и дозволи на сајт",
          ].map((item, i) => (
            <li key={i} className="flex gap-3 text-[#ccc]">
              <span className="text-[#e8c97e] shrink-0 mt-0.5">&#8250;</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#f0f0f0] mb-4">5. Измени на Политиката</h2>
        <p>
          При воведување на нови колачиња или промена на постоечките, оваа Политика ќе биде ажурирана.
          Датумот на последното ажурирање е прикажан на почетокот на документот. За суштински промени,
          корисниците ќе бидат известени преку банер на Платформата.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#f0f0f0] mb-4">6. Контакт</h2>
        <p className="mb-4">За прашања поврзани со колачиња и приватност:</p>
        <div className="space-y-2 text-sm">
          <p>
            Е-пошта:{" "}
            <a href="mailto:privacy@photonia.mk" className="text-[#e8c97e] hover:underline">
              privacy@photonia.mk
            </a>
          </p>
          <p>
            Повеќе информации во{" "}
            <Link href="/legal/privacy" className="text-[#e8c97e] hover:underline">
              Политиката за приватност
            </Link>
            .
          </p>
        </div>
      </section>
    </article>
  );
}
