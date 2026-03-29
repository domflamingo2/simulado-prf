"use client";

import {
  XP_REWARDS,
  calcularNivel,
  criarProgressoInicial,
  verificarNovasConquistas,
} from "@/data/gamificacao";
import {
  BadgeType,
  Disciplina,
  ModoSimulado,
  UserProgress,
} from "@/data/types";
import { useCallback, useEffect, useState } from "react";

const PROGRESS_KEY = "prf_user_progress_v2";

interface UseGamificacaoReturn {
  progress: UserProgress;
  isLoaded: boolean;
  adicionarXP: (quantidade: number, motivo?: string) => void;
  registrarAtividade: (
    tipo: "simulado" | "treino" | "revisao",
    dados?: {
      modo?: ModoSimulado;
      pontuacao?: number;
      tempo?: number;
      acertos?: number;
      erros?: number;
      disciplina?: Disciplina;
    },
  ) => { xpGanho: number; novasConquistas: BadgeType[] };
  verificarStreak: () => void;
  novasConquistas: BadgeType[];
  showLevelUp: boolean;
  nivelAnterior: number;
  resetProgress: () => void;
  dismissLevelUp: () => void;
}

export function useGamificacao(): UseGamificacaoReturn {
  const [progress, setProgress] = useState<UserProgress>(
    criarProgressoInicial(),
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [novasConquistas, setNovasConquistas] = useState<BadgeType[]>([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [nivelAnterior, setNivelAnterior] = useState(1);

  // Carregar progresso do localStorage
  useEffect(() => {
    const dados = localStorage.getItem(PROGRESS_KEY);
    if (dados) {
      try {
        const parsed = JSON.parse(dados);
        // Migração de dados antigos se necessário
        setProgress({ ...criarProgressoInicial(), ...parsed });
      } catch {
        setProgress(criarProgressoInicial());
      }
    }
    setIsLoaded(true);
  }, []);

  // Salvar progresso quando mudar
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    }
  }, [progress, isLoaded]);

  const adicionarXP = useCallback((quantidade: number, motivo?: string) => {
    setProgress((prev) => {
      const nivelAntes = prev.nivel;
      const novoXpTotal = prev.xpTotal + quantidade;
      const novoNivel = calcularNivel(novoXpTotal);

      if (novoNivel.nivel > nivelAntes) {
        setNivelAnterior(nivelAntes);
        setShowLevelUp(true);
        // Auto-hide após 5 segundos
        setTimeout(() => setShowLevelUp(false), 5000);
      }

      return {
        ...prev,
        xpTotal: novoXpTotal,
        nivel: novoNivel.nivel,
        xpAtual: novoXpTotal - novoNivel.xpMin,
        xpParaProximoNivel: novoNivel.xpMax - novoXpTotal,
      };
    });
  }, []);

  const verificarStreak = useCallback(() => {
    const hoje = new Date().toISOString().split("T")[0];
    const ontem = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    setProgress((prev) => {
      if (prev.ultimoDiaEstudo === hoje) return prev; // Já estudou hoje

      let novoStreak = 1;
      let xpStreak = XP_REWARDS.STREAK_DIA;

      if (prev.ultimoDiaEstudo === ontem) {
        // Continuou streak
        novoStreak = prev.streakDias + 1;

        // Bônus de streak
        if (novoStreak === 3) xpStreak += XP_REWARDS.STREAK_3;
        if (novoStreak === 7) xpStreak += XP_REWARDS.STREAK_7;
        if (novoStreak === 30) xpStreak += XP_REWARDS.STREAK_30;
      }

      // Aplica XP de streak
      if (xpStreak > XP_REWARDS.STREAK_DIA) {
        setTimeout(
          () => adicionarXP(xpStreak - XP_REWARDS.STREAK_DIA, "streak-bonus"),
          0,
        );
      }

      return {
        ...prev,
        streakDias: novoStreak,
        maiorStreak: Math.max(prev.maiorStreak, novoStreak),
        ultimoDiaEstudo: hoje,
      };
    });
  }, [adicionarXP]);

  const registrarAtividade = useCallback(
    (
      tipo: "simulado" | "treino" | "revisao",
      dados?: {
        modo?: ModoSimulado;
        pontuacao?: number;
        tempo?: number;
        acertos?: number;
        erros?: number;
        disciplina?: Disciplina;
      },
    ): { xpGanho: number; novasConquistas: BadgeType[] } => {
      // Verifica streak primeiro
      verificarStreak();

      let xpGanho = 0;
      const hoje = new Date().toISOString().split("T")[0];

      // Calcula XP base
      switch (tipo) {
        case "simulado":
          if (dados?.modo === "TURBO") xpGanho = XP_REWARDS.SIMULADO_TURBO;
          else if (dados?.modo === "ADAPTATIVO")
            xpGanho = XP_REWARDS.SIMULADO_ADAPTATIVO;
          else xpGanho = XP_REWARDS.SIMULADO_COMPLETO;
          break;
        case "treino":
          xpGanho = XP_REWARDS.TREINO_DISCIPLINA;
          break;
        case "revisao":
          xpGanho = XP_REWARDS.REVISAO_ERROS;
          break;
      }

      // XP por acertos
      if (dados?.acertos) {
        xpGanho += dados.acertos * XP_REWARDS.ACERTO;
      }

      // XP por erros (consolação)
      if (dados?.erros) {
        xpGanho += dados.erros * XP_REWARDS.ERRO;
      }

      // Bônus de recorde
      setProgress((prev) => {
        const novosRecordes = { ...prev.conquistas.recordes };

        // Verifica recorde de pontuação
        if (
          dados?.pontuacao &&
          dados.pontuacao > prev.conquistas.recordes.melhorPontuacao
        ) {
          novosRecordes.melhorPontuacao = dados.pontuacao;
          xpGanho += XP_REWARDS.NOVO_RECORDE_PONTUACAO;
        }

        // Verifica recorde de velocidade (turbo)
        if (dados?.modo === "TURBO" && dados.tempo) {
          const recordeAtual = prev.conquistas.recordes.turboMaisRapido;
          if (!recordeAtual || dados.tempo < recordeAtual) {
            novosRecordes.turboMaisRapido = dados.tempo;
            xpGanho += XP_REWARDS.NOVO_RECORDE_VELOCIDADE;
          }
        }

        // Atualiza conquistas
        const novasConquistas = verificarNovasConquistas(
          {
            ...prev,
            streakDias:
              prev.streakDias + (prev.ultimoDiaEstudo === hoje ? 0 : 1),
          },
          {
            simuladoPontuacao: dados?.pontuacao,
            simuladoAcertos: dados?.acertos,
            turboTempo: dados?.tempo,
          },
        );

        if (novasConquistas.length > 0) {
          setNovasConquistas(novasConquistas);
          setTimeout(() => setNovasConquistas([]), 5000);
        }

        // Atualiza estatísticas
        const novasConquistasStats = {
          ...prev.conquistas,
          simuladosCompletos:
            tipo === "simulado" && dados?.modo !== "TURBO"
              ? prev.conquistas.simuladosCompletos + 1
              : prev.conquistas.simuladosCompletos,
          simuladosTurbo:
            tipo === "simulado" && dados?.modo === "TURBO"
              ? prev.conquistas.simuladosTurbo + 1
              : prev.conquistas.simuladosTurbo,
          simuladosAdaptativos:
            tipo === "simulado" && dados?.modo === "ADAPTATIVO"
              ? prev.conquistas.simuladosAdaptativos + 1
              : prev.conquistas.simuladosAdaptativos,
          treinosDisciplina:
            tipo === "treino"
              ? prev.conquistas.treinosDisciplina + 1
              : prev.conquistas.treinosDisciplina,
          revisoesErros:
            tipo === "revisao"
              ? prev.conquistas.revisoesErros + 1
              : prev.conquistas.revisoesErros,
          totalQuestoesRespondidas:
            prev.conquistas.totalQuestoesRespondidas +
            (dados?.acertos || 0) +
            (dados?.erros || 0),
          totalAcertos: prev.conquistas.totalAcertos + (dados?.acertos || 0),
          totalErros: prev.conquistas.totalErros + (dados?.erros || 0),
          recordes: novosRecordes,
        };

        return {
          ...prev,
          conquistas: novasConquistasStats,
          badges: [
            ...prev.badges,
            ...novasConquistas.map((id) => ({ id, unlockedAt: hoje })),
          ],
        };
      });

      // Aplica XP
      adicionarXP(xpGanho, tipo);

      return { xpGanho, novasConquistas };
    },
    [adicionarXP, verificarStreak],
  );

  const resetProgress = useCallback(() => {
    if (
      confirm(
        "Tem certeza que deseja resetar TODO o progresso? Isso não pode ser desfeito!",
      )
    ) {
      setProgress(criarProgressoInicial());
      localStorage.removeItem(PROGRESS_KEY);
    }
  }, []);

  const dismissLevelUp = useCallback(() => {
    setShowLevelUp(false);
  }, []);

  return {
    progress,
    isLoaded,
    adicionarXP,
    registrarAtividade,
    verificarStreak,
    novasConquistas,
    showLevelUp,
    nivelAnterior,
    resetProgress,
    dismissLevelUp,
  };
}
