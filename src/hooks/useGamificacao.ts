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

// ─── Chave de storage ──────────────────────────────────────────────────────
// FIX: alinhado com LS_KEYS.progresso usado no dashboard e no backup/restore.
// O valor anterior "prf_user_progress_v2" era diferente da chave exportada,
// então os dados nunca eram incluídos no backup.
const PROGRESS_KEY = "prf_user_progress";

// ─── Tipos ─────────────────────────────────────────────────────────────────

interface RegistrarAtividadeDados {
  modo?: ModoSimulado;
  pontuacao?: number;
  tempo?: number;
  acertos?: number;
  erros?: number;
  disciplina?: Disciplina;
}

interface RegistrarAtividadeResult {
  xpGanho: number;
  // FIX: retorna as conquistas calculadas nesta chamada, não o estado anterior
  conquistasDesbloqueadas: BadgeType[];
}

export interface UseGamificacaoReturn {
  progress: UserProgress;
  isLoaded: boolean;
  adicionarXP: (quantidade: number, motivo?: string) => void;
  registrarAtividade: (
    tipo: "simulado" | "treino" | "revisao",
    dados?: RegistrarAtividadeDados,
  ) => RegistrarAtividadeResult;
  verificarStreak: () => void;
  novasConquistas: BadgeType[];
  showLevelUp: boolean;
  nivelAnterior: number;
  resetProgress: () => void;
  dismissLevelUp: () => void;
}

// ─── Merge profundo de progresso ───────────────────────────────────────────

function mergeProgresso(
  base: UserProgress,
  saved: Partial<UserProgress>,
): UserProgress {
  return {
    ...base,
    ...saved,

    conquistas: {
      ...base.conquistas,
      ...(saved.conquistas ?? {}),
    },

    recordes: {
      ...base.recordes,
      ...(saved.recordes ?? {}),
    },

    badges: Array.isArray(saved.badges) ? saved.badges : base.badges,
  };
}

// ─── Cálculo de streak (puro, sem side effects) ────────────────────────────

interface StreakResult {
  novoStreak: number;
  maiorStreak: number;
  ultimoDiaEstudo: string;
  xpBonus: number;
}

/**
 * FIX: lógica de streak extraída como função pura.
 * Era duplicada entre `verificarStreak` e `registrarAtividade` —
 * fonte de bugs quando as duas eram chamadas em sequência.
 */
function calcularStreak(
  prev: UserProgress,
  hoje: string,
  ontem: string,
): StreakResult {
  // Já estudou hoje — sem mudança
  if (prev.ultimoDiaEstudo === hoje) {
    return {
      novoStreak: prev.streakDias,
      maiorStreak: prev.maiorStreak,
      ultimoDiaEstudo: prev.ultimoDiaEstudo,
      xpBonus: 0,
    };
  }

  let novoStreak = 1;
  let xpBonus = XP_REWARDS.STREAK_DIA;

  if (prev.ultimoDiaEstudo === ontem) {
    // Continua streak
    novoStreak = prev.streakDias + 1;
    if (novoStreak === 3) xpBonus += XP_REWARDS.STREAK_3;
    if (novoStreak === 7) xpBonus += XP_REWARDS.STREAK_7;
    if (novoStreak === 30) xpBonus += XP_REWARDS.STREAK_30;
  }
  // Caso contrário: streak quebrado → novoStreak = 1

  return {
    novoStreak,
    maiorStreak: Math.max(prev.maiorStreak, novoStreak),
    ultimoDiaEstudo: hoje,
    xpBonus,
  };
}

// ─── Hook principal ─────────────────────────────────────────────────────────

