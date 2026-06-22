import type { Metadata } from "next";
import Link from "next/link";
import { Camera, FileText, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "За нас — Photonia",
  description: "M&M Фото и приказната зад Photonia.mk",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="mb-12">
        <p className="text-xs uppercase tracking-widest text-[#e8c97e] mb-3">За нас</p>
        <h1 className="text-3xl sm:text-4xl font-bold mb-5">M&M Фото</h1>
        <p className="text-lg text-[#888] leading-relaxed">
          Фотографска работа посветена на документирање на македонската стварност, настан по настан.
        </p>
      </div>

      <div className="prose-like flex flex-col gap-6 text-[#ccc] leading-relaxed mb-14">
        <p>
          M&M Фото е фотографски проект на M&M Media со фокус на новинарска и документарна
          фотографија во Република Македонија. Работата се состои од присуство на јавни настани,
          политички собири, спортски натпревари, општествени движења и културни манифестации,
          со цел создавање на визуелен архив на македонскиот јавен живот.
        </p>
        <p>
          Секоја фотографија е оригинална, снимена лично, без обработка која го менува
          фактичкиот контекст. Целта е документарна точност и естетска вредност истовремено.
          Сликите раскажуваат приказни кои вреди да се зачуваат.
        </p>
        <p>
          Photonia.mk е официјалната онлајн продавница на M&M Media DOOEL Gostivar за тие фотографии.
          Сите дела се оригинална сопственост на фирмата. Наместо да останат во архива,
          фотографиите стануваат достапни за купување со лична или комерцијална лиценца.
          Редакциите, медиумите, агенциите и поединците можат да пристапат до оригинали
          во HD резолуција, веднаш по плаќање, без претплата.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-14">
        {[
          {
            icon: Camera,
            title: "Документарна фотографија",
            desc: "Јавни настани, политика, спорт, култура. Снимки кои го отсликуваат македонскиот јавен живот.",
          },
          {
            icon: FileText,
            title: "Editorial стандарди",
            desc: "Сите фотографии со препознатливи лица се означени со Editorial Only и имаат соодветни ограничувања за употреба.",
          },
          {
            icon: Globe,
            title: "Поврзаност со медиумите",
            desc: "M&M Media е издавач на gostivarpress.mk, локален информативен портал со долгогодишна медиумска традиција.",
          },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-[#141414] border border-white/[0.08] rounded-card p-5">
            <div className="w-9 h-9 rounded-lg bg-[#e8c97e]/10 flex items-center justify-center mb-3">
              <Icon size={16} className="text-[#e8c97e]" />
            </div>
            <p className="font-semibold text-[#f0f0f0] mb-2">{title}</p>
            <p className="text-sm text-[#888] leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      <div className="border border-white/[0.08] rounded-card p-6 mb-10">
        <h2 className="text-lg font-semibold text-[#f0f0f0] mb-3">Принципи на работа</h2>
        <ul className="flex flex-col gap-3 text-sm text-[#ccc]">
          {[
            "Сите фотографии се оригинални авторски дела на M&M Фото.",
            "Не се врши дигитална манипулација која го менува фактичкиот контекст на фотографијата.",
            "Фотографиите со препознатливи лица се продаваат исклучиво за editorial употреба.",
            "Авторските права остануваат кај M&M Media при секоја продажба.",
            "Секое лице прикажано на фотографија може да поднесе барање за бришење.",
          ].map((item, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-[#e8c97e] shrink-0 mt-0.5">&#8250;</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="text-sm text-[#888] space-y-2">
        <p>
          За прашања и соработка:{" "}
          <a href="mailto:info@photonia.mk" className="text-[#e8c97e] hover:underline">
            info@photonia.mk
          </a>
        </p>
        <p>
          За медиуми и press пакети:{" "}
          <Link href="/press" className="text-[#e8c97e] hover:underline">
            Прес пакети
          </Link>
        </p>
        <p>
          Правни документи:{" "}
          <Link href="/legal/terms" className="text-[#e8c97e] hover:underline">
            Услови за користење
          </Link>
        </p>
      </div>
    </div>
  );
}
