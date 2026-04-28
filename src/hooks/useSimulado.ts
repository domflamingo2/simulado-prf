"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  Disciplina,
  EstatisticasDisciplina,
  HistoricoSimulado,
  ModoSimulado,
  Questao,
  QuestaoRespondida,
  RespostaCebraspe,
} from "@/data/index";

// ═══════════════════════════════════════════════════════════
// TIPOS DO HOOK
// ═══════════════════════════════════════════════════════════

type FaseSimulado = "configuracao" | "em-andamento" | "pausado" | "finalizado";

interface EstadoSimulado {
  fase: FaseSimulado;
  questoes: Questao[];
  questaoAtual: number;
  respostas: Map<string, RespostaCebraspe | null>;
  tempoInicio: number | null;
  tempoAcumuladoAnterior: number;
}

interface EstatisticasSimuladoHook {
  acertos: number;
  erros: number;
  brancos: number;
  naoRespondidas: number;
  pontuacao: number;
  percentual: number;
  tempoTotal: number;
  desempenhoPorDisciplina: Record<Disciplina, EstatisticasDisciplina>;
}

interface UseSimuladoReturn {
  estado: EstadoSimulado;
  fase: FaseSimulado;
  questaoAtual: Questao | null;
  progresso: { atual: number; total: number; percentual: number };
  tempoDecorrido: number;
  podeVoltar: boolean;
  podeAvancar: boolean;
  estatisticas: EstatisticasSimuladoHook | null;
  iniciar: (config: SimuladoConfig) => void;
  responder: (questaoId: string, resposta: RespostaCebraspe) => void;
  pular: (questaoId: string) => void;
  navegar: (direcao: "anterior" | "proxima" | number) => void;
  pausar: () => void;
  retomar: () => void;
  finalizar: () => void;
  reiniciar: () => void;
  salvarProgresso: () => void;
  carregarProgresso: () => boolean;
}

export interface SimuladoConfig {
  modo: ModoSimulado;
  bancoQuestoes: Questao[];
  disciplina?: Disciplina;
  quantidade?: number;
  historico?: HistoricoSimulado[];
  questoesPreSelecionadas?: Questao[];
  tempoLimite?: number;
}

// ═══════════════════════════════════════════════════════════
// CONSTANTES & UTILITÁRIOS
// ═══════════════════════════════════════════════════════════

const CHAVE_PROGRESSO = "prf_simulado_progresso";
const CHAVE_HISTORICO = "prf_historico";
const CHAVE_ULTIMO_SIMULADO = "prf_ultimo_simulado";

const ESTRUTURA_PRF: Record<Disciplina, { nome: string; questoes: number }> = {
  PORTUGUES: { nome: "Língua Portuguesa", questoes: 12 },
  ETICA: { nome: "Ética e Conduta Pública", questoes: 6 },
  RACIOCINIO_LOGICO: { nome: "Raciocínio Lógico", questoes: 6 },
  DIREITO_CONSTITUCIONAL: { nome: "Direito Constitucional", questoes: 6 },
  DIREITO_ADMINISTRATIVO: { nome: "Direito Administrativo", questoes: 6 },
  ADMINISTRACAO: { nome: "Administração", questoes: 6 },
  ARQUIVOLOGIA: { nome: "Arquivologia", questoes: 6 },
  INFORMATICA: { nome: "Informática", questoes: 6 },
  LEGISLACAO_PRF: { nome: "Legislação PRF", questoes: 6 },
};

// FIX: naoRespondidas adicionado em todas as 9 disciplinas
function criarStatsVazias(): Record<Disciplina, EstatisticasDisciplina> {
  const vazio: EstatisticasDisciplina = {
    total: 0,
    acertos: 0,
    erros: 0,
    brancos: 0,
    naoRespondidas: 0,
    percentual: 0,
    pontuacao: 0,
  };

  return {
    PORTUGUES: { ...vazio },
    ETICA: { ...vazio },
    RACIOCINIO_LOGICO: { ...vazio },
    DIREITO_CONSTITUCIONAL: { ...vazio },
    DIREITO_ADMINISTRATIVO: { ...vazio },
    ADMINISTRACAO: { ...vazio },
    ARQUIVOLOGIA: { ...vazio },
    INFORMATICA: { ...vazio },
    LEGISLACAO_PRF: { ...vazio },
  };
}

