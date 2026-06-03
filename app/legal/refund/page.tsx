import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Политика за поврат на средства",
  description: "Услови за поврат на средства при купување дигитални фотографии на Photonia.mk",
};

export default function RefundPage() {
  return (
    <article className="text-[#ccc] leading-relaxed">
      <h1 className="text-3xl font-bold text-[#f0f0f0] mb-2">Политика за поврат на средства</h1>
      <p className="text-[#666] text-sm mb-10">Последно ажурирање: јуни 2026</p>

      <p className="mb-10 text-[#ccc]">
        Оваа Политика ги дефинира условите за поврат при купување дигитални фотографии преку
        Photonia.mk. Плаќањата ги обработува LemonSqueezy како овластен продавач на евиденција
        (merchant of record).
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#f0f0f0] mb-4">
          1. Природа на производот и согласност за веднаш испорака
        </h2>
        <p>
          Фотографиите се дигитална содржина што се испорачува веднаш по плаќањето, без физички
          носач. Со завршување на купувањето и прифаќањето на Условите за користење, купувачот
          изречно се согласува содржината да биде испорачана веднаш и потврдува дека по
          преземањето поврат на средства не е возможен.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#f0f0f0] mb-4">2. Кога поврат е возможен</h2>
        <p className="mb-4">
          И покрај горенаведеното, ќе биде извршен целосен поврат во следниве случаи:
        </p>
        <div className="space-y-4">
          {[
            {
              title: "Технички неуспех при испорака",
              desc: "Линкот за преземање не функционирал поради техничка грешка на Платформата и купувачот не успеал да ја преземе фотографијата во рок од 72 часа.",
            },
            {
              title: "Отстранета фотографија пред преземање",
              desc: "Доколку фотографијата е отстранета по плаќањето, но пред купувачот да ја презел.",
            },
            {
              title: "Двојна наплата",
              desc: "Доколку поради техничка грешка купувачот е наплатен двапати за иста фотографија, вишокот се враќа во целост.",
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
        <h2 className="text-xl font-semibold text-[#f0f0f0] mb-4">3. Кога поврат не е возможен</h2>
        <ul className="space-y-2 pl-0">
          {[
            "Фотографијата е успешно преземена, без оглед дали е употребена.",
            "Купувачот тврди дека сликата не одговара на очекувањата, иако соодветствува на описот и прегледот.",
            "Прекршени се условите на лиценцата.",
            "Изгубен е пристапот до преземената фотографија поради технички проблеми кај купувачот.",
            "Промена на мислење по успешно преземање.",
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
        <ol className="space-y-3 pl-0">
          {[
            "Испрати е-пошта на support@photonia.mk со предмет „Барање за поврат“.",
            "Наведи ја е-поштата употребена при купувањето, датумот на купувањето и опис на проблемот.",
            "Ќе ги провериме техничките логови и ќе одговориме во рок од 24 часа.",
            "Доколку барањето е основано, повратот се иницира во рок од 3 работни дена преку истиот платежен метод.",
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
