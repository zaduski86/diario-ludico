import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

// Supabase é opcional: o site funciona normalmente sem as variáveis de
// ambiente configuradas. Quando presentes, habilita registro de visitas e
// comentários dos leitores (ver supabase/schema.sql).
export function getSupabase(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  if (!client) client = createClient(url, anonKey);
  return client;
}

export async function registrarVisita(poemaSlug: string) {
  const supabase = getSupabase();
  if (!supabase) return;
  try {
    await supabase.from("visitas").insert({ poema_slug: poemaSlug });
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
