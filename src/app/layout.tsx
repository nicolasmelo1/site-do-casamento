import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const thankYouFont = localFont({
  src: "./fonts/thankYou.ttf",
  variable: "--font-thank-you",
});
const mansteinFont = localFont({
  src: "./fonts/manstein.ttf",
  variable: "--font-manstein",
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
      className={`${thankYouFont.variable} ${mansteinFont.variable}`}
    >
      <body className={`flex overflow-hidden w-screen h-screen`}>
        {children}
      </body>
    </html>
  );
}