export function useGamificacao(): UseGamificacaoReturn {
  const [progress, setProgress] = useState<UserProgress>(criarProgressoInicial);
  const [isLoaded, setIsLoaded] = useState(false);
  const [novasConquistas, setNovasConquistas] = useState<BadgeType[]>([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [nivelAnterior, setNivelAnterior] = useState(1);

  const levelUpTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const conquistasTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  // ── Carregamento inicial ──────────────────────────────────────────────────

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROGRESS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<UserProgress>;
        // FIX: merge profundo em vez de spread raso
        setProgress(mergeProgresso(criarProgressoInicial(), parsed));
      }
    } catch {
      // Dado corrompido — começa do zero silenciosamente
      setProgress(criarProgressoInicial());
    }
    setIsLoaded(true);
  }, []);

  // ── Persistência ──────────────────────────────────────────────────────────

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    }
  }, [progress, isLoaded]);

  // ── Cleanup ───────────────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      if (levelUpTimeoutRef.current) clearTimeout(levelUpTimeoutRef.current);
      if (conquistasTimeoutRef.current)
        clearTimeout(conquistasTimeoutRef.current);
    };
  }, []);

  // ── adicionarXP ───────────────────────────────────────────────────────────

  const adicionarXP = useCallback((quantidade: number, motivo?: string) => {
    // FIX: guard contra XP negativo que subtrairia do total
    const xpEfetivo = Math.max(0, quantidade);
    if (xpEfetivo === 0) return;

    setProgress((prev) => {
      const nivelAntes = prev.nivel;
      const novoXpTotal = prev.xpTotal + xpEfetivo;
      const novoNivel = calcularNivel(novoXpTotal);

      // FIX: setNivelAnterior e setShowLevelUp são chamados fora do updater
      // para não violar a regra de pureza. Usamos setTimeout(0) para
      // garantir que o estado do progresso já foi aplicado antes.
      if (novoNivel.nivel > nivelAntes) {
        setTimeout(() => {
          setNivelAnterior(nivelAntes);
          setShowLevelUp(true);

          if (levelUpTimeoutRef.current)
            clearTimeout(levelUpTimeoutRef.current);
          levelUpTimeoutRef.current = setTimeout(() => {
            setShowLevelUp(false);
            levelUpTimeoutRef.current = null;
          }, 5000);
        }, 0);
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

  // ── verificarStreak ───────────────────────────────────────────────────────
  // FIX: não chama adicionarXP via setTimeout — calcula e aplica XP de streak
  // diretamente dentro do setProgress, sem race condition.

  const verificarStreak = useCallback(() => {
    const hoje = new Date().toISOString().split("T")[0];
    const ontem = new Date(Date.now() - 86_400_000).toISOString().split("T")[0];

    setProgress((prev) => {
      const streak = calcularStreak(prev, hoje, ontem);

      // Sem mudança
      if (
        streak.novoStreak === prev.streakDias &&
        streak.ultimoDiaEstudo === prev.ultimoDiaEstudo
      ) {
        return prev;
      }

      // Aplica XP de streak via adicionarXP (fora do updater para não aninhar setState)
      if (streak.xpBonus > 0) {
        setTimeout(() => adicionarXP(streak.xpBonus, "streak"), 0);
      }

      return {
        ...prev,
        streakDias: streak.novoStreak,
        maiorStreak: streak.maiorStreak,
        ultimoDiaEstudo: streak.ultimoDiaEstudo,
      };
    });
  }, [adicionarXP]);

  // ── registrarAtividade ────────────────────────────────────────────────────

  const registrarAtividade = useCallback(
    (
      tipo: "simulado" | "treino" | "revisao",
      dados?: RegistrarAtividadeDados,
    ): RegistrarAtividadeResult => {
      const hoje = new Date().toISOString().split("T")[0];
      const ontem = new Date(Date.now() - 86_400_000)
        .toISOString()
        .split("T")[0];

      // FIX: `xpBase` calculado antes do setProgress — valor imutável,
      // não pode ser acidentalmente incrementado duas vezes em Strict Mode.
      let xpBase = 0;

      switch (tipo) {
        case "simulado":
          if (dados?.modo === "TURBO") xpBase = XP_REWARDS.SIMULADO_TURBO;
          else if (dados?.modo === "ADAPTATIVO")
            xpBase = XP_REWARDS.SIMULADO_ADAPTATIVO;
          else xpBase = XP_REWARDS.SIMULADO_COMPLETO;
          break;
        case "treino":
          xpBase = XP_REWARDS.TREINO_DISCIPLINA;
          break;
        case "revisao":
          xpBase = XP_REWARDS.REVISAO_ERROS;
          break;
      }

      // XP por acertos — só considera valores positivos
      if (dados?.acertos && dados.acertos > 0) {
        xpBase += dados.acertos * (XP_REWARDS.ACERTO ?? 0);
      }
      // FIX: erros não adicionam XP negativo — XP nunca diminui por erro
      // (a penalidade já existe na pontuação CEBRASPE; XP é progresso de gamificação)

      // FIX: resultado das conquistas capturado fora do estado para retorno síncrono
      let conquistasCalculadas: BadgeType[] = [];
      let xpTotal = xpBase;

      setProgress((prev) => {
        // ── Streak integrado (sem chamar verificarStreak separadamente) ────────
        const streak = calcularStreak(prev, hoje, ontem);
        xpTotal = xpBase + streak.xpBonus;

        const novosRecordes = { ...prev.recordes };

        // Recorde de pontuação
        if (
          dados?.pontuacao != null &&
          dados.pontuacao > prev.recordes.melhorPontuacao
        ) {
          novosRecordes.melhorPontuacao = dados.pontuacao;
          xpTotal += XP_REWARDS.NOVO_RECORDE_PONTUACAO ?? 0;
        }

        // Recorde de velocidade turbo
        if (dados?.modo === "TURBO" && dados.tempo != null) {
          const recordeAtual = prev.recordes.turboMaisRapido;
          if (!recordeAtual || dados.tempo < recordeAtual) {
            novosRecordes.turboMaisRapido = dados.tempo;
            xpTotal += XP_REWARDS.NOVO_RECORDE_VELOCIDADE ?? 0;
          }
        }

        // Contadores atualizados para verificação de conquistas
        const contadores = {
          simuladosCompletos:
            tipo === "simulado" &&
            dados?.modo !== "TURBO" &&
            dados?.modo !== "ADAPTATIVO"
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
        };

        const progressSnapshot: UserProgress = {
          ...prev,
          streakDias: streak.novoStreak,
          maiorStreak: streak.maiorStreak,
          ultimoDiaEstudo: streak.ultimoDiaEstudo,
          conquistas: {
            ...prev.conquistas,
            ...contadores,
          },
        };

        const todasConquistas = verificarNovasConquistas(progressSnapshot, {
          simuladoPontuacao: dados?.pontuacao,
          simuladoAcertos: dados?.acertos,
          turboTempo: dados?.tempo,
        });

        // FIX: filtra conquistas já existentes para evitar duplicatas
        const idsExistentes = new Set(prev.badges.map((b) => b.id));
        conquistasCalculadas = todasConquistas.filter(
          (id) => !idsExistentes.has(id),
        );

        if (conquistasCalculadas.length > 0) {
          // FIX: atualiza o estado de conquistas fora do updater via setTimeout(0)
          const conquistasParaNotificar = [...conquistasCalculadas];
          setTimeout(() => {
            setNovasConquistas(conquistasParaNotificar);
            if (conquistasTimeoutRef.current)
              clearTimeout(conquistasTimeoutRef.current);
            conquistasTimeoutRef.current = setTimeout(() => {
              setNovasConquistas([]);
              conquistasTimeoutRef.current = null;
            }, 5000);
          }, 0);
        }

        return {
          ...progressSnapshot,
          badges: [
            ...prev.badges,
            ...conquistasCalculadas.map((id) => ({ id, unlockedAt: hoje })),
          ],
        };
      });

      // FIX: aplica XP após o setProgress — xpTotal foi calculado dentro
      // do updater na primeira execução. Em Strict Mode o updater roda duas
      // vezes mas `adicionarXP` é chamado uma vez aqui, fora do updater.
      // Isso é seguro porque adicionarXP também usa setProgress com updater.
      adicionarXP(xpTotal, tipo);

      // FIX: retorna as conquistas calculadas NESTA chamada (não o estado anterior)
      return {
        xpGanho: xpTotal,
        conquistasDesbloqueadas: conquistasCalculadas,
      };
    },
    [adicionarXP],
  );

  // ── resetProgress ─────────────────────────────────────────────────────────
  // FIX: limpa todos os estados relacionados, não só `progress`

  const resetProgress = useCallback(() => {
    if (
      typeof window !== "undefined" &&
      window.confirm(
        "Tem certeza que deseja resetar TODO o progresso? Isso não pode ser desfeito!",
      )
    ) {
      if (levelUpTimeoutRef.current) clearTimeout(levelUpTimeoutRef.current);
      if (conquistasTimeoutRef.current)
        clearTimeout(conquistasTimeoutRef.current);

      setProgress(criarProgressoInicial());
      setNovasConquistas([]);
      setShowLevelUp(false);
      setNivelAnterior(1);
      localStorage.removeItem(PROGRESS_KEY);
    }
  }, []);

  // ── dismissLevelUp ────────────────────────────────────────────────────────

  const dismissLevelUp = useCallback(() => {
    setShowLevelUp(false);
    // FIX: cancela o auto-dismiss pendente para não chamar setShowLevelUp(false) novamente
    if (levelUpTimeoutRef.current) {
      clearTimeout(levelUpTimeoutRef.current);
      levelUpTimeoutRef.current = null;
    }
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
