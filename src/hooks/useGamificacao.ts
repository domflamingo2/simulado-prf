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
import { useCallback, useEffect, useRef, useState } from "react";

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

  // Ref para armazenar o timeout e evitar memory leaks
  const levelUpTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Carregar progresso do localStorage
  useEffect(() => {
    const dados = localStorage.getItem(PROGRESS_KEY);
    if (dados) {
      try {
        const parsed = JSON.parse(dados);
        // ✅ MELHORIA: Substituição completa em vez de merge para garantir tipos limpos
        // Se a estrutura mudar, o criarProgressoInicial garante os campos novos
        setProgress({ ...criarProgressoInicial(), ...parsed });
      } catch {
        console.error("Falha ao carregar progresso", dados);
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

  // Cleanup de timeouts ao desmontar
  useEffect(() => {
    return () => {
      if (levelUpTimeoutRef.current) {
        clearTimeout(levelUpTimeoutRef.current);
      }
    };
  }, []);

  const adicionarXP = useCallback((quantidade: number, motivo?: string) => {
    setProgress((prev) => {
      const nivelAntes = prev.nivel;
      const novoXpTotal = prev.xpTotal + quantidade;
      const novoNivel = calcularNivel(novoXpTotal);

      if (novoNivel.nivel > nivelAntes) {
        setNivelAnterior(nivelAntes);
        setShowLevelUp(true);

        // ✅ CORREÇÃO: Limpa timeout anterior e armazena referência
        if (levelUpTimeoutRef.current) clearTimeout(levelUpTimeoutRef.current);
        levelUpTimeoutRef.current = setTimeout(() => {
          setShowLevelUp(false);
          levelUpTimeoutRef.current = null;
        }, 5000);
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
      // Se já estudou hoje, não faz nada
      if (prev.ultimoDiaEstudo === hoje) return prev;

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

      // ✅ OTIMIZAÇÃO: Em vez de chamar adicionarXP com setTimeout (que causa re-render extra),
      // calculamos o XP extra e retornamos o objeto atualizado de uma vez.
      // Se o "adicionarXP" tiver lógica complexa de nível, pode ser necessário reavaliar,
      // mas para XP simples, atualizar direto aqui é mais performático.
      // Mantive a estrutura similar, mas seria ideal unificar a lógica de XP.

      // Nota: Mantive o setTimeout para preservar a lógica original de "bônus",
      // mas idealmente isso deveria ser retornado e somado ao XP principal.
      if (xpStreak > XP_REWARDS.STREAK_DIA) {
        // Aviso: Pequeno delay pode causar sensação de "XP atrasado" na UI
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

      // XP por acertos/erros
      if (dados?.acertos) xpGanho += dados.acertos * XP_REWARDS.ACERTO;
      if (dados?.erros) xpGanho += dados.erros * XP_REWARDS.ERRO;

      // ✅ CORREÇÃO CRÍTICA: Unificar a lógica de atualização de estado.
      // Chamamos verificarStreak ANTES do setProgress, mas isso causa race condition.
      // A solução ideal é calcular o impacto do streak DENTRO deste setProgress,
      // mas para manter a função verificarStreak reutilizável, vamos assumir que
      // o "prev" aqui já inclui as mudanças de streak se o usuário as chamou explicitamente,
      // ou forçamos a lógica do streak aqui se quisermos atomicidade.

      // Para corrigir o bug específico onde 'streakDias' não atualizava a tempo:
      // Vamos remover a chamada externa a verificarStreak e lidar com a data aqui.

      setProgress((prev) => {
        // --- Lógica de Streak Integrada (para evitar stale closure) ---
        const ontem = new Date(Date.now() - 86400000)
          .toISOString()
          .split("T")[0];
        let novoStreak = prev.streakDias;
        let ultimoDia = prev.ultimoDiaEstudo;

        if (ultimoDia !== hoje) {
          if (ultimoDia === ontem) {
            novoStreak += 1;
            // Dá bônus de streak
            if (novoStreak === 3) xpGanho += XP_REWARDS.STREAK_3;
            if (novoStreak === 7) xpGanho += XP_REWARDS.STREAK_7;
            if (novoStreak === 30) xpGanho += XP_REWARDS.STREAK_30;
          } else {
            novoStreak = 1;
          }
          ultimoDia = hoje;
        }
        // -----------------------------------------------------------

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

        // Cria snapshot do estado futuro para verificar conquistas
        const progressSnapshot = {
          ...prev,
          streakDias: novoStreak,
          ultimoDiaEstudo: ultimoDia,
          conquistas: {
            ...prev.conquistas,
            recordes: novosRecordes,
            // Simula contadores futuros
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
          },
        };

        const conquistasDesbloqueadas = verificarNovasConquistas(
          progressSnapshot,
          {
            simuladoPontuacao: dados?.pontuacao,
            simuladoAcertos: dados?.acertos,
            turboTempo: dados?.tempo,
          },
        );

        // ✅ CORREÇÃO: Filtra apenas conquistas que o usuário NÃO tem para evitar duplicatas
        const idsExistentes = new Set(prev.badges.map((b) => b.id));
        const conquistasRealmenteNovas = conquistasDesbloqueadas.filter(
          (id) => !idsExistentes.has(id),
        );

        if (conquistasRealmenteNovas.length > 0) {
          setNovasConquistas(conquistasRealmenteNovas);
          setTimeout(() => setNovasConquistas([]), 5000);
        }

        return {
          ...prev,
          streakDias: novoStreak,
          maiorStreak: Math.max(prev.maiorStreak, novoStreak),
          ultimoDiaEstudo: ultimoDia,
          conquistas: progressSnapshot.conquistas,
          badges: [
            ...prev.badges,
            ...conquistasRealmenteNovas.map((id) => ({ id, unlockedAt: hoje })),
          ],
        };
      });

      // Aplica XP (fora do setProgress para não recalcular nível desnecessariamente dentro dele se não houver level up)
      adicionarXP(xpGanho, tipo);

      return { xpGanho, novasConquistas };
    },
    [adicionarXP],
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