// FIX: rastreia naoRespondidas separadamente de brancos.
// undefined → questão não vista (naoRespondidas)
// null      → usuário deixou em branco explicitamente (brancos)
function calcularEstatisticasPuras(
  questoes: Questao[],
  respostas: Map<string, RespostaCebraspe | null>,
  tempoTotal: number,
): EstatisticasSimuladoHook {
  let acertos = 0;
  let erros = 0;
  let brancos = 0;
  let naoRespondidas = 0;

  const desempenhoPorDisciplina = criarStatsVazias();

  questoes.forEach((q) => {
    const temResposta = respostas.has(q.id);
    const resposta = respostas.get(q.id);

    if (!desempenhoPorDisciplina[q.disciplina]) {
      desempenhoPorDisciplina[q.disciplina] = {
        total: 0,
        acertos: 0,
        erros: 0,
        brancos: 0,
        naoRespondidas: 0,
        percentual: 0,
        pontuacao: 0,
      };
    }

    const stats = desempenhoPorDisciplina[q.disciplina];
    stats.total++;

    if (!temResposta) {
      // Questão não vista — não está no Map
      naoRespondidas++;
      stats.naoRespondidas++;
    } else if (resposta === null) {
      // Usuário pulou explicitamente
      brancos++;
      stats.brancos++;
    } else if (resposta === q.resposta) {
      acertos++;
      stats.acertos++;
    } else {
      erros++;
      stats.erros++;
    }
  });

  (Object.keys(desempenhoPorDisciplina) as Disciplina[]).forEach((disc) => {
    const d = desempenhoPorDisciplina[disc];
    if (d.total > 0) {
      d.percentual = (d.acertos / d.total) * 100;
      d.pontuacao = d.acertos - d.erros;
    }
  });

  const pontuacao = acertos - erros;
  const totalRespondidas = acertos + erros;
  const percentual =
    totalRespondidas > 0 ? (acertos / totalRespondidas) * 100 : 0;

  return {
    acertos,
    erros,
    brancos,
    naoRespondidas,
    pontuacao,
    percentual,
    tempoTotal,
    desempenhoPorDisciplina,
  };
}

function embaralharArray<T>(array: T[]): T[] {
  const novo = [...array];
  for (let i = novo.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [novo[i], novo[j]] = [novo[j], novo[i]];
  }
  return novo;
}

