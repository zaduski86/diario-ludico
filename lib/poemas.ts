export type Poema = {
  slug: string;
  numero: string;
  titulo: string;
  sub: string;
  imagem: string;
  narracao: string;
  trilha: string;
  preview: string[];
  /** Índice da cena 3D de fundo: 0 aurora/brasas, 1 outono/água/fios, 2 cósmico/lua/poeira. */
  cena: number;
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
    cena: 0,
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
    cena: 1,
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
    cena: 2,
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
  {
    slug: "o-lugar-sem-coordenadas",
    numero: "IV",
    titulo: 'O "Lugar" sem Coordenadas',
    sub: "",
    imagem: "/assets/images/lugar.webp",
    narracao: "/assets/audio/audio_4.mp3",
    trilha: "/assets/audio/trilha_4.mp3",
    preview: [
      'Existe um "lugar" que só é possível ser "visto"',
      'quando ninguém está "olhando" pra ele.',
    ],
    cena: 2,
    estrofes: [
      [
        'Existe um "lugar" que só é possível ser "visto" quando ninguém está "olhando" pra ele.',
        'É preciso fechar os olhos pra conseguir "ver" os primeiros traços dourados e simétricos, rasgando a escuridão e iluminando uma silhueta desconhecida.',
      ],
      [
        "A forma é vaga, mas a magnitude é certa.",
        'Para estar nesse "lugar", até o tempo — que nunca pede licença pra passar — ali para. Contempla, pede, e aí passa, devagar, quase imóvel, seguindo seu caminho.',
      ],
      [
        "Neste instante, o silêncio fala. E pela primeira vez, é a única voz que importa.",
        "Fazia tempo que você não ouvia aquela voz.",
      ],
      [
        "Bate uma saudade — uma nostalgia que mais parece um déjà não vi. Uma certeza estranha de reconhecer o que nunca foi encontrado.",
        'A "fala" do silêncio vira grito. O som ecoa e vibra, cada vez mais forte, até quase cegar e ensurdecer.',
      ],
      [
        "À beira do inconsciente, você percebe que não foi você que encontrou esse lugar — foi ele que esperou até você estar pronto para ali perder-se.",
        "Então, você se entrega. O silêncio volta às suas origens — e emudece.",
      ],
      [
        "Nesse vazio que não é vazio, pela primeira vez, algo respira.",
        "E quando respira, você nota que seu peito estufa.",
      ],
      [
        'O "lugar" — a silhueta de poder intangível onde o tempo para, o silêncio grita, e onde os olhos fechados enxergam com a alma — em realidade, é você.',
        "E tudo que parecia perdido era só você, esperando que você mesmo chegasse — e através de um abraço......., se reconectasse !!!",
      ],
    ],
  },
  {
    slug: "a-guerra-da-sombra-sem-nome",
    numero: "V",
    titulo: "A Guerra da Sombra Sem Nome",
    sub: "",
    imagem: "/assets/images/sombra.webp",
    narracao: "/assets/audio/audio_5.mp3",
    trilha: "/assets/audio/trilha_5.mp3",
    preview: [
      "Ela habita em todos.",
      "Rasteja pelos cantinhos que ninguém nota.",
    ],
    cena: 0,
    estrofes: [
      [
        "Ela habita em todos.",
        "Rasteja pelos cantinhos que ninguém nota. Pelos silêncios entre uma palavra e outra. Pelos segundos antes de você decidir quem vai ser hoje.",
        "Eu a mato todos os dias.",
      ],
      [
        "Não de uma vez — nunca de uma vez. É centímetro por centímetro, trincheira por trincheira, num lamaçal que não seca e num front que não tem mapa.",
        "O preparo é árduo. A batalha, constante. E o campo — sempre o mesmo: dentro.",
      ],
      [
        "A cada migalha de alimento ela cresce. O que o bem conquista em um ano de treino, ela devora num instante de descuido.",
        "Às vezes ela não ataca. Ela espera.",
        "Sabe que a exaustão faz o trabalho por ela.",
      ],
      [
        "Quando duas delas se encontram, não precisam de palavras. Se reconhecem — e num instante formam alcatéia, com um único propósito: apagar o brilho ao redor.",
        "Não por maldade. Por necessidade.",
        "A luz as incomoda de um jeito que o escuro nunca vai entender.",
      ],
      [
        "Porque a luz não as combate.",
        "Ela apenas as revela.",
        "E revelar seria o fim.",
      ],
      [
        "Porque no dia em que ela tiver rosto — a guerra está perdida.",
        "No dia em que tiver cheiro — perdida.",
        "Peso. Forma. Nome.",
        "Perdida.",
      ],
      [
        "Uma sombra com identidade não é mais sombra. É outra coisa. E essa outra coisa, ninguém quer conhecer.",
        "Pois se você a conhecer, terá empatia — e se tiver empatia, ela já ganhou. Por isso eu a mantenho sem nome, sem forma, sem brilho e sem vida.",
        "Por isso eu a mato antes do amanhecer, todos os dias, sem olhar nos olhos que ela não tem — ainda.",
      ],
      [
        "Hoje a luz ganhou.",
        "Exausto. Destruído. Orgulhoso.",
        "Parte de mim morreu no processo — como sempre morre. É preciso destruir às vezes para edificar mais forte.",
      ],
      [
        "Ninguém sabe dessa guerra.",
        "E todo mundo a trava.",
        "Em silêncio. Ao mesmo tempo. Sem se ver.",
        "É um jogo de fluxo contínuo — e quem vence sempre é o lado mais alimentado.",
        "Qual lado você alimentou hoje?",
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
