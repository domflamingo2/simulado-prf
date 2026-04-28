"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { HistoricoSimulado } from "@/data/index";
import { classificarDesempenho } from "@/lib/simulado-logic";

type FiltroRevisao = "todas" | "erros" | "acertos" | "brancos" | "marcadas";
type OrdenacaoRevisao = "numero" | "disciplina" | "dificuldade";

interface FiltrosState {
  tipo: FiltroRevisao;
  disciplina: string | "todas";
  ordenacao: OrdenacaoRevisao;
  busca: string;
}

export function useRevisaoData() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [simulados, setSimulados] = useState<HistoricoSimulado[]>([]);
  const [simuladoSelecionado, setSimuladoSelecionado] =
    useState<HistoricoSimulado | null>(null);
  const [marcadas, setMarcadas] = useState<number[]>([]);
  const [filtros, setFiltros] = useState<FiltrosState>({
    tipo: (searchParams.get("filtro") as FiltroRevisao) || "todas",
    disciplina: "todas",
    ordenacao: "numero",
    busca: "",
  });

  useEffect(() => {
    const historico = JSON.parse(localStorage.getItem("prf_historico") || "[]");
    const ultimo = localStorage.getItem("prf_ultimo_simulado");

    if (historico.length === 0 && !ultimo) {
      router.push("/");
      return;
    }

    setSimulados(historico);

    const idFromUrl = searchParams.get("id");
    const selecionado = idFromUrl
      ? historico.find((s: HistoricoSimulado) => s.id === idFromUrl)
      : ultimo
        ? JSON.parse(ultimo)
        : historico[0];

    if (selecionado) {
      setSimuladoSelecionado(selecionado);
      const chaveMarcadas = `prf_marcadas_${selecionado.id}`;
      setMarcadas(JSON.parse(localStorage.getItem(chaveMarcadas) || "[]"));
    }
  }, [router, searchParams]);

  // Persiste marcações
  useEffect(() => {
    if (!simuladoSelecionado) return;
    const chave = `prf_marcadas_${simuladoSelecionado.id}`;
    localStorage.setItem(chave, JSON.stringify(marcadas));
  }, [marcadas, simuladoSelecionado]);

  const toggleMarcacao = useCallback((questaoRealIndex: number) => {
    setMarcadas((prev) =>
      prev.includes(questaoRealIndex)
        ? prev.filter((m) => m !== questaoRealIndex)
        : [...prev, questaoRealIndex],
    );
  }, []);

  const estatisticas = useMemo(() => {
    if (!simuladoSelecionado) return null;

    const stats = simuladoSelecionado.estatisticas;
    const classificacao = classificarDesempenho(
      stats.pontuacao,
      stats.totalQuestoes,
    );

    return {
      ...stats,
      classificacao,
      data: new Date(simuladoSelecionado.data).toLocaleDateString("pt-BR"),
    };
  }, [simuladoSelecionado]);

  return {
    simulados,
    simuladoSelecionado,
    setSimuladoSelecionado,
    marcadas,
    toggleMarcacao,
    filtros,
    setFiltros,
    estatisticas,
  };
}
