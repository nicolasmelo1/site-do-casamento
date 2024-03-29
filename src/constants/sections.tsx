"use client";

import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import specialPersons from "./special-persons";

import type { getPendingPayment } from "../server/asaas/payments";
import Confirmation from "../components/Confirmation";
import Presents from "../components/Presents";
import Countdown from "../components/Countdown";
import Carousel from "../components/Carousel";

const sections: {
  label: string;
  slug: string;
  content:
    | string
    | JSX.Element
    | ((props: {
        cookies: string;
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
      <div className="flex justify-center items-center w-full">
        <div
          className="flex w-full relative"
          style={{
            height: "100vh",
            width: "100vw",
            backgroundAttachment: "fixed",
            backgroundImage: `url(/nos-3.jpeg)`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div
            className="flex flex-col justify-center items-center w-full h-full bg-black bg-opacity-50"
            style={{ zIndex: 10 }}
          >
            <h1
              className="font-bold font-thankYou text-white text-center"
              style={{
                fontSize: "3rem",
              }}
            >
              Viviane e Nicolas
            </h1>
            <h2
              className="text-white font-thankYou"
              style={{
                fontSize: "1.5rem",
              }}
            >
              28/07/2024
            </h2>
          </div>
        </div>
      </div>
    ),
  },
  {
    label: "Contagem Regressiva",
    slug: "o-casamento",
    isSticky: true,
    content: () => (
      <Fragment>
        <Countdown />
        <div
          className={`flex flex-col justify-center items-center min-w-96 max-w-lg`}
        >
          {(
            "Queridos amigos e familiares, estamos muito felizes por vocês estarem aqui.\nSe vocês estão aqui é porque vocês provavelmente já sabem, mas: ESTAMOS NOS CASANDO! (morar junto não é casar)\n" +
            "Nosso casamento vai ser no dia 28 de Julho de 2024 em Mairiporã, São Paulo. A cerimônia vai começar às 16:00 e a festa vai até o último convidado ir embora. (Não é mas o noivo paga kkkkk)\n" +
            "Aqui nesse site vamos deixar todas as informações sobre o casamento, como chegar, onde se hospedar caso precise e outras informações úteis.\n" +
            "Também vamos deixar aqui a lista de presentes, caso vocês queiram nos presentear. Não é obrigatório, mas é. Da um presentinho ai pô!\n" +
            "No finalzinho do site tem um formulário para confirmar a presença, por favor, preencha caso você for para que possamos deixar tudo organizadinho ❤\n" +
            "A contagem regressiva já começou e estamos muito ansiosos para compartilhar esse dia tão especial para nós com todos vocês."
          )
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
    breakpoints: {
      afterContainer: (
        <div className="flex flex-col" style={{ zIndex: 10 }}>
          <div className="flex justify-center items-center w-full">
            <div
              className="flex w-full relative"
              style={{
                height: "50vh",
                backgroundAttachment: "fixed",
                backgroundImage: `url(/nos-1.jpeg)`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            />
          </div>
          <div className="flex h-4 bg-white relative" />
          <div className="flex justify-center items-center w-full">
            <div
              className="flex w-full relative"
              style={{
                height: "50vh",
                backgroundAttachment: "fixed",
                backgroundImage: `url(/nos-2.png)`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
            />
          </div>
        </div>
      ),
    },
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
      betweenContentAndTitle: (
        <div className="flex min-w-96 h-96 p-3 border-red-400 border-2 rounded-md">
          <div className="flex relative w-full h-full">
            <Image
              fill={true}
              src="/uniao.png"
              sizes="100vw 50vh"
              style={{}}
              objectFit="cover"
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
                  src: "/nos-3.jpeg",
                  alt: "Nós dois juntos no RJ",
                },
                {
                  src: "/nos-3.jpeg",
                  alt: "Nós dois juntos no RJ",
                },
                {
                  src: "/nos-3.jpeg",
                  alt: "Nós dois juntos no RJ",
                },
                {
                  src: "/nos-3.jpeg",
                  alt: "Nós dois juntos no RJ",
                },
              ]}
            />
          </div>
        </div>
      ) /*(
        <div
          className="flex justify-center items-start w-full p-6 bg-white"
          style={{ zIndex: 10 }}
        >
          <div
            className="flex p-3 border-red-400 border-2 rounded-md min-w-96 min-h-96"
            style={{
              width: "50vw",
              height: "50vw",
            }}
          >
            <div className="flex relative w-full h-full">
              <Image
                fill={true}
                src="/nos-3.jpeg"
                sizes="100vw 50vh"
                style={{}}
                objectFit="cover"
                alt="Picture of the author"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      )*/,
    },
  },
  {
    label: "Padrinhos e Madrinhas",
    slug: "padrinhos-e-madrinhas",
    isSticky: true,
    content: (
      <div className="flex flex-row flex-wrap justify-center items-center w-screen max-w-6xl">
        {specialPersons.map((specialPerson) => (
          <div
            key={specialPerson.name}
            className="flex justify-center flex-col flex-wrap mt-2"
          >
            <div
              className="p-6 relative"
              style={{
                marginLeft: "1vw",
                marginRight: "1vw",
                width: "22vw",
                height: "22vw",
              }}
            >
              <Image
                src={specialPerson.photo}
                alt="Picture of the author"
                className="w-full h-auto rounded-tl-full rounded-tr-full border-red-400 p-1"
                style={{
                  borderWidth: "2px",
                  borderRadius: "50%",
                  padding: "0.50rem",
                }}
                fill={true}
                objectFit="cover"
                sizes="20vw 20vw"
              />
            </div>
            <p className="font-bold text-red-400 w-full mt-2 text-center ">
              {specialPerson.name}
            </p>
          </div>
        ))}
      </div>
    ),
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
  },
  {
    label: "Confirme sua presença no evento do ano!",
    slug: "confirme-sua-presenca",
    isSticky: false,
    zIndex: 4,
    content: ({ cookies, hasConfirmedOrNotPresence }) => (
      <Confirmation
        cookies={cookies}
        hasConfirmedOrNotPresence={hasConfirmedOrNotPresence}
      />
    ),
  },
  {
    label: "Presentes",
    slug: "presentes",
    isSticky: false,
    zIndex: 4,
    content: ({ cookies, paymentData }) => (
      <Presents cookies={cookies} paymentData={paymentData} />
    ),
  },
];

export default sections;
