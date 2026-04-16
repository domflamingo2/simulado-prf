"use client";

import { useMemo, useState } from "react";

import { questoes } from "@/data";
import { Disciplina } from "@/data/types";

export function useTreinoConfig() {
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<
    Disciplina | ""
  >("");
  const [quantidade, setQuantidade] = useState(10);
  const [mostrarExplicacao, setMostrarExplicacao] = useState(false);

  const stats = useMemo(() => {
    if (!disciplinaSelecionada) return { count: 0, max: 0 };
    const filtered = questoes.filter(
      (q) => q.disciplina === disciplinaSelecionada,
    );
    return { count: filtered.length, max: Math.min(filtered.length, 50) };
  }, [disciplinaSelecionada]);

  // Ajusta quantidade se mudar a disciplina e o limite for menor
  useMemo(() => {
    if (quantidade > stats.max && stats.max > 0) {
      setQuantidade(stats.max);
    }
  }, [stats.max, quantidade]);

  const selecionarDisciplina = (disciplina: Disciplina) => {
    setDisciplinaSelecionada(disciplina);
    const filtered = questoes.filter((q) => q.disciplina === disciplina);
    const max = Math.min(filtered.length, 50);
    if (quantidade > max) {
      setQuantidade(Math.min(10, max));
    }
  };

  return {
    disciplinaSelecionada,
    quantidade,
    mostrarExplicacao,
    stats,
    setQuantidade,
    setMostrarExplicacao,
    selecionarDisciplina,
  };
}
