"use client";

import { questoes } from "@/data/questoes";
import { Disciplina } from "@/data/types";
import { embaralhar } from "@/lib/simulado-logic";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Grid3x3,
  Layers,
  Settings2,
  Sparkles,
  Target,
  Timer,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

// ═══════════════════════════════════════════════════════════
// CONFIGURAÇÃO DE DADOS (Com Ícones e Cores)
// ═══════════════════════════════════════════════════════════

const DISCIPLINAS_CONFIG: {
  value: Disciplina;
  label: string;
  icon: any;
  color: string;
  bgGradient: string;
  iconBg: string;
}[] = [
  {
    value: "PORTUGUES",
    label: "Língua Portuguesa",
    icon: require("lucide-react").FileText,
    color: "text-blue-400",
    bgGradient: "group-hover:bg-blue-500/5 border-blue-500/20",
    iconBg: "bg-blue-500/10 text-blue-400",
  },
  {
    value: "ETICA",
    label: "Ética e Conduta",
    icon: require("lucide-react").ShieldCheck,
    color: "text-purple-400",
    bgGradient: "group-hover:bg-purple-500/5 border-purple-500/20",
    iconBg: "bg-purple-500/10 text-purple-400",
  },
  {
    value: "RACIOCINIO_LOGICO",
    label: "Raciocínio Lógico",
    icon: require("lucide-react").BrainCircuit,
    color: "text-pink-400",
    bgGradient: "group-hover:bg-pink-500/5 border-pink-500/20",
    iconBg: "bg-pink-500/10 text-pink-400",
  },
  {
    value: "DIREITO_CONSTITUCIONAL",
    label: "Dir. Constitucional",
    icon: require("lucide-react").Scale,
    color: "text-emerald-400",
    bgGradient: "group-hover:bg-emerald-500/5 border-emerald-500/20",
    iconBg: "bg-emerald-500/10 text-emerald-400",
  },
  {
    value: "DIREITO_ADMINISTRATIVO",
    label: "Dir. Administrativo",
    icon: require("lucide-react").Building2,
    color: "text-cyan-400",
    bgGradient: "group-hover:bg-cyan-500/5 border-cyan-500/20",
    iconBg: "bg-cyan-500/10 text-cyan-400",
  },
  {
    value: "ADMINISTRACAO",
    label: "Administração",
    icon: require("lucide-react").Briefcase,
    color: "text-amber-400",
    bgGradient: "group-hover:bg-amber-500/5 border-amber-500/20",
    iconBg: "bg-amber-500/10 text-amber-400",
  },
  {
    value: "ARQUIVOLOGIA",
    label: "Arquivologia",
    icon: require("lucide-react").Archive,
    color: "text-orange-400",
    bgGradient: "group-hover:bg-orange-500/5 border-orange-500/20",
    iconBg: "bg-orange-500/10 text-orange-400",
  },
  {
    value: "INFORMATICA",
    label: "Informática",
    icon: require("lucide-react").Cpu,
    color: "text-indigo-400",
    bgGradient: "group-hover:bg-indigo-500/5 border-indigo-500/20",
    iconBg: "bg-indigo-500/10 text-indigo-400",
  },
  {
    value: "LEGISLACAO_PRF",
    label: "Legislação PRF",
    icon: require("lucide-react").Gavel,
    color: "text-rose-400",
    bgGradient: "group-hover:bg-rose-500/5 border-rose-500/20",
    iconBg: "bg-rose-500/10 text-rose-400",
  },
];

// ═══════════════════════════════════════════════════════════
// SUB-COMPONENTES (UI)
// ═══════════════════════════════════════════════════════════

// Componente Toggle Acessível e Estiloso
const ToggleSwitch = ({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description: string;
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`
        w-full text-left p-4 rounded-xl border transition-all duration-300 relative overflow-hidden group
        flex items-start gap-4
        ${
          checked
            ? "bg-emerald-500/10 border-emerald-500/50"
            : "bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 hover:border-slate-600"
        }
      `}
    >
      {/* Efeito de brilho ao passar o mouse */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Switch Visual */}
      <div className="relative shrink-0 mt-1">
        <div
          className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 flex items-center ${
            checked ? "bg-emerald-500" : "bg-slate-700"
          }`}
        >
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`w-5 h-5 rounded-full bg-white shadow-md ${
              checked ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </div>
      </div>

      {/* Texto */}
      <div className="relative z-10">
        <span
          className={`block font-semibold text-sm transition-colors ${
            checked ? "text-emerald-300" : "text-slate-200"
          }`}
        >
          {label}
        </span>
        <span className="text-xs text-slate-400 block mt-1 leading-relaxed">
          {description}
        </span>
      </div>
    </button>
  );
};