function gerarIdSimulado(): string {
  return `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ═══════════════════════════════════════════════════════════
// HOOK PRINCIPAL
// ═══════════════════════════════════════════════════════════

export function useSimulado(): UseSimuladoReturn {
  const router = useRouter();

  const [tempoUi, setTempoUi] = useState(0);

  const [estado, setEstado] = useState<EstadoSimulado>({
    fase: "configuracao",
    questoes: [],
    questaoAtual: 0,
    respostas: new Map(),
    tempoInicio: null,
    tempoAcumuladoAnterior: 0,
  });

  const requestRef = useRef<number | undefined>(undefined);
  const tempoInicioRef = useRef<number | null>(null);

  // ═══════════════════════════════════════════════════════════
  // COMPUTED VALUES
  // ═══════════════════════════════════════════════════════════

  const questaoAtual = useMemo(() => {
    if (estado.questoes.length === 0) return null;
    return estado.questoes[estado.questaoAtual];
  }, [estado.questoes, estado.questaoAtual]);

  const progresso = useMemo(
    () => ({
      atual: estado.questaoAtual + 1,
      total: estado.questoes.length,
      percentual:
        estado.questoes.length > 0
          ? ((estado.questaoAtual + 1) / estado.questoes.length) * 100
          : 0,
    }),
    [estado.questaoAtual, estado.questoes.length],
  );

  const podeVoltar = estado.questaoAtual > 0;
  const podeAvancar = estado.questaoAtual < estado.questoes.length - 1;

  const tempoDecorrido = estado.tempoAcumuladoAnterior + tempoUi;

  const estatisticas = useMemo<EstatisticasSimuladoHook | null>(() => {
    if (estado.fase !== "em-andamento" && estado.fase !== "finalizado")
      return null;
    return calcularEstatisticasPuras(
      estado.questoes,
      estado.respostas,
      tempoDecorrido,
    );
  }, [estado.fase, estado.questoes, estado.respostas, tempoDecorrido]);

  // ═══════════════════════════════════════════════════════════
  // EFEITOS
  // ═══════════════════════════════════════════════════════════

  useEffect(() => {
    if (estado.fase === "em-andamento") {
      tempoInicioRef.current = Date.now();
      const startTime = Date.now();

      const animate = () => {
        const agora = Date.now();
        setTempoUi(agora - startTime);
        requestRef.current = requestAnimationFrame(animate);
      };

      requestRef.current = requestAnimationFrame(animate);

      return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
      };
    } else {
      if (tempoUi > 0) {
        setEstado((prev) => ({
          ...prev,
          tempoAcumuladoAnterior: prev.tempoAcumuladoAnterior + tempoUi,
        }));
        setTempoUi(0);
      }
    }
  }, [estado.fase, tempoUi]);

  useEffect(() => {
    if (estado.fase !== "em-andamento") return;
    const autoSave = setInterval(() => salvarProgresso(), 30000);
    return () => clearInterval(autoSave);
  }, [estado.fase, estado]);

  // ═══════════════════════════════════════════════════════════
  // AÇÕES
  // ═══════════════════════════════════════════════════════════

  const iniciar = useCallback((config: SimuladoConfig) => {
    let questoesSelecionadas: Questao[] = [];

    if (config.modo === "COMPLETO") {
      (Object.keys(ESTRUTURA_PRF) as Disciplina[]).forEach((disciplina) => {
        const info = ESTRUTURA_PRF[disciplina];
        const daDisciplina = config.bancoQuestoes.filter(
          (q) => q.disciplina === disciplina,
        );
        const embaralhadas = embaralharArray(daDisciplina);
        questoesSelecionadas.push(...embaralhadas.slice(0, info.questoes));
      });
    } else if (config.modo === "TURBO") {
      const todas = embaralharArray(config.bancoQuestoes);
      questoesSelecionadas = todas.slice(0, 50);
    } else if (config.modo === "DISCIPLINA" && config.disciplina) {
      const daDisciplina = config.bancoQuestoes.filter(
        (q) => q.disciplina === config.disciplina,
      );
      questoesSelecionadas = embaralharArray(daDisciplina).slice(
        0,
        config.quantidade || 20,
      );
    } else if (config.modo === "ADAPTATIVO" && config.historico) {
      const disciplinasFracas = analisarDisciplinasFracas(config.historico);
      const pesos = new Map<string, number>();
      disciplinasFracas.forEach(({ disciplina, taxaErro }) => {
        pesos.set(disciplina, 1 + taxaErro * 2);
      });
      const pool: Questao[] = [];
      config.bancoQuestoes.forEach((q) => {
        const peso = pesos.get(q.disciplina) || 0.5;
        const repeticoes = Math.ceil(peso);
        for (let i = 0; i < repeticoes; i++) pool.push(q);
      });
      questoesSelecionadas = embaralharArray(pool).slice(0, 60);
    } else if (config.modo === "ERROS" && config.questoesPreSelecionadas) {
      questoesSelecionadas = config.questoesPreSelecionadas;
    }

    questoesSelecionadas = embaralharArray(questoesSelecionadas);

    setTempoUi(0);
    setEstado({
      fase: "em-andamento",
      questoes: questoesSelecionadas,
      questaoAtual: 0,
      respostas: new Map(),
      tempoInicio: Date.now(),
      tempoAcumuladoAnterior: 0,
    });
    localStorage.removeItem(CHAVE_PROGRESSO);
  }, []);

  const responder = useCallback(
    (questaoId: string, resposta: RespostaCebraspe) => {
      setEstado((prev) => {
        const novasRespostas = new Map(prev.respostas);
        novasRespostas.set(questaoId, resposta);
        const proximaQuestao =
          prev.questaoAtual < prev.questoes.length - 1
            ? prev.questaoAtual + 1
            : prev.questaoAtual;
        return {
          ...prev,
          respostas: novasRespostas,
          questaoAtual: proximaQuestao,
        };
      });
    },
    [],
  );

  const pular = useCallback((questaoId: string) => {
    setEstado((prev) => {
      const novasRespostas = new Map(prev.respostas);
      novasRespostas.set(questaoId, null);
      return { ...prev, respostas: novasRespostas };
    });
  }, []);

  const navegar = useCallback((direcao: "anterior" | "proxima" | number) => {
    setEstado((prev) => {
      let novaPosicao = prev.questaoAtual;
      if (direcao === "anterior")
        novaPosicao = Math.max(0, prev.questaoAtual - 1);
      else if (direcao === "proxima")
        novaPosicao = Math.min(prev.questoes.length - 1, prev.questaoAtual + 1);
      else if (typeof direcao === "number")
        novaPosicao = Math.max(0, Math.min(prev.questoes.length - 1, direcao));
      return { ...prev, questaoAtual: novaPosicao };
    });
  }, []);

  const pausar = useCallback(() => {
    setEstado((prev) => ({ ...prev, fase: "pausado" }));
  }, []);

  const retomar = useCallback(() => {
    setTempoUi(0);
    setEstado((prev) => ({
      ...prev,
      fase: "em-andamento",
      tempoInicio: Date.now(),
    }));
  }, []);

  const finalizar = useCallback(() => {
    setEstado((prev) => {
      const tempoSessao = prev.tempoInicio ? Date.now() - prev.tempoInicio : 0;
      const tempoFinal = prev.tempoAcumuladoAnterior + tempoUi + tempoSessao;

      const statsFinais = calcularEstatisticasPuras(
        prev.questoes,
        prev.respostas,
        tempoFinal,
      );

      const modoDetectado = detectarModo(prev.questoes, prev.respostas.size);

      // FIX: naoRespondidas adicionado ao objeto estatisticas do HistoricoSimulado
      const historicoItem: HistoricoSimulado = {
        id: gerarIdSimulado(),
        data: new Date().toISOString(),
        modo: modoDetectado,
        questoes: prev.questoes.map((q) => ({
          ...q,
          respostaUsuario: prev.respostas.get(q.id) ?? null,
        })) as QuestaoRespondida[],
        estatisticas: {
          totalQuestoes: prev.questoes.length,
          acertos: statsFinais.acertos,
          erros: statsFinais.erros,
          brancos: statsFinais.brancos,
          naoRespondidas: statsFinais.naoRespondidas,
          pontuacao: statsFinais.pontuacao,
          percentual: statsFinais.percentual,
          tempoTotal: tempoFinal,
          tempoMedioPorQuestao:
            prev.questoes.length > 0 ? tempoFinal / prev.questoes.length : 0,
          desempenhoPorDisciplina: statsFinais.desempenhoPorDisciplina,
          taxaResposta:
            prev.questoes.length > 0
              ? ((statsFinais.acertos + statsFinais.erros) /
                  prev.questoes.length) *
                100
              : 0,
        },
      };

      try {
        const historicoExistente = localStorage.getItem(CHAVE_HISTORICO);
        const historico: HistoricoSimulado[] = historicoExistente
          ? JSON.parse(historicoExistente)
          : [];
        historico.unshift(historicoItem);
        localStorage.setItem(CHAVE_HISTORICO, JSON.stringify(historico));
        localStorage.setItem(
          CHAVE_ULTIMO_SIMULADO,
          JSON.stringify(historicoItem),
        );
      } catch (e) {
        console.error("Erro ao salvar histórico", e);
      }
      localStorage.removeItem(CHAVE_PROGRESSO);

      return { ...prev, fase: "finalizado" };
    });

    router.push("/resultado");
  }, [router, tempoUi]);

  const reiniciar = useCallback(() => {
    setTempoUi(0);
    setEstado({
      fase: "configuracao",
      questoes: [],
      questaoAtual: 0,
      respostas: new Map(),
      tempoInicio: null,
      tempoAcumuladoAnterior: 0,
    });
    localStorage.removeItem(CHAVE_PROGRESSO);
  }, []);

  // ═══════════════════════════════════════════════════════════
  // PERSISTÊNCIA
  // ═══════════════════════════════════════════════════════════

  const salvarProgresso = useCallback(() => {
    if (estado.fase !== "em-andamento") return;

    const respostasObj: Record<string, RespostaCebraspe | null> = {};
    estado.respostas.forEach((val, key) => {
      respostasObj[key] = val;
    });

    const dadosSalvar = {
      estado: { ...estado, respostas: respostasObj },
      timestamp: Date.now(),
      tempoUiSnapshot: tempoUi,
    };

    localStorage.setItem(CHAVE_PROGRESSO, JSON.stringify(dadosSalvar));
  }, [estado, tempoUi]);

  const carregarProgresso = useCallback((): boolean => {
    try {
      const dados = localStorage.getItem(CHAVE_PROGRESSO);
      if (!dados) return false;

      const parsed = JSON.parse(dados);
      const { estado: estadoSalvo, tempoUiSnapshot, timestamp } = parsed;

      const horasPassadas = (Date.now() - timestamp) / (1000 * 60 * 60);
      if (horasPassadas > 24) {
        localStorage.removeItem(CHAVE_PROGRESSO);
        return false;
      }

      const respostasRestauradas = new Map<string, RespostaCebraspe | null>();
      if (estadoSalvo.respostas) {
        Object.entries(estadoSalvo.respostas).forEach(([key, value]) => {
          respostasRestauradas.set(key, value as RespostaCebraspe | null);
        });
      }

      setTempoUi(tempoUiSnapshot || 0);
      setEstado({
        ...estadoSalvo,
        respostas: respostasRestauradas,
        fase: "pausado",
      });
      return true;
    } catch (error) {
      console.error("Erro ao carregar progresso:", error);
      return false;
    }
  }, []);

  return {
    estado,
    fase: estado.fase,
    questaoAtual,
    progresso,
    tempoDecorrido,
    podeVoltar,
    podeAvancar,
    estatisticas,
    iniciar,
    responder,
    pular,
    navegar,
    pausar,
    retomar,
    finalizar,
    reiniciar,
    salvarProgresso,
    carregarProgresso,
  };
}

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

function analisarDisciplinasFracas(
  historico: HistoricoSimulado[],
): Array<{ disciplina: Disciplina; taxaErro: number }> {
  const stats = new Map<Disciplina, { acertos: number; total: number }>();
  historico.forEach((h) => {
    h.questoes.forEach((q) => {
      if (!stats.has(q.disciplina))
        stats.set(q.disciplina, { acertos: 0, total: 0 });
      const atual = stats.get(q.disciplina)!;
      atual.total++;
      if (q.respostaUsuario === q.resposta) atual.acertos++;
    });
  });
  return Array.from(stats.entries())
    .map(([disciplina, { acertos, total }]) => ({
      disciplina,
      taxaErro: total > 0 ? 1 - acertos / total : 0,
    }))
    .sort((a, b) => b.taxaErro - a.taxaErro);
}

function detectarModo(
  questoes: Questao[],
  respondidasCount: number,
): ModoSimulado {
  if (questoes.length === 60) return "COMPLETO";
  if (questoes.length === 50) return "TURBO";
  if (respondidasCount > 0 && respondidasCount < 20) return "ERROS";
  return "DISCIPLINA";
}
