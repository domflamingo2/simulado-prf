// src/components/como-funciona/ModosEstudoSection.tsx
"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { MODOS } from "@/constants/modosEstudo";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import React from "react"; // Adicionar import do React
import { SectionTitle } from "./SectionTitle";

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

const getIcon = (iconName: string) => {
  const IconComponent = (Icons as any)[iconName];
  return IconComponent || Icons.HelpCircle;
};

const ModoCard = React.memo(
  ({ icon, titulo, descricao, detalhes, cor, popular = false }: any) => {
    const IconComponent = getIcon(icon);

    return (
      <motion.div variants={fadeInUp} className="group relative">
        {popular && (
          <span className="absolute -top-2 -right-2 z-10 px-2 py-0.5 text-xs rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold shadow-lg whitespace-nowrap">
            🔥 Popular
          </span>
        )}
        <GlassCard className="p-6 h-full hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
          <div
            className={`w-12 h-12 rounded-xl ${cor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
          >
            <IconComponent className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">{titulo}</h3>
          <p className="text-slate-300 text-sm mb-4">{descricao}</p>
          <ul className="space-y-2">
            {detalhes.map((detalhe: string, idx: number) => (
              <li
                key={idx}
                className="flex items-center gap-2 text-xs text-slate-400"
              >
                <Icons.CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                <span className="break-words">{detalhe}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </motion.div>
    );
  },
);

ModoCard.displayName = "ModoCard";

export function ModosEstudoSection() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  return (
    <div ref={ref}>
      <SectionTitle
        icon={Icons.Brain}
        title="Modos de Estudo"
        subtitle="6 formas diferentes de treinar, cada uma para um objetivo específico"
      />

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate={isVisible ? "animate" : "initial"}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {MODOS.map((modo) => (
          <ModoCard key={modo.titulo} {...modo} />
        ))}
      </motion.div>
    </div>
  );
}