const QuantitySelector = ({
  value,
  max,
  onChange,
}: {
  value: number;
  max: number;
  onChange: (v: number) => void;
}) => {
  return (
    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-slate-300">Quantidade</span>
        <span className="text-xs text-slate-500">Disponíveis: {max}</span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => onChange(Math.max(5, value - 5))}
          disabled={value <= 5}
          className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          -
        </button>

        <div className="flex-1 text-center">
          <div className="text-4xl font-bold text-white tracking-tight">
            {value}
          </div>
          <div className="text-xs text-slate-500 uppercase tracking-widest font-semibold mt-1">
            Questões
          </div>
        </div>

        <button
          onClick={() => onChange(Math.min(max, value + 5))}
          disabled={value >= max}
          className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
        >
          +
        </button>
      </div>

      {/* Barra de Progresso Visual */}
      <div className="mt-4 h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(value / max) * 100}%` }}
          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
        />
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════

export default function TreinoPage() {
  const router = useRouter();
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<
    Disciplina | ""
  >("");
  const [quantidade, setQuantidade] = useState(10);
  const [mostrarExplicacao, setMostrarExplicacao] = useState(false);

  // Calcula estatísticas da disciplina
  const stats = useMemo(() => {
    if (!disciplinaSelecionada) return { count: 0, max: 0 };
    const filtered = questoes.filter(
      (q) => q.disciplina === disciplinaSelecionada,
    );
    return { count: filtered.length, max: Math.min(filtered.length, 50) };
  }, [disciplinaSelecionada]);

  // Reseta quantidade se mudar a disciplina e o limite for menor
  useMemo(() => {
    if (quantidade > stats.max && stats.max > 0) {
      setQuantidade(stats.max);
    }
  }, [stats.max, quantidade]);

  const iniciarTreino = () => {
    if (!disciplinaSelecionada) {
      alert("Selecione uma disciplina para continuar.");
      return;
    }

    const questoesDisciplina = questoes.filter(
      (q) => q.disciplina === disciplinaSelecionada,
    );
    const selecionadas = embaralhar(questoesDisciplina).slice(0, quantidade);

    localStorage.setItem(
      "prf_treino_atual",
      JSON.stringify({
        disciplina: disciplinaSelecionada,
        questoes: selecionadas.map((q) => ({
          ...q,
          respostaUsuario: undefined,
        })),
        mostrarExplicacao,
        modo: "TREINO",
      }),
    );

    router.push("/treino/simulado");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500/30">
      {/* Background Glow Effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center sm:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3 h-3" /> Modo Estudo
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
            Treino Específico
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Personalize sua sessão focando nas matérias que precisam de mais
            atenção.
          </p>
        </motion.div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Coluna Esquerda: Seleção de Disciplina (Mais larga em telas grandes) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="flex items-center gap-2 mb-4 text-slate-300">
              <Layers className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold">Escolha a Disciplina</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DISCIPLINAS_CONFIG.map((config) => {
                const count = questoes.filter(
                  (q) => q.disciplina === config.value,
                ).length;
                const isSelected = disciplinaSelecionada === config.value;
                const Icon = config.icon;

                return (
                  <button
                    key={config.value}
                    onClick={() => {
                      setDisciplinaSelecionada(config.value);
                      if (quantidade > count)
                        setQuantidade(Math.min(10, count));
                    }}
                    className={`
                      relative text-left p-5 rounded-2xl border transition-all duration-300 group
                      flex flex-col justify-between h-32
                      ${
                        isSelected
                          ? "bg-slate-800/80 border-emerald-500/50 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/20"
                          : "bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60"
                      }
                    `}
                  >
                    <div className="flex justify-between items-start">
                      <div
                        className={`p-2.5 rounded-xl ${config.iconBg} transition-transform group-hover:scale-110 duration-300`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="bg-emerald-500/20 p-1 rounded-full"
                        >
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        </motion.div>
                      )}
                    </div>

                    <div>
                      <h3
                        className={`font-bold text-sm mb-1 ${
                          isSelected ? "text-white" : "text-slate-300"
                        }`}
                      >
                        {config.label}
                      </h3>
                      <div className="flex items-center gap-2 text-xs">
                        <Grid3x3 className="w-3 h-3 text-slate-500" />
                        <span className="text-slate-500">
                          {count} {count === 1 ? "questão" : "questões"}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Coluna Direita: Configurações (Sticky em Desktop) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="lg:sticky lg:top-8">
              <div className="flex items-center gap-2 mb-4 text-slate-300">
                <Settings2 className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-bold">Configurações</h2>
              </div>

              <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
                <AnimatePresence mode="wait">
                  {!disciplinaSelecionada ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-8"
                    >
                      <Target className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                      <p className="text-slate-500 text-sm">
                        Selecione uma disciplina ao lado para configurar o
                        treino.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="config"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      {/* Quantidade */}
                      <QuantitySelector
                        value={quantidade}
                        max={stats.max}
                        onChange={setQuantidade}
                      />

                      {/* Toggle Explicação */}
                      <div>
                        <ToggleSwitch
                          checked={mostrarExplicacao}
                          onChange={setMostrarExplicacao}
                          label="Explicação Imediata"
                          description="Veja a correção logo após responder cada questão."
                        />
                      </div>

                      <div className="h-px bg-slate-800 my-4" />

                      {/* Botão Ação */}
                      <button
                        onClick={iniciarTreino}
                        className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/20 transition-all hover:shadow-emerald-500/40 flex items-center justify-center gap-3 group relative overflow-hidden"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          Iniciar Treino{" "}
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      </button>

                      {/* Badge de Estimativa */}
                      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mt-2">
                        <Timer className="w-3 h-3" />
                        <span>
                          Estimativa: ~{Math.ceil(quantidade * 1.5)} minutos
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
