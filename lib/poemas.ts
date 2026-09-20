export type Poema = {
  slug: string;
  numero: string;
  titulo: string;
  sub: string;
  imagem: string;
  preview: string[];
  /** Índice da cena 3D de fundo: 0 aurora/brasas, 1 outono/água/fios, 2 cósmico/lua/poeira. */
  cena: number;
  /** "prosa" usa uma medida de linha mais estreita, melhor para parágrafos longos. */
  estilo?: "verso" | "prosa";
  /** Matiz sutil sobreposta à cena 3D (hex), para diferenciar poemas que reaproveitam a mesma cena. */
  corAmbiente?: string;
  estrofes: string[][];
};

/** ~200 palavras/minuto, ritmo de leitura confortável em português. */
export function tempoLeituraMin(poema: Poema): number {
  const palavras = poema.estrofes
    .flat()
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(palavras / 200));
}

export const poemas: Poema[] = [
  {
    slug: "cartografia-do-onde-nao-fui",
    numero: "I",
    titulo: "Cartografia de Onde Não Fui",
    sub: "",
    imagem: "/assets/images/poema3.png",
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
    slug: "do-fim-ao-comeco",
    numero: "II",
    titulo: "Do Fim ao Começo",
    sub: "",
    imagem: "/assets/images/poema1.jpg",
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
    numero: "III",
    titulo: "Mono no aware",
    sub: "A melancolia suave das coisas passageiras",
    imagem: "/assets/images/poema2.jpg",
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
        "Guarda um tesouro tão precioso dentro de si,",
        'que expõe ao mundo "coberto" só pra não ser visto,',
        "pois tudo que é visto é cobiçado — e o que é cobiçado é deturpado",
        "e assim, some mesmo antes de ter sido. Antes de existir.",
      ],
      [
        "Não é felicidade, não é dor,",
        "é saber sem saber que tudo passa,",
        "que o pra sempre tem fim, mas o que ficou",
        "também não fica — e mesmo assim não cansa.",
      ],
      [
        "É a origem, o alfa, o ômega, a essência,",
        "o fio invisível de tudo que poderia ser,",
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
    slug: "o-lugar-sem-coordenadas",
    numero: "IV",
    titulo: 'O "Lugar" sem Coordenadas',
    sub: "",
    imagem: "/assets/images/lugar.webp",
    preview: [
      'Existe um "lugar" que só é possível ser "visto"',
      'quando ninguém está "olhando" pra ele.',
    ],
    cena: 2,
    estilo: "prosa",
    corAmbiente: "#f0c84a",
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
        "Nesse vazio que não é mais vazio, pela primeira vez, algo respira.",
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
    titulo: "The War Within the Nameless Shadow",
    sub: "",
    imagem: "/assets/images/sombra.webp",
    preview: [
      "Ela habita em todos.",
      "Rasteja pelos cantinhos que ninguém nota.",
    ],
    cena: 0,
    estilo: "prosa",
    corAmbiente: "#6878b8",
    estrofes: [
      [
        "Ela habita em todos.",
        "Rasteja pelos cantinhos que ninguém nota. Pelos silêncios entre uma palavra e outra. Pelos segundos antes de você decidir quem vai ser hoje.",
      ],
      ["A minha eu tento matar todos os dias."],
      [
        "Mas mesmo que eu a mate hoje, a guerra não é vencida.",
        "Não de uma vez — nunca de uma vez. É centímetro por centímetro, trincheira por trincheira, num lamaçal que não seca e num front que não tem mapa.",
        "O preparo é árduo. A batalha, constante. E o campo de batalha — sempre o mesmo: o interior.",
      ],
      [
        "É um inimigo voraz. A cada migalha de alimento que consegue, cresce exponencialmente.",
        "O que o bem conquista em um ano de treino, ela devora num instante de descuido.",
      ],
      ["Às vezes ela não ataca. Ela espera."],
      ["Sabe que a exaustão faz o trabalho por ela."],
      [
        "Quando duas delas se encontram, não precisam de palavras. Se reconhecem — e num instante formam alcatéia, com um único propósito: apagar todo e qualquer brilho ao redor.",
      ],
      ["Não por maldade. Por necessidade."],
      ["A luz incomoda de um jeito que o escuro nunca vai entender."],
      ["Porque a luz não as destrói? Porque não simplesmente as revela?"],
      ["Porque se as revelasse, seria o fim."],
      [
        "No dia em que ela tiver rosto — a guerra estará perdida.",
        "No dia em que tiver cheiro — perdida.",
        "Peso. Forma. Nome.",
        "Perdida.",
      ],
      [
        "Porque quando você a conhece, ela também te conhece — e aí você já perdeu.",
      ],
      ["Por isso eu a mantenho sem nome."],
      [
        "E a mato antes do amanhecer, todos os dias, sem olhar nos olhos que ela não tem — ainda.",
      ],
      ["Hoje a luz ganhou."],
      ["Exausto. Destruído. Orgulhoso."],
      [
        "Parte de mim morreu no processo — como sempre morre. É preciso destruir às vezes para edificar mais forte.",
      ],
      ["Ninguém sabe dessa guerra."],
      ["E todo mundo a trava."],
      ["Em silêncio. Ao mesmo tempo. Sem se ver."],
      [
        "É um jogo de fluxo contínuo — e vence sempre o lado mais alimentado.",
      ],
    ],
  },
  {
    slug: "o-eco-do-que-nunca-foi-dito",
    numero: "VI",
    titulo: "O Eco do Que Nunca Foi Dito",
    sub: "",
    imagem: "/assets/images/eco.webp",
    preview: [
      "Alguns acreditam que os grandes nós da vida são feitos de cordas.",
      "Poucos percebem que os maiores — são feitos de silêncio.",
    ],
    cena: 2,
    corAmbiente: "#5ac8c8",
    estrofes: [
      [
        "Alguns acreditam que os grandes nós da vida são feitos de cordas.",
        "Poucos percebem que os maiores — são feitos de silêncio.",
      ],
      [
        "Da ausência daquilo que um dia poderíamos ter dito.",
        "Das pequenas travas que colocamos pra evitar um desastre,",
        "uma discussão, uma vergonha —",
        "ou simplesmente porque achamos que ainda não era a hora.",
      ],
      ["Às vezes nem são palavras."],
      [
        "É o beijo que nunca foi roubado.",
        "O vai toma no seu cu que ficou preso na garganta.",
        "O eu te amo dito sem ser sentido.",
        "O pedido de casamento ensaiado que nunca saiu.",
      ],
      [
        "Se houvesse um universo de possibilidades",
        "que foram criadas mas nunca chegaram a existir —",
        "ele seria mais imenso e intenso",
        "do que todos os que de fato existem.",
      ],
      [
        "Mais puro. Mais gostoso. Mais real",
        "do que a realidade que de fato vivemos.",
      ],
      [
        "Nesse mundo não existiria falsidade —",
        "pois o que se sente não poderia ser não dito.",
        "Tudo transpareceria.",
        "E as relações seriam construídas",
        "sobre o único material que nunca mente:",
        "o sentimento genuíno.",
      ],
      [
        "Mesmo que eu nunca tenha dito o que não disse,",
        "sei que às vezes foi muito mais verdadeiro",
        "do que tudo que eu de fato proferi.",
      ],
      ["Às vezes a gente nem falar sabe."],
      [
        "Nesse mundo do que nunca vivi",
        "porque nunca me permiti dizer —",
        "o silêncio seria o único pecado",
        "que jamais ninguém cometeria.",
      ],
      [
        "E seria uma máxima dizer",
        "que ali nos encontraríamos todos —",
        "e muitas vezes —",
        "procurando desesperadamente",
        "onde estaria perdida a nossa essência.",
      ],
      [
        "Espalhada. Deixada de lado.",
        "A cada resposta não dada.",
        "A cada sonho engolido pela realidade.",
        "A cada verdade que ficou presa",
        "no único universo que nunca existiu —",
        "mas que sempre foi o mais real de todos.",
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
