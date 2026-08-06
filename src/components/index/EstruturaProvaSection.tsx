// src/components/como-funciona/EstruturaProvaSection.tsx
"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { ESTRUTURA_PROVA } from "@/constants/estruturaProva";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Clock,
  GraduationCap,
  HelpCircle,
  ListChecks,
  PieChart,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
} from "lucide-react";
import { memo, useState } from "react";
import { SectionTitle } from "./SectionTitle";

// Animações
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

// Componente de disciplina (expansível, com nome sempre completo — nunca cortado)
const DisciplinaItem = memo(
  ({
    nome,
    qtd,
    total,
    topicos,
    cor,
    index,
  }: {
    nome: string;
    qtd: number;
    total: number;
    topicos: string[];
    cor: "blue" | "purple";
    index: number;
  }) => {
    const percentage = (qtd / total) * 100;
    const [isHovered, setIsHovered] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const corClasses = {
      blue: {
        bg: "bg-blue-500",
        text: "text-blue-400",
        light: "bg-blue-500/10",
        border: "border-blue-500/30",
        gradient: "from-blue-500 to-blue-600",
        marker: "text-blue-400",
      },
      purple: {
        bg: "bg-purple-500",
        text: "text-purple-400",
        light: "bg-purple-500/10",
        border: "border-purple-500/30",
        gradient: "from-purple-500 to-purple-600",
        marker: "text-purple-400",
      },
    };

    const colors = corClasses[cor];
    const hasTopicos = topicos && topicos.length > 0;

    return (
      <motion.li variants={fadeInUp} custom={index}>
        <div className="group relative">
          <button
            type="button"
            onClick={() => hasTopicos && setIsOpen((prev) => !prev)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-expanded={isOpen}
            className={`w-full text-left p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/60 transition-all duration-300 border ${
              isOpen ? colors.border : "border-slate-700/50"
            } hover:border-slate-600 ${hasTopicos ? "cursor-pointer" : "cursor-default"}`}
          >
            {/* Linha 1: nome completo da disciplina + contador de assuntos + chevron */}
            <div className="flex items-center gap-2.5">
              <motion.div
                animate={{ scale: isHovered ? 1.2 : 1 }}
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${colors.bg} ${isHovered ? "shadow-lg shadow-blue-500/50" : ""}`}
              />
              <span className="text-slate-200 text-sm font-semibold leading-snug break-words flex-1 min-w-0">
                {nome}
              </span>
              {hasTopicos && (
                <>
                  <span className="text-[10px] text-slate-500 flex-shrink-0 hidden sm:inline">
                    {topicos.length} assuntos
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className={`w-4 h-4 ${colors.text}`} />
                  </motion.div>
                </>
              )}
            </div>

            {/* Linha 2: quantidade de questões, barra de progresso e percentual */}
            <div className="flex items-center gap-3 mt-2.5 pl-4">
              <span
                className={`text-xs font-bold whitespace-nowrap ${colors.text}`}
              >
                {qtd} questões
              </span>
              <div className="flex-1 bg-slate-700 rounded-full h-1.5 overflow-hidden min-w-[40px]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: index * 0.05 }}
                  className={`h-full rounded-full bg-gradient-to-r ${colors.gradient} relative`}
                >
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, x: "-100%" }}
                      animate={{ opacity: 1, x: "100%" }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    />
                  )}
                </motion.div>
              </div>
              <span className="text-xs text-slate-500 whitespace-nowrap font-mono flex-shrink-0">
                {percentage.toFixed(0)}%
              </span>
              {hasTopicos && (
                <span className="text-[10px] text-slate-500 whitespace-nowrap sm:hidden flex-shrink-0">
                  {topicos.length} assuntos
                </span>
              )}
            </div>
          </button>

          <AnimatePresence initial={false}>
            {isOpen && hasTopicos && (
              <motion.div
                key="content"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div
                  className={`mt-2 ml-2 p-3 rounded-lg ${colors.light} border ${colors.border}`}
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <ListChecks className={`w-3 h-3 ${colors.marker}`} />
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                      Assuntos do edital
                    </span>
                  </div>
                  <ol className="space-y-1.5">
                    {topicos.map((topico, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.02 }}
                        className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed"
                      >
                        <span
                          className={`flex-shrink-0 font-mono font-bold ${colors.marker} mt-[1px]`}
                        >
                          {i + 1}.
                        </span>
                        <span className="break-words">{topico}</span>
                      </motion.li>
                    ))}
                  </ol>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.li>
    );
  },
);

DisciplinaItem.displayName = "DisciplinaItem";

// Card de estatística
const StatCard = memo(
  ({
    icon: Icon,
    label,
    value,
    description,
    gradient,
    delay,
  }: {
    icon: React.ElementType;
    label: string;
    value: string | number;
    description?: string;
    gradient: string;
    delay: number;
  }) => (
    <motion.div
      variants={fadeInUp}
      custom={delay}
      whileHover={{ y: -4 }}
      className="group"
    >
      <div
        className={`p-4 rounded-xl bg-gradient-to-br ${gradient} backdrop-blur-sm border border-white/10 transition-all duration-300 hover:shadow-lg`}
      >
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-white/10 group-hover:scale-110 transition-transform">
            <Icon className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-slate-300 mt-0.5">{label}</p>
            {description && (
              <p className="text-[10px] text-slate-400 mt-1 break-words">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  ),
);

StatCard.displayName = "StatCard";

// Dica de estudo
const StudyTip = memo(
  ({ dica, cor }: { dica: string; cor: "blue" | "purple" | "amber" }) => {
    const cores = {
      blue: "from-blue-500/15 to-blue-600/10 border-blue-500/30 text-blue-300",
      purple:
        "from-purple-500/15 to-purple-600/10 border-purple-500/30 text-purple-300",
      amber:
        "from-amber-500/15 to-amber-600/10 border-amber-500/30 text-amber-300",
    };

    return (
      <motion.div
        variants={fadeInUp}
        className={`mt-4 p-3 rounded-xl bg-gradient-to-r ${cores[cor]} border backdrop-blur-sm`}
      >
        <div className="flex items-start gap-2">
          <HelpCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p className="text-xs leading-relaxed">{dica}</p>
        </div>
      </motion.div>
    );
  },
);

StudyTip.displayName = "StudyTip";

export function EstruturaProvaSection() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({
    threshold: 0.1,
    once: true,
  });

  const basicas = Object.entries(
    ESTRUTURA_PROVA.conhecimentosBasicos.disciplinas,
  );
  const especificas = Object.entries(
    ESTRUTURA_PROVA.conhecimentosEspecificos.disciplinas,
  );

  const totalQuestoes = 60;
  const tempoTotal = 4;
  const tempoPorQuestao = (tempoTotal * 60) / totalQuestoes;
  const percentualBasico =
    (ESTRUTURA_PROVA.conhecimentosBasicos.total / totalQuestoes) * 100;
  const percentualEspecifico =
    (ESTRUTURA_PROVA.conhecimentosEspecificos.total / totalQuestoes) * 100;

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={staggerContainer}
      className="scroll-mt-20 py-8"
    >
      <div className="mb-10">
        <SectionTitle
          icon={BookOpen}
          title="Estrutura da Prova PRF"
          subtitle="Distribuição oficial de questões por disciplina — clique em uma disciplina para ver os assuntos do edital"
        />
      </div>

      {/* Cards de estatísticas */}
      <motion.div
        variants={staggerContainer}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
      >
        <StatCard
          icon={Target}
          label="Total de Questões"
          value="60"
          description={`${ESTRUTURA_PROVA.conhecimentosBasicos.total} básicas + ${ESTRUTURA_PROVA.conhecimentosEspecificos.total} específicas`}
          gradient="from-blue-600/90 to-blue-800/90"
          delay={0}
        />
        <StatCard
          icon={Clock}
          label="Tempo Total"
          value="4h"
          description={`~${tempoPorQuestao.toFixed(0)} min por questão`}
          gradient="from-emerald-600/90 to-emerald-800/90"
          delay={1}
        />
        <StatCard
          icon={BarChart3}
          label="Conhecimentos Básicos"
          value={ESTRUTURA_PROVA.conhecimentosBasicos.total}
          description={`${percentualBasico.toFixed(0)}% da prova`}
          gradient="from-blue-600/90 to-indigo-800/90"
          delay={2}
        />
        <StatCard
          icon={PieChart}
          label="Conhecimentos Específicos"
          value={ESTRUTURA_PROVA.conhecimentosEspecificos.total}
          description={`${percentualEspecifico.toFixed(0)}% da prova`}
          gradient="from-purple-600/90 to-pink-800/90"
          delay={3}
        />
      </motion.div>

      {/* Gráfico de distribuição */}
      <motion.div
        variants={fadeInUp}
        className="mb-8 p-5 rounded-xl bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm border border-white/10"
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-blue-400" />
            Distribuição da prova
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-xs text-slate-400">Básicos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-xs text-slate-400">Específicos</span>
            </div>
          </div>
        </div>

        <div className="w-full bg-slate-700 rounded-full h-7 overflow-hidden flex">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentualBasico}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gradient-to-r from-blue-500 to-blue-400 h-full flex items-center justify-center text-xs font-bold text-white"
          >
            {percentualBasico >= 15 && `${percentualBasico.toFixed(0)}%`}
          </motion.div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentualEspecifico}%` }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-gradient-to-r from-purple-500 to-purple-400 h-full flex items-center justify-center text-xs font-bold text-white"
          >
            {percentualEspecifico >= 15 &&
              `${percentualEspecifico.toFixed(0)}%`}
          </motion.div>
        </div>
      </motion.div>

      {/* Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Conhecimentos Básicos */}
        <motion.div variants={fadeInUp} className="h-full">
          <GlassCard className="p-6 h-full flex flex-col hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Conhecimentos Básicos
                  </h3>
                  <p className="text-xs text-slate-400">
                    Fundamentos essenciais
                  </p>
                </div>
              </div>
              <div className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30">
                <span className="text-sm font-bold text-blue-400">
                  {ESTRUTURA_PROVA.conhecimentosBasicos.total} questões
                </span>
              </div>
            </div>

            <ul className="space-y-2 flex-1">
              {basicas.map(([nome, disciplina], index) => (
                <DisciplinaItem
                  key={nome}
                  nome={nome}
                  qtd={disciplina.qtd}
                  topicos={disciplina.topicos}
                  total={ESTRUTURA_PROVA.conhecimentosBasicos.total}
                  cor="blue"
                  index={index}
                />
              ))}
            </ul>

            <StudyTip
              dica="📖 Português e Raciocínio Lógico são disciplinas eliminatórias. Dedique atenção especial a elas!"
              cor="blue"
            />
          </GlassCard>
        </motion.div>

        {/* Conhecimentos Específicos */}
        <motion.div variants={fadeInUp} className="h-full">
          <GlassCard className="p-6 h-full flex flex-col hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Conhecimentos Específicos
                  </h3>
                  <p className="text-xs text-slate-400">Matérias do cargo</p>
                </div>
              </div>
              <div className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30">
                <span className="text-sm font-bold text-purple-400">
                  {ESTRUTURA_PROVA.conhecimentosEspecificos.total} questões
                </span>
              </div>
            </div>

            <ul className="space-y-2 flex-1">
              {especificas.map(([nome, disciplina], index) => (
                <DisciplinaItem
                  key={nome}
                  nome={nome}
                  qtd={disciplina.qtd}
                  topicos={disciplina.topicos}
                  total={ESTRUTURA_PROVA.conhecimentosEspecificos.total}
                  cor="purple"
                  index={index}
                />
              ))}
            </ul>

            <StudyTip
              dica="⚖️ Legislação PRF e Direito Constitucional são os maiores pesos. Invista tempo nelas!"
              cor="purple"
            />
          </GlassCard>
        </motion.div>
      </div>

      {/* Informações complementares */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <motion.div
          variants={fadeInUp}
          className="p-4 rounded-xl bg-gradient-to-r from-amber-500/15 to-amber-600/10 border border-amber-500/30"
        >
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-amber-500/20">
              <Timer className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-slate-200 font-semibold mb-1">
                Gestão de Tempo
              </p>
              <p className="text-xs text-slate-400">
                Você tem cerca de{" "}
                <span className="text-amber-400 font-bold">
                  {tempoPorQuestao.toFixed(0)} minutos
                </span>{" "}
                por questão. Não fique travado em uma única questão!
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/15 to-emerald-600/10 border border-emerald-500/30"
        >
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-lg bg-emerald-500/20">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm text-slate-200 font-semibold mb-1">
                Estratégia Recomendada
              </p>
              <p className="text-xs text-slate-400">
                Resolva primeiro as questões que você tem mais domínio. Deixe as
                mais difíceis para o final.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Pesos por disciplina */}
      <motion.div
        variants={fadeInUp}
        className="p-5 rounded-xl bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm border border-white/10"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1 rounded-lg bg-blue-500/20">
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <p className="text-sm font-semibold text-slate-300">
            Peso das disciplinas na nota final
          </p>
          <Sparkles className="ml-auto w-3.5 h-3.5 text-yellow-500" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[...basicas, ...especificas].map(([nome, disciplina], idx) => {
            const percentual = (disciplina.qtd / totalQuestoes) * 100;
            return (
              <motion.div
                key={nome}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.02 }}
                className="text-center p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300"
              >
                <p
                  className="text-[11px] text-slate-400 leading-tight break-words min-h-[2rem] flex items-center justify-center"
                  title={nome}
                >
                  {nome}
                </p>
                <p className="text-lg font-bold text-blue-400 mt-1">
                  {percentual.toFixed(0)}%
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.section>
  );
}
