"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import specialPersons from "./special-persons";

import Confirmation from "../components/Confirmation";
import Presents from "../components/Presents";
import Carousel from "../components/Carousel";
import { WEDDING_DATE } from "./constants";
import SectionHeader from "../components/SectionHeader";

import type { getPendingPayment } from "../server/asaas/payments";

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
          <div className="flex flex-1 flex-col justify-between items-center w-[100vw] h-[100vh] bg-black bg-opacity-50 md:pb-12">
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
                {new Intl.DateTimeFormat("pt-BR", { dateStyle: "full" })
                  .format(WEDDING_DATE)[0]
                  .toUpperCase() +
                  new Intl.DateTimeFormat("pt-BR", { dateStyle: "full" })
                    .format(WEDDING_DATE)
                    .slice(1)}
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
        <div
          className={`flex flex-col justify-center items-center min-w-96 max-w-lg`}
        >
          {(
            "Criamos esse site para compartilhar com vocês os detalhes da organização do nosso casamento\n" +
            "Estamos muito felizes e contamos com a presença de todos no nosso grande dia!\n" +
            "Se você foi convidado, saiba que fazemos questão da sua presença para brindarmos juntos!\n\n" +
            "Caso tenham alguma dúvida sobre horário e localização, fizemos um resumo em Cerimônia & Recepção para facilitar.\n\n" +
            "Para nos presentear, escolha qualquer item da Lista de Presentes. Fiquem à vontade!\n\n" +
            "Aguardamos vocês no nosso grande dia!"
          )
            /* "Queridos amigos e familiares, estamos muito felizes por vocês estarem aqui.\nSe vocês estão aqui é porque vocês provavelmente já sabem, mas: ESTAMOS NOS CASANDO! (morar junto não é casar)\n" +
            "Nosso casamento vai ser no dia 28 de Julho de 2024 em Mairiporã, São Paulo. A cerimônia vai começar às 16:00 e a festa vai até o último convidado ir embora. (Não é mas o noivo paga kkkkk)\n" +
            "Aqui nesse site vamos deixar todas as informações sobre o casamento, como chegar, onde se hospedar caso precise e outras informações úteis.\n" +
            "Também vamos deixar aqui a lista de presentes, caso vocês queiram nos presentear. Não é obrigatório, mas é. Da um presentinho ai pô!\n" +
            "No finalzinho do site tem um formulário para confirmar a presença, por favor, preencha caso você for para que possamos deixar tudo organizadinho ❤\n" +
            "A contagem regressiva já começou e estamos muito ansiosos para compartilhar esse dia tão especial para nós com todos vocês."*/
            .split("\n")
            .map((paragraph) => (
              <p
                key={paragraph}
                className="flex w-full justify-center text-2xlr mt-6 md:mt-3"
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
    content:
      "É bem engraçado como as coisas acontecem na vida, na hora parecem tão aleatórias e pequenas e as pequenas coisas mudam completamente o rumo da nossa vida.\n" +
      "Essa história começa com um menino e com uma menina. O menino e a menina se conheceram a partir de um grupo de amigos que estavam lá no Shopping Center 3 da Paulista. " +
      "O amigo do menino falou: \n - Vem aqui, ta eu, um amigo e dois amigos que você não conhece.\n" +
      "O menino sai de casa, sem esperar muito o que encontrar aquele dia. Chegando lá, ele encontra seus amigos e para sua surpresa, encontra duas pessoas novas que não tinha visto antes. " +
      "O amigo do menino apresenta a menina para o menino e os dois se conhecem. Um dia normal, como qualquer outro, mas que mudou a vida dos dois para sempre.\n" +
      "Olhando para trás o menino percebe que tudo foi como tinha que ser. Aquele mesmo dia em que se encontraram, o menino ganhou uma camisa em uma promoção que estava acontecendo no Shopping. Sem pensar duas vezes, " +
      "o menino ofereceu sua camisa para a menina. Ainda no mesmo dia, ambos iriam se encontrar em uma festa que aconteceria mais tarde. A menina, com fome, pediu ao menino para que levasse algo para ela. " +
      "Sem pensar duas vezes o menino comprou uma caixa do Habibs contendo algumas esfihas para a menina. E conversaram e conversaram durante longos momentos durante a festa.\n" +
      "Houveram outras festas, outros encontros. Sem explicação a vontade da menina de estar com o menino era muito grande. E o menino, sem explicação, sentia o mesmo. " +
      "Eles se encontravam, conversavam, riam, se divertiam. Eles se gostavam. Eles se amavam... Só não sabiam ainda.\n" +
      "Não houveram ocasiões onde os dois se beijaram. Eles só queriam estar juntos, rir, compartilhar os momentos juntos. Quando finalmente aconteceu, por incrivel que pareça, foi bem questionável" +
      " (mas deixa que a noiva conta essa história).\n" +
      "Durante algum tempo, os dois ficaram sem se falar. Mas o destino, ou o acaso, ou o que quer que seja, fez com que os dois se reencontrassem novamente e começassem a se falar por causa de uma mensagem mandada errôneamente no falecido aplicativo Snapchat." +
      " A partir dai, o resto é história. Namoraram por 7 anos, noivaram e agora vocês estão lendo essa singela história nesse site feito para o casamento deles.",
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
    label: "Endereço",
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
        <iframe
          style={{
            border: 0,
            marginTop: 24,
            width: width > 600 ? 600 : width - 10,
            height: width > 600 ? 600 : width - 10,
          }}
          title="Villa Vezzane, Mairiporã SP"
          allowFullScreen={true}
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps/embed/v1/place?key=AIzaSyANcu9m5u73d9IwIHVBTctJDN6aTkxloPo&q=Villa+Vezzane,Mairiporã+SP"
        />
      );
    },
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
