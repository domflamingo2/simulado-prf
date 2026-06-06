// src/hooks/useTreinoConfig.ts

"use client";

import { useEffect, useMemo, useState } from "react";

import { DISCIPLINAS_LABELS, questoes } from "@/data/questoes";

import { Disciplina } from "@/data/questoes/index";

type PerformanceLevel = "bom" | "medio" | "baixo";

interface DisciplinaStats {
  nome: string;
  total: number;
  taxaAcerto: number;
}

interface TreinoStats {
  count: number;
  max: number;

  totalQuestoes: number;
  streak: number;
  taxaAcerto: number;

  performance: Record<string, PerformanceLevel>;

  disciplinaStats?: DisciplinaStats;
}

export function useTreinoConfig() {
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<
    Disciplina | ""
  >("");

  const [quantidade, setQuantidade] = useState(10);

  const [mostrarExplicacao, setMostrarExplicacao] = useState(false);

  const stats = useMemo<TreinoStats>(() => {
    const totalQuestoes = questoes.length;

    // Valores fixos (sem Math.random)
    const streak = 12;
    const taxaAcerto = 78;

    const performance: Record<string, PerformanceLevel> = {
      portugues: "bom",
      matematica: "medio",
      constitucional: "baixo",
      administrativo: "medio",
      informatica: "bom",
    };

    if (!disciplinaSelecionada) {
      return {
        count: 0,
        max: 0,
        totalQuestoes,
        streak,
        taxaAcerto,
        performance,
      };
    }

    const filtered = questoes.filter(
      (q) => q.disciplina === disciplinaSelecionada,
    );

    const total = filtered.length;
    const max = Math.min(total, 50);

    // ✅ valor constante em vez de Math.random()
    const taxaAcertoReal = 70;

    const disciplinaStats: DisciplinaStats = {
      nome:
        DISCIPLINAS_LABELS[
          disciplinaSelecionada as keyof typeof DISCIPLINAS_LABELS
        ] ?? disciplinaSelecionada,
      total,
      taxaAcerto: taxaAcertoReal,
    };

    return {
      count: total,
      max,
      totalQuestoes,
      streak,
      taxaAcerto,
      performance,
      disciplinaStats,
    };
  }, [disciplinaSelecionada]);

  // Ajusta quantidade automaticamente
  useEffect(() => {
    if (quantidade > stats.max && stats.max > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
