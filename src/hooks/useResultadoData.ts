// src/hooks/useResultadoData.ts

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { HistoricoSimulado } from "@/data/questoes/index";
import { classificarDesempenho } from "@/lib/simulado-logic";

const STORAGE_KEYS = {
  ULTIMO_SIMULADO: "prf_ultimo_resultado", // Corrigido para bater com o finalizar
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
  const searchParams = useSearchParams();
  const [simulado, setSimulado] = useState<HistoricoSimulado | null>(null);
  const [historico, setHistorico] = useState<HistoricoSimulado[]>([]);
  const [comparacao, setComparacao] = useState<ComparacaoAnterior | null>(null);
  const [erroCarregamento, setErroCarregamento] = useState<string | null>(null);
  const inicializadoRef = useRef(false);

  useEffect(() => {
    if (inicializadoRef.current) return;
    inicializadoRef.current = true;

    try {
      // Tentar buscar por ID na URL primeiro
      const resultadoId = searchParams.get("id");
      let simuladoAtual: HistoricoSimulado | null = null;

      // Buscar histórico completo
      const historicoDados = localStorage.getItem(STORAGE_KEYS.HISTORICO);
      let historicoLista: HistoricoSimulado[] = [];

      if (historicoDados) {
        try {
          const parsed = JSON.parse(historicoDados);
          if (Array.isArray(parsed)) {
            historicoLista = parsed;
          } else if (parsed && typeof parsed === "object" && "data" in parsed) {
            historicoLista = parsed.data;
          }
        } catch (e) {
          console.error("Erro ao parsear histórico:", e);
        }
      }

      // Se tem ID na URL, buscar pelo ID
      if (resultadoId) {
        simuladoAtual =
          historicoLista.find((h) => h.id === resultadoId) || null;
      }

      // Se não encontrou pelo ID, tentar último resultado salvo
      if (!simuladoAtual) {
        const ultimoDados = localStorage.getItem(STORAGE_KEYS.ULTIMO_SIMULADO);
        if (ultimoDados) {
          simuladoAtual = JSON.parse(ultimoDados);
        }
      }

      // Se ainda não tem resultado, tentar o primeiro do histórico
      if (!simuladoAtual && historicoLista.length > 0) {
        simuladoAtual = historicoLista[0];
      }

      if (!simuladoAtual) {
        console.warn("Nenhum resultado encontrado");
        router.push("/dashboard");
        return;
      }

      // Validar dados
      if (!simuladoAtual.estatisticas || !simuladoAtual.questoes) {
        throw new Error("Dados do simulado inválidos");
      }

      setSimulado(simuladoAtual);
      setHistorico(historicoLista);

      // Compara com simulado anterior
      const indexAtual = historicoLista.findIndex(
        (h) => h.id === simuladoAtual.id,
      );

      if (indexAtual !== -1 && indexAtual < historicoLista.length - 1) {
        const anterior = historicoLista[indexAtual + 1];
        if (anterior) {
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
  }, [router, searchParams]);

  const classificacao = simulado
    ? classificarDesempenho(
        simulado.estatisticas.percentual,
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
