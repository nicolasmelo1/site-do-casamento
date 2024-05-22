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

export async function generateMetadata({
  searchParams,
}: {
  searchParams: {
    inviteName?: string;
  };
}): Promise<Metadata> {
  console.log("searchParams", searchParams);
  return {
    title: "Nicolas Melo & Viviane Gennari (Melo)",
    description: searchParams?.inviteName
      ? `${searchParams?.inviteName}. Nós convidamos vocês para celebrar conosco o nosso casamento no dia 28/07/2024 as 15:30 no Espaço Villa Vezzane em Mairiporã - SP`
      : "Convidamos você para celebrar conosco o nosso casamento no dia 28/07/2024 as 15:30 no Espaço Villa Vezzane em Mairiporã - SP",

    openGraph: {
      images: {
        url:
          Math.random() > 0.7
            ? "/nos-1.jpeg"
            : Math.random() > 0.5
            ? "/capa.jpeg"
            : "/nos-2.jpeg",
        width: 300,
        height: 300,
      },
    },
  };
}

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
