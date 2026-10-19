/**
 * Progresso de leitura do Livro de Arelah, guardado só no navegador do leitor
 * (localStorage). Cada capítulo guarda a posição da rolagem (0 a 1); além
 * disso há o último capítulo lido e a lista de capítulos já concluídos.
 *
 * O capítulo 0 é o prefácio. Tudo aqui é seguro contra localStorage
 * indisponível (modo privado, bloqueio de dados): nesse caso simplesmente não
 * há progresso a oferecer.
 */

const PREFIXO = "diario-ludico:arelah:";
const chaveProgresso = (numero: number) => `${PREFIXO}progresso:${numero}`;
const CHAVE_ULTIMO = `${PREFIXO}ultimo`;
const CHAVE_LIDOS = `${PREFIXO}lidos`;

/** Abaixo disso o leitor mal começou; acima do máximo, já terminou. */
export const PROGRESSO_MINIMO = 0.05;
export const PROGRESSO_MAXIMO = 0.95;

export type UltimaLeitura = { numero: number; progresso: number };

function lerNumero(chave: string): number {
  try {
    const valor = Number(window.localStorage.getItem(chave) ?? "0");
    return Number.isFinite(valor) ? Math.min(1, Math.max(0, valor)) : 0;
  } catch {
    return 0;
  }
}

export function getProgressoCapitulo(numero: number): number {
  return lerNumero(chaveProgresso(numero));
}

export function getLidos(): number[] {
  try {
    const bruto = window.localStorage.getItem(CHAVE_LIDOS);
    const lista = bruto ? JSON.parse(bruto) : [];
    return Array.isArray(lista)
      ? lista.filter((n): n is number => typeof n === "number")
      : [];
  } catch {
    return [];
  }
}

export function getUltimaLeitura(): UltimaLeitura | null {
  try {
    const bruto = window.localStorage.getItem(CHAVE_ULTIMO);
    if (!bruto) return null;
    const u = JSON.parse(bruto);
    if (typeof u?.numero === "number" && typeof u?.progresso === "number") {
      return { numero: u.numero, progresso: u.progresso };
    }
    return null;
  } catch {
    return null;
  }
}

/** Grava a posição no capítulo e, se chegou ao fim, marca o capítulo como lido. */
export function salvarProgressoCapitulo(numero: number, progresso: number): void {
  const p = Math.min(1, Math.max(0, progresso));
  try {
    window.localStorage.setItem(chaveProgresso(numero), String(p));
    window.localStorage.setItem(
      CHAVE_ULTIMO,
      JSON.stringify({ numero, progresso: p, em: Date.now() }),
    );
    if (p >= PROGRESSO_MAXIMO) {
      const lidos = getLidos();
      if (!lidos.includes(numero)) {
        window.localStorage.setItem(CHAVE_LIDOS, JSON.stringify([...lidos, numero]));
      }
    }
  } catch {
    // Sem localStorage: o progresso não será lembrado.
  }
}

/** Volta ao início do capítulo (a marca de "lido" continua valendo). */
export function reiniciarProgressoCapitulo(numero: number): void {
  salvarProgressoCapitulo(numero, 0);
}

/**
 * Para onde o botão "continuar de onde parou" deve levar. Se o último
 * capítulo foi concluído, aponta para o início do próximo; se o livro todo
 * foi concluído, devolve null.
 */
export function getRetomada(totalCapitulos: number): UltimaLeitura | null {
  const ultima = getUltimaLeitura();
  if (!ultima) return null;
  if (ultima.progresso >= PROGRESSO_MAXIMO) {
    return ultima.numero < totalCapitulos
      ? { numero: ultima.numero + 1, progresso: 0 }
      : null;
  }
  // Quem só abriu o capítulo e ainda não leu nada não precisa de retomada.
  if (ultima.progresso < PROGRESSO_MINIMO && ultima.numero === 0) return null;
  return ultima;
}
