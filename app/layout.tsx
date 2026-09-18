import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import InkFilter from "@/components/InkFilter";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const siteUrl = "https://diario-ludico.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Diário Lúdico da Realidade Paralela",
  description:
    "Um livro de poesia digital e interativo — três poemas para explorar como constelações, sons e memórias.",
  openGraph: {
    title: "Diário Lúdico da Realidade Paralela",
    description:
      "Um livro de poesia digital e interativo — três poemas para explorar como constelações, sons e memórias.",
    images: ["/assets/images/poema3.png"],
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Diário Lúdico da Realidade Paralela",
    description:
      "Um livro de poesia digital e interativo — três poemas para explorar como constelações, sons e memórias.",
    images: ["/assets/images/poema3.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#06040f] text-[#f0ecff]">
        <InkFilter />
        {children}
      </body>
    </html>
  );
}
