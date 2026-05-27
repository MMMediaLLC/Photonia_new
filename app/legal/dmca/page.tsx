import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DMCA и авторски права",
  description: "Процедура за пријавување на повреда на авторски права на Photonia.mk",
};

export default function DmcaPage() {
  return (
    <article className="text-[#ccc] leading-relaxed">
      <h1 className="text-3xl font-bold text-[#f0f0f0] mb-2">DMCA и авторски права</h1>
      <p className="text-[#666] text-sm mb-12">Последно ажурирање: мај 2026</p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#f0f0f0] mb-4">1. Вовед</h2>
        <p className="mb-4">
          Photonia.mk ги почитува авторските права на сите трети страни и очекува исто и од
          корисниците на Платформата. Сите фотографии достапни на Платформата се оригинални авторски
          дела на M&M Фото, снимени лично при документирање на јавни настани во Македонија.
        </p>
        <p>
          Доколку сметате дека на Платформата се наоѓа содржина која го нарушува вашето авторско право
          или правото на трета страна, можете да поднесете пријава согласно процедурата опишана во овој
          документ. Процедурата е усогласена со американскиот Digital Millennium Copyright Act (DMCA),
          Директивата на ЕУ за авторски права (2019/790/ЕУ) и Законот за авторско право и сродни права
          на Република Македонија.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#f0f0f0] mb-4">2. Поднесување на пријава за повреда</h2>
        <p className="mb-4">
          За поднесување на пријава за повреда на авторски права, испратете е-пошта на:
        </p>
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-5 mb-6">
          <p className="text-[#f0f0f0] font-semibold mb-1">Designated Copyright Agent:</p>
          <a href="mailto:legal@photonia.mk" className="text-[#e8c97e] hover:underline text-lg">
            legal@photonia.mk
          </a>
        </div>
        <p className="mb-4">Пријавата мора да содржи:</p>
        <ol className="space-y-3 pl-0">
          {[
            "Потпис (електронски или физички) на лицето овластено да дејствува во ime на носителот на авторското право.",
            "Идентификација на авторското дело за кое тврдите дека е нарушено (опис, URL адреса или друга идентификација).",
            "Идентификација на содржината на Платформата за која тврдите дека го нарушува авторското право, со доволно информации за да можеме да ја лоцираме (URL адреса или опис на местото на содржината).",
            "Ваши контакт информации: целосно ime, адреса, телефонски број и е-пошта.",
            "Изјава дека добросовесно верувате дека употребата на содржината не е одобрена од носителот на авторското право, неговиот застапник или со закон.",
            "Изјава дека информациите во пријавата се точни и, под казна за лажно сведочење, дека сте овластени да дејствувате во ime на носителот на авторското право.",
          ].map((item, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-[#e8c97e] font-mono shrink-0">{i + 1}.</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#f0f0f0] mb-4">3. Рокови за обработка</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <tbody>
              {[
                ["Потврда за прием на пријавата", "48 часа"],
                ["Прелиминарна оцена на пријавата", "5 работни дена"],
                ["Конечна одлука и спроведување", "14 работни дена"],
              ].map(([step, deadline], i) => (
                <tr key={i} className="border-b border-white/[0.05]">
                  <td className="py-3 pr-6 text-[#ccc]">{step}</td>
                  <td className="py-3 text-[#e8c97e] font-medium">{deadline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#f0f0f0] mb-4">4. Можни исходи</h2>
        <p className="mb-4">По обработката на пријавата, Операторот може да:</p>
        <ul className="space-y-2 pl-0">
          {[
            "Ја отстрани или оневозможи пристапот до наводно нарушувачката содржина.",
            "Одбие пријавата со образложение, доколку смета дека не постои нарушување.",
            "Побара дополнителни информации за пријавата.",
          ].map((item, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-[#e8c97e] shrink-0 mt-0.5">&#8250;</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#f0f0f0] mb-4">5. Counter-notice процедура</h2>
        <p className="mb-4">
          Доколку содржината на Платформата е отстранета поради пријава за повреда, а сметате дека
          отстранувањето е грешка или погрешна идентификација, можете да поднесете counter-notice на
          legal@photonia.mk. Counter-notice-от мора да содржи:
        </p>
        <ol className="space-y-2 pl-0">
          {[
            "Идентификација на отстранетата содржина со нејзина локација пред отстранувањето.",
            "Изјава под казна за лажно сведочење дека добросовесно верувате дека содржината е отстранета поради грешка.",
            "Ваши контакт информации и согласност за надлежноста на судовите.",
          ].map((item, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-[#e8c97e] font-mono shrink-0">{i + 1}.</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#f0f0f0] mb-4">6. Злоупотреба на процедурата</h2>
        <p>
          Поднесувањето на лажни пријави за повреда на авторски права може да доведе до правна
          одговорност на подносителот за настаната штета. Операторот ги задржува сите пријави и
          одговори и може да ги употреби во евентуална правна постапка.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#f0f0f0] mb-4">7. Авторски права на M&M Media</h2>
        <p className="mb-4">
          Доколку сте забележале дека фотографии на M&M Media се употребени без дозвола на трети
          сајтови или платформи, ве молиме да не известите на:
        </p>
        <div className="space-y-2 text-sm">
          <p>
            Е-пошта:{" "}
            <a href="mailto:legal@photonia.mk" className="text-[#e8c97e] hover:underline">
              legal@photonia.mk
            </a>
          </p>
        </div>
        <p className="mt-4 text-sm text-[#888]">
          Ваша помош во заштитата на авторските права на M&M Фото е ценета.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#f0f0f0] mb-4">8. Контакт</h2>
        <div className="space-y-2 text-sm">
          <p>
            Copyright Agent:{" "}
            <a href="mailto:legal@photonia.mk" className="text-[#e8c97e] hover:underline">
              legal@photonia.mk
            </a>
          </p>
        </div>
      </section>
    </article>
  );
}
