import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Барање за бришење на фотографија",
  description: "Процедура за поднесување барање за бришење на фотографија на Photonia.mk",
};

export default function TakedownPage() {
  return (
    <article className="text-[#ccc] leading-relaxed">
      <h1 className="text-3xl font-bold text-[#f0f0f0] mb-2">Барање за бришење на фотографија</h1>
      <p className="text-[#666] text-sm mb-12">Последно ажурирање: мај 2026</p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#f0f0f0] mb-4">1. Вовед и правна основа</h2>
        <p className="mb-4">
          Photonia.mk ги почитува правата на личноста и правото на сопствена слика на сите лица прикажани
          на фотографиите достапни на Платформата. Секое физичко лице кое се препознава на фотографија
          поставена на Платформата и смета дека нејзината продажба ги нарушува неговите/нејзините права,
          има право да поднесе барање за бришење на таа фотографија.
        </p>
        <p className="mb-4">
          Правна основа за ова право е:
        </p>
        <ul className="space-y-2 pl-0 mb-4">
          <li className="flex gap-3">
            <span className="text-[#e8c97e] shrink-0 mt-0.5">&#8250;</span>
            <span>
              <span className="text-[#f0f0f0] font-medium">Член 16 од ЗЗЛП</span>, кој го уредува
              правото на бришење на лични податоци (право да се биде заборавен), применливо кога
              обработката на податоци повеќе не е оправдана со законска основа.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-[#e8c97e] shrink-0 mt-0.5">&#8250;</span>
            <span>
              <span className="text-[#f0f0f0] font-medium">Член 21 од ЗЗЛП</span>, кој го уредува
              правото на приговор против обработката на лични податоци, вклучувајќи приговор заснован
              на легитимен интерес на субјектот.
            </span>
          </li>
        </ul>
        <p>
          Операторот ги обработува сите барања совесно и во предвидените рокови, почитувајќи го
          балансот меѓу правото на приватност на субјектот и правото на јавна информираност.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#f0f0f0] mb-4">2. Кои можат да поднесат барање</h2>
        <p className="mb-4">Барање за бришење може да поднесе:</p>
        <ul className="space-y-2 pl-0">
          {[
            "Физичко лице кое се препознава на фотографијата и сака таа да биде отстранета.",
            "Законски застапник (родител, старател) во ime на малолетно лице прикажано на фотографијата.",
            "Полномошник кој располага со писмено полномошно од прикажаното лице.",
          ].map((item, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-[#e8c97e] shrink-0 mt-0.5">&#8250;</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#f0f0f0] mb-4">3. Каде и како да поднесете барање</h2>
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-5 mb-6">
          <p className="text-[#f0f0f0] font-semibold mb-1">Е-пошта за поднесување на барања:</p>
          <a href="mailto:privacy@photonia.mk" className="text-[#e8c97e] hover:underline text-lg">
            privacy@photonia.mk
          </a>
        </div>
        <p className="mb-4">Барањето се поднесува на македонски или англиски јазик и мора да содржи:</p>
        <ol className="space-y-3 pl-0">
          {[
            "Целосно ime и презиме на лицето кое поднесува барање.",
            "Контакт е-пошта адреса за комуникација во текот на постапката.",
            "URL адреса или јасен опис (наслов на галерија, приближен опис) на фотографијата за која се бара бришење.",
            "Кратко образложение зошто сметате дека фотографијата треба да биде отстранета.",
            "Изјава дека информациите наведени во барањето се точни и дека подносителот е лицето прикажано на фотографијата, или негов/нејзин законски застапник.",
          ].map((item, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-[#e8c97e] font-mono shrink-0">{i + 1}.</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm text-[#888]">
          Не е потребно да прикачувате лична документација во почетната фаза. Доколку биде потребно,
          Операторот ќе побара дополнителни информации.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#f0f0f0] mb-4">4. Рокови за обработка</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 pr-6 text-xs uppercase tracking-widest text-[#888] font-normal">Чекор</th>
                <th className="text-left py-3 text-xs uppercase tracking-widest text-[#888] font-normal">Рок</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Потврда за прием на барањето", "48 часа (работни дена)"],
                ["Прелиминарна оцена на барањето", "3 работни дена"],
                ["Конечна одлука и известување на подносителот", "7 работни дена"],
                ["Спроведување на одлуката (при прифаќање)", "24 часа по донесувањето на одлуката"],
              ].map(([step, deadline], i) => (
                <tr key={i} className="border-b border-white/[0.05]">
                  <td className="py-3 pr-6 text-[#ccc]">{step}</td>
                  <td className="py-3 text-[#e8c97e] font-medium whitespace-nowrap">{deadline}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#f0f0f0] mb-4">5. Можни исходи</h2>
        <div className="space-y-4">
          {[
            {
              outcome: "Бришење на фотографијата",
              color: "border-green-700/30 bg-green-950/10",
              titleColor: "text-green-400",
              desc: "Фотографијата целосно се отстранува од Платформата, вклучувајќи ги сите нејзини верзии (preview, thumbnail, оригинал). Ова е стандардниот исход кога барањето е основано и нема доминантен јавен интерес.",
            },
            {
              outcome: "Замаглување на лицето",
              color: "border-blue-700/30 bg-blue-950/10",
              titleColor: "text-blue-400",
              desc: "Кога фотографијата има значајна документарна вредност (историски настан, новинарска важност), Операторот може да понуди замаглување на препознатливите лица наместо целосно бришење. Ова решение се применува само со согласност на подносителот на барањето.",
            },
            {
              outcome: "Задржување на фотографијата",
              color: "border-amber-700/30 bg-amber-950/10",
              titleColor: "text-amber-400",
              desc: "Операторот може да одбие бришење кога постои доминантен јавен интерес за зачувување на фотографијата, на пример: фотографиите ги документираат дејствија на јавни личности во вршење на нивните функции, или настани со историско значење. Во таков случај, Операторот дава детално писмено образложение за одлуката.",
            },
            {
              outcome: "Барање за дополнителни информации",
              color: "border-white/10 bg-white/[0.02]",
              titleColor: "text-[#aaa]",
              desc: "Доколку барањето е нецелосно или содржи недоволно информации, Операторот ќе побара дополнување во рок од 3 работни дена. Рокот за конечна одлука тече од моментот на прием на дополнетото барање.",
            },
          ].map((item) => (
            <div key={item.outcome} className={`border ${item.color} rounded-lg p-4`}>
              <p className={`font-semibold ${item.titleColor} mb-2`}>{item.outcome}</p>
              <p className="text-sm text-[#ccc]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#f0f0f0] mb-4">6. Жалба при одбиено барање</h2>
        <p className="mb-4">
          Доколку не сте задоволни со одлуката на Операторот, имате право да поднесете жалба до:
        </p>
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-4 text-sm space-y-1">
          <p className="text-[#f0f0f0] font-medium">Агенција за заштита на личните податоци</p>
          <p>Адреса: ул. Македонија бр. 12, 1000 Скопје</p>
          <p>Веб: <span className="text-[#e8c97e]">www.azlp.mk</span></p>
          <p>Е-пошта: <span className="text-[#e8c97e]">info@azlp.mk</span></p>
        </div>
        <p className="mt-4 text-sm text-[#888]">
          Правото на жалба до надзорниот орган постои независно од претходното поднесување на барање до
          Операторот и не е условено со претходно исцрпување на постапката.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#f0f0f0] mb-4">7. Купувачи кои веќе ја купиле фотографијата</h2>
        <p>
          Доколку при прифаќање на барањето за бришење постојат активни лиценци за фотографијата,
          Операторот ги информира купувачите по е-пошта за прекинувањето на лиценцата и за обврската за
          бришење на локалните копии. Купувачите не добиваат поврат на средства бидејќи лиценцата
          бесте склучена и исполнета во момент кога не постоела одлука за бришење.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#f0f0f0] mb-4">8. Контакт</h2>
        <div className="space-y-2 text-sm">
          <p>
            Поднесување на барања:{" "}
            <a href="mailto:privacy@photonia.mk" className="text-[#e8c97e] hover:underline">
              privacy@photonia.mk
            </a>
          </p>
          <p>
            Правни прашања:{" "}
            <a href="mailto:legal@photonia.mk" className="text-[#e8c97e] hover:underline">
              legal@photonia.mk
            </a>
          </p>
        </div>
      </section>
    </article>
  );
}
