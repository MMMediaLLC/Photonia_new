import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import { Toaster } from "@/components/ui/Toaster";
import CookieBanner from "@/components/ui/CookieBanner";

const inter = Inter({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Photonia — Платформа за дигитални фотографии",
    template: "%s | Photonia",
  },
  description:
    "Купи уникатни фотографии директно од македонски фотографи. Лична и комерцијална лиценца — HD без воден жиг.",
  keywords: ["фотографии", "купи фото", "македонски фотографи", "фото пазар"],
  openGraph: {
    type: "website",
    locale: "mk_MK",
    siteName: "Photonia",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mk" className={inter.variable}>
      <body className="antialiased font-sans">
        <CartProvider>
          {children}
          <Toaster />
          <CookieBanner />
        </CartProvider>
      </body>
    </html>
  );
}
