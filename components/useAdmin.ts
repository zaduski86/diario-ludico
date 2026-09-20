"use client";

const CHAVE_SENHA = "diario-ludico:admin-senha";

export function getNomeAdmin(): string | null {
  return process.env.NEXT_PUBLIC_ADMIN_NOME ?? null;
}

export function nomeEhAdmin(nome: string): boolean {
  const esperado = getNomeAdmin();
  if (!esperado) return false;
  return nome.trim().toLowerCase() === esperado.trim().toLowerCase();
}

export function isAdminSessao(): boolean {
  try {
    return Boolean(window.sessionStorage.getItem(CHAVE_SENHA));
  } catch {
    return false;
  }
}

export async function loginAdmin(senha: string): Promise<boolean> {
  try {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senha }),
    });
    if (!res.ok) return false;
    window.sessionStorage.setItem(CHAVE_SENHA, senha);
    return true;
  } catch {
    return false;
  }
}

export async function apagarComentarioAdmin(id: string): Promise<boolean> {
  const senha = getSenhaSessao();
  if (!senha) return false;
  try {
    const res = await fetch("/api/admin/comentarios", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, senha }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

function getSenhaSessao(): string | null {
  try {
    return window.sessionStorage.getItem(CHAVE_SENHA);
  } catch {
    return null;
  }
}
