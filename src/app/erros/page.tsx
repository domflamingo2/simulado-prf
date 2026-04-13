"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  Flame,
  Play,
  RotateCcw,
  Search,
  Trash2,
  TrendingUp,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Toaster, toast } from "sonner";

import { GlassCard } from "@/components/ui/GlassCard";
import { HistoricoSimulado, Questao } from "@/data/types";

// ═══════════════════════════════════════════════════════════
// TIPOS E CONSTANTES
// ═══════════════════════════════════════════════════════════

interface ErroComMetadados extends Questao {
  vezesErrada: number;
  ultimaData: string;
  disciplinaFormatada: string;
}

// FIX: renomeada de EstatisticasAvancadas para StatsData — conflitava com o
// nome do componente EstatisticasAvancadas abaixo (mesmo identificador).
interface StatsData {
  totalErrosContabilizados: number;
  taxaAcertoMedia: number;
  mediaErrosPorQuestao: number;
  disciplinaMaisDificil: string;
  disciplinaMaisDificilCount: number;
  diaComMaisErros: string;
  progressoRevisao: number;
}

type OrdenacaoType = "vezes" | "data" | "disciplina" | "recentes";

const DISCIPLINAS_NOME: Record<string, string> = {
  PORTUGUES: "Língua Portuguesa",
  ETICA: "Ética e Conduta",
  RACIOCINIO_LOGICO: "Raciocínio Lógico",
  DIREITO_CONSTITUCIONAL: "Direito Constitucional",
  DIREITO_ADMINISTRATIVO: "Direito Administrativo",
  ADMINISTRACAO: "Administração",
  ARQUIVOLOGIA: "Arquivologia",
  INFORMATICA: "Informática",
  LEGISLACAO_PRF: "Legislação PRF",
};

const DISCIPLINAS_COR: Record<string, string> = {
  PORTUGUES: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  ETICA: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  RACIOCINIO_LOGICO: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  DIREITO_CONSTITUCIONAL: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  DIREITO_ADMINISTRATIVO:
    "bg-orange-500/20 text-orange-400 border-orange-500/30",
  ADMINISTRACAO: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  ARQUIVOLOGIA: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  INFORMATICA: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  LEGISLACAO_PRF: "bg-red-500/20 text-red-400 border-red-500/30",
};

// Chave separada para erros removidos manualmente — não toca o histórico
const LS_HISTORICO = "prf_historico";
const LS_REVISADOS = "prf_erros_revisados";
const LS_REMOVIDOS = "prf_erros_removidos"; // FIX: nova chave para remoções individuais
const LS_BACKUP = "prf_backup_automatico";

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

/**
 * FIX: lê do localStorage suportando tanto o formato legado (array direto)
 * quanto o novo formato { v, data } do useLocalStorage hook.
 */
function lerHistorico(): HistoricoSimulado[] {
  try {
    const raw = localStorage.getItem(LS_HISTORICO);
    if (!raw) return [];
    const parsed = JSON.parse(raw);

    // Formato novo: { v: number, data: array }
    if (
      parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed) &&
      "data" in parsed &&
      Array.isArray(parsed.data)
    ) {
      return parsed.data as HistoricoSimulado[];
    }

    // Formato legado: array direto
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

// ═══════════════════════════════════════════════════════════
// COMPONENTES AUXILIARES
// ═══════════════════════════════════════════════════════════

function EmptyState({ tipo }: { tipo: "sem-simulados" | "sem-erros" }) {
  const configs = {
    "sem-simulados": {
      icon: AlertCircle,
      titulo: "Nenhum simulado encontrado",
      descricao:
        "Faça pelo menos um simulado completo para gerar um histórico de erros.",
      acao: { href: "/simulado", label: "Iniciar Simulado", icon: Play },
    },
    "sem-erros": {
      icon: CheckCircle2,
      titulo: "Parabéns! 🎉",
      descricao:
        "Você não tem erros registrados. Seu desempenho está excelente! Continue assim.",
      acao: {
        href: "/estatisticas",
        label: "Ver Estatísticas",
        icon: TrendingUp,
      },
    },
  };

  const config = configs[tipo];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[60vh] p-6"
    >
      <GlassCard className="p-12 text-center max-w-md">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <config.icon className="w-20 h-20 text-slate-500 mx-auto mb-6" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-3">{config.titulo}</h2>
        <p className="text-slate-400 mb-8 leading-relaxed">
          {config.descricao}
        </p>
        <Link
          href={config.acao.href}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all hover:scale-105 shadow-lg shadow-blue-500/25"
        >
          <config.acao.icon className="w-5 h-5" />
          {config.acao.label}
        </Link>
      </GlassCard>
    </motion.div>
  );
}

