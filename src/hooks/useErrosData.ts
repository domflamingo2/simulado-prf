"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { DISCIPLINAS_NOME } from "@/constants/disciplinas";
import { HistoricoSimulado } from "@/data/types";
import { ErroComMetadados } from "@/types/erros";

const LS_HISTORICO = "prf_historico";
const LS_REVISADOS = "prf_erros_revisados";
const LS_REMOVIDOS = "prf_erros_removidos";
const LS_BACKUP = "prf_backup_automatico";

function lerHistorico(): HistoricoSimulado[] {
  try {
    const raw = localStorage.getItem(LS_HISTORICO);
    if (!raw) return [];
    const parsed = JSON.parse(raw);

    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed) &&
      "data" in parsed &&
      Array.isArray(parsed.data)
    ) {
      return parsed.data as HistoricoSimulado[];
    }

    if (Array.isArray(parsed)) return parsed as HistoricoSimulado[];
    return [];
  } catch {
    return [];
  }
}

function lerJsonLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function useErrosData() {
  const [errosTodos, setErrosTodos] = useState<ErroComMetadados[]>([]);
  const [totalQuestoesRespondidas, setTotalQuestoesRespondidas] = useState(0);
  const [totalSimulados, setTotalSimulados] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [revisados, setRevisados] = useState<Set<string>>(new Set());
  const [removidosLocal, setRemovidosLocal] = useState<Set<string>>(new Set());

  const inicializadoRef = useRef(false);

  useEffect(() => {
    if (inicializadoRef.current) return;
    inicializadoRef.current = true;

    try {
      const historico = lerHistorico();
      setTotalSimulados(historico.length);

      const totalQuestoes = historico.reduce(
        (acc, s) => acc + (s.questoes?.length ?? 0),
        0,
      );
      setTotalQuestoesRespondidas(totalQuestoes);

      const errosMap = new Map<string, ErroComMetadados>();

      for (const simulado of historico) {
        if (!Array.isArray(simulado.questoes)) continue;

        for (const q of simulado.questoes) {
          if (!q?.id || !q.respostaUsuario) continue;
          const errou = q.respostaUsuario !== q.resposta;
          if (!errou) continue;

          const existente = errosMap.get(q.id);
          if (existente) {
            errosMap.set(q.id, {
              ...existente,
              vezesErrada: existente.vezesErrada + 1,
              ultimaData:
                simulado.data > existente.ultimaData
                  ? simulado.data
                  : existente.ultimaData,
            });
          } else {
            errosMap.set(q.id, {
              ...q,
              vezesErrada: 1,
              ultimaData: simulado.data,
              disciplinaFormatada:
                DISCIPLINAS_NOME[q.disciplina] ??
                q.disciplina.replace(/_/g, " "),
            });
          }
        }
      }

      const listaErros = Array.from(errosMap.values()).sort((a, b) => {
        if (b.vezesErrada !== a.vezesErrada)
          return b.vezesErrada - a.vezesErrada;
        return (
          new Date(b.ultimaData).getTime() - new Date(a.ultimaData).getTime()
        );
      });

      setErrosTodos(listaErros);

      const revisadosSalvos = lerJsonLS<string[]>(LS_REVISADOS, []);
      setRevisados(new Set(revisadosSalvos));

      const removidosSalvos = lerJsonLS<string[]>(LS_REMOVIDOS, []);
      setRemovidosLocal(new Set(removidosSalvos));
    } catch (err) {
      console.error("Erro ao carregar histórico:", err);
      toast.error("Erro ao carregar histórico. Tente recarregar a página.");
    } finally {
      setCarregando(false);
    }
  }, []);

  const errosAtivos = useMemo(
    () => errosTodos.filter((e) => !removidosLocal.has(e.id)),
    [errosTodos, removidosLocal],
  );

  const removerErroIndividual = useCallback((id: string) => {
    setRemovidosLocal((prev) => {
      const novo = new Set(prev);
      novo.add(id);
      localStorage.setItem(LS_REMOVIDOS, JSON.stringify([...novo]));
      return novo;
    });
    toast.success("Questão removida do banco de erros");
  }, []);

  const marcarComoRevisado = useCallback((id: string) => {
    setRevisados((prev) => {
      const novo = new Set(prev);
      if (novo.has(id)) {
        novo.delete(id);
        toast.info("Marcação de revisado removida");
      } else {
        novo.add(id);
        toast.success("Questão marcada como revisada! 🎯");
      }
      localStorage.setItem(LS_REVISADOS, JSON.stringify([...novo]));
      return novo;
    });
  }, []);

  const limparHistoricoCompleto = useCallback(() => {
    const confirmou = window.confirm(
      "⚠️ ATENÇÃO: Isso apagará TODO o seu histórico de simulados e estatísticas.\n\n" +
        "Um backup automático será salvo neste dispositivo.\n\n" +
        "Deseja continuar?",
    );
    if (!confirmou) return;

    const backup = localStorage.getItem(LS_HISTORICO);
    if (backup) localStorage.setItem(LS_BACKUP, backup);

    localStorage.removeItem(LS_HISTORICO);
    localStorage.removeItem(LS_REVISADOS);
    localStorage.removeItem(LS_REMOVIDOS);

    setErrosTodos([]);
    setTotalSimulados(0);
    setTotalQuestoesRespondidas(0);
    setRevisados(new Set());
    setRemovidosLocal(new Set());

    toast.success("Histórico apagado. Backup salvo automaticamente.");
  }, []);

  const resetarRevisados = useCallback(() => {
    setRevisados(new Set());
    localStorage.removeItem(LS_REVISADOS);
    toast.info("Lista de revisados resetada");
  }, []);

  return {
    carregando,
    errosAtivos,
    totalSimulados,
    totalQuestoesRespondidas,
    revisados,
    removerErroIndividual,
    marcarComoRevisado,
    limparHistoricoCompleto,
    resetarRevisados,
  };
}
