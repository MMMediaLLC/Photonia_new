import type { Metadata } from "next";
import { CheckCircle, Download, Shield, CreditCard, FileImage, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Често поставувани прашања — Photonia",
  description: "Сè што треба да знаеш пред да купиш слика на Photonia",
};

const FAQS = [
  {
    icon: FileImage,
    q: "Што добивам кога купувам слика?",
    a: "Добиваш оригинална HD фотографија без watermark, во висока резолуција. Сликата се испраќа како дигитално преземање (JPG) — нема физичка испорака.",
  },
  {
    icon: Shield,
    q: "Која е разликата помеѓу трите лиценци?",
    a: "Лична лиценца — за приватна употреба (печатиш за себе, ставаш во рамка, личен профил на социјални мрежи).\n\nКомерцијална лиценца — за бизнис употреба (веб-страна, реклама, маркетинг материјал, печатени производи).\n\nПроширена лиценца — неограничена употреба, вклучително препродажба на производи каде сликата е дел (магацини, печатени производи во низа).",
  },
  {
    icon: Download,
    q: "Како ја симнувам сликата?",
    a: "По плаќањето примаш email со магичен линк. Кликнеш — автоматски си најавен. Одиш на „Мои преземања" и кликнеш на „Преземи". Линкот важи 48 часа и може да се користи до 3 пати.",
  },
  {
    icon: CreditCard,
    q: "Како да платам?",
    a: "Плаќањето е безбедно преку LemonSqueezy — глобално признат payment processor. Прифаќаме сите големи картички (Visa, Mastercard, AmEx) и PayPal. Цените се во македонски денари (МКД).",
  },
  {
    icon: Mail,
    q: "Не сум добил email — што да правам?",
    a: "Прво провери ja Spam папката (особено ако користиш Gmail/Outlook). Ако пак нема — оди на /magic-link, внеси го email-от со кој си платил, ќе ти стасa нов линк. Ако имaш проблем, контактирaj на info@photonia.mk.",
  },
  {
    icon: CheckCircle,
    q: "Мора ли да се регистрирам?",
    a: "Не. Можеш да купуваш како гост — само внесуваш email и картичка при плаќање. Профил автоматски се создaдa со твојот email, за лесен пристап до сликите. Не треба ни лозинка — користи магичен линк секогаш кога ќе ти треба.",
  },
  {
    icon: Shield,
    q: "Дали можам да барам поврат на пари?",
    a: "Бидejќи се работи за дигитален продукт кој веднаш се испорачува, поврат не е возможен после преземање. Ако имаш технички проблем со симнување (фajлот е оштетен, не може да се отвори), контактирaj не во 48 часа и ќе решиме.",
  },
  {
    icon: FileImage,
    q: "Колкава е резолуцијата на сликите?",
    a: "Сликите се во оригинална резолуција (обично 4000×3000 пиксели или повеќе). Соодветно за печат до A2 формат, веб-употреба, и професионални медиумски материјали.",
  },
];

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <p className="text-xs uppercase tracking-widest text-[#e8c97e] mb-2">FAQ</p>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Често поставувани прашања</h1>
        <p className="text-[#888]">
          Сè што треба да знаеш пред да купиш слика на Photonia
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {FAQS.map(({ icon: Icon, q, a }, i) => (
          <details
            key={i}
            className="group bg-[#141414] border border-white/[0.08] rounded-card overflow-hidden"
          >
            <summary className="flex items-center gap-3 px-5 py-4 cursor-pointer list-none hover:bg-white/[0.02] transition-colors">
              <div className="w-9 h-9 rounded-lg bg-[#e8c97e]/10 flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-[#e8c97e]" />
              </div>
              <span className="flex-1 font-medium text-[#f0f0f0]">{q}</span>
              <svg
                className="w-4 h-4 text-[#888] group-open:rotate-180 transition-transform flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-5 pb-5 pt-1 ml-12 text-sm text-[#888] leading-relaxed whitespace-pre-line">
              {a}
            </div>
          </details>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-[#888] text-sm mb-3">Не најде одговор на твоето прашање?</p>
        <a
          href="mailto:info@photonia.mk"
          className="text-[#e8c97e] hover:underline font-medium"
        >
          info@photonia.mk
        </a>
      </div>
    </div>
  );
}
