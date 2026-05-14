// src/components/como-funciona/RegraCEBRASPESection.tsx (VERSÃO OTIMIZADA)
"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  MinusCircle,
  Shield,
  TrendingUp,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";
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

// Componente de card de regra melhorado
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
        bg: "from-emerald-500/20 to-emerald-600/10",
        border: "border-emerald-500/30",
        text: "text-emerald-400",
        glow: "shadow-emerald-500/20",
      },
      rose: {
        bg: "from-rose-500/20 to-rose-600/10",
        border: "border-rose-500/30",
        text: "text-rose-400",
        glow: "shadow-rose-500/20",
      },
      slate: {
        bg: "from-slate-500/20 to-slate-600/10",
        border: "border-slate-500/30",
        text: "text-slate-400",
        glow: "shadow-slate-500/20",
      },
    };

    const IconComponent = Icon;

    return (
      <motion.div
        variants={fadeInUp}
        custom={delay}
        whileHover={{ scale: 1.03, y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
        className={`group relative`}
      >
        <div
          className={`p-6 rounded-xl bg-gradient-to-br ${cores[cor].bg} border ${cores[cor].border} hover:shadow-lg ${cores[cor].glow} transition-all duration-300`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`p-2 rounded-lg bg-white/5 group-hover:scale-110 transition-transform`}
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

// Componente de dica estratégica
const DicaEstrategica = () => {
  const [showTip, setShowTip] = useState(false);

  return (
    <motion.div
      variants={fadeInUp}
      className="mt-4 p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-blue-500/20">
          <TrendingUp className="w-4 h-4 text-blue-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-white text-sm">
              Estratégia CEBRASPE
            </h4>
            <button
              onClick={() => setShowTip(!showTip)}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              {showTip ? "Menos dicas" : "Mais dicas"}
            </button>
          </div>
          <p className="text-slate-300 text-sm">
            No sistema CEBRASPE, cada erro anula um acerto. Por isso, é melhor
            deixar em branco do que chutar sem certeza!
          </p>

          <AnimatePresence>
            {showTip && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 space-y-2"
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
      className="scroll-mt-20"
    >
      <SectionTitle
        icon={Shield}
        title="Regra de Pontuação CEBRASPE"
        subtitle="O mesmo sistema da prova real, para você treinar na condição exata da prova"
      />

      {/* Cards das regras */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      </div>

      {/* Exemplo prático melhorado */}
      <GlassCard className="mt-6 p-6">
        <div className="flex items-start gap-4 flex-col sm:flex-row">
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <HelpCircle className="w-6 h-6 text-blue-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
              Exemplo prático
              <span className="text-xs bg-slate-700 px-2 py-0.5 rounded-full text-slate-400">
                Cálculo real
              </span>
            </h4>
            <div className="space-y-3">
              <p className="text-slate-300 text-sm leading-relaxed">
                Se você acertar{" "}
                <span className="text-emerald-400 font-bold">40 questões</span>{" "}
                e errou <span className="text-rose-400 font-bold">20</span>, sua
                pontuação final é{" "}
                <span className="text-emerald-400 font-bold text-lg">
                  20 pontos
                </span>{" "}
                (40 - 20 = 20).
              </p>
              <p className="text-slate-300 text-sm leading-relaxed">
                Se deixou as{" "}
                <span className="text-slate-400 font-bold">20 em branco</span>,
                seriam{" "}
                <span className="text-emerald-400 font-bold text-lg">
                  40 pontos
                </span>
                .
              </p>
              <div className="mt-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-slate-200 text-sm font-medium">
                  💡 Conclusão: no CEBRASPE,{" "}
                  <span className="text-white font-bold">
                    chutar não piora sua nota
                  </span>{" "}
                  — mas acertar melhora!
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
        variants={fadeInUp}
        className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3"
      >
        <div className="p-3 rounded-lg bg-slate-800/30 text-center">
          <p className="text-xs text-slate-500">Chute certeiro (80% acerto)</p>
          <p className="text-sm font-bold text-emerald-400">+0.6 pontos</p>
          <p className="text-[10px] text-slate-600">Em média por questão</p>
        </div>
        <div className="p-3 rounded-lg bg-slate-800/30 text-center">
          <p className="text-xs text-slate-500">Chute duvidoso (50% acerto)</p>
          <p className="text-sm font-bold text-yellow-400">0 pontos</p>
          <p className="text-[10px] text-slate-600">Empate estatístico</p>
        </div>
        <div className="p-3 rounded-lg bg-slate-800/30 text-center">
          <p className="text-xs text-slate-500">
            Chute sem eliminar (25% acerto)
          </p>
          <p className="text-sm font-bold text-rose-400">-0.5 pontos</p>
          <p className="text-[10px] text-slate-600">Melhor deixar em branco</p>
        </div>
      </motion.div>
    </motion.section>
  );
}
