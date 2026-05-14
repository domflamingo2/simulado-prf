// src/components/como-funciona/EstruturaProvaSection.tsx (VERSÃO OTIMIZADA)
"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { ESTRUTURA_PROVA } from "@/constants/estruturaProva";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { motion } from "framer-motion";
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock,
  HelpCircle,
  PieChart,
  Target,
  TrendingUp,
} from "lucide-react";
import { memo, useState } from "react";
import { SectionTitle } from "./SectionTitle";

const scrollReveal = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Componente de disciplina memoizado
const DisciplinaItem = memo(
  ({
    nome,
    qtd,
    total,
    cor,
    index,
  }: {
    nome: string;
    qtd: number;
    total: number;
    cor: "blue" | "purple";
    index: number;
  }) => {
    const percentage = (qtd / total) * 100;
    const [isHovered, setIsHovered] = useState(false);

    const corClasses = {
      blue: {
        bg: "bg-blue-500",
        text: "text-blue-400",
        light: "bg-blue-500/10",
        border: "border-blue-500/20",
      },
      purple: {
        bg: "bg-purple-500",
        text: "text-purple-400",
        light: "bg-purple-500/10",
        border: "border-purple-500/20",
      },
    };

    const colors = corClasses[cor];

    return (
      <motion.li
        variants={fadeInUp}
        custom={index}
        className="group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800/70 transition-all duration-300 gap-2 border border-slate-700/50 hover:border-slate-600">
          <div className="flex items-center gap-3">
            <div
              className={`w-1.5 h-1.5 rounded-full ${colors.bg} ${isHovered ? "scale-150" : ""} transition-transform`}
            />
            <span className="text-slate-300 text-sm font-medium">{nome}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 min-w-[100px] justify-end">
              <span className={`font-bold text-sm ${colors.text}`}>
                {qtd} questões
              </span>
              <div className="w-24 bg-slate-700 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className={`${colors.bg} h-1.5 rounded-full relative`}
                >
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-white/30 animate-pulse"
                    />
                  )}
                </motion.div>
              </div>
            </div>
            <span className="text-xs text-slate-500 min-w-[45px] text-right">
              {percentage.toFixed(0)}%
            </span>
          </div>
        </div>
      </motion.li>
    );
  },
);

DisciplinaItem.displayName = "DisciplinaItem";

