// src/components/como-funciona/ModosEstudoSection.tsx
"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { MODOS } from "@/constants/modosEstudo";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import React, { useState } from "react";
import { SectionTitle } from "./SectionTitle";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const getIcon = (iconName: string) => {
  const IconComponent = (Icons as any)[iconName];
  return IconComponent || Icons.HelpCircle;
};

const ModoCard = React.memo(
  ({ icon, titulo, descricao, detalhes, cor, popular = false }: any) => {
    const IconComponent = getIcon(icon);
    const [isHovered, setIsHovered] = useState(false);

    const corClasses = {
      blue: "bg-gradient-to-br from-blue-500 to-blue-600",
      purple: "bg-gradient-to-br from-purple-500 to-purple-600",
      emerald: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      amber: "bg-gradient-to-br from-amber-500 to-amber-600",
      rose: "bg-gradient-to-br from-rose-500 to-rose-600",
      cyan: "bg-gradient-to-br from-cyan-500 to-cyan-600",
    };

    const gradient =
      corClasses[cor as keyof typeof corClasses] || corClasses.blue;

    return (
      <motion.div
        variants={fadeInUp}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative"
      >
        {popular && (
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring" }}
            className="absolute -top-3 -right-3 z-10 px-2.5 py-1 text-[10px] font-bold rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg whitespace-nowrap flex items-center gap-1"
          >
            <Icons.Flame className="w-3 h-3" />
            Popular
          </motion.span>
        )}

        <GlassCard
          className={`p-6 h-full transition-all duration-300 ${
            isHovered
              ? "border-blue-500/40 shadow-xl shadow-blue-500/10"
              : "border-white/10"
          }`}
        >
          <div className="relative">
            <div
              className={`w-14 h-14 rounded-xl ${gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
            >
              <IconComponent className="w-7 h-7 text-white" />
            </div>

            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute -top-1 -right-1 w-3 h-3"
              >
                <Icons.Sparkles className="w-3 h-3 text-yellow-400" />
              </motion.div>
            )}
          </div>

          <h3 className="text-lg font-bold text-white mb-2">{titulo}</h3>
          <p className="text-slate-300 text-sm mb-4 leading-relaxed">
            {descricao}
          </p>

          <ul className="space-y-2.5">
            {detalhes.map((detalhe: string, idx: number) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-start gap-2 text-xs text-slate-400"
              >
                <Icons.CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="break-words leading-relaxed">{detalhe}</span>
              </motion.li>
            ))}
          </ul>

          {/* Barra decorativa no hover */}
          {isHovered && (
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-b-xl"
            />
          )}
        </GlassCard>
      </motion.div>
    );
  },
);

ModoCard.displayName = "ModoCard";

export function ModosEstudoSection() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({
    threshold: 0.1,
    once: true,
  });

  return (
    <div ref={ref} className="py-8">
      <SectionTitle
        icon={Icons.Brain}
        title="Modos de Estudo"
        subtitle="6 formas diferentes de treinar, cada uma para um objetivo específico"
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {MODOS.map((modo, idx) => (
          <ModoCard key={modo.titulo} {...modo} index={idx} />
        ))}
      </motion.div>

      {/* Dica adicional */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5 }}
        className="mt-8 p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-center"
      >
        <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
          <Icons.Lightbulb className="w-4 h-4 text-yellow-500" />
          <span>
            💡 Dica: Alterne entre os modos para manter a motivação e evoluir
            mais rápido!
          </span>
        </div>
      </motion.div>
    </div>
  );
}
