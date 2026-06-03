import Link from "next/link";
import { CheckCircle, Mail, ShoppingBag } from "lucide-react";
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
        <p className="text-[#888] mb-3 leading-relaxed">
          Благодариме на купувањето. Линковите за преземање ќе ти бидат испратени на твојата
          е-пошта во наредните минути.
        </p>
        <p className="text-[#555] text-sm mb-8 leading-relaxed">
          Ако мејлот не пристигне, провери ја Spam папката или пиши ни на{" "}
          <a href="mailto:support@photonia.mk" className="text-[#888] hover:text-[#e8c97e]">
            support@photonia.mk
          </a>
          .
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="mailto:"
            className="flex-1 flex items-center justify-center gap-2 bg-[#e8c97e] text-[#0a0a0a] font-semibold py-3 rounded-card hover:bg-[#d4b46a] transition-colors"
          >
            <Mail size={16} />
            Отвори е-пошта
          </a>
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
