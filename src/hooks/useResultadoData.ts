"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { HistoricoSimulado } from "@/data/types";
import { classificarDesempenho } from "@/lib/simulado-logic";

const STORAGE_KEYS = {
  ULTIMO_SIMULADO: "prf_ultimo_simulado",
  HISTORICO: "prf_historico",
} as const;

type Tendencia = "melhorou" | "piorou" | "estavel";

interface ComparacaoAnterior {
  tendencia: Tendencia;
  diferencaPontos: number;
  diferencaPercentual: number;
}

export function useResultadoData() {
  const router = useRouter();
  const [simulado, setSimulado] = useState<HistoricoSimulado | null>(null);
  const [historico, setHistorico] = useState<HistoricoSimulado[]>([]);
  const [comparacao, setComparacao] = useState<ComparacaoAnterior | null>(null);
  const [erroCarregamento, setErroCarregamento] = useState<string | null>(null);
  const inicializadoRef = useRef(false);

  useEffect(() => {
    if (inicializadoRef.current) return;
    inicializadoRef.current = true;

    try {
      const dados = localStorage.getItem(STORAGE_KEYS.ULTIMO_SIMULADO);
      const historicoDados = localStorage.getItem(STORAGE_KEYS.HISTORICO);

      if (!dados) {
        router.push("/");
        return;
      }

      const simuladoAtual: HistoricoSimulado = JSON.parse(dados);

      if (!simuladoAtual.estatisticas || !simuladoAtual.questoes) {
        throw new Error("Dados do simulado inválidos");
      }

      let historicoLista: HistoricoSimulado[] = [];
      if (historicoDados) {
        const parsed = JSON.parse(historicoDados);
        if (
          parsed &&
          typeof parsed === "object" &&
          !Array.isArray(parsed) &&
          "data" in parsed
        ) {
          historicoLista = parsed.data;
        } else if (Array.isArray(parsed)) {
          historicoLista = parsed;
        }
      }

      setSimulado(simuladoAtual);
      setHistorico(historicoLista);

      // Compara com anterior
      if (historicoLista.length >= 2) {
        const indexAtual = historicoLista.findIndex(
          (h) => h.data === simuladoAtual.data,
        );

        if (indexAtual > 0) {
          const anterior = historicoLista[indexAtual - 1];
          const diferenca =
            simuladoAtual.estatisticas.pontuacao -
            anterior.estatisticas.pontuacao;
          const diferencaPct =
            simuladoAtual.estatisticas.percentual -
            anterior.estatisticas.percentual;

          let tendencia: Tendencia = "estavel";
          if (diferenca > 3) tendencia = "melhorou";
          else if (diferenca < -3) tendencia = "piorou";

          setComparacao({
            tendencia,
            diferencaPontos: diferenca,
            diferencaPercentual: diferencaPct,
          });
        }
      }
    } catch (error) {
      console.error("Erro ao carregar resultado:", error);
      setErroCarregamento(
        "Não foi possível carregar os resultados do simulado.",
      );
    }
  }, [router]);

  const classificacao = simulado
    ? classificarDesempenho(
        simulado.estatisticas.pontuacao,
        simulado.estatisticas.totalQuestoes,
      )
    : null;

  return {
    simulado,
    historico,
    comparacao,
    classificacao,
    erroCarregamento,
  };
}