// Componente de card de estatística
const StatCard = memo(
  ({
    icon: Icon,
    label,
    value,
    description,
    color,
    delay,
  }: {
    icon: React.ElementType;
    label: string;
    value: string | number;
    description?: string;
    color: string;
    delay: number;
  }) => (
    <motion.div
      variants={fadeInUp}
      custom={delay}
      whileHover={{ scale: 1.02, y: -2 }}
      className="p-4 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-800/30 border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300"
    >
      <div className="flex items-start gap-3">
        <div
          className={`p-2 rounded-lg ${color} group-hover:scale-110 transition-transform`}
        >
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-xs text-slate-400 mt-0.5">{label}</p>
          {description && (
            <p className="text-[10px] text-slate-500 mt-1">{description}</p>
          )}
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
      blue: "from-blue-500/10 to-blue-600/5 border-blue-500/20 text-blue-400",
      purple:
        "from-purple-500/10 to-purple-600/5 border-purple-500/20 text-purple-400",
      amber:
        "from-amber-500/10 to-amber-600/5 border-amber-500/20 text-amber-400",
    };

    return (
      <motion.div
        variants={fadeInUp}
        className={`p-3 rounded-lg bg-gradient-to-r ${cores[cor]} border`}
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
  const tempoTotal = 4; // horas
  const tempoPorQuestao = (tempoTotal * 60) / totalQuestoes; // minutos por questão

  // Calcular distribuição percentual
  const percentualBasico =
    (ESTRUTURA_PROVA.conhecimentosBasicos.total / totalQuestoes) * 100;
  const percentualEspecifico =
    (ESTRUTURA_PROVA.conhecimentosEspecificos.total / totalQuestoes) * 100;

  return (
    <motion.section
      ref={ref}
      variants={scrollReveal}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      className="scroll-mt-20"
    >
      <SectionTitle
        icon={BookOpen}
        title="Estrutura da Prova PRF"
        subtitle="Distribuição oficial de questões por disciplina"
      />

      {/* Cards de estatísticas rápidas */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate={isVisible ? "animate" : "initial"}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
      >
        <StatCard
          icon={Target}
          label="Total de Questões"
          value="60"
          description="Distribuídas em 2 blocos"
          color="bg-blue-500"
          delay={0}
        />
        <StatCard
          icon={Clock}
          label="Tempo Total"
          value="4h"
          description={`~${tempoPorQuestao.toFixed(0)} min por questão`}
          color="bg-emerald-500"
          delay={1}
        />
        <StatCard
          icon={BarChart3}
          label="Conhecimentos Básicos"
          value={`${ESTRUTURA_PROVA.conhecimentosBasicos.total}`}
          description={`${percentualBasico.toFixed(0)}% da prova`}
          color="bg-blue-500"
          delay={2}
        />
        <StatCard
          icon={PieChart}
          label="Conhecimentos Específicos"
          value={`${ESTRUTURA_PROVA.conhecimentosEspecificos.total}`}
          description={`${percentualEspecifico.toFixed(0)}% da prova`}
          color="bg-purple-500"
          delay={3}
        />
      </motion.div>

      {/* Gráfico de distribuição visual */}
      <motion.div
        variants={fadeInUp}
        className="mb-6 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50"
      >
        <p className="text-xs text-slate-400 mb-2 flex items-center gap-2">
          <PieChart className="w-3 h-3" />
          Distribuição da prova:
        </p>
        <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden flex">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentualBasico}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-gradient-to-r from-blue-500 to-blue-400 h-full flex items-center justify-center text-[10px] font-bold text-white"
          >
            {percentualBasico >= 15 && `${percentualBasico.toFixed(0)}%`}
          </motion.div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentualEspecifico}%` }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-gradient-to-r from-purple-500 to-purple-400 h-full flex items-center justify-center text-[10px] font-bold text-white"
          >
            {percentualEspecifico >= 15 &&
              `${percentualEspecifico.toFixed(0)}%`}
          </motion.div>
        </div>
        <div className="flex justify-center gap-4 mt-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-slate-400">Básicos</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-purple-500" />
            <span className="text-slate-400">Específicos</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conhecimentos Básicos */}
        <GlassCard className="p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-blue-400 font-bold">1</span>
              </div>
              Conhecimentos Básicos
            </h3>
            <div className="px-2 py-1 rounded-full bg-blue-500/20">
              <span className="text-xs font-bold text-blue-400">
                {ESTRUTURA_PROVA.conhecimentosBasicos.total} questões
              </span>
            </div>
          </div>

          <ul className="space-y-2">
            {basicas.map(([nome, qtd], index) => (
              <DisciplinaItem
                key={nome}
                nome={nome}
                qtd={qtd}
                total={ESTRUTURA_PROVA.conhecimentosBasicos.total}
                cor="blue"
                index={index}
              />
            ))}
          </ul>

          {/* Dica para conhecimentos básicos */}
          <StudyTip
            dica="Português e Raciocínio Lógico são disciplinas eliminatórias. Dedique atenção especial a elas!"
            cor="blue"
          />
        </GlassCard>

        {/* Conhecimentos Específicos */}
        <GlassCard className="p-6 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-purple-400 font-bold">2</span>
              </div>
              Conhecimentos Específicos
            </h3>
            <div className="px-2 py-1 rounded-full bg-purple-500/20">
              <span className="text-xs font-bold text-purple-400">
                {ESTRUTURA_PROVA.conhecimentosEspecificos.total} questões
              </span>
            </div>
          </div>

          <ul className="space-y-2">
            {especificas.map(([nome, qtd], index) => (
              <DisciplinaItem
                key={nome}
                nome={nome}
                qtd={qtd}
                total={ESTRUTURA_PROVA.conhecimentosEspecificos.total}
                cor="purple"
                index={index}
              />
            ))}
          </ul>

          {/* Dica para conhecimentos específicos */}
          <StudyTip
            dica="Legislação PRF e Direito Constitucional são os maiores pesos. Invista tempo nelas!"
            cor="purple"
          />
        </GlassCard>
      </div>

      {/* Informações de tempo e estratégia */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-amber-600/5 border border-amber-500/20">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div>
              <p className="text-slate-300 text-sm">
                <span className="font-semibold text-amber-400">
                  Tempo total:
                </span>{" "}
                4 horas para resolver as 60 questões.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                ⏱️ Você tem cerca de {tempoPorQuestao.toFixed(0)} minutos por
                questão. Gerencie bem seu tempo!
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-slate-300 text-sm">
                <span className="font-semibold text-emerald-400">
                  Estratégia recomendada:
                </span>{" "}
                Resolva primeiro as questões que você tem mais domínio.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                🎯 Deixe as questões mais difíceis para o final e não fique
                travado em uma única questão.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de pesos por disciplina */}
      <motion.div
        variants={fadeInUp}
        className="mt-6 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50"
      >
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          <p className="text-xs font-semibold text-slate-300">
            Peso das disciplinas na nota final:
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {[...basicas, ...especificas].map(([nome, qtd]) => (
            <div
              key={nome}
              className="text-center p-2 rounded-lg bg-slate-800/50"
            >
              <p className="text-[10px] text-slate-400 truncate" title={nome}>
                {nome.split(" ")[0]}
              </p>
              <p className="text-xs font-bold text-blue-400">
                {((qtd / totalQuestoes) * 100).toFixed(0)}%
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
}
