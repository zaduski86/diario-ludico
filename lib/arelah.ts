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
