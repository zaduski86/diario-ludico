/**
 * Dicas misteriosas que preenchem os baús enquanto ainda não há sussurros
 * reais o bastante deixados por leitores. Em ordem: da mais vaga à mais
 * explícita — clicando o suficiente, o leitor acaba descobrindo o que
 * precisa fazer pra alcançar a chave.
 */
const DICAS: string[] = [
  "Seis mundos, seis vozes — nenhuma sussurra sozinha.",
  "O que se lê até o fim, deixa rastro. O gênio sente rastro.",
  "Silêncio depois da sexta leitura não é vazio. É convite.",
  "Quem atravessa tudo carrega algo que precisa ser dito — e dito aqui.",
  "Uma palavra sua, gravada pra sempre, pesa mais do que parece.",
  "A chave não se procura. Se merece — depois de ler, e depois de deixar algo em troca.",
  "Seis poemas. Um sussurro seu. Só então ela aparece na sua mão.",
  "Leia os seis. Escreva o seu. A chave vem até você — e o livro espera.",
];

const CHAVE_CONTADOR = "diario-ludico:dicas-genio-vistas";

/** Retorna a próxima dica na sequência (avança e persiste o progresso). */
export function proximaDica(): string {
  let contador = 0;
  try {
    contador = Number(localStorage.getItem(CHAVE_CONTADOR) ?? "0");
  } catch {
    // Sem localStorage — sempre mostra a primeira dica.
  }
  const dica = DICAS[Math.min(contador, DICAS.length - 1)];
  try {
    localStorage.setItem(CHAVE_CONTADOR, String(contador + 1));
  } catch {
    // Progresso das dicas não será lembrado nesta sessão.
  }
  return dica;
}
