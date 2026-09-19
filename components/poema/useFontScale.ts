"use client";

import { useEffect, useState } from "react";

export type EscalaFonte = 0 | 1 | 2;

const CHAVE = "diario-ludico:escala-fonte";

export function useFontScale(): [EscalaFonte, (v: EscalaFonte) => void] {
  const [escala, setEscalaState] = useState<EscalaFonte>(1);

  useEffect(() => {
    try {
      const salva = window.localStorage.getItem(CHAVE);
      if (salva === "0" || salva === "1" || salva === "2") {
        setEscalaState(Number(salva) as EscalaFonte);
      }
    } catch {
      // localStorage indisponível — segue com o padrão.
    }
  }, []);

  function setEscala(v: EscalaFonte) {
    setEscalaState(v);
    try {
      window.localStorage.setItem(CHAVE, String(v));
    } catch {
      // Preferência não será lembrada, mas a leitura continua funcionando.
    }
  }

  return [escala, setEscala];
}
