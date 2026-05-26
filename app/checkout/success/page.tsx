import Link from "next/link";
import { CheckCircle, Download, ShoppingBag } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-[#4caf7d]/15 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-[#4caf7d]" />
        </div>

        <h1 className="text-3xl font-bold mb-3">Плаќањето е успешно!</h1>
        <p className="text-[#888] mb-8 leading-relaxed">
          Благодариме на купувањето. Сликите се <strong className="text-[#f0f0f0]">подготвени во HD без watermark</strong>.
          На твојот email испративме <strong className="text-[#f0f0f0]">магичен линк</strong> за веднаш да ги симнеш.
        </p>

        <div className="bg-[#141414] border border-white/[0.08] rounded-card p-5 mb-8 text-left">
          <p className="text-sm text-[#f0f0f0] font-medium mb-3">📧 Што следно?</p>
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#e8c97e]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[#e8c97e] text-xs font-bold">1</span>
              </div>
              <p className="text-sm text-[#888]">
                Отвори го email-от од Photonia (провери ja и Spam папката)
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#e8c97e]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[#e8c97e] text-xs font-bold">2</span>
              </div>
              <p className="text-sm text-[#888]">
                Кликни на копчето „🔑 Најави се и преземи" — автоматски си логиран
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#e8c97e]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[#e8c97e] text-xs font-bold">3</span>
              </div>
              <p className="text-sm text-[#888]">
                Преземи ja HD сликата (важност: 48 часа, до 3 преземања)
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/account/downloads"
            className="flex-1 flex items-center justify-center gap-2 bg-[#e8c97e] text-[#0a0a0a] font-semibold py-3 rounded-card hover:bg-[#d4b46a] transition-colors"
          >
            <Download size={16} />
            Мои преземања
          </Link>
          <Link
            href="/galleries"
            className="flex-1 flex items-center justify-center gap-2 bg-white/5 text-[#f0f0f0] font-semibold py-3 rounded-card hover:bg-white/10 transition-colors border border-white/[0.08]"
          >
            <ShoppingBag size={16} />
            Продолжи со купување
          </Link>
        </div>
      </div>
    </div>
  );
}
