import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, Download, Shield, CreditCard, FileImage, Mail, UserX, Scale, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Често поставувани прашања — Photonia",
  description: "Сè што треба да знаеш пред да купиш слика на Photonia",
};

const FAQS = [
  {
    icon: FileImage,
    q: "Што добивам кога купувам слика?",
    a: "Добиваш оригинална HD фотографија без watermark, во целосна резолуција (обично над 4000 пиксели по долгата страна). Сликата се испраќа как дигитално преземање во JPG формат, со вграден sRGB профил на бои. Нема физичка испорака.",
  },
  {
    icon: Shield,
    q: "Која е разликата помеѓу Личната и Комерцијалната лиценца?",
    a: "Личната лиценца е за приватна, некомерцијална употреба: печатиш за себе, ставаш во рамка, ја користиш на личен профил без спонзорски контекст.\n\nКомерцијалната лиценца е за бизнис употреба: веб страница, маркетинг материјали, прес соопштенија, огласи.\n\nОбете лиценци забрануваат препродажба, употреба за обука на вештачка интелигенција и употреба во NFT контекст.\n\nДетаљни услови на /legal/license.",
  },
  {
    icon: Scale,
    q: "Што значи ознаката Editorial Only?",
    a: "Фотографиите со ознаката Editorial Only содржат препознатливи лица снимени на јавни настани без индивидуална писмена согласност. Дури и со Комерцијална лиценца, ваквите слики не смеат да се употребат во реклами кои имплицираат дека прикажаното лице го одобрува производот или услугата, во политичка пропаганда без согласност, или во контекст кој ја нарушува репутацијата на лицето.\n\nПодетално на /legal/editorial-notice.",
  },
  {
    icon: Download,
    q: "Како ја преземам сликата?",
    a: "По плаќањето добиваш е-пошта со потврда. Влезеш во профилот преку magic link и одиш на Мои преземања. Линкот за преземање важи 365 дена и дозволува до 3 преземања. Зачувај ја сликата локално веднаш по преземање.",
  },
  {
    icon: CreditCard,
    q: "Kako да платам?",
    a: "Плаќањето е безбедно преку LemonSqueezy, сертифициран платежен процесор. Прифаќаме Visa, Mastercard и AmEx. Цените се прикажани во евра.",
  },
  {
    icon: Mail,
    q: "Не сум добил е-пошта со потврда, што да правам?",
    a: "Прво провери ја папката Нежелена пошта (Spam). Ако нема, оди на страницата за magic link, внеси ја е-поштата со која си платил и ќе добиеш нов линк. За дополнителна помош: support@photonia.mk.",
  },
  {
    icon: CheckCircle,
    q: "Мора ли да се регистрирам за да купам?",
    a: "Не. Можеш да купуваш без претходна регистрација. Внесуваш е-пошта при плаќање и профилот автоматски се создава. За пристап до купените слики, влезеш преку magic link без лозинка.",
  },
  {
    icon: UserX,
    q: "Јас сум на сликата и не сакам да се продава. Што можам да направам?",
    a: "Имате право да поднесете барање за бришење на сликата согласно членот 16 и членот 21 од Законот за заштита на личните податоци. Испратете барање на privacy@photonia.mk со опис на сликата. Одговараме во рок од 7 работни дена. Детална постапка на /legal/takedown.",
  },
  {
    icon: FileImage,
    q: "Дали можам да ја купам сликата ако јас сум на неа?",
    a: "Да. Ако се препознаваш на слика и сакаш да ја имаш, можеш да ја купиш по редовна цена. При купување, исто важат условите на лиценцата. Доколку сакаш сликата да биде отстранета наместо да ја купиш, постапи преку процедурата за бришење.",
  },
  {
    icon: Info,
    q: "Кои се техничките спецификации на сликите?",
    a: "Сликите се испорачуваат во JPG формат, оригинална резолуција (типично 4000 до 6000 пиксели по долгата страна), бојна профил sRGB, соодветни за печат до A2 формат при 300 DPI, и за сите дигитални употреби. Watermarkот е отстранет на оригиналот кој го преземаш.",
  },
  {
    icon: Shield,
    q: "Дали можам да барам поврат на средства?",
    a: "Бидејќи се работи за дигитален производ испорачан веднаш по плаќање, и бидејќи при купување изречно ги прифаќаш условите за одрекување од правото на одустанок, поврат по преземање не е можен. Исклучок: ако линкот не функционирал поради техничка грешка на наша страна, контактирај support@photonia.mk во рок од 72 часа. Детали на /legal/refund.",
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
        <p className="text-[#888]">Сè што треба да знаеш пред да купиш слика на Photonia</p>
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
