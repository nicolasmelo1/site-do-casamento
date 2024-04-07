const presents = [
  {
    title: "20 packs de tortuguita do Oxxo",
    description: "Ela ama, compra pra vivi",
    imageUrl: "/presents/tortuguita.jpeg",
    value: 100,
  },
  {
    title: "Pack com 10 cigarros da Sogra",
    description: "Te amo, tá? USHAHSAHUSAHU",
    imageUrl: "/presents/pack-de-cigarro.jpeg",
    value: 120,
  },
  {
    title: "Café da manhã pós cerimônia",
    description: "Vamos estar com fominha",
    imageUrl: "/presents/cafe-da-manha.jpeg",
    value: 150,
  },
  {
    title: "Curso de hetero com o cunhado",
    description: "Ta aprendendo, mas não chegou lá ainda.",
    imageUrl: "/presents/pereirao.jpeg",
    value: 180,
  },
  {
    title: "Whey da Vivi",
    description: "Pra ela ficar MAIS grande",
    imageUrl: "/presents/hello-kitty-bombada.jpeg",
    value: 200,
  },
  {
    title: "Viagem pra Disney com a Noiva",
    description: "Gastou mais do que podia",
    imageUrl: "/presents/viagem-pra-disno.png",
    value: 300,
  },
  {
    title: "Cavalgada do noivo",
    description: "Pra ele se sentir o cowboy",
    imageUrl: "/presents/cavalgada.jpeg",
    value: 250,
  },
  {
    title: "Maracugina para a noiva",
    description: "Não fique estressadiha calma amor não se exponha",
    imageUrl: "/presents/maracunoiva.webp",
    value: 260,
  },
  {
    title: "Ir de penetra no casamento",
    description:
      "não tem nada que me impeça. aumenta o som que eu já to entrando, vou penetrando",
    imageUrl: "/presents/penetra.webp",
    value: 300,
  },
  {
    title: "Detetização da nossa casa",
    description: "Nossas filhinhas balatinhas",
    imageUrl: "/presents/detetizacao-balatinhas.jpeg",
    value: 200,
  },
  {
    title: "Auto escola para habilitados p/ o noivo",
    description: "Precisa urgentemente",
    imageUrl: "/presents/aula-p-habilitados.jpeg",
    value: 300,
  },
  {
    title: "Jogo de Cama King",
    description: "Precisa urgentemente",
    imageUrl: "/presents/cama-king.jpeg",
    value: 350,
  },
  {
    title: "Personal da noiva",
    description: "Vai achando que é fácil ser gostosa assim",
    imageUrl: "/presents/felipe-personal.png",
    value: 400,
  },
  {
    title: "Passeio turistico na lua de mel",
    description: "Não agora, mas no futuro",
    imageUrl: "/presents/tartaruguinha.jpeg",
    value: 310,
  },
  {
    title: "Passagem só de ida da sogra",
    description: "Qualquer lugar, só de ida",
    imageUrl: "/presents/naget.png",
    value: 500,
  },
  {
    title: "Uma compra do mês",
    description: "Pô, só uma",
    imageUrl: "/presents/compra-do-mes.jpeg",
    value: 600,
  },
  {
    title: `"Ops" do noivo`,
    description: "Mais uma do noivo",
    imageUrl: "/presents/cagadinha.avif",
    value: 170,
  },
  {
    title: "Parcelas dos fotografos",
    description: "Pra registrar o momento",
    imageUrl: "/presents/studio-k.jpeg",
    value: 260,
  },
  {
    title: "Ir na lua de mel com os noivos",
    description: "Para só se encontrar, também",
    imageUrl: "/presents/viagem-de-aviao.jpeg",
    value: 400,
  },
  {
    title: "Nosso casamento inteiro",
    description:
      "Pô, não precisava, mas vamos e convenhamos, é o minimo que a gente espera",
    imageUrl: "/presents/o-casamento-todo.jpeg",
    value: 250000,
  },
];

export default function getPresents(isDevMode?: boolean) {
  return isDevMode
    ? presents.concat([
        {
          description: "Teste",
          imageUrl: "/placeholder.webp",
          title: "Teste",
          value: 5,
        },
      ])
    : presents;
}
