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
} from "@/data/types";

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
  tempoPausado: number;
  tempoTotal: number;
}

interface EstatisticasSimuladoHook {
  acertos: number;
  erros: number;
  brancos: number;
  pontuacao: number;
  percentual: number;
  tempoTotal: number;
  desempenhoPorDisciplina: Record<Disciplina, EstatisticasDisciplina>;
}

interface UseSimuladoReturn {
  // Estado
  estado: EstadoSimulado;
  fase: FaseSimulado;
  questaoAtual: Questao | null;
  progresso: { atual: number; total: number; percentual: number };
  tempoDecorrido: number;
  podeVoltar: boolean;
  podeAvancar: boolean;
  estatisticas: EstatisticasSimuladoHook | null;

  // Ações
  iniciar: (config: SimuladoConfig) => void;
  responder: (questaoId: string, resposta: RespostaCebraspe) => void;
  pular: (questaoId: string) => void;
  navegar: (direcao: "anterior" | "proxima" | number) => void;
  pausar: () => void;
  retomar: () => void;
  finalizar: () => void;
  reiniciar: () => void;

  // Persistência
  salvarProgresso: () => void;
  carregarProgresso: () => boolean;
}

// ═══════════════════════════════════════════════════════════
// TIPO SIMULADO CONFIG (adicionado aqui pois não existe em types.ts)
// ═══════════════════════════════════════════════════════════

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
// CONSTANTES
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

// ═══════════════════════════════════════════════════════════
// FUNÇÕES AUXILIARES
// ═══════════════════════════════════════════════════════════

function embaralharArray<T>(array: T[]): T[] {
  const novo = [...array];
  for (let i = novo.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [novo[i], novo[j]] = [novo[j], novo[i]];
  }
  return novo;
}

function calcularPontuacaoCEBRASPE(acertos: number, erros: number): number {
  return acertos - erros;
}

