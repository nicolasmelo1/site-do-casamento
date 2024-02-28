"use client";

import Image from "next/image";

import specialPersons from "./special-persons";

import type { getPendingPayment } from "../server/asaas/payments";
import Confirmation from "../components/Confirmation";
import Presents from "../components/Presents";

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
    label: "O Grande dia ta ai!",
    slug: "o-casamento",
    isSticky: true,
    content:
      "Queridos amigos e familiares, estamos muito felizes por vocês estarem aqui.\nSe vocês estão aqui é porque vocês provavelmente já sabem, mas: ESTAMOS NOS CASANDO! (morar junto não é casar)\n" +
      "Nosso casamento vai ser no dia 28 de Julho de 2024 em Mairiporã, São Paulo. A cerimônia vai começar às 16:00 e a festa vai até o último convidado ir embora. (Não é mas o noivo paga kkkkk)\n" +
      "Aqui nesse site vamos deixar todas as informações sobre o casamento, como chegar, onde se hospedar caso precise e outras informações úteis.\n" +
      "Também vamos deixar aqui a lista de presentes, caso vocês queiram nos presentear. Não é obrigatório, mas é. Da um presentinho ai pô!\n" +
      "No finalzinho do site tem um formulário para confirmar a presença, por favor, preencha caso você for para que possamos deixar tudo organizadinho ❤\n" +
      "A contagem regressiva já começou e estamos muito ansiosos para compartilhar esse dia tão especial para nós com todos vocês.",
    breakpoints: {
      afterContainer: (
        <div className="flex flex-col z-10">
          <div className="flex justify-center items-center w-full">
            <div
              className="flex w-full bg-attachment bg-fixed relative h-96 bg-no-repeat bg-cover"
              style={{ backgroundImage: `url(/placeholder.webp)` }}
            />
          </div>
          <div className="flex h-4 bg-white relative" />
          <div className="flex justify-center items-center w-full">
            <div
              className="flex w-full bg-attachment bg-fixed relative h-96 bg-no-repeat bg-cover"
              style={{ backgroundImage: `url(/placeholder.webp)` }}
            />
          </div>
        </div>
      ),
    },
  },
  {
    label: "União",
    slug: "o-casal",
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
        <div className="flex relative h-96 w-96">
          <Image
            fill={true}
            src="/placeholder.webp"
            sizes="100vw 50vh"
            objectFit="cover"
            alt="Picture of the author"
            className="w-full h-auto border-red-400 border-[1px] p-3 rounded-md"
          />
        </div>
      ),
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
            className="flex justify-center flex-wrap p-6 w-3/12 min-w-72"
          >
            <Image
              src={specialPerson.photo}
              alt="Picture of the author"
              className="rounded-tl-full rounded-tr-full  border-black border-[1px] p-1"
              width={384}
              height={384}
            />
            <p className="font-bold text-red-400">{specialPerson.name}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    label: "Endereço",
    slug: "endereco",
    isSticky: false,
    content: (
      <iframe
        width="600"
        height="450"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen={true}
        referrerPolicy="no-referrer-when-downgrade"
        src="https://www.google.com/maps/embed/v1/place?key=AIzaSyANcu9m5u73d9IwIHVBTctJDN6aTkxloPo&q=Villa+Vezzane,Mairiporã+SP"
      />
    ),
  },
  {
    label: "Confime sua presença",
    slug: "confime-sua-presenca",
    isSticky: false,
    zIndex: 7,
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
    content: ({ cookies, paymentData }) => (
      <Presents cookies={cookies} paymentData={paymentData} />
    ),
  },
];

export default sections;
