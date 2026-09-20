import { NextResponse } from "next/server";
import { senhaAdminValida } from "@/lib/supabaseAdmin";

export async function POST(request: Request) {
  const { senha } = await request.json().catch(() => ({ senha: "" }));
  if (typeof senha !== "string" || !senhaAdminValida(senha)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
