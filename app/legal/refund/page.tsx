import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Политика за поврат на средства",
  description: "Политика за поврат на средства при купување на дигитални фотографии на Photonia.mk",
};

export default function RefundPage() {
  return (
    <article className="text-[#ccc] leading-relaxed">
      <h1 className="text-3xl font-bold text-[#f0f0f0] mb-2">Политика за поврат на средства</h1>
      <p className="text-[#666] text-sm mb-12">Последно ажурирање: мај 2026</p>

      <div className="bg-blue-950/30 border border-blue-700/40 rounded-lg p-5 mb-10">
        <p className="text-blue-300 text-sm">
          Оваа Политика ги дефинира условите за поврат на средства при купување на дигитални фотографии
          преку Photonia.mk. Пред купувањето, купувачот изречно ги прифаќа условите наведени подолу
          преку посебен checkbox на страната за купување.
        </p>
      </div>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#f0f0f0] mb-4">1. Одрекување од право на одустанок</h2>
        <p className="mb-4">
          Согласно членот 16, точка (м) од Директивата на Европската Унија за правата на потрошувачите
          (2011/83/ЕУ, EU Consumer Rights Directive), правото на одустанок од договор не се применува за
          испорака на дигитална содржина која не е испорачана на физички носач, кога:
        </p>
        <ul className="space-y-2 pl-0 mb-4">
          <li className="flex gap-3">
            <span className="text-[#e8c97e] shrink-0 mt-0.5">&#8250;</span>
            <span>Извршувањето на договорот започнало со изречна претходна согласност на потрошувачот, и</span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#e8c97e] shrink-0 mt-0.5">&#8250;</span>
            <span>
              Потрошувачот изречно потврдил дека со тоа го губи правото на одустанок.
            </span>
          </li>
        </ul>
        <p className="mb-4">
          При секое купување на Photonia.mk, купувачот потврдува и двата горенаведени услова преку
          посебен задолжителен checkbox на страната за купување, со текст:
        </p>
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-4 mb-4">
          <p className="text-sm text-[#f0f0f0] italic">
            "Се согласувам дека со преземање на дигиталната фотографија, откажувам од правото на
            одустанок во рок од 14 дена, согласно членот 16(м) од EU Consumer Rights Directive.
            Разбирам дека поврат на средства не е можен откако фотографијата ќе биде преземена."
          </p>
        </div>
        <p>
          Без изречно прифаќање на овој checkbox, купувањето не може да биде завршено.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#f0f0f0] mb-4">2. Кога поврат е можен</h2>
        <p className="mb-4">
          Иако поврат на средства по преземање на фотографијата не е можен, Операторот ќе изврши
          целосен поврат на средства во следните ситуации:
        </p>
        <div className="space-y-4">
          {[
            {
              title: "Технички неуспех при испорака",
              desc: "Доколку линкот за преземање не функционирал поради техничка грешка на страна на Платформата и купувачот не успеал да ја преземе фотографијата во рамките на 72 часа по купувањето.",
            },
            {
              title: "Фотографијата е отстранета пред преземање",
              desc: "Доколку фотографијата биде отстранета од Платформата по купувањето, но пред купувачот да ја презел, купувачот добива целосен поврат.",
            },
            {
              title: "Дупла наплата",
              desc: "Доколку поради техничка грешка купувачот бил наплатен двапати за иста фотографија, вишокот на средства ќе биде вратен во целост.",
            },
          ].map((item, i) => (
            <div key={i} className="border border-green-700/20 bg-green-950/10 rounded-lg p-4">
              <p className="text-sm font-semibold text-green-400 mb-1">{item.title}</p>
              <p className="text-sm text-[#ccc]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#f0f0f0] mb-4">3. Кога поврат не е можен</h2>
        <ul className="space-y-2 pl-0">
          {[
            "Купувачот успешно ја презел фотографијата, без оглед на тоа дали ја употребил.",
            "Купувачот тврди дека сликата не одговара на очекувањата, иако соодветствува на описот и preview-то.",
            "Купувачот ги прекршил условите на лиценцата.",
            "Купувачот го изгубил пристапот до преземената фотографија поради свои технички проблеми.",
            "Купувачот го сменил мислењето по успешно преземање.",
          ].map((item, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-red-400 shrink-0 mt-0.5">✗</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#f0f0f0] mb-4">4. Постапка за барање поврат</h2>
        <p className="mb-4">
          За поднесување на барање за поврат на средства поради техничка причина:
        </p>
        <ol className="space-y-3 pl-0">
          {[
            "Испратете е-пошта на support@photonia.mk со предмет: Барање за поврат.",
            "Наведете е-пошта адресата употребена при купувањето, датумот на купувањето и опис на проблемот.",
            "Операторот ќе ги провери техничките логови и ќе одговори во рок од 24 часа.",
            "Доколку барањето е основано, повратот ќе биде иницирен во рок од 3 работни дена преку истиот платежен метод.",
          ].map((item, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-[#e8c97e] font-mono shrink-0">{i + 1}.</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#f0f0f0] mb-4">5. Контакт</h2>
        <div className="space-y-2 text-sm">
          <p>
            Барања за поврат:{" "}
            <a href="mailto:support@photonia.mk" className="text-[#e8c97e] hover:underline">
              support@photonia.mk
            </a>
          </p>
          <p>
            Платежни прашања:{" "}
            <a href="mailto:info@photonia.mk" className="text-[#e8c97e] hover:underline">
              info@photonia.mk
            </a>
          </p>
        </div>
      </section>
    </article>
  );
}