function gerarIdSimulado(): string {
  return `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ═══════════════════════════════════════════════════════════
// HOOK PRINCIPAL
// ═══════════════════════════════════════════════════════════

export function useSimulado(): UseSimuladoReturn {
  const router = useRouter();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Estado principal
  const [estado, setEstado] = useState<EstadoSimulado>({
    fase: "configuracao",
    questoes: [],
    questaoAtual: 0,
    respostas: new Map(),
    tempoInicio: null,
    tempoPausado: 0,
    tempoTotal: 0,
  });

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

  const tempoDecorrido = useMemo(() => {
    if (estado.fase !== "em-andamento" || !estado.tempoInicio)
      return estado.tempoTotal;
    return estado.tempoTotal + (Date.now() - estado.tempoInicio);
  }, [estado.fase, estado.tempoInicio, estado.tempoTotal]);

  const estatisticas = useMemo<EstatisticasSimuladoHook | null>(() => {
    if (estado.fase !== "finalizado" && estado.fase !== "em-andamento")
      return null;

    let acertos = 0;
    let erros = 0;
    let brancos = 0;

    const desempenhoPorDisciplina: Record<Disciplina, EstatisticasDisciplina> =
      {
        PORTUGUES: {
          total: 0,
          acertos: 0,
          erros: 0,
          brancos: 0,
          percentual: 0,
          pontuacao: 0,
        },
        ETICA: {
          total: 0,
          acertos: 0,
          erros: 0,
          brancos: 0,
          percentual: 0,
          pontuacao: 0,
        },
        RACIOCINIO_LOGICO: {
          total: 0,
          acertos: 0,
          erros: 0,
          brancos: 0,
          percentual: 0,
          pontuacao: 0,
        },
        DIREITO_CONSTITUCIONAL: {
          total: 0,
          acertos: 0,
          erros: 0,
          brancos: 0,
          percentual: 0,
          pontuacao: 0,
        },
        DIREITO_ADMINISTRATIVO: {
          total: 0,
          acertos: 0,
          erros: 0,
          brancos: 0,
          percentual: 0,
          pontuacao: 0,
        },
        ADMINISTRACAO: {
          total: 0,
          acertos: 0,
          erros: 0,
          brancos: 0,
          percentual: 0,
          pontuacao: 0,
        },
        ARQUIVOLOGIA: {
          total: 0,
          acertos: 0,
          erros: 0,
          brancos: 0,
          percentual: 0,
          pontuacao: 0,
        },
        INFORMATICA: {
          total: 0,
          acertos: 0,
          erros: 0,
          brancos: 0,
          percentual: 0,
          pontuacao: 0,
        },
        LEGISLACAO_PRF: {
          total: 0,
          acertos: 0,
          erros: 0,
          brancos: 0,
          percentual: 0,
          pontuacao: 0,
        },
      };

    estado.questoes.forEach((q: Questao) => {
      const resposta = estado.respostas.get(q.id);

      // Inicializa disciplina
      if (!desempenhoPorDisciplina[q.disciplina]) {
        desempenhoPorDisciplina[q.disciplina] = {
          total: 0,
          acertos: 0,
          erros: 0,
          brancos: 0,
          percentual: 0,
          pontuacao: 0,
        };
      }
      desempenhoPorDisciplina[q.disciplina].total++;

      if (resposta === null || resposta === undefined) {
        brancos++;
        desempenhoPorDisciplina[q.disciplina].brancos++;
      } else if (resposta === q.resposta) {
        acertos++;
        desempenhoPorDisciplina[q.disciplina].acertos++;
      } else {
        erros++;
        desempenhoPorDisciplina[q.disciplina].erros++;
      }
    });

    // Calcula percentuais e pontuações por disciplina
    (Object.keys(desempenhoPorDisciplina) as Disciplina[]).forEach((disc) => {
      const d = desempenhoPorDisciplina[disc];
      if (d.total > 0) {
        d.percentual = (d.acertos / d.total) * 100;
        d.pontuacao = calcularPontuacaoCEBRASPE(d.acertos, d.erros);
      }
    });

    const pontuacao = calcularPontuacaoCEBRASPE(acertos, erros);
    const totalRespondidas = acertos + erros;
    const percentual =
      totalRespondidas > 0 ? (acertos / totalRespondidas) * 100 : 0;

    return {
      acertos,
      erros,
      brancos,
      pontuacao,
      percentual,
      tempoTotal: estado.tempoTotal,
      desempenhoPorDisciplina,
    };
  }, [estado.fase, estado.questoes, estado.respostas, estado.tempoTotal]);

  // ═══════════════════════════════════════════════════════════
  // EFEITOS
  // ═══════════════════════════════════════════════════════════

  // Cronômetro
  useEffect(() => {
    if (estado.fase === "em-andamento") {
      intervalRef.current = setInterval(() => {
        setEstado((prev) => ({
          ...prev,
          tempoTotal: prev.tempoTotal + 1000,
        }));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [estado.fase]);

  // Auto-salvamento a cada 30 segundos
  useEffect(() => {
    if (estado.fase !== "em-andamento") return;

    const autoSave = setInterval(() => {
      salvarProgresso();
    }, 30000);

    return () => clearInterval(autoSave);
  }, [estado.fase, estado]);

  // ═══════════════════════════════════════════════════════════
  // AÇÕES
  // ═══════════════════════════════════════════════════════════

  const iniciar = useCallback((config: SimuladoConfig) => {
    let questoesSelecionadas: Questao[] = [];

    if (config.modo === "COMPLETO") {
      // Estrutura oficial PRF: 24 básicas + 36 específicas = 60 questões
      (Object.keys(ESTRUTURA_PRF) as Disciplina[]).forEach((disciplina) => {
        const info = ESTRUTURA_PRF[disciplina];
        const daDisciplina = config.bancoQuestoes.filter(
          (q: Questao) => q.disciplina === disciplina,
        );
        const embaralhadas = embaralharArray(daDisciplina);
        questoesSelecionadas.push(...embaralhadas.slice(0, info.questoes));
      });
    } else if (config.modo === "TURBO") {
      // 50 questões aleatórias de todas as disciplinas
      const todas = embaralharArray(config.bancoQuestoes);
      questoesSelecionadas = todas.slice(0, 50);
    } else if (config.modo === "DISCIPLINA" && config.disciplina) {
      // Apenas disciplina específica
      const daDisciplina = config.bancoQuestoes.filter(
        (q: Questao) => q.disciplina === config.disciplina,
      );
      questoesSelecionadas = embaralharArray(daDisciplina).slice(
        0,
        config.quantidade || 20,
      );
    } else if (config.modo === "ADAPTATIVO" && config.historico) {
      // Seleciona mais questões das disciplinas com maior taxa de erro
      const disciplinasFracas = analisarDisciplinasFracas(config.historico);
      const pesos = new Map<string, number>();

      // Calcula pesos inversos ao desempenho
      disciplinasFracas.forEach(({ disciplina, taxaErro }) => {
        pesos.set(disciplina, 1 + taxaErro * 2);
      });

      // Seleciona proporcionalmente aos pesos
      const pool: Questao[] = [];
      config.bancoQuestoes.forEach((q: Questao) => {
        const peso = pesos.get(q.disciplina) || 0.5;
        const repeticoes = Math.ceil(peso);
        for (let i = 0; i < repeticoes; i++) {
          pool.push(q);
        }
      });

      questoesSelecionadas = embaralharArray(pool).slice(0, 60);
    } else if (config.modo === "ERROS" && config.questoesPreSelecionadas) {
      // Modo revisão de erros
      questoesSelecionadas = config.questoesPreSelecionadas;
    }

    // Embaralha ordem final
    questoesSelecionadas = embaralharArray(questoesSelecionadas);

    setEstado({
      fase: "em-andamento",
      questoes: questoesSelecionadas,
      questaoAtual: 0,
      respostas: new Map(),
      tempoInicio: Date.now(),
      tempoPausado: 0,
      tempoTotal: 0,
    });

    // Limpa progresso anterior
    localStorage.removeItem(CHAVE_PROGRESSO);
  }, []);

  const responder = useCallback(
    (questaoId: string, resposta: RespostaCebraspe) => {
      setEstado((prev) => {
        const novasRespostas = new Map(prev.respostas);
        novasRespostas.set(questaoId, resposta);

        // Avança automaticamente se não for a última
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

      return {
        ...prev,
        respostas: novasRespostas,
      };
    });
  }, []);

  const navegar = useCallback((direcao: "anterior" | "proxima" | number) => {
    setEstado((prev) => {
      let novaPosicao = prev.questaoAtual;

      if (direcao === "anterior") {
        novaPosicao = Math.max(0, prev.questaoAtual - 1);
      } else if (direcao === "proxima") {
        novaPosicao = Math.min(prev.questoes.length - 1, prev.questaoAtual + 1);
      } else if (typeof direcao === "number") {
        novaPosicao = Math.max(0, Math.min(prev.questoes.length - 1, direcao));
      }

      return {
        ...prev,
        questaoAtual: novaPosicao,
      };
    });
  }, []);

  const pausar = useCallback(() => {
    setEstado((prev) => ({
      ...prev,
      fase: "pausado",
      tempoPausado: Date.now(),
    }));
  }, []);

  const retomar = useCallback(() => {
    setEstado((prev) => {
      const tempoPausadoTotal = prev.tempoPausado
        ? Date.now() - prev.tempoPausado
        : 0;

      return {
        ...prev,
        fase: "em-andamento",
        tempoInicio: Date.now(),
        tempoPausado: 0,
        tempoTotal: prev.tempoTotal + tempoPausadoTotal,
      };
    });
  }, []);

  const finalizar = useCallback(() => {
    setEstado((prev) => {
      const tempoFinal = prev.tempoInicio
        ? prev.tempoTotal + (Date.now() - prev.tempoInicio)
        : prev.tempoTotal;

      // Detecta o modo baseado nas questões
      const modoDetectado = detectarModo(prev.questoes);

      // Persiste no histórico
      const historicoItem: HistoricoSimulado = {
        id: gerarIdSimulado(),
        data: new Date().toISOString(),
        modo: modoDetectado,
        questoes: prev.questoes.map((q: Questao) => ({
          ...q,
          respostaUsuario: prev.respostas.get(q.id) || null,
        })) as QuestaoRespondida[],
        estatisticas: {
          totalQuestoes: prev.questoes.length,
          acertos: estatisticas?.acertos || 0,
          erros: estatisticas?.erros || 0,
          brancos: estatisticas?.brancos || 0,
          pontuacao: estatisticas?.pontuacao || 0,
          percentual: estatisticas?.percentual || 0,
          tempoTotal: tempoFinal,
          tempoMedioPorQuestao: tempoFinal / prev.questoes.length,
          desempenhoPorDisciplina: estatisticas?.desempenhoPorDisciplina || {
            PORTUGUES: {
              total: 0,
              acertos: 0,
              erros: 0,
              brancos: 0,
              percentual: 0,
              pontuacao: 0,
            },
            ETICA: {
              total: 0,
              acertos: 0,
              erros: 0,
              brancos: 0,
              percentual: 0,
              pontuacao: 0,
            },
            RACIOCINIO_LOGICO: {
              total: 0,
              acertos: 0,
              erros: 0,
              brancos: 0,
              percentual: 0,
              pontuacao: 0,
            },
            DIREITO_CONSTITUCIONAL: {
              total: 0,
              acertos: 0,
              erros: 0,
              brancos: 0,
              percentual: 0,
              pontuacao: 0,
            },
            DIREITO_ADMINISTRATIVO: {
              total: 0,
              acertos: 0,
              erros: 0,
              brancos: 0,
              percentual: 0,
              pontuacao: 0,
            },
            ADMINISTRACAO: {
              total: 0,
              acertos: 0,
              erros: 0,
              brancos: 0,
              percentual: 0,
              pontuacao: 0,
            },
            ARQUIVOLOGIA: {
              total: 0,
              acertos: 0,
              erros: 0,
              brancos: 0,
              percentual: 0,
              pontuacao: 0,
            },
            INFORMATICA: {
              total: 0,
              acertos: 0,
              erros: 0,
              brancos: 0,
              percentual: 0,
              pontuacao: 0,
            },
            LEGISLACAO_PRF: {
              total: 0,
              acertos: 0,
              erros: 0,
              brancos: 0,
              percentual: 0,
              pontuacao: 0,
            },
          },
          taxaResposta:
            ((estatisticas?.acertos || 0) + (estatisticas?.erros || 0)) /
            prev.questoes.length,
        },
      };

      // Salva no localStorage
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

      // Limpa progresso
      localStorage.removeItem(CHAVE_PROGRESSO);

      return {
        ...prev,
        fase: "finalizado",
        tempoTotal: tempoFinal,
      };
    });

    // Redireciona para resultado
    router.push("/resultado");
  }, [estatisticas, router]);

  const reiniciar = useCallback(() => {
    setEstado({
      fase: "configuracao",
      questoes: [],
      questaoAtual: 0,
      respostas: new Map(),
      tempoInicio: null,
      tempoPausado: 0,
      tempoTotal: 0,
    });
    localStorage.removeItem(CHAVE_PROGRESSO);
  }, []);

  // ═══════════════════════════════════════════════════════════
  // PERSISTÊNCIA
  // ═══════════════════════════════════════════════════════════

  const salvarProgresso = useCallback(() => {
    if (estado.fase !== "em-andamento") return;

    const dadosSalvar = {
      estado,
      timestamp: Date.now(),
    };

    localStorage.setItem(CHAVE_PROGRESSO, JSON.stringify(dadosSalvar));
  }, [estado]);

  const carregarProgresso = useCallback((): boolean => {
    try {
      const dados = localStorage.getItem(CHAVE_PROGRESSO);
      if (!dados) return false;

      const { estado: estadoSalvo, timestamp } = JSON.parse(dados);

      // Verifica se não expirou (24 horas)
      const horasPassadas = (Date.now() - timestamp) / (1000 * 60 * 60);
      if (horasPassadas > 24) {
        localStorage.removeItem(CHAVE_PROGRESSO);
        return false;
      }

      // Restaura Map de respostas (JSON não preserva Maps)
      const respostasRestauradas = new Map<string, RespostaCebraspe | null>();
      if (estadoSalvo.respostas) {
        Object.entries(estadoSalvo.respostas).forEach(([key, value]) => {
          respostasRestauradas.set(key, value as RespostaCebraspe | null);
        });
      }

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
// FUNÇÕES AUXILIARES INTERNAS
// ═══════════════════════════════════════════════════════════

function analisarDisciplinasFracas(
  historico: HistoricoSimulado[],
): Array<{ disciplina: Disciplina; taxaErro: number }> {
  const stats = new Map<Disciplina, { acertos: number; total: number }>();

  historico.forEach((h: HistoricoSimulado) => {
    h.questoes.forEach((q: QuestaoRespondida) => {
      if (!stats.has(q.disciplina)) {
        stats.set(q.disciplina, { acertos: 0, total: 0 });
      }
      const atual = stats.get(q.disciplina)!;
      atual.total++;
      if (q.respostaUsuario === q.resposta) {
        atual.acertos++;
      }
    });
  });

  return Array.from(stats.entries())
    .map(([disciplina, { acertos, total }]) => ({
      disciplina,
      taxaErro: total > 0 ? 1 - acertos / total : 0,
    }))
    .sort((a, b) => b.taxaErro - a.taxaErro);
}

function detectarModo(questoes: Questao[]): ModoSimulado {
  if (questoes.length === 60) return "COMPLETO";
  if (questoes.length === 50) return "TURBO";
  if (questoes.length < 20) return "ERROS";
  return "DISCIPLINA";
}
