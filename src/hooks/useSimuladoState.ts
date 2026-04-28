"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Questao, QuestaoRespondida } from "@/data/index";
import {
  gerarAnaliseAdaptativa,
  selecionarQuestoesAdaptativas,
} from "@/lib/adaptativo";
import { selecionarQuestoes } from "@/lib/simulado-logic";

type ModoSimulado = "completo" | "turbo" | "adaptativo";

interface SimuladoState {
  questoes: QuestaoRespondida[];
  questaoAtual: number;
  tempoInicio: number;
  modo: ModoSimulado;
  marcadasParaRevisao: number[];
  ultimoAutoSave: number;
}

const CONFIG = {
  AUTO_SALVAR_INTERVALO: 30000,
  EXPIRACAO_PROGRESSO: 24 * 60 * 60 * 1000,
  CHAVE_PROGRESSO: "prf_simulado_progresso",
  TEMPO_ANALISE_IA: 2000,
};

function lerHistoricoStorage() {
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

export function useSimuladoState(
  modo: ModoSimulado,
  questoesData: Questao[],
  onLoadingComplete?: () => void,
) {
  const [state, setState] = useState<SimuladoState | null>(null);
  const [loading, setLoading] = useState(true);
  const [analiseIA, setAnaliseIA] = useState<ReturnType<
    typeof gerarAnaliseAdaptativa
  > | null>(null);
  const stateRef = useRef<SimuladoState | null>(null);
  const chaveProgresso = `${CONFIG.CHAVE_PROGRESSO}_${modo}`;

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const salvarProgresso = useCallback(
    (estado: SimuladoState | null) => {
      if (!estado) return;
      try {
        localStorage.setItem(
          chaveProgresso,
          JSON.stringify({ ...estado, ultimoAutoSave: Date.now() }),
        );
      } catch (err) {
        console.error("Erro ao salvar progresso:", err);
      }
    },
    [chaveProgresso],
  );

  const limparProgresso = useCallback(() => {
    localStorage.removeItem(chaveProgresso);
  }, [chaveProgresso]);

  const inicializar = useCallback(async () => {
    // Tenta retomar progresso salvo
    const salvo = localStorage.getItem(chaveProgresso);
    if (salvo) {
      try {
        const parsed: SimuladoState = JSON.parse(salvo);
        const expirado =
          Date.now() - parsed.tempoInicio > CONFIG.EXPIRACAO_PROGRESSO;

        if (!expirado && parsed.modo === modo) {
          const continuar = window.confirm(
            "Você tem um simulado em andamento. Deseja continuar de onde parou?",
          );
          if (continuar) {
            setState(parsed);
            setLoading(false);
            onLoadingComplete?.();
            return;
          }
        }
      } catch {
        // dado corrompido
      }
      limparProgresso();
    }

    // Inicia novo simulado
    try {
      let selecionadas: Questao[] = [];

      if (modo === "adaptativo") {
        const historico = lerHistoricoStorage();
        const analise = gerarAnaliseAdaptativa(historico, questoesData);
        setAnaliseIA(analise);

        await new Promise<void>((r) => setTimeout(r, CONFIG.TEMPO_ANALISE_IA));

        const resultado = selecionarQuestoesAdaptativas(
          questoesData,
          historico,
          60,
        );
        selecionadas = resultado.questoes;
      } else {
        selecionadas = selecionarQuestoes(questoesData, {
          modo: modo === "turbo" ? "TURBO" : "COMPLETO",
        });
      }

      const questoesIniciais: QuestaoRespondida[] = selecionadas.map((q) => ({
        ...q,
        disciplina: q.disciplina || "GERAL",
        respostaUsuario: undefined,
      }));

      const novoState: SimuladoState = {
        questoes: questoesIniciais,
        questaoAtual: 0,
        tempoInicio: Date.now(),
        modo,
        marcadasParaRevisao: [],
        ultimoAutoSave: Date.now(),
      };

      setState(novoState);
    } catch (err) {
      console.error("Erro ao inicializar simulado:", err);
      throw err;
    } finally {
      setLoading(false);
      onLoadingComplete?.();
    }
  }, [modo, questoesData, chaveProgresso, limparProgresso, onLoadingComplete]);

  useEffect(() => {
    inicializar();
  }, [inicializar]);

  const setQuestaoAtual = useCallback((index: number) => {
    setState((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        questaoAtual: Math.min(Math.max(0, index), prev.questoes.length - 1),
      };
    });
  }, []);

  const atualizarResposta = useCallback(
    (questaoIndex: number, resposta: "CERTO" | "ERRADO" | null) => {
      setState((prev) => {
        if (!prev) return null;
        const novasQuestoes = prev.questoes.map((q, i) =>
          i === questaoIndex ? { ...q, respostaUsuario: resposta } : q,
        );
        return { ...prev, questoes: novasQuestoes };
      });
    },
    [],
  );

  const toggleMarcacao = useCallback((numero: number) => {
    setState((prev) => {
      if (!prev) return null;
      const jaMarcada = prev.marcadasParaRevisao.includes(numero);
      return {
        ...prev,
        marcadasParaRevisao: jaMarcada
          ? prev.marcadasParaRevisao.filter((x) => x !== numero)
          : [...prev.marcadasParaRevisao, numero],
      };
    });
  }, []);

  return {
    state,
    loading,
    analiseIA,
    salvarProgresso,
    limparProgresso,
    setQuestaoAtual,
    atualizarResposta,
    toggleMarcacao,
    stateRef,
  };
}
