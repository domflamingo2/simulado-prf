// src/components/como-funciona/RegraCEBRASPESection.tsx (VERSÃO OTIMIZADA)
"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { AnimatePresence, motion, Variants } from "framer-motion";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  HelpCircle,
  MinusCircle,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";
import { SectionTitle } from "./SectionTitle";

const scrollReveal: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      type: "spring",
    },
  },
};

const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const RegraCard = React.memo(
  ({
    titulo,
    valor,
    descricao,
    cor,
    icon: Icon,
    delay,
  }: {
    titulo: string;
    valor: string;
    descricao: string;
    cor: "emerald" | "rose" | "slate";
    icon: React.ElementType;
    delay: number;
  }) => {
    const cores = {
      emerald: {
        bg: "from-emerald-500/20 via-emerald-500/10 to-emerald-600/5",
        border: "border-emerald-500/30",
        text: "text-emerald-400",
        glow: "shadow-emerald-500/20",
        iconBg: "bg-emerald-500/20",
      },
      rose: {
        bg: "from-rose-500/20 via-rose-500/10 to-rose-600/5",
        border: "border-rose-500/30",
        text: "text-rose-400",
        glow: "shadow-rose-500/20",
        iconBg: "bg-rose-500/20",
      },
      slate: {
        bg: "from-slate-500/20 via-slate-500/10 to-slate-600/5",
        border: "border-slate-500/30",
        text: "text-slate-400",
        glow: "shadow-slate-500/20",
        iconBg: "bg-slate-500/20",
      },
    };

    const IconComponent = Icon;

    return (
      <motion.div
        variants={fadeInUp}
        custom={delay}
        whileHover={{ scale: 1.03, y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="group relative"
      >
        <div
          className={`p-6 rounded-xl bg-gradient-to-br ${cores[cor].bg} border ${cores[cor].border} hover:shadow-lg ${cores[cor].glow} transition-all duration-300`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`p-2 rounded-lg ${cores[cor].iconBg} group-hover:scale-110 transition-transform`}
            >
              <IconComponent className={`w-5 h-5 ${cores[cor].text}`} />
            </div>
            <div className={`text-4xl font-black ${cores[cor].text}`}>
              {valor}
            </div>
          </div>
          <div className={`font-semibold mb-1 text-white`}>{titulo}</div>
          <div className="text-sm text-slate-400">{descricao}</div>
        </div>
      </motion.div>
    );
  },
);

RegraCard.displayName = "RegraCard";

const DicaEstrategica = () => {
  const [showTip, setShowTip] = useState(false);

  return (
    <motion.div
      variants={fadeInUp}
      className="mt-6 p-5 rounded-xl bg-gradient-to-r from-blue-500/15 to-purple-500/15 border border-blue-500/30 backdrop-blur-sm"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-blue-500/20">
          <TrendingUp className="w-5 h-5 text-blue-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <h4 className="font-semibold text-white text-base">
              Estratégia CEBRASPE
            </h4>
            <button
              onClick={() => setShowTip(!showTip)}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
            >
              {showTip ? "Menos dicas" : "Mais dicas"}
              <ArrowRight
                className={`w-3 h-3 transition-transform ${showTip ? "rotate-90" : ""}`}
              />
            </button>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            No sistema CEBRASPE, cada erro anula um acerto. Por isso, é melhor
            deixar em branco do que chutar sem certeza!
          </p>

          <AnimatePresence>
            {showTip && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 space-y-2"
              >
                <div className="flex items-start gap-2 text-xs text-slate-400">
                  <ArrowRight className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>Se você tem 50% de chance, vale a pena chutar</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-400">
                  <ArrowRight className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>Elimine alternativas para aumentar suas chances</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-slate-400">
                  <ArrowRight className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>Foco em acertar mais do que errar</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export function RegraCEBRASPESection() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({
    threshold: 0.1,
    once: true,
  });

  return (
    <motion.section
      ref={ref}
      variants={scrollReveal}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      className="scroll-mt-20 py-8"
    >
      <SectionTitle
        icon={Shield}
        title="Regra de Pontuação CEBRASPE"
        subtitle="O mesmo sistema da prova real, para você treinar na condição exata da prova"
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6"
      >
        <RegraCard
          titulo="Acerto"
          valor="+1"
          descricao="Ganha 1 ponto a favor"
          cor="emerald"
          icon={CheckCircle2}
          delay={0}
        />
        <RegraCard
          titulo="Erro"
          valor="-1"
          descricao="Perde 1 ponto (anula um acerto)"
          cor="rose"
          icon={XCircle}
          delay={1}
        />
        <RegraCard
          titulo="Em Branco"
          valor="0"
          descricao="Não altera a pontuação"
          cor="slate"
          icon={MinusCircle}
          delay={2}
        />
      </motion.div>

      {/* Exemplo prático */}
      <GlassCard className="mt-6 p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/10 to-teal-500/10 rounded-full blur-2xl" />

        <div className="flex items-start gap-5 flex-col sm:flex-row relative">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
            <HelpCircle className="w-6 h-6 text-blue-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <h4 className="font-semibold text-white text-base">
                Exemplo prático
              </h4>
              <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded-full text-slate-400">
                Cálculo real
              </span>
            </div>
            <div className="space-y-3">
              <p className="text-slate-300 text-sm leading-relaxed">
                Se você acertar{" "}
                <span className="text-emerald-400 font-bold text-base">
                  40 questões
                </span>{" "}
                e errar{" "}
                <span className="text-rose-400 font-bold text-base">20</span>,
                sua pontuação final é{" "}
                <span className="text-emerald-400 font-bold text-xl">
                  20 pontos
                </span>{" "}
                (40 - 20 = 20).
              </p>
              <p className="text-slate-300 text-sm leading-relaxed">
                Se deixar as{" "}
                <span className="text-slate-400 font-bold">20 em branco</span>,
                seriam{" "}
                <span className="text-emerald-400 font-bold text-xl">
                  40 pontos
                </span>
                .
              </p>
              <div className="mt-3 p-3 rounded-lg bg-gradient-to-r from-emerald-500/15 to-emerald-600/10 border border-emerald-500/30">
                <p className="text-slate-200 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>💡 Conclusão: no CEBRASPE,</span>
                  <span className="text-white font-bold">
                    chutar não piora sua nota
                  </span>
                  <span>— mas acertar melhora!</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Dica Estratégica */}
      <DicaEstrategica />

      {/* Comparativo de estratégias */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {[
          {
            label: "Chute certeiro",
            chance: "80% acerto",
            pontos: "+0.6",
            cor: "emerald",
            desc: "Em média por questão",
          },
          {
            label: "Chute duvidoso",
            chance: "50% acerto",
            pontos: "0",
            cor: "yellow",
            desc: "Empate estatístico",
          },
          {
            label: "Chute sem eliminar",
            chance: "25% acerto",
            pontos: "-0.5",
            cor: "rose",
            desc: "Melhor deixar em branco",
          },
        ].map((item, idx) => (
          <motion.div
            key={item.label}
            variants={fadeInUp}
            custom={idx}
            whileHover={{ y: -2 }}
            className={`p-3 rounded-xl bg-gradient-to-br from-${item.cor}-500/10 to-${item.cor}-600/5 border border-${item.cor}-500/20 text-center transition-all duration-200 hover:shadow-lg`}
          >
            <p className="text-[11px] text-slate-500">{item.label}</p>
            <p className="text-[10px] text-slate-500 mb-1">{item.chance}</p>
            <p className={`text-xl font-bold text-${item.cor}-400`}>
              {item.pontos}
            </p>
            <p className="text-[9px] text-slate-600 mt-1">{item.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Botão de CTA */}
      <motion.div variants={fadeInUp} className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-white/10">
          <Brain className="w-4 h-4 text-purple-400" />
          <span className="text-xs text-slate-400">
            Treine agora e domine o sistema CEBRASPE
          </span>
          <Target className="w-3.5 h-3.5 text-blue-400" />
        </div>
      </motion.div>
    </motion.section>
  );
}
