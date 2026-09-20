import { NextResponse } from "next/server";
import { getSupabaseAdmin, senhaAdminValida } from "@/lib/supabaseAdmin";

export async function DELETE(request: Request) {
  const { id, senha } = await request.json().catch(() => ({}));

  if (typeof senha !== "string" || !senhaAdminValida(senha)) {
    return NextResponse.json({ ok: false, error: "senha inválida" }, { status: 401 });
  }
  if (typeof id !== "string" || !id) {
    return NextResponse.json({ ok: false, error: "id inválido" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: "admin não configurado" },
      { status: 500 },
    );
  }

  const { error } = await supabase.from("comentarios").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
