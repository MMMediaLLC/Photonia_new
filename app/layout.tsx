import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import { Toaster } from "@/components/ui/Toaster";

export const metadata: Metadata = {
  title: {
    default: "Photonia — Фото Пазар",
    template: "%s | Photonia",
  },
  description:
    "Купи уникатни фотографии директно од македонски фотографи. Лични, комерцијални и проширени лиценци.",
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
    <html lang="mk">
      <body className="antialiased">
        <CartProvider>
          {children}
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
