import type { Metadata } from "next";
import localFont from "next/font/local";
import { Quicksand } from "next/font/google";
import "./globals.css";

const thankYouFont = localFont({
  src: "./fonts/thankYou.ttf",
  variable: "--font-thank-you",
});
const mansteinFont = localFont({
  src: "./fonts/manstein.ttf",
  variable: "--font-manstein",
});
const italiannoFont = localFont({
  src: "./fonts/italianno.ttf",
  variable: "--font-italianno",
});
const quicksand = Quicksand({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-quicksand",
});

export const metadata: Metadata = {
  title: "Nicolas Melo & Viviane Gennari (Melo)",
  description: "Nosso site de casamento fofuxo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${thankYouFont.variable} ${mansteinFont.variable} ${italiannoFont.variable} ${quicksand.variable}`}
    >
      <body className={`flex overflow-hidden w-screen h-screen font-quicksand`}>
        {children}
      </body>
    </html>
  );
}
