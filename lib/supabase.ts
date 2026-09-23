import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { poemas } from "./poemas";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

// Supabase é opcional: o site funciona normalmente sem as variáveis de
// ambiente configuradas. Quando presentes, habilita identidade do leitor,
// registro de visitas/compartilhamentos e comentários (ver
// supabase/schema.sql).
export function getSupabase(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  if (!client) client = createClient(url, anonKey);
  return client;
}

const CHAVE_LEITOR = "diario-ludico:leitor";

export type Leitor = { id: string; nome: string };

/** Lê o leitor salvo neste navegador, sem tocar a rede. */
export function getLeitorLocal(): Leitor | null {
  try {
    const bruto = window.localStorage.getItem(CHAVE_LEITOR);
    if (!bruto) return null;
    const leitor = JSON.parse(bruto);
    if (leitor?.id && leitor?.nome) return leitor;
    return null;
  } catch {
    return null;
  }
}

function salvarLeitorLocal(leitor: Leitor) {
  try {
    window.localStorage.setItem(CHAVE_LEITOR, JSON.stringify(leitor));
  } catch {
    // Sem localStorage — a identidade não persiste entre visitas.
  }
}

/**
 * Cria (ou atualiza) o registro do leitor a partir do nome informado.
 * Sem Supabase configurado, ainda assim salva localmente para não travar
 * a experiência.
 */
export async function identificarLeitor(nome: string): Promise<Leitor> {
  const existente = getLeitorLocal();
  const supabase = getSupabase();

  if (!supabase) {
    const leitor = existente?.id
      ? { ...existente, nome }
      : { id: crypto.randomUUID(), nome };
    salvarLeitorLocal(leitor);
    return leitor;
  }

  try {
    if (existente?.id) {
      await supabase
        .from("leitores")
        .update({ nome, ultima_visita: new Date().toISOString() })
        .eq("id", existente.id);
      const leitor = { id: existente.id, nome };
      salvarLeitorLocal(leitor);
      return leitor;
    }
    const { data, error } = await supabase
      .from("leitores")
      .insert({ nome })
      .select("id")
      .single();
    if (error || !data) throw error;
    const leitor = { id: data.id as string, nome };
    salvarLeitorLocal(leitor);
    return leitor;
  } catch {
    const leitor = existente?.id
      ? { ...existente, nome }
      : { id: crypto.randomUUID(), nome };
    salvarLeitorLocal(leitor);
    return leitor;
  }
}

/**
 * Garante que o leitor salvo neste navegador tenha uma linha correspondente
 * em `leitores`. Cobre leitores criados durante alguma falha passada do
 * Supabase (identidade salva só localmente) — sem isso, qualquer inserção
 * que referencie leitor_id (leituras_completas, sussurros) falha calada por
 * violar a chave estrangeira.
 */
async function garantirLeitorNoBanco(leitor: Leitor) {
  const supabase = getSupabase();
  if (!supabase) return;
  try {
    await supabase
      .from("leitores")
      .upsert(
        { id: leitor.id, nome: leitor.nome },
        { onConflict: "id", ignoreDuplicates: true },
      );
  } catch {
    // Silencioso: tentativas futuras cobrem isso.
  }
}

export async function registrarVisita(poemaSlug: string) {
  const supabase = getSupabase();
  if (!supabase) return;
  try {
    const leitor = getLeitorLocal();
    if (leitor) await garantirLeitorNoBanco(leitor);
    await supabase
      .from("visitas")
      .insert({ poema_slug: poemaSlug, leitor_id: leitor?.id ?? null });
  } catch {
    // Silencioso: analytics nunca deve quebrar a experiência de leitura.
  }
}

export async function registrarCompartilhamento(
  poemaSlug: string,
  tipo: "link" | "cartao",
) {
  const supabase = getSupabase();
  if (!supabase) return;
  try {
    const leitor = getLeitorLocal();
    await supabase
      .from("compartilhamentos")
      .insert({ poema_slug: poemaSlug, tipo, leitor_id: leitor?.id ?? null });
  } catch {
    // Silencioso: analytics nunca deve quebrar a experiência de leitura.
  }
}

export type Comentario = {
  id: string;
  poema_slug: string;
  nome: string;
  mensagem: string;
  created_at: string;
};

export async function listarComentarios(
  poemaSlug: string,
): Promise<Comentario[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("comentarios")
    .select("*")
    .eq("poema_slug", poemaSlug)
    .order("created_at", { ascending: false });
  if (error) return [];
  return data as Comentario[];
}

