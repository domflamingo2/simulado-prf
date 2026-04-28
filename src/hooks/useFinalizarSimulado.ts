"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { HistoricoSimulado, QuestaoRespondida } from "@/data/index";
import { useGamificacao } from "@/hooks/useGamificacao";
import { calcularEstatisticas } from "@/lib/simulado-logic";

type ModoEnum = "COMPLETO" | "TURBO" | "ADAPTATIVO";

function lerHistoricoStorage(): HistoricoSimulado[] {
  try {
    const raw = localStorage.getItem("prf_historico");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed) &&
      "data" in parsed
    ) {
      return Array.isArray(parsed.data) ? parsed.data : [];
    }
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function salvarHistoricoStorage(historico: HistoricoSimulado[]): void {
  localStorage.setItem("prf_historico", JSON.stringify(historico));
}

export function useFinalizarSimulado() {
  const router = useRouter();
  const { registrarAtividade } = useGamificacao();
  const [isFinalizing, setIsFinalizing] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const finalizarSimulado = useCallback(
    async (
      questoes: QuestaoRespondida[],
      tempoInicio: number,
      modo: ModoEnum,
      limparProgresso: () => void,
      onSuccess?: () => void,
    ) => {
      if (isFinalizing) return;

      setIsFinalizing(true);

      try {
        const tempoTotal = Math.floor((Date.now() - tempoInicio) / 1000);
        const estatisticas = calcularEstatisticas(questoes, tempoTotal);

        // FIX: passa `estatisticas` diretamente em vez de replicar cada campo
        // manualmente — evita erros de compilação quando novos campos são
        // adicionados à interface EstatisticasSimulado (como `naoRespondidas`).
        const historico: HistoricoSimulado = {
          id: `sim_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
          data: new Date().toISOString(),
          modo,
          estatisticas,
          questoes: questoes.map((q) => ({
            ...q,
            disciplina: q.disciplina || "GERAL",
          })),
          xpGanho: 0,
        };

        const historicoExistente = lerHistoricoStorage();
        const novoHistorico = [historico, ...historicoExistente];
        salvarHistoricoStorage(novoHistorico);

        window.dispatchEvent(
          new StorageEvent("storage", {
            key: "prf_historico",
            newValue: JSON.stringify(novoHistorico),
          }),
        );

        const { xpGanho } = registrarAtividade("simulado", {
          pontuacao: estatisticas.pontuacao,
          acertos: estatisticas.acertos,
          erros: estatisticas.erros,
          modo,
          tempo: tempoTotal,
        });

        historico.xpGanho = xpGanho;
        salvarHistoricoStorage([historico, ...historicoExistente]);

        limparProgresso();

        onSuccess?.();

        setTimeout(() => {
          if (isMountedRef.current) router.push("/resultado");
        }, 1000);
      } catch (err) {
        console.error("Erro ao finalizar simulado:", err);
        alert("Erro ao salvar resultados. Tente novamente.");
      } finally {
        if (isMountedRef.current) setIsFinalizing(false);
      }
    },
    [isFinalizing, registrarAtividade, router],
  );

  return { finalizarSimulado, isFinalizing };
}
