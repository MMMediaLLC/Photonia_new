import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Политика за приватност",
  description: "Политика за заштита на личните податоци на корисниците на Photonia.mk",
};

function DataTable({
  rows,
}: {
  rows: { category: string; data: string; purpose: string; basis: string; retention: string }[];
}) {
  return (
    <div className="overflow-x-auto mb-6">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-3 pr-4 text-xs uppercase tracking-widest text-[#888] font-normal">Категорија</th>
            <th className="text-left py-3 pr-4 text-xs uppercase tracking-widest text-[#888] font-normal">Податоци</th>
            <th className="text-left py-3 pr-4 text-xs uppercase tracking-widest text-[#888] font-normal">Цел</th>
            <th className="text-left py-3 pr-4 text-xs uppercase tracking-widest text-[#888] font-normal">Правна основа</th>
            <th className="text-left py-3 text-xs uppercase tracking-widest text-[#888] font-normal">Чување</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-white/[0.05]">
              <td className="py-3 pr-4 text-[#e8c97e] font-medium align-top">{row.category}</td>
              <td className="py-3 pr-4 text-[#ccc] align-top">{row.data}</td>
              <td className="py-3 pr-4 text-[#ccc] align-top">{row.purpose}</td>
              <td className="py-3 pr-4 text-[#ccc] align-top">{row.basis}</td>
              <td className="py-3 text-[#ccc] align-top">{row.retention}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <article className="text-[#ccc] leading-relaxed">
      <h1 className="text-3xl font-bold text-[#f0f0f0] mb-2">Политика за приватност</h1>
      <p className="text-[#666] text-sm mb-12">Последно ажурирање: мај 2026</p>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#f0f0f0] mb-4">1. Вовед и контролор на податоци</h2>
        <p className="mb-4">
          Оваа Политика за приватност ги опишува начините на кои M&M Media (во понатамошниот текст: Оператор,
          Контролор) ги собира, обработува, чува и штити личните податоци на посетителите и корисниците на
          платформата Photonia.mk (во понатамошниот текст: Платформата).
        </p>
        <p className="mb-4">
          Политиката е усогласена со Законот за заштита на личните податоци на Република Македонија (Службен
          весник на РМ бр. 42/2020 и измени, во понатамошниот текст: ЗЗЛП) и со Општата регулатива за заштита на
          податоци на Европската Унија (Регулатива ЕУ 2016/679, во понатамошниот текст: GDPR) во делот кој се
          однесува на посетители и корисници со место на живеење во ЕУ.
        </p>
        <p>
          Контролор на личните податоци е M&M Media. За сите прашања поврзани со приватноста контактирајте на{" "}
          <a href="mailto:privacy@photonia.mk" className="text-[#e8c97e] hover:underline">
            privacy@photonia.mk
          </a>
          .
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#f0f0f0] mb-4">2. Кои лични податоци собираме</h2>
        <DataTable
          rows={[
            {
              category: "Идентификација",
              data: "Е-пошта адреса",
              purpose: "Верификација на идентитет (magic link), испраќање потврди за нарачки и линкови за преземање",
              basis: "Извршување на договор (чл. 9 ст. 1 т. 2 ЗЗЛП)",
              retention: "До бришење на сметката или 5 години по последната трансакција",
            },
            {
              category: "Трансакции",
              data: "Тип на лиценца, купена фотографија, износ, валута, датум",
              purpose: "Процесирање на нарачки, испорака на дигитален производ, даночна евиденција",
              basis: "Извршување на договор и законска обврска",
              retention: "10 години (даночна законска обврска)",
            },
            {
              category: "Преземања",
              data: "Токен за преземање, број на преземања, датум на истекување",
              purpose: "Контрола на пристап до купените фотографии",
              basis: "Извршување на договор",
              retention: "1 година по истекот на токенот",
            },
            {
              category: "Техничко",
              data: "IP адреса (анонимизирана), тип на уред, прелистувач",
              purpose: "Безбедност на платформата, откривање на злоупотреби, аналитика",
              basis: "Легитимен интерес (чл. 9 ст. 1 т. 6 ЗЗЛП)",
              retention: "90 дена",
            },
          ]}
        />
        <p className="text-sm text-[#888]">
          Не собираме платежни картички, IBAN броеви или банкарски информации. Сите платежни податоци се
          обработуваат исклучиво преку LemonSqueezy (merchant of record).
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#f0f0f0] mb-4">3. Под-обработувачи (sub-processors)</h2>
        <p className="mb-5">
          За обезбедување на услугите на Платформата, Операторот соработува со следните доверливи трети страни кои
          обработуваат лични податоци во негово ime. Секој под-обработувач е обврзан со договор за обработка на
          податоци и обезбедува ниво на заштита споредливо со ЗЗЛП и GDPR.
        </p>
        <div className="space-y-4">
          {[
            {
              name: "Supabase",
              role: "База на податоци и автентикација",
              location: "ЕУ (AWS eu-central-1)",
              data: "Е-пошта, историја на нарачки, токени за преземање",
              link: "https://supabase.com/privacy",
            },
            {
              name: "Cloudinary",
              role: "Складирање и обработка на фотографии",
              location: "САД (со SCCs за ЕУ пренос)",
              data: "Не обработува лични податоци на корисници директно",
              link: "https://cloudinary.com/privacy",
            },
            {
              name: "LemonSqueezy",
              role: "Обработка на плаќања (merchant of record)",
              location: "САД (со SCCs за ЕУ пренос)",
              data: "Платежни информации, е-пошта за потврди",
              link: "https://www.lemonsqueezy.com/privacy",
            },
            {
              name: "Resend",
              role: "Транзакциски е-пошти",
              location: "САД (со SCCs за ЕУ пренос)",
              data: "Е-пошта адреса, содржина на е-пошта",
              link: "https://resend.com/privacy",
            },
            {
              name: "Plausible Analytics",
              role: "Аналитика на употреба (cookieless)",
              location: "ЕУ (Германија)",
              data: "Анонимизирани метаподатоци за посетите, без лични податоци",
              link: "https://plausible.io/privacy",
            },
          ].map((sp) => (
            <div key={sp.name} className="border border-white/[0.08] rounded-lg p-4">
              <div className="flex items-start justify-between gap-4 mb-2">
                <p className="font-semibold text-[#f0f0f0]">{sp.name}</p>
                <span className="text-xs text-[#888] shrink-0">{sp.location}</span>
              </div>
              <p className="text-sm text-[#888] mb-1">{sp.role}</p>
              <p className="text-sm text-[#ccc]">{sp.data}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#f0f0f0] mb-4">4. Пренос на податоци надвор од ЕУ</h2>
        <p className="mb-4">
          Некои под-обработувачи (LemonSqueezy, Cloudinary, Resend) имаат седиште во Соединетите Американски
          Држави. За преносот на лични податоци надвор од Европскиот економски простор, Операторот се потпира на
          Стандардните договорни клаузули (Standard Contractual Clauses, SCCs) одобрени од Европската комисија,
          со цел обезбедување на соодветно ниво на заштита.
        </p>
        <p>
          За посетители и корисници со место на живеење во Република Македонија, преносот на податоци е регулиран
          со членот 55 и следните од ЗЗЛП.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#f0f0f0] mb-4">5. Колачиња и следење</h2>
        <p className="mb-4">
          Платформата користи минимален број на колачиња неопходни за нејзиното функционирање. За аналитика се
          користи Plausible Analytics во cookieless режим, кој не поставува колачиња и не собира лични
          идентификувачки информации.
        </p>
        <p>
          Детален преглед на сите колачиња е достапен во{" "}
          <Link href="/legal/cookies" className="text-[#e8c97e] hover:underline">
            Политиката за колачиња
          </Link>
          .
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#f0f0f0] mb-4">6. Права на субјектот на податоците</h2>
        <p className="mb-5">
          Согласно членовите 12 до 22 од ЗЗЛП и членовите 15 до 22 од GDPR, секое лице чии лични податоци ги
          обработуваме ги има следните права:
        </p>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {[
            {
              right: "Право на пристап (чл. 12 ЗЗЛП)",
              desc: "Право да добиете потврда дали обработуваме ваши лични податоци и копија од нив.",
            },
            {
              right: "Право на исправка (чл. 14 ЗЗЛП)",
              desc: "Право да побарате исправка на нeточни или дополнување на нецелосни лични податоци.",
            },
            {
              right: "Право на бришење (чл. 16 ЗЗЛП)",
              desc: "Право да побарате бришење на личните податоци кога повеќе не се неопходни за целите за кои биле собрани.",
            },
            {
              right: "Право на ограничување (чл. 17 ЗЗЛП)",
              desc: "Право да побарате ограничување на обработката во одредени случаи предвидени со закон.",
            },
            {
              right: "Право на преносливост (чл. 19 ЗЗЛП)",
              desc: "Право да ги добиете личните податоци во структуриран, машински читлив формат.",
            },
            {
              right: "Право на приговор (чл. 21 ЗЗЛП)",
              desc: "Право да поднесете приговор против обработката базирана на легитимен интерес.",
            },
          ].map((item) => (
            <div key={item.right} className="border border-white/[0.08] rounded-lg p-4">
              <p className="text-sm font-semibold text-[#e8c97e] mb-2">{item.right}</p>
              <p className="text-sm text-[#ccc]">{item.desc}</p>
            </div>
          ))}
        </div>
        <p>
          За остварување на кое и да е право, испратете барање на{" "}
          <a href="mailto:privacy@photonia.mk" className="text-[#e8c97e] hover:underline">
            privacy@photonia.mk
          </a>
          . Ќе одговориме во рок од 30 дена.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#f0f0f0] mb-4">7. Барање за бришење на фотографија</h2>
        <p className="mb-4">
          Доколку се препознавате на некоја фотографија достапна на Платформата и сакате таа да биде отстранета,
          имате право да поднесете барање за бришење согласно членот 16 и членот 21 од ЗЗЛП. Деталната процедура
          е опишана во посебниот документ{" "}
          <Link href="/legal/takedown" className="text-[#e8c97e] hover:underline">
            Барање за бришење на фотографија
          </Link>
          .
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#f0f0f0] mb-4">8. Безбедност на податоците</h2>
        <p className="mb-4">
          Операторот применува технички и организациски мерки за заштита на личните податоци од неовластен
          пристап, загуба или уништување. Мерките вклучуваат:
        </p>
        <ul className="space-y-2 pl-0 mb-4">
          {[
            "Шифрирање на податоците при пренос преку HTTPS/TLS.",
            "Потпишани URL адреси со краток рок на важност за пристап до фотографиите.",
            "Разграничување на пристапните права согласно принципот на минимална привилегија.",
            "Редовно резервно копирање на базата на податоци.",
            "Мониторинг на безбедносни инциденти преку автоматизирани алатки.",
          ].map((item, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-[#e8c97e] shrink-0 mt-0.5">&#8250;</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p>
          Во случај на нарушување на безбедноста кое може да ги загрози правата и слободите на субјектите,
          Операторот ќе го извести надлежниот орган за заштита на личните податоци во рок предвиден со ЗЗЛП, а
          засегнатите субјекти ќе бидат информирани без непотребно одложување.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#f0f0f0] mb-4">9. Малолетни лица</h2>
        <p>
          Платформата не е наменета за лица под 16 години. Ако посомневаме дека сме собрале лични податоци на
          малолетно лице без согласност на родител или старател, ќе ги избришеме тие податоци веднаш по
          откривањето. За пријавување на таков случај контактирајте на{" "}
          <a href="mailto:privacy@photonia.mk" className="text-[#e8c97e] hover:underline">
            privacy@photonia.mk
          </a>
          .
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#f0f0f0] mb-4">10. Измени на Политиката</h2>
        <p>
          Операторот го задржува правото да ја измени оваа Политика. При суштински измени, регистрираните
          корисници ќе бидат известени по е-пошта во рок од 7 дена пред стапувањето на измените на сила. Датумот
          на последното ажурирање е прикажан на почетокот на документот.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#f0f0f0] mb-4">11. Жалба до надлежен орган</h2>
        <p className="mb-4">
          Доколку сметате дека обработката на вашите лични податоци ги нарушува одредбите на ЗЗЛП, имате право
          да поднесете жалба до Агенцијата за заштита на личните податоци на Република Македонија:
        </p>
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-lg p-4 text-sm space-y-1">
          <p className="text-[#f0f0f0] font-medium">Агенција за заштита на личните податоци</p>
          <p>Адреса: ул. Македонија бр. 12, 1000 Скопје</p>
          <p>Веб: <span className="text-[#e8c97e]">www.azlp.mk</span></p>
          <p>Е-пошта: <span className="text-[#e8c97e]">info@azlp.mk</span></p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-[#f0f0f0] mb-4">12. Контакт</h2>
        <div className="space-y-2 text-sm">
          <p>
            Прашања за приватност и лични податоци:{" "}
            <a href="mailto:privacy@photonia.mk" className="text-[#e8c97e] hover:underline">
              privacy@photonia.mk
            </a>
          </p>
          <p>
            Општи прашања:{" "}
            <a href="mailto:info@photonia.mk" className="text-[#e8c97e] hover:underline">
              info@photonia.mk
            </a>
          </p>
        </div>
      </section>
    </article>
  );
}
