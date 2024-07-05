"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import { specialPersons, moreSpecialPersons } from "./special-persons";

import Confirmation from "../components/Confirmation";
import Presents from "../components/Presents";
import Carousel from "../components/Carousel";
import { WEDDING_DATE } from "./constants";
import SectionHeader from "../components/SectionHeader";

import type { getPendingPayment } from "../server/asaas/payments";
import { capitalize } from "../utils";

const LazyCountdown = dynamic(() => import("../components/Countdown"), {
  ssr: false,
});

const sections: {
  label: string;
  slug: string;
  content:
    | string
    | JSX.Element
    | ((props: {
        cookies: string;
        isDevMode: boolean;
        hasConfirmedOrNotPresence: boolean | undefined;
        paymentData: Awaited<ReturnType<typeof getPendingPayment>>;
      }) => JSX.Element);
  doNotShowHeader?: boolean;
  isSticky?: boolean;
  zIndex?: number;
  breakpoints?: {
    beforeTitle?: JSX.Element;
    betweenContentAndTitle?: JSX.Element;
    afterContent?: JSX.Element;
    beforeContainer?: JSX.Element;
    afterContainer?: JSX.Element;
  };
}[] = [
  {
    label: "Home",
    slug: "home",
    doNotShowHeader: true,
    isSticky: false,
    content: (
      <div className="flex w-full">
        <div
          className="flex  relative"
          style={{
            height: "100vh",
            width: "100vw",
            backgroundImage: `url(/capa.jpeg)`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="flex flex-1 flex-col justify-between items-center w-[100vw] h-[100vh] bg-black bg-opacity-70 md:pb-12">
            <div className="flex flex-col justify-center md:justify-between items-center w-full h-full">
              <div className="flex flex-col justify-center items-center w-72 h-72 md:w-60 md:h-60 bg-transparent relative">
                <Image
                  fill={true}
                  src="/complete-logo.svg"
                  alt="Logo do nosso casamento"
                />
              </div>
              <h2
                className="text-white font-thankYou"
                style={{
                  fontSize: "1.5rem",
                }}
              >
                {capitalize(
                  new Intl.DateTimeFormat("pt-BR", {
                    dateStyle: "full",
                  }).format(WEDDING_DATE)
                )}
              </h2>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    label: "Contagem Regressiva",
    slug: "o-casamento",
    isSticky: false,
    breakpoints: {
      beforeTitle: <SectionHeader />,
    },
    content: () => (
      <Fragment>
        <LazyCountdown />
        <div className={`flex flex-col justify-center items-center w-80`}>
          {(
            "Queridos familiares e amigos, criamos esse site para compartilhar com vocês os detalhes da organização do nosso casamento.\n" +
            "Estamos muito felizes e contamos com a presença de todos no nosso grande e sonhado dia!\n" +
            "Se você foi convidado, saiba que fazemos questão da sua presença para brindarmos juntos!\n" +
            "Caso tenham alguma dúvida sobre horário e localização, fizemos um resumo em Cerimônia & Recepção para facilitar.\n" +
            "Para nos presentear, escolha qualquer item da Lista de Presentes. Fiquem à vontade!\n" +
            "Aguardamos vocês no nosso grande dia!"
          )
            .split("\n")
            .map((paragraph) => (
              <p
                key={paragraph}
                className="flex w-full justify-center text-justify text-2xlr mt-6 md:mt-3"
              >
                {paragraph}
              </p>
            ))}
        </div>
      </Fragment>
    ),
  },
  {
    label: "Nossa história",
    slug: "nossa-historia",
    isSticky: false,
    content: () => (
      <Fragment>
        <div
          className={`flex flex-col justify-center items-center w-80 max-w-lg italic`}
        >
          <p className="text-center">
            {`"E a vida, tão generosa comigo\nveio de amigo a amigo\nme apresentar a você"`}
          </p>
        </div>
        <div className={`flex flex-col justify-center items-center w-80`}>
          {(
            `É engraçado como as coisas acontecem na vida, na hora parecem aleatórias e pequenas, mas coisas pequenas e (não tão aleatórias assim), podem mudar completamente o rumo da nossa vida e trazer um novo significado para tudo o que antes nem existia.\n` +
            `E assim é a nossa história, despretensiosa, leve e uma linda surpresa da vida! ` +
            `Se lá em 2015 nos contassem que iríamos nos casar, muito provavelmente não acreditaríamos, mas essa é a graça da vida, ela sempre nos surpreende.\n` +
            `Ainda bem que o Nicolas de 2015 insistiu para a "amiga do amigo" aceitar sair com ele, e ainda bem que a "amiga do amigo" aceitou rsrs. Já são quase 9 anos de muito amor, companheirismo, parceria e trabalho em equipe para que, dia após dia, a construção da nossa história seja cada vez mais sólida.\n` +
            `Estamos muito ansiosos para o nosso grande, sonhado, planejado e amado dia que irá concretizar a nossa união e dar início a nossa nova família!`
          )
            .split("\n")
            .map((paragraph) => (
              <p
                key={paragraph}
                className="flex w-full justify-center text-justify text-2xlr mt-6 md:mt-3"
              >
                {paragraph}
              </p>
            ))}
        </div>
      </Fragment>
    ),
    breakpoints: {
      beforeTitle: <SectionHeader />,
      betweenContentAndTitle: (
        <div className="flex w-[20vw] h-[30vw] min-w-64 min-h-96 p-3 rounded-md">
          <div className="flex relative w-full h-full">
            <Image
              fill={true}
              src="/primeira-foto.jpeg"
              alt="Picture of the author"
              className="w-full h-auto"
            />
          </div>
        </div>
      ),
      afterContainer: (
        <div
          className="flex justify-center items-center w-full bg-white"
          style={{ zIndex: 20 }}
        >
          <div className="flex flex-row" style={{ maxWidth: 800 }}>
            <Carousel
              images={[
                {
                  src: "/carousel/argentina.jpeg",
                  alt: "Nós dois juntos na Argentina",
                },
                {
                  src: "/carousel/rildi.jpeg",
                  alt: "Nós dois juntos no RJ",
                },
                {
                  src: "/carousel/argentina-3.jpeg",
                  alt: "Nós dois juntos na Argentina outra vez",
                },
                {
                  src: "/carousel/argentina-4.jpeg",
                  alt: "Nós dois juntos na Argentina de novo",
                },
                {
                  src: "/carousel/argentina-2.jpeg",
                  alt: "A gente ama a argentina",
                },
              ]}
            />
          </div>
        </div>
      ),
    },
  },
  {
    label: "Mães, Pais e Dama de Honra",
    slug: "mae-pai-dama-de-honra",
    isSticky: false,
    content: (
      <div className="flex flex-row flex-wrap justify-center items-center w-screen max-w-6xl">
        {moreSpecialPersons.map((moreSpecialPerson) => (
          <div
            key={moreSpecialPerson.name}
            className="flex justify-center flex-col flex-wrap mt-2"
          >
            <div className="p-6 relative ml-[1vw] mr-[1vw] w-[22vw] max-w-60 h-[22vw] max-h-60 min-w-32 min-h-32 rounded-full bg-black">
              <Image
                src={moreSpecialPerson.photo}
                alt="Picture of the author"
                className="w-full h-auto rounded-full"
                fill={true}
                objectFit="contain"
                sizes="20vw 20vw"
              />
            </div>
            <p className="font-bold text-gray-400 w-full mt-2 text-center ">
              {moreSpecialPerson.name}
            </p>
            <small className="text-gray-400 text-center">
              {moreSpecialPerson.role}
            </small>
          </div>
        ))}
      </div>
    ),
    breakpoints: {
      beforeTitle: <SectionHeader />,
    },
  },
  {
    label: "Padrinhos e Madrinhas",
    slug: "padrinhos-e-madrinhas",
    isSticky: false,
    content: (
      <div className="flex flex-row flex-wrap justify-center items-center w-screen max-w-6xl">
        {specialPersons.map((specialPerson) => (
          <div
            key={specialPerson.name}
            className="flex justify-center flex-col flex-wrap mt-2"
          >
            <div className="p-6 relative ml-[1vw] mr-[1vw] w-[22vw] max-w-60 h-[22vw] max-h-60 min-w-32 min-h-32 rounded-full bg-black">
              <Image
                src={specialPerson.photo}
                alt="Picture of the author"
                className="w-full h-auto rounded-full"
                fill={true}
                objectFit="contain"
                sizes="20vw 20vw"
              />
            </div>
            <p className="font-bold text-gray-400 w-full mt-2 text-center ">
              {specialPerson.name}
            </p>
          </div>
        ))}
      </div>
    ),
    breakpoints: {
      beforeTitle: <SectionHeader />,
    },
  },
  {
    label: "Cerimônia & Recepção",
    slug: "endereco",
    isSticky: false,
    zIndex: 4,
    content: function Address() {
      const [width, setWidth] = useState<number>(0);
      const isOnServer = typeof window === "undefined";

      useEffect(() => {
        const handleResize = () => {
          setWidth(document.body.offsetWidth);
        };

        window.addEventListener("resize", handleResize);
        return () => {
          window.removeEventListener("resize", handleResize);
        };
      }, []);

      useEffect(() => {
        console.log("aqi", document.body.offsetWidth);
        setWidth(document.body.offsetWidth);
      }, [isOnServer]);

      return (
        <Fragment>
          <div>
            <p className="w-full">
              {capitalize(
                new Intl.DateTimeFormat("pt-BR", {
                  day: "numeric",
                  dayPeriod: "long",
                  hour: "numeric",
                  minute: "numeric",
                  weekday: "long",
                  month: "long",
                }).format(WEDDING_DATE)
              )}
            </p>
          </div>
          <iframe
            style={{
              border: 0,
              marginTop: 24,
              width: width > 384 ? 384 : width - 10,
              height: width > 384 ? 384 : width - 10,
            }}
            title="Villa Vezzane, Mairiporã SP"
            allowFullScreen={true}
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed/v1/place?key=AIzaSyANcu9m5u73d9IwIHVBTctJDN6aTkxloPo&q=Villa+Vezzane,Mairiporã+SP"
          />
          <div className="mt-3 w-96 h-96 relative rounded-sm overflow-hidden">
            <Image
              src="/local.jpeg"
              alt="Local do casamento"
              className="w-full h-auto"
              fill={true}
            />
          </div>
        </Fragment>
      );
    },
    breakpoints: {
      beforeTitle: <SectionHeader />,
    },
  },
  {
    label: "Dress Code",
    slug: "dress-code",
    isSticky: false,
    content: () => (
      <Fragment>
        <div className={`flex flex-col justify-center items-center w-80`}>
          <p>
            {
              "Queridos convidados, fiquem a vontade para usarem roupas no traje esporte fino. O importante é você se sentir bem e confortável para aproveitar a festa com a gente!"
            }
          </p>
        </div>
        <div className="mt-3 w-96 h-64 relative rounded-sm overflow-hidden">
          <Image
            src="/dress-code.png"
            alt="Dress Code"
            className="w-full h-auto"
            fill={true}
          />
        </div>
      </Fragment>
    ),
    breakpoints: {
      beforeTitle: <SectionHeader />,
    },
  },
  {
    label: "Confirme sua presença",
    slug: "confirme-sua-presenca",
    isSticky: false,
    zIndex: 4,
    content: ({ cookies, hasConfirmedOrNotPresence }) => (
      <Confirmation
        cookies={cookies}
        hasConfirmedOrNotPresence={hasConfirmedOrNotPresence}
      />
    ),
    breakpoints: {
      beforeTitle: <SectionHeader />,
    },
  },
  {
    label: "Presentes",
    slug: "presentes",
    isSticky: false,
    zIndex: 4,
    content: ({ cookies, paymentData, isDevMode }) => (
      <Presents
        cookies={cookies}
        paymentData={paymentData}
        isDevMode={isDevMode}
      />
    ),
    breakpoints: {
      beforeTitle: <SectionHeader />,
    },
  },
];

export default sections;
