import Link from "next/link";
import { CheckCircle, Download, ShoppingBag } from "lucide-react";
import { ClearCart } from "@/components/checkout/ClearCart";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <ClearCart />
        <div className="w-20 h-20 rounded-full bg-[#4caf7d]/15 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-[#4caf7d]" />
        </div>

        <h1 className="text-3xl font-bold mb-3">Плаќањето е успешно!</h1>
        <p className="text-[#888] mb-8 leading-relaxed">
          Благодариме на купувањето. Сликите се{" "}
          <strong className="text-[#f0f0f0]">достапни веднаш</strong>{" "}
          во твојот профил, HD без watermark.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/account/downloads"
            className="flex-1 flex items-center justify-center gap-2 bg-[#e8c97e] text-[#0a0a0a] font-semibold py-3 rounded-card hover:bg-[#d4b46a] transition-colors"
          >
            <Download size={16} />
            Преземи сега
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
