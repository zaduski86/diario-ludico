import { NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Comentários dos leitores, intermediados pelo servidor. O navegador do leitor
 * só fala com o próprio domínio do site, nunca direto com o Supabase: isso
 * evita falhas por cache antigo, redes que bloqueiam o domínio do banco e
 * navegadores embutidos (WhatsApp, Instagram etc.).
 */

const SLUG_VALIDO = /^[a-z0-9-]{1,80}$/;
const LIMITE_POR_MINUTO = 6;

let client: SupabaseClient | null = null;

function getClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  if (!client) client = createClient(url, key);
  return client;
}

// Limite simples por IP, em memória: segura o spam mais óbvio sem depender de
// outro serviço. Cada instância do servidor mantém a sua própria contagem.
const envios = new Map<string, number[]>();

function excedeuLimite(ip: string): boolean {
  const agora = Date.now();
  const recentes = (envios.get(ip) ?? []).filter((t) => agora - t < 60_000);
  recentes.push(agora);
  envios.set(ip, recentes);
  if (envios.size > 5000) envios.clear();
  return recentes.length > LIMITE_POR_MINUTO;
}

function ipDe(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "desconhecido"
  );
}

export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get("slug") ?? "";
  if (!SLUG_VALIDO.test(slug)) {
    return NextResponse.json({ ok: false, error: "slug inválido" }, { status: 400 });
  }
  const supabase = getClient();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "indisponível" }, { status: 503 });
  }
  const { data, error } = await supabase
    .from("comentarios")
    .select("*")
    .eq("poema_slug", slug)
    .order("created_at", { ascending: false });
  if (error) {
    return NextResponse.json({ ok: false, error: "falha ao ler" }, { status: 502 });
  }
  return NextResponse.json(
    { ok: true, comentarios: data },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  const corpo = await request.json().catch(() => null);
  const slug = typeof corpo?.slug === "string" ? corpo.slug : "";
  const nome = typeof corpo?.nome === "string" ? corpo.nome.trim() : "";
  const mensagem = typeof corpo?.mensagem === "string" ? corpo.mensagem.trim() : "";

  if (
    !SLUG_VALIDO.test(slug) ||
    nome.length < 1 ||
    nome.length > 60 ||
    mensagem.length < 1 ||
    mensagem.length > 1000
  ) {
    return NextResponse.json({ ok: false, error: "dados inválidos" }, { status: 400 });
  }
  if (excedeuLimite(ipDe(request))) {
    return NextResponse.json(
      { ok: false, error: "muitos comentários em pouco tempo" },
      { status: 429 },
    );
  }
  const supabase = getClient();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "indisponível" }, { status: 503 });
  }
  const { error } = await supabase
    .from("comentarios")
    .insert({ poema_slug: slug, nome, mensagem });
  if (error) {
    return NextResponse.json({ ok: false, error: "falha ao gravar" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