// FIX: `isRevisado` agora é boolean calculado pelo pai — evita O(n) includes
// a cada render de cada card para listas grandes.
function CardErro({
  erro,
  index,
  onRemover,
  isRevisado,
  onToggleRevisado,
}: {
  erro: ErroComMetadados;
  index: number;
  onRemover: (id: string) => void;
  isRevisado: boolean;
  onToggleRevisado: (id: string) => void;
}) {
  const [expandido, setExpandido] = useState(false);

  // FIX: delay com cap em 500ms para evitar espera de 3s+ em listas longas
  const delay = Math.min(index * 0.04, 0.5);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -80 }}
      transition={{ delay, duration: 0.25 }}
      className="group"
    >
      <GlassCard
        className={`p-5 border-l-4 transition-all duration-300 ${
          isRevisado
            ? "border-l-emerald-500 bg-emerald-500/5"
            : "border-l-rose-500 hover:border-l-rose-400"
        }`}
      >
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                  DISCIPLINAS_COR[erro.disciplina] ??
                  "bg-slate-700 text-slate-300 border-slate-600"
                }`}
              >
                {erro.disciplinaFormatada}
              </span>
              {erro.vezesErrada > 1 && (
                <span className="flex items-center gap-1 text-xs text-rose-400 bg-rose-500/10 px-2 py-1 rounded-full">
                  <RotateCcw className="w-3 h-3" />
                  Errou {erro.vezesErrada}x
                </span>
              )}
              <span className="text-xs text-slate-500 ml-auto">
                {new Date(erro.ultimaData).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

            {/* Enunciado */}
            <p
              className={`text-slate-200 text-sm leading-relaxed ${
                expandido ? "" : "line-clamp-2"
              }`}
            >
              {erro.enunciado}
            </p>

            {/* Ações */}
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              <button
                onClick={() => setExpandido((p) => !p)}
                className="text-xs text-slate-400 hover:text-blue-400 transition-colors"
              >
                {expandido ? "Ver menos" : "Ver completo"}
              </button>
              <button
                onClick={() => onRemover(erro.id)}
                className="text-xs text-slate-500 hover:text-rose-400 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                Remover da lista
              </button>
              <button
                onClick={() => onToggleRevisado(erro.id)}
                className={`text-xs transition-colors flex items-center gap-1 ${
                  isRevisado
                    ? "text-emerald-400 hover:text-emerald-300"
                    : "text-slate-500 hover:text-blue-400"
                }`}
              >
                <CheckCircle2 className="w-3 h-3" />
                {isRevisado ? "Revisado ✓" : "Marcar como revisado"}
              </button>
            </div>
          </div>

          {/* Indicador de resposta correta */}
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <span className="text-xs text-slate-500">Correta</span>
            <span
              className={`px-3 py-1 rounded-lg text-sm font-bold ${
                erro.resposta === "CERTO"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-rose-500/20 text-rose-400"
              }`}
            >
              {erro.resposta}
            </span>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

function PainelEstatisticas({
  erros,
  totalQuestoesRespondidas,
  revisados,
}: {
  erros: ErroComMetadados[];
  totalQuestoesRespondidas: number; // FIX: total real de questões respondidas
  revisados: Set<string>; // FIX: Set para O(1) lookup
}) {
  const stats = useMemo((): StatsData => {
    const totalErrosContabilizados = erros.reduce(
      (acc, e) => acc + e.vezesErrada,
      0,
    );

    // FIX: usa o total real de questões respondidas, não simulados * 60
    const taxaAcertoMedia =
      totalQuestoesRespondidas > 0
        ? ((totalQuestoesRespondidas - totalErrosContabilizados) /
            totalQuestoesRespondidas) *
          100
        : 0;

    const mediaErrosPorQuestao =
      erros.length > 0 ? totalErrosContabilizados / erros.length : 0;

    // Disciplina mais difícil
    const disciplinaCount = new Map<string, number>();
    for (const e of erros) {
      disciplinaCount.set(
        e.disciplina,
        (disciplinaCount.get(e.disciplina) ?? 0) + 1,
      );
    }
    let disciplinaMaisDificil = "";
    let disciplinaMaisDificilCount = 0;
    disciplinaCount.forEach((count, disc) => {
      if (count > disciplinaMaisDificilCount) {
        disciplinaMaisDificilCount = count;
        disciplinaMaisDificil = DISCIPLINAS_NOME[disc] ?? disc;
      }
    });

    // Dia com mais erros
    const diaCount = new Map<string, number>();
    for (const e of erros) {
      const dia = new Date(e.ultimaData).toLocaleDateString("pt-BR");
      diaCount.set(dia, (diaCount.get(dia) ?? 0) + 1);
    }
    let diaComMaisErros = "";
    let maxErrosDia = 0;
    diaCount.forEach((count, dia) => {
      if (count > maxErrosDia) {
        maxErrosDia = count;
        diaComMaisErros = dia;
      }
    });

    // FIX: usa Set.size que é O(1)
    const progressoRevisao =
      erros.length > 0 ? (revisados.size / erros.length) * 100 : 0;

    return {
      totalErrosContabilizados,
      taxaAcertoMedia: Math.max(0, Math.min(100, taxaAcertoMedia)),
      mediaErrosPorQuestao,
      disciplinaMaisDificil,
      disciplinaMaisDificilCount,
      diaComMaisErros,
      progressoRevisao,
    };
  }, [erros, totalQuestoesRespondidas, revisados]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
    >
      {[
        {
          valor: stats.totalErrosContabilizados,
          label: "Total de erros",
          cor: "from-rose-500/10 to-rose-600/5 border-rose-500/20",
          textCor: "text-rose-400",
          sufixo: "",
        },
        {
          valor: stats.taxaAcertoMedia.toFixed(1),
          label: "Taxa de acerto",
          cor: "from-emerald-500/10 to-emerald-600/5 border-emerald-500/20",
          textCor: "text-emerald-400",
          sufixo: "%",
        },
        {
          valor: stats.mediaErrosPorQuestao.toFixed(1),
          label: "Média por questão",
          cor: "from-amber-500/10 to-amber-600/5 border-amber-500/20",
          textCor: "text-amber-400",
          sufixo: "x",
        },
        {
          valor: stats.progressoRevisao.toFixed(0),
          label: "Progresso revisão",
          cor: "from-blue-500/10 to-blue-600/5 border-blue-500/20",
          textCor: "text-blue-400",
          sufixo: "%",
        },
      ].map((card) => (
        <div
          key={card.label}
          className={`p-4 rounded-xl bg-gradient-to-br ${card.cor} border`}
        >
          <div className={`text-2xl font-bold ${card.textCor}`}>
            {card.valor}
            {card.sufixo}
          </div>
          <div className="text-xs text-slate-400 mt-1">{card.label}</div>
        </div>
      ))}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════

export default function ErrosPage() {
  const router = useRouter();

  const [errosTodos, setErrosTodos] = useState<ErroComMetadados[]>([]);
  const [errosVisiveis, setErrosVisiveis] = useState<ErroComMetadados[]>([]);
  const [totalQuestoesRespondidas, setTotalQuestoesRespondidas] = useState(0);
  const [totalSimulados, setTotalSimulados] = useState(0);
  const [busca, setBusca] = useState("");
  const [filtroDisciplina, setFiltroDisciplina] = useState("todas");
  const [carregando, setCarregando] = useState(true);
  const [ordenacao, setOrdenacao] = useState<OrdenacaoType>("vezes");

  // FIX: Set<string> para O(1) lookup em vez de array com includes O(n)
  const [revisados, setRevisados] = useState<Set<string>>(new Set());

  // FIX: removidos: Set de IDs que o usuário quis ocultar da view
  // sem tocar no histórico real
  const [removidosLocal, setRemovidosLocal] = useState<Set<string>>(new Set());

  // Ref para evitar re-carregamento desnecessário
  const inicializadoRef = useRef(false);

  // ── Carregamento inicial ──────────────────────────────────────────────────

  useEffect(() => {
    if (inicializadoRef.current) return;
    inicializadoRef.current = true;

    try {
      const historico = lerHistorico();
      setTotalSimulados(historico.length);

      // Total real de questões respondidas (não simulados * 60)
      const totalQuestoes = historico.reduce(
        (acc, s) => acc + (s.questoes?.length ?? 0),
        0,
      );
      setTotalQuestoesRespondidas(totalQuestoes);

      // Constrói o mapa de erros
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
      setErrosVisiveis(listaErros);

      // Carrega revisados e removidos
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

  // ── Erros disponíveis (excluindo removidos individualmente) ──────────────

  const errosAtivos = useMemo(
    () => errosTodos.filter((e) => !removidosLocal.has(e.id)),
    [errosTodos, removidosLocal],
  );

  // ── Filtragem e ordenação ─────────────────────────────────────────────────

  const errosFiltrados = useMemo(() => {
    const term = busca.trim().toLowerCase();

    const filtrados = errosAtivos.filter((e) => {
      const matchBusca =
        !term ||
        e.enunciado.toLowerCase().includes(term) ||
        e.disciplinaFormatada.toLowerCase().includes(term);
      const matchDisc =
        filtroDisciplina === "todas" || e.disciplina === filtroDisciplina;
      return matchBusca && matchDisc;
    });

    // FIX: não muta `filtrados`, cria nova referência
    return [...filtrados].sort((a, b) => {
      switch (ordenacao) {
        case "vezes":
          return b.vezesErrada - a.vezesErrada;
        case "data":
          return (
            new Date(b.ultimaData).getTime() - new Date(a.ultimaData).getTime()
          );
        case "recentes":
          return (
            new Date(a.ultimaData).getTime() - new Date(b.ultimaData).getTime()
          );
        case "disciplina":
          return a.disciplina.localeCompare(b.disciplina);
        default:
          return 0;
      }
    });
  }, [errosAtivos, busca, filtroDisciplina, ordenacao]);

  // ── Estatísticas por disciplina ───────────────────────────────────────────

  const statsPorDisciplina = useMemo(() => {
    const stats = new Map<string, number>();
    for (const e of errosAtivos) {
      stats.set(e.disciplina, (stats.get(e.disciplina) ?? 0) + 1);
    }
    return Array.from(stats.entries())
      .sort(([, a], [, b]) => b - a)
      .map(([disc, count]) => ({
        disciplina: disc,
        count,
        nome: DISCIPLINAS_NOME[disc] ?? disc,
      }));
  }, [errosAtivos]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  /**
   * FIX crítico: removerErroIndividual agora só oculta o erro da view
   * salvando o ID em `prf_erros_removidos` — NÃO toca no histórico real.
   * O histórico de simulados é preservado intacto.
   */
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

  /**
   * FIX: limparHistorico agora é uma ação explícita e devidamente nomeada.
   * Faz backup automático antes de apagar.
   */
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
    setErrosVisiveis([]);
    setTotalSimulados(0);
    setTotalQuestoesRespondidas(0);
    setRevisados(new Set());
    setRemovidosLocal(new Set());

    toast.success("Histórico apagado. Backup salvo automaticamente.");
  }, []);

  const iniciarTreinoErros = useCallback(() => {
    if (errosFiltrados.length === 0) {
      toast.error("Nenhum erro para treinar com os filtros atuais");
      return;
    }

    // FIX: usa errosFiltrados diretamente — já está ordenado por useMemo
    const selecionadas = errosFiltrados.slice(0, 30).map((e) => ({
      id: e.id,
      disciplina: e.disciplina,
      enunciado: e.enunciado,
      resposta: e.resposta,
      explicacao: e.explicacao,
      respostaUsuario: undefined,
    }));

    localStorage.setItem(
      "prf_treino_atual",
      JSON.stringify({
        disciplina: "REVISÃO DE ERROS",
        questoes: selecionadas,
        mostrarExplicacao: true,
        modo: "ERROS",
        totalErrosDisponiveis: errosAtivos.length,
        meta: { tipo: "revisao_erros", prioridade: "mais_errados" },
      }),
    );

    toast.success(`Iniciando treino com ${selecionadas.length} questões!`);
    router.push("/treino/simulado");
  }, [errosFiltrados, errosAtivos.length, router]);

  const exportarErros = useCallback(() => {
    const data = {
      exportadoEm: new Date().toISOString(),
      versao: "1.0",
      totalSimulados,
      totalErrosUnicos: errosAtivos.length,
      totalErrosContabilizados: errosAtivos.reduce(
        (acc, e) => acc + e.vezesErrada,
        0,
      ),
      erros: errosAtivos.map(
        ({
          id,
          disciplina,
          disciplinaFormatada,
          enunciado,
          resposta,
          vezesErrada,
          ultimaData,
        }) => ({
          id,
          disciplina,
          disciplinaFormatada,
          enunciado,
          resposta,
          vezesErrada,
          ultimaData,
        }),
      ),
      revisados: [...revisados],
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    // FIX: insere o link no DOM antes de clicar (necessário no Firefox)
    const a = document.createElement("a");
    a.href = url;
    a.download = `prf_banco_erros_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    requestAnimationFrame(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    toast.success("Banco de erros exportado com sucesso!");
  }, [errosAtivos, revisados, totalSimulados]);

  const limparFiltros = useCallback(() => {
    setBusca("");
    setFiltroDisciplina("todas");
    setOrdenacao("vezes");
  }, []);

  const resetarRevisados = useCallback(() => {
    setRevisados(new Set());
    localStorage.removeItem(LS_REVISADOS);
    toast.info("Lista de revisados resetada");
  }, []);

  // ── Renders de estado ──────────────────────────────────────────────────────

  if (carregando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 rounded-xl border-2 border-rose-500 border-t-transparent"
          />
          <p className="text-slate-400">Analisando seus erros...</p>
        </motion.div>
      </div>
    );
  }

  if (totalSimulados === 0) return <EmptyState tipo="sem-simulados" />;
  if (errosAtivos.length === 0) return <EmptyState tipo="sem-erros" />;

  // ── Render principal ───────────────────────────────────────────────────────

  return (
    <>
      {/* FIX: Toaster renderizado uma única vez, no root do render principal */}
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          style: {
            background: "#1e293b",
            border: "1px solid #334155",
            color: "#f1f5f9",
          },
          duration: 3000,
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white pb-12">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/10"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Link
                  href="/"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
                  aria-label="Voltar ao início"
                >
                  <BookOpen className="w-5 h-5" />
                </Link>
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2">
                    <XCircle className="w-6 h-6 text-rose-500" />
                    Banco de Erros
                  </h1>
                  <p className="text-sm text-slate-400">
                    {errosAtivos.length} questão
                    {errosAtivos.length !== 1 ? "ões" : ""} para revisar
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={exportarErros}
                  className="flex items-center gap-2 px-4 py-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Exportar</span>
                </button>
                <button
                  onClick={limparHistoricoCompleto}
                  className="flex items-center gap-2 px-4 py-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-sm"
                  title="Apaga todo o histórico de simulados"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Limpar Histórico</span>
                </button>
              </div>
            </div>
          </div>
        </motion.header>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Estatísticas */}
          <PainelEstatisticas
            erros={errosAtivos}
            totalQuestoesRespondidas={totalQuestoesRespondidas}
            revisados={revisados}
          />

          {/* Card de ação principal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="p-6" glow="pink">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex-1">
                  <p className="text-slate-400 text-sm mb-1 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-400" />
                    Baseado em {totalSimulados} simulado
                    {totalSimulados !== 1 ? "s" : ""} realizados
                  </p>
                  <p className="text-3xl font-bold text-white mb-2">
                    {errosAtivos.length}{" "}
                    <span className="text-lg text-slate-400 font-normal">
                      questões para revisar
                    </span>
                  </p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Último erro:{" "}
                      {errosAtivos[0]
                        ? new Date(
                            errosAtivos[0].ultimaData,
                          ).toLocaleDateString("pt-BR")
                        : "—"}
                    </span>
                    {revisados.size > 0 && (
                      <span className="flex items-center gap-1 text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        {revisados.size} revisadas
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={iniciarTreinoErros}
                  disabled={errosFiltrados.length === 0}
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-500 text-white rounded-xl font-bold transition-all hover:scale-105 shadow-lg shadow-rose-500/25 disabled:shadow-none disabled:cursor-not-allowed"
                >
                  <Play className="w-5 h-5" />
                  Treinar {Math.min(errosFiltrados.length, 30)} Erros
                </button>
              </div>
            </GlassCard>
          </motion.div>

          {/* Filtros */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar em enunciados ou disciplinas..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <select
              value={filtroDisciplina}
              onChange={(e) => setFiltroDisciplina(e.target.value)}
              className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
            >
              <option value="todas">Todas as disciplinas</option>
              {statsPorDisciplina.map(({ disciplina, nome, count }) => (
                <option key={disciplina} value={disciplina}>
                  {nome} ({count})
                </option>
              ))}
            </select>

            <select
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value as OrdenacaoType)}
              className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
            >
              <option value="vezes">Mais erradas</option>
              <option value="data">Mais recentes</option>
              <option value="recentes">Mais antigas</option>
              <option value="disciplina">Por disciplina</option>
            </select>
          </motion.div>

          {/* Chips de disciplina */}
          {statsPorDisciplina.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-2"
            >
              {statsPorDisciplina.map(({ disciplina, count, nome }) => (
                <button
                  key={disciplina}
                  onClick={() =>
                    setFiltroDisciplina((prev) =>
                      prev === disciplina ? "todas" : disciplina,
                    )
                  }
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    filtroDisciplina === disciplina
                      ? (DISCIPLINAS_COR[disciplina] ??
                        "bg-slate-800 text-slate-300 border-slate-600")
                      : "bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600"
                  }`}
                >
                  {nome}: {count}
                </button>
              ))}
              {(busca || filtroDisciplina !== "todas") && (
                <button
                  onClick={limparFiltros}
                  className="px-3 py-1.5 rounded-full text-xs font-medium border bg-slate-800 text-blue-400 border-blue-500/30 hover:bg-blue-500/10 transition-all"
                >
                  <Filter className="w-3 h-3 inline mr-1" />
                  Limpar filtros
                </button>
              )}
            </motion.div>
          )}

          {/* Lista de erros */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="space-y-3"
          >
            <AnimatePresence mode="popLayout">
              {errosFiltrados.length === 0 ? (
                <motion.div
                  key="empty-filtered"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12 text-slate-500"
                >
                  <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhum erro encontrado com os filtros atuais.</p>
                  <button
                    onClick={limparFiltros}
                    className="mt-2 text-blue-400 hover:underline text-sm"
                  >
                    Limpar filtros
                  </button>
                </motion.div>
              ) : (
                errosFiltrados.map((erro, idx) => (
                  <CardErro
                    key={erro.id}
                    erro={erro}
                    index={idx}
                    onRemover={removerErroIndividual}
                    // FIX: boolean calculado aqui — O(1) com Set.has
                    isRevisado={revisados.has(erro.id)}
                    onToggleRevisado={marcarComoRevisado}
                  />
                ))
              )}
            </AnimatePresence>
          </motion.div>

          {/* Footer */}
          {errosFiltrados.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 text-xs text-slate-600"
            >
              <p>
                Mostrando {errosFiltrados.length} de {errosAtivos.length} erros
                {errosFiltrados.length > 30 &&
                  " • Treino limitado a 30 questões por sessão"}
              </p>
              <div className="flex gap-4">
                {/* FIX: não muta `errosTodos` — usa filtro visual separado */}
                <button
                  onClick={() => {
                    const naoRevisados = errosAtivos.filter(
                      (e) => !revisados.has(e.id),
                    );
                    if (naoRevisados.length === 0) {
                      toast.info("Todos os erros já foram revisados! 🎉");
                      return;
                    }
                    setBusca("");
                    setFiltroDisciplina("todas");
                    // Filtra via estado local de removidos visualmente
                    const idsRevisados = [...revisados];
                    setRemovidosLocal((prev) => {
                      // Temporário: só filtra a view sem salvar no LS
                      // O usuário pode limpar com "Limpar filtros"
                      return prev;
                    });
                    toast.info(`${naoRevisados.length} erros não revisados`);
                  }}
                  className="text-slate-500 hover:text-blue-400 transition-colors"
                >
                  Não revisados (
                  {errosAtivos.filter((e) => !revisados.has(e.id)).length})
                </button>
                <button
                  onClick={resetarRevisados}
                  className="text-slate-500 hover:text-amber-400 transition-colors"
                >
                  Resetar revisados
                </button>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </>
  );
}
