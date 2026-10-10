import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Força novo hash de build (2026-09-23): contorna cache de rede preso na
// versão anterior desta chave em alguns pontos entre o navegador e a Vercel.
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

/**
 * Lê os comentários de uma página. Passa primeiro pelo servidor do próprio
 * site (/api/comentarios); só recorre ao Supabase direto se essa rota falhar.
 */
export async function listarComentarios(
  poemaSlug: string,
): Promise<Comentario[]> {
  try {
    const res = await fetch(
      `/api/comentarios?slug=${encodeURIComponent(poemaSlug)}`,
      { cache: "no-store" },
    );
    if (res.ok) {
      const json = await res.json();
      if (json?.ok && Array.isArray(json.comentarios)) {
        return json.comentarios as Comentario[];
      }
    }
  } catch {
    // Rota indisponível: tenta o caminho direto abaixo.
  }
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

/** Todos os comentários (livro e poemas), do mais novo para o mais antigo. Usado pela página de administração. */
export async function listarTodosComentarios(
  limite = 1000,
): Promise<Comentario[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("comentarios")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limite);
  if (error) return [];
  return data as Comentario[];
}

/**
 * Envia um comentário pelo servidor do próprio site. Se a rota estiver fora
 * do ar ou inacessível, tenta gravar direto no Supabase como plano B.
 * Erros de validação e de limite (400/429) não são repetidos.
 */
export async function enviarComentario(
  poemaSlug: string,
  nome: string,
  mensagem: string,
): Promise<{ error: string | null; limite?: boolean }> {
  try {
    const res = await fetch("/api/comentarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: poemaSlug, nome, mensagem }),
    });
    if (res.ok) return { error: null };
    if (res.status === 429) {
      return { error: "muitos comentários em pouco tempo", limite: true };
    }
    if (res.status === 400) return { error: "dados inválidos" };
  } catch {
    // Rota inacessível: cai no plano B.
  }
  const supabase = getSupabase();
  if (!supabase) return { error: "Supabase não configurado" };
  const { error } = await supabase
    .from("comentarios")
    .insert({ poema_slug: poemaSlug, nome, mensagem });
  return { error: error?.message ?? null };
}

