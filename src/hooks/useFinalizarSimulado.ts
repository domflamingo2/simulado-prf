// src/hooks/useFinalizarSimulado.ts

"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { HistoricoSimulado, QuestaoRespondida } from "@/data/questoes/index";
import { useGamificacao } from "@/hooks/useGamificacao";
import { calcularEstatisticas } from "@/lib/simulado-logic";

type ModoEnum = "COMPLETO" | "TURBO" | "ADAPTATIVO";

function lerHistoricoStorage(): HistoricoSimulado[] {
  try {
    const raw = localStorage.getItem("prf_historico");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    if (parsed && typeof parsed === "object" && "data" in parsed) {
      return Array.isArray(parsed.data) ? parsed.data : [];
    }
    return [];
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

        // Criar ID único para o simulado
        const simuladoId = `sim_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

        const simulado: HistoricoSimulado = {
          id: simuladoId,
          data: new Date().toISOString(),
          modo,
          estatisticas,
          questoes: questoes.map((q) => ({
            ...q,
            disciplina: q.disciplina || "GERAL",
          })),
          xpGanho: 0,
        };

        // Atualizar histórico
        const historicoExistente = lerHistoricoStorage();
        const novoHistorico = [simulado, ...historicoExistente];
        salvarHistoricoStorage(novoHistorico);

        // Registrar atividade e ganhar XP
        const { xpGanho } = registrarAtividade("simulado", {
          pontuacao: estatisticas.pontuacao,
          acertos: estatisticas.acertos,
          erros: estatisticas.erros,
          modo,
          tempo: tempoTotal,
        });

        // Atualizar XP no simulado
        simulado.xpGanho = xpGanho;
        salvarHistoricoStorage([simulado, ...historicoExistente]);

        // Salvar como último resultado para fácil acesso
        localStorage.setItem("prf_ultimo_resultado", JSON.stringify(simulado));

        // Disparar evento para sincronizar outras abas
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: "prf_historico",
            newValue: JSON.stringify([simulado, ...historicoExistente]),
          }),
        );

        limparProgresso();

        onSuccess?.();

        // Redirecionar para página de resultado com o ID
        setTimeout(() => {
          if (isMountedRef.current) {
            console.log("🚀 Redirecionando para /resultado?id=", simuladoId);
            router.push(`/resultado?id=${simuladoId}`);
          }
        }, 500);
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
