export type Capitulo = {
  numero: number;
  titulo: string;
  subtitulo: string;
  /** Ilustração própria do capítulo. */
  imagem?: string;
  /** Índice da cena 3D de fundo, reaproveitando o mesmo sistema dos poemas. */
  cena: number;
  paragrafos: string[];
};

/** Arte de capa do livro (viajante diante do rosto de estrelas). */
export const IMAGEM_CAPA = "/assets/images/arelah-capa.webp";

export const capitulos: Capitulo[] = [
  {
    numero: 1,
    titulo: "Arelah — Origens",
    subtitulo: "Capítulo I — O dia que nasceu o Infinito",
    imagem: "/assets/images/arelah-cap1.webp",
    cena: 2,
    paragrafos: [
      "Ela tinha um mundo só dela.",
      "A língua era diferente, os sons eram diferentes, e a magia existia mais forte nela do que na própria terra ao seu redor. O sol era quente porque Arelah era sorridente, a vida existia porque ela era feliz. Não era Arelah que ficava triste quando o mundo estava cinza — era o mundo que ficava cinza quando ela estava triste. Mas essa palavra nunca tinha entrado no vocabulário dela antes. Era só um mito. Até que um dia virou fato.",
      "Mas esse capítulo não é sobre isso.",
      "Era 22 de setembro da era π. Ela completava 2 anos e 2 meses.",
      "Uma coincidência que ninguém naquela casa havia notado.",
      "Naquela noite, Arelah não falava. Só apontava coisas.",
      "Mas seus olhos estavam fixos na bolha d'água que pairava em pleno ar — rodando em torno de si mesma, lenta, perfeita, como um planeta minúsculo que havia decidido existir ali, entre a lareira e a mesa de jantar. Ela não sabia que aquilo era extraordinário. Pra ela era tão natural quanto respirar.",
      "Do outro lado da mesa, Arquimendes desenhava plantas de algo que provavelmente nunca seria construído. Kassandra organizava os potes sem olhar, como quem executa uma memória antiga.",
      "Ninguém via. Cada um no seu mundo — quando de repente.",
      "PLAAAAAAA.",
      "A porta bateu com uma força que não combinava com ninguém que quisesse apenas visitar. A bolha d'água desapareceu em poça no chão de terra batida. Arelah virou a cabeça devagar, sem susto — como se soubesse quem era antes de ver.",
      "Na entrada, com o cachimbo apagado entre os dentes e a muleta encostada na parede que acabara de estremecer, estava Barnabé.",
      "— Kassandra! — gritou ele, como se ela estivesse do outro lado de uma montanha. — A maldita planta floriu hoje? Preciso acender esse troço!",
      "Ninguém olhou pro chão.",
      "Ninguém viu a poça.",
      "Só Arelah — que apontou pra ela, depois apontou pra Barnabé, e fez algo que nunca havia feito antes.",
      "Sorriu.",
    ],
  },
  {
    numero: 2,
    titulo: "Arelah — Origens",
    subtitulo: "Capítulo II — O Fim do Começo",
    imagem: "/assets/images/arelah-cap2.webp",
    cena: 0,
    paragrafos: [
      "Barnabé entrou sem ser convidado — como sempre fazia.",
      "Mas dessa vez, algo na casa estava diferente.",
      "Ele não sabia dizer o quê. Só sabia que o cachimbo continuava apagado — e que a criança no chão não havia tirado os olhos dele desde que a porta bateu.",
      "Kassandra, que não aceitava desaforos nem da própria sombra, cresceu como gigante em poderio. E antes de mais um passo, Barnabé — velho de guerra, sobrevivente de batalhas que ninguém mais lembrava — sentiu o frio na espinha. Entendeu, naquele instante, que desafiar aquela mulher era pior do que qualquer inimigo encontrado nos exércitos mais ferozes do passado.",
      "— Pare aí mesmo. Eu limpei a casa hoje — veja lá se isso são modos, seu ogro sem educação.",
      "Num instante, Barnabé perdeu toda a compostura. O velho de guerra encolheu como filhote de gatinho perto da lareira.",
      "— Sim, senhora dona Kassandra. Eu só queria mesmo saber se o foguinho deu certo. Estou precisando fumar. — Fez uma pausa, olhou pro chão, e apontou com a muleta. — Percebi que a senhora limpou a casa. Estava terminando de secar?",
      "Kassandra perdeu o tamanho gigantesco que a raiva lhe dera.",
      "Virou-se para a tal poça de água.",
      "Olhou.",
      "Uma grande interrogação nasceu no seu rosto — de onde tinha vindo aquela água? Mas antes que o pensamento terminasse de se formar, uma máquina voadora mecânica cortou o ar vinda do quarto de Arquimendes, passou zunindo pela sala e foi se estatelar na parede do fundo.",
      "Kassandra olhou pra máquina. Olhou pra poça. Olhou pro quarto.",
      "Seu rosto ficou vermelho.",
      "— ARQUIMENDES, não acredito que você—",
      "— EUREKAAAAAAAAA!",
      "A voz dele explodiu antes que ela terminasse.",
      "Arquimendes saiu do quarto como se o mundo inteiro precisasse saber da notícia.",
      "— Finalizei! O coletor de partículas! Se eu estiver certo — e eu estou — com isso poderemos alimentar o gerador de energia para sempre! EUREKAAAAAAAAA!",
      "Kassandra respirou fundo. Pegou um pedaço de guantchale da mesa. Mordeu. Bocejou.",
      "— Claro, claro, claro. Só falta um pequeno detalhe, não é meu amor?",
      "— Qual?",
      "— Precisa funcionar.",
      "Arquimendes nem ouviu. Já tinha Barnabé pelo colarinho e o arrastava porta afora.",
      "— Venha, venha, venha — precisamos instalar no telhado. Agora.",
      "— Espere, espere — gritou Barnabé sendo arrastado — é mais seguro apoiar do outro lado, eu conheço estruturas, eu já vi casas—",
      "— Só segure a escada, seu velho falastrão.",
      "A casa de Arquimendes era um organismo vivo.",
      "Cabos percorriam as paredes como veias — entravam e saíam pelas raízes e frestas, carregando um fluxo de extratos de plantas escolhidos por Kassandra e energia gerada pelas engenhocas de Arquimendes. Cinco invenções fracassadas pra cada uma que funcionava. Sucata empilhada em cada canto. Papéis com anotações, sonhos e esquemas espalhados por todos os cômodos. Era impossível dizer onde terminava a casa e onde começavam as invenções.",
      "No centro de tudo isso — Arelah.",
      "Quieta. Observando. Rindo de coisas que ninguém mais via.",
      "Kassandra voltou com o balde, o pano e a água. Começou a limpar a poça de costas para a filha.",
      "Lá fora, Barnabé segurava a escada e discutia cada degrau enquanto Arquimendes subia escorregando, ignorando cada aviso com a confiança de quem nunca caiu — ainda.",
      "No topo, Arquimendes fez os últimos ajustes. Respirou fundo. Preparou-se para encaixar a peça final no capacitor translucidérico temporalmetildo convexso.",
      "Dentro, Arelah sentiu o vento.",
      "E o cheiro de chuva que ela tanto amava.",
      "O arrepio do clima a animou — ela também queria brincar na água. Lembrou da bolha. E instantaneamente, toda a água do balde de Kassandra voltou ao ar — rodando em torno de si mesma, perfeita, como um planeta que havia decidido existir ali de novo.",
      "Deu um gritinho tímido.",
      "— Alá.",
      "Kassandra sorriu sem virar.",
      "— Vai chover, minha princesinha. Está com fome?",
      "Virou-se devagar para ver a resposta da filha.",
      "E emudeceu.",
      "A cor saiu completamente do seu rosto.",
      "O silêncio durou exatamente o tempo de um raio decidir onde cair.",
      "KABLAN.",
      "O trovão cortou tudo ao mesmo tempo — o espanto de Kassandra, o grito de Barnabé lá fora, e o braço estendido de Arquimendes no momento exato em que encaixava a peça no capacitor.",
      "O raio o atingiu.",
      "A invenção conectou.",
      "Às 16:20, a sibannac floriu.",
      "E pegou fogo — como fazia todos os dias, naquele mesmo horário, desde que Kassandra a trouxera da ruína sem saber o que carregava.",
      "A faísca encontrou os cabos. Os cabos encontraram os extratos. Os extratos encontraram a energia. A energia encontrou o raio. O raio encontrou a magia de Arelah no ar.",
      "E tudo — absolutamente tudo — se conectou na explosão.",
      "O tempo parou.",
      "Não desacelerou. Não hesitou.",
      "Parou.",
      "Barnabé congelou no meio de um grito. Kassandra congelou com a boca aberta e os olhos arregalados. Arquimendes congelou no telhado — iluminado, os cabelos em pé, uma expressão entre o êxtase e o terror.",
      "Só Arelah se movia.",
      "Atravessou a sala em câmera lentíssima — milissegundos que pareciam horas. Tocou os cacos que voavam sem chegar ao destino. Passou pelos fios de energia suspensa no ar como cortinas de luz. Cheirou a fumaça da sibannac que subia em espiral congelada.",
      "Para ela era um parque de diversões.",
      "Ela não sabia o que era uma explosão. Não sabia o que era o perigo. Não sabia o que era o tempo parando.",
      "Só sabia que aquelas cores eram bonitas. E que o cheiro de chuva ainda estava lá.",
      "Andou. Sorriu. Foi indo.",
      "Até chegar lá fora.",
      "E olhar.",
      "O cogumelo gigante de destruição subia lento e majestoso onde havia sido a sua casa — uma devastação completa, suspensa no tempo como uma pintura do fim do mundo.",
      "Arelah inclinou a cabeça.",
      "Apontou.",
      "E riu.",
    ],
  },
];

export function getCapitulo(numero: number): Capitulo | undefined {
  return capitulos.find((c) => c.numero === numero);
}

/**
 * Quantos capítulos já deveriam estar liberados hoje pra um leitor que
 * destrancou o livro em `livroDestrancadoEm` — 1 por dia, a partir do dia
 * do desbloqueio, limitado ao que já foi escrito.
 */
export function capitulosLiberados(livroDestrancadoEm: string): number {
  const inicio = new Date(livroDestrancadoEm).getTime();
  const diasPassados = Math.floor((Date.now() - inicio) / (24 * 60 * 60 * 1000));
  return Math.min(capitulos.length, diasPassados + 1);
}
