import "server-only";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * Cliente Supabase com a service_role key — ignora RLS. Só pode ser
 * importado por código que roda no servidor (rotas de API), nunca por
 * componentes de cliente.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  if (!client) client = createClient(url, serviceKey);
  return client;
}

export function senhaAdminValida(senha: string): boolean {
  const esperada = process.env.ADMIN_PASSWORD;
  return Boolean(esperada) && senha === esperada;
}