export async function enviarComentario(
  poemaSlug: string,
  nome: string,
  mensagem: string,
) {
  const supabase = getSupabase();
  if (!supabase) return { error: "Supabase não configurado" };
  const { error } = await supabase
    .from("comentarios")
    .insert({ poema_slug: poemaSlug, nome, mensagem });
  return { error: error?.message ?? null };
}

/**
 * Marca silenciosamente que o leitor atual terminou este poema. Usado só
 * para liberar os sussurros — nunca deve interromper a leitura em caso de
 * falha.
 */
export async function marcarPoemaLido(poemaSlug: string) {
  const supabase = getSupabase();
  const leitor = getLeitorLocal();
  if (!supabase || !leitor) return;
  try {
    await supabase
      .from("leituras_completas")
      .upsert(
        { leitor_id: leitor.id, poema_slug: poemaSlug },
        { onConflict: "leitor_id,poema_slug", ignoreDuplicates: true },
      );
  } catch {
    // Silencioso: não deve afetar a leitura.
  }
}

/** Slugs (do total existente hoje) que esse leitor já terminou de ler. */
export async function listarPoemasLidos(leitorId: string): Promise<string[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("leituras_completas")
    .select("poema_slug")
    .eq("leitor_id", leitorId);
  if (error || !data) return [];
  const slugsValidos = new Set(poemas.map((p) => p.slug));
  return [...new Set(data.map((d) => d.poema_slug))].filter((s) =>
    slugsValidos.has(s),
  );
}

export async function contarPoemasLidos(leitorId: string): Promise<number> {
  return (await listarPoemasLidos(leitorId)).length;
}

export async function leuTodosPoemas(leitorId: string): Promise<boolean> {
  const lidos = await contarPoemasLidos(leitorId);
  return lidos >= poemas.length;
}

export type Sussurro = {
  id: string;
  nome: string;
  mensagem: string;
  created_at: string;
};

export async function listarSussurros(): Promise<Sussurro[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("sussurros")
    .select("id, nome, mensagem, created_at")
    .order("created_at", { ascending: false });
  if (error) return [];
  return data as Sussurro[];
}

export async function enviarSussurro(nome: string, mensagem: string) {
  const supabase = getSupabase();
  if (!supabase) return { error: "Supabase não configurado" };
  const leitor = getLeitorLocal();
  const { error } = await supabase
    .from("sussurros")
    .insert({ leitor_id: leitor?.id ?? null, nome, mensagem });
  return { error: error?.message ?? null };
}

export async function jaDeixouSussurro(leitorId: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;
  const { count, error } = await supabase
    .from("sussurros")
    .select("id", { count: "exact", head: true })
    .eq("leitor_id", leitorId);
  if (error) return false;
  return (count ?? 0) > 0;
}

export type ArelahProgresso = {
  chaveRecebidaEm: string | null;
  livroDestrancadoEm: string | null;
};

export async function getArelahProgresso(
  leitorId: string,
): Promise<ArelahProgresso> {
  const supabase = getSupabase();
  const vazio: ArelahProgresso = {
    chaveRecebidaEm: null,
    livroDestrancadoEm: null,
  };
  if (!supabase) return vazio;
  const { data, error } = await supabase
    .from("arelah_progresso")
    .select("chave_recebida_em, livro_destrancado_em")
    .eq("leitor_id", leitorId)
    .maybeSingle();
  if (error || !data) return vazio;
  return {
    chaveRecebidaEm: data.chave_recebida_em,
    livroDestrancadoEm: data.livro_destrancado_em,
  };
}

/** Marca que o gênio entregou a chave a este leitor (só acontece uma vez). */
export async function receberChave(leitor: Leitor) {
  const supabase = getSupabase();
  if (!supabase) return;
  try {
    await garantirLeitorNoBanco(leitor);
    await supabase.from("arelah_progresso").upsert(
      { leitor_id: leitor.id, chave_recebida_em: new Date().toISOString() },
      { onConflict: "leitor_id", ignoreDuplicates: true },
    );
  } catch {
    // Silencioso: o gênio tenta de novo no próximo clique.
  }
}

/** Marca que a chave foi usada no livro, liberando a leitura de Arelah. */
export async function destrancarLivro(leitor: Leitor) {
  const supabase = getSupabase();
  if (!supabase) return;
  try {
    await garantirLeitorNoBanco(leitor);
    await supabase
      .from("arelah_progresso")
      .update({ livro_destrancado_em: new Date().toISOString() })
      .eq("leitor_id", leitor.id);
  } catch {
    // Silencioso: o leitor pode tentar arrastar a chave de novo.
  }
}
