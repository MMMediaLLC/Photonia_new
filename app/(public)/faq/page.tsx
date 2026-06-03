import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, Download, Shield, CreditCard, FileImage, Mail, UserX, Scale, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Често поставувани прашања — Photonia",
  description: "Сè што треба да знаеш пред да купиш фотографија на Photonia",
};

const FAQS = [
  {
    icon: FileImage,
    q: "Што добивам кога купувам фотографија?",
    a: "Добиваш оригинална HD фотографија без воден жиг, во целосна резолуција (обично над 4000 пиксели по долгата страна). Фотографијата се испраќа како дигитално преземање во JPG формат, со вграден sRGB профил на бои. Нема физичка испорака.",
  },
  {
    icon: Shield,
    q: "Која е разликата помеѓу Личната и Комерцијалната лиценца?",
    a: "Личната лиценца е за приватна, некомерцијална употреба: печатиш за себе, ставаш во рамка, ја користиш на личен профил без спонзорски контекст.\n\nКомерцијалната лиценца е за бизнис употреба: веб страница, маркетинг материјали, прес соопштенија, огласи.\n\nОбете лиценци забрануваат препродажба, употреба за обука на вештачка интелигенција и употреба во NFT контекст.\n\nДетаљни услови на /legal/license.",
  },
  {
    icon: Scale,
    q: "Што значи ознаката Editorial Only?",
    a: "Фотографиите со ознаката Editorial Only содржат препознатливи лица снимени на јавни настани без индивидуална писмена согласност. Дури и со Комерцијална лиценца, ваквите фотографии не смеат да се употребат во реклами кои имплицираат дека прикажаното лице го одобрува производот или услугата, во политичка пропаганда без согласност, или во контекст кој ја нарушува репутацијата на лицето.\n\nПодетално на /legal/editorial-notice.",
  },
  {
    icon: Download,
    q: "Како ја преземам фотографијата?",
    a: "По плаќањето добиваш е-пошта со директни линкови за преземање за секоја купена фотографија. Линковите важат една година од купувањето и можеш да преземаш без ограничување на бројот преземања. Алтернативно, можеш да се најавиш на photonia.mk и да ги најдеш сите свои преземања на /account/downloads.",
  },
  {
    icon: CreditCard,
    q: "Како да платам?",
    a: "Плаќањето е безбедно преку сертифициран платежен процесор. Прифаќаме Visa, Mastercard и American Express. Цените се прикажани во македонски денари (МКД).",
  },
  {
    icon: Mail,
    q: "Не сум добил е-пошта со линкови за преземање, што да правам?",
    a: "Прво провери ја папката Нежелена пошта (Spam). Ако нема, најави се на photonia.mk со истата е-пошта со која си платил — сите преземања се видливи во делот „Мои преземања“. За техничка помош пиши на support@photonia.mk во рок од 72 часа.",
  },
  {
    icon: CheckCircle,
    q: "Мора ли да се регистрирам за да купам?",
    a: "Не. Не е потребна регистрација пред купување. При плаќање внесуваш само е-пошта, а сметката се создава автоматски и преземањата се поврзани со неа. За подоцнежен пристап можеш да се најавиш на photonia.mk со истата е-пошта и ќе добиеш линк за најава.",
  },
  {
    icon: UserX,
    q: "Јас сум на фотографијата и не сакам да се продава. Што можам да направам?",
    a: "Имате право да поднесете барање за бришење на фотографијата согласно членот 16 и членот 21 од Законот за заштита на личните податоци. Испратете барање на privacy@photonia.mk со опис на фотографијата. Одговараме во рок од 7 работни дена. Детална постапка на /legal/takedown.",
  },
  {
    icon: FileImage,
    q: "Дали можам да ја купам фотографијата ако јас сум на неа?",
    a: "Да. Ако се препознаваш на фотографија и сакаш да ја имаш, можеш да ја купиш по редовна цена. При купување, исто важат условите на лиценцата. Доколку сакаш фотографијата да биде отстранета наместо да ја купиш, постапи преку процедурата за бришење.",
  },
  {
    icon: Info,
    q: "Кои се техничките спецификации на фотографиите?",
    a: "Фотографиите се испорачуваат во JPG формат, оригинална резолуција (типично 4000 до 6000 пиксели по долгата страна), бојна профил sRGB, соодветни за печат до A2 формат при 300 DPI, и за сите дигитални употреби. Воденот жиг е отстранет на оригиналот кој го преземаш.",
  },
  {
    icon: Shield,
    q: "Дали можам да барам поврат на средства?",
    a: "Поврат по преземање не е возможен бидејќи се работи за дигитален производ испорачан веднаш по плаќањето. Поврат е возможен само ако линкот не функционирал поради техничка грешка на наша страна — јави ни се на support@photonia.mk во рок од 72 часа од купувањето и ќе решиме. Сите услови за поврат се содржани во Политиката за поврат.",
  },
];

function linkify(text: string) {
  const parts = text.split(/(\/[a-z][a-z0-9/-]*)/g);
  return parts.map((part, i) =>
    part.startsWith("/") ? (
      <Link key={i} href={part} className="text-[#e8c97e] hover:underline">
        {part}
      </Link>
    ) : (
      part
    )
  );
}

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <p className="text-xs uppercase tracking-widest text-[#e8c97e] mb-2">FAQ</p>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Често поставувани прашања</h1>
        <p className="text-[#888]">Сè што треба да знаеш пред да купиш фотографија на Photonia</p>
      </div>

      <div className="flex flex-col gap-3">
        {FAQS.map(({ icon: Icon, q, a }, i) => (
          <details
            key={i}
            className="group bg-[#141414] border border-white/[0.08] rounded-card overflow-hidden"
          >
            <summary className="flex items-center gap-3 px-5 py-4 cursor-pointer list-none hover:bg-white/[0.02] transition-colors">
              <div className="w-9 h-9 rounded-lg bg-[#e8c97e]/10 flex items-center justify-center shrink-0">
                <Icon size={15} className="text-[#e8c97e]" />
              </div>
              <span className="flex-1 font-medium text-[#f0f0f0] text-sm">{q}</span>
              <svg
                className="w-4 h-4 text-[#888] group-open:rotate-180 transition-transform shrink-0"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-5 pb-5 pt-1 ml-12 text-sm text-[#888] leading-relaxed whitespace-pre-line">
              {linkify(a)}
            </div>
          </details>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-[#888] text-sm mb-3">Не најде одговор на твоето прашање?</p>
        <a href="mailto:info@photonia.mk" className="text-[#e8c97e] hover:underline font-medium">
          info@photonia.mk
        </a>
      </div>
    </div>
  );
}
