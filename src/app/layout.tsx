import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="pt-BR">
      <body
        className={inter.className + " flex overflow-hidden w-screen h-screen"}
      >
        {children}
      </body>
    </html>
  );
}
