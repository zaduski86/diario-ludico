export type ObjetoInterativo = {
  simbolo: string;
  x: number; // % da tela
  y: number; // % da tela
  label: string;
};

export type Poema = {
  slug: string;
  numero: string;
  titulo: string;
  sub: string;
  imagem: string;
  narracao: string;
  trilha: string;
  preview: string[];
  objetos: ObjetoInterativo[];
  estrofes: string[][];
};

export const poemas: Poema[] = [
  {
    slug: "do-fim-ao-comeco",
    numero: "I",
    titulo: "Do Fim ao Começo",
    sub: "",
    imagem: "/assets/images/poema1.jpg",
    narracao: "/assets/audio/audio_1.mp3",
    trilha: "/assets/audio/trilha_1.mp3",
    preview: [
      "O dia que perdeu o que nunca teve,",
      "brotou a abundância do que sempre habitou.",
    ],
    objetos: [
      { simbolo: "⛓", x: 15, y: 60, label: "corrente" },
      { simbolo: "🕊", x: 75, y: 25, label: "asa" },
      { simbolo: "☀", x: 82, y: 68, label: "aurora" },
      { simbolo: "✦", x: 22, y: 30, label: "sonho" },
    ],
    estrofes: [
      [
        "O dia que perdeu o que nunca teve,",
        "brotou a abundância do que sempre habitou.",
      ],
      [
        "Entre o vazio e o horizonte voa livre,",
        "o pássaro enjaulado que se libertou.",
      ],
      [
        "Os grilhões que o prendiam no agouro,",
        "viraram asas nos sonhos que sonhou.",
      ],
      [
        "E a noite que velava a liberdade,",
        "o alvorecer do novo dia revelou.",
      ],
    ],
  },
  {
    slug: "mono-no-aware",
    numero: "II",
    titulo: "Mono no aware",
    sub: "A melancolia suave das coisas passageiras",
    imagem: "/assets/images/poema2.jpg",
    narracao: "/assets/audio/audio_2.mp3",
    trilha: "/assets/audio/trilha_2.mp3",
    preview: [
      "Não é saudade, não é melancolia,",
      "é a antecipação de um momento que não existe.",
    ],
    objetos: [
      { simbolo: "🍂", x: 18, y: 35, label: "folha" },
      { simbolo: "∞", x: 78, y: 20, label: "fio" },
      { simbolo: "◎", x: 65, y: 72, label: "água" },
      { simbolo: "◦", x: 30, y: 75, label: "gota" },
      { simbolo: "✦", x: 85, y: 50, label: "essência" },
      { simbolo: "〰", x: 45, y: 20, label: "onda" },
    ],
    estrofes: [
      [
        "Não é saudade, não é melancolia,",
        "é a antecipação de um momento que não existe,",
        "o prazer do talvez com a loucura do nunca seria,",
        "a vertigem doce de quem no próprio abismo persiste.",
      ],
      [
        "Um tesouro tão vasto dentro de si,",
        "que se mostra ao mundo só pra não ser visto,",
        "tudo que é visto é cobiçado — e assim",
        "some o que um dia foi, antes de ter sido.",
      ],
      [
        "Não é felicidade, não é dor,",
        "é saber sem saber que tudo passa,",
        "que o pra sempre tem fim, mas o que ficou",
        "também não fica — e mesmo assim não cansa.",
      ],
      [
        "É a origem, o alfa, o ômega, a essência,",
        "o fio invisível de tudo que teve que ser,",
        "cada traço convergindo numa presença",
        "que é nenhum momento e todos ao mesmo tempo.",
      ],
      [
        "Cada escolha certa ou errada, cada desvio,",
        "cada linha tecida que sim ou não existiu,",
        "converge num instante — e nesse instante",
        "há algo maior do que tudo.",
      ],
      [
        "Somos uma gota que contém o oceano,",
        "e no momento em que isso se descobre —",
        "viramos mar.",
      ],
    ],
  },
  {
    slug: "cartografia-do-onde-nao-fui",
    numero: "III",
    titulo: "Cartografia do Onde Não Fui",
    sub: "",
    imagem: "/assets/images/poema3.png",
    narracao: "/assets/audio/audio_3.mp3",
    trilha: "/assets/audio/trilha_3.mp3",
    preview: [
      "E foi ali, naquele mesmo lugar",
      "que eu não me lembro onde era.",
    ],
    objetos: [
      { simbolo: "🕯", x: 20, y: 65, label: "vela" },
      { simbolo: "🪶", x: 70, y: 30, label: "pena" },
      { simbolo: "◉", x: 78, y: 70, label: "pedra" },
      { simbolo: "☽", x: 25, y: 25, label: "lua" },
    ],
    estrofes: [
      [
        "E foi ali, naquele mesmo lugar que eu não me lembro onde era,",
        "que eu não tenha certeza nem ter visto ele convidar o Sol pra entrar numa noite singela.",
        "Já era mais ou menos meio dia quando a lua apontou na janela —",
        "um calor de bater os dentes, mas eu suava de frio na escuridão da vela.",
      ],
      [
        "Nada era turvo, mas eu não consegui enxergar",
        "a pedra que flutuava plena,",
        "enquanto a pena afundava o que tinha sobrado",
        "do nada que ali havia.",
      ],
      [
        "Pensei que era difícil não saber nada,",
        "mas sem pensar, descobri que nem era.",
        "Mas a era era outra —",
        "e a aurora que outrora outorga hora",
        "ontem nem existiu",
        "num futuro que com certeza aconteceu faz tempo.",
      ],
    ],
  },
];

export function getPoemaBySlug(slug: string): Poema | undefined {
  return poemas.find((p) => p.slug === slug);
}

export function getPoemaIndex(slug: string): number {
  return poemas.findIndex((p) => p.slug === slug);
}
