// src/components/como-funciona/BeneficiosSection.tsx
"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { BENEFICIOS } from "@/constants/beneficios";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import React, { memo, useCallback, useState } from "react";
import { SectionTitle } from "./SectionTitle";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const iconCache = new Map<string, React.ElementType>();

const getIcon = (iconName: string): React.ElementType => {
  if (iconCache.has(iconName)) {
    return iconCache.get(iconName)!;
  }
  const IconComponent = (Icons as any)[iconName];
  const fallbackIcon = Icons.HelpCircle;
  const result = IconComponent || fallbackIcon;
  iconCache.set(iconName, result);
  return result;
};

const BeneficioCard = memo(
  ({
    icon,
    titulo,
    descricao,
    valor,
    destaque,
    index,
  }: {
    icon: string;
    titulo: string;
    descricao: string;
    valor?: string;
    destaque: boolean;
    index: number;
  }) => {
    const IconComponent = getIcon(icon);
    const [isHovered, setIsHovered] = useState(false);

    return (
      <motion.div
        custom={index}
        variants={fadeInUp}
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="h-full"
      >
        <GlassCard
          className={`p-5 h-full transition-all duration-300 ${
            destaque
              ? "border-amber-500/40 bg-gradient-to-br from-amber-500/10 to-amber-600/5 shadow-lg shadow-amber-500/10"
              : "hover:shadow-xl hover:shadow-blue-500/10"
          } ${isHovered ? "shadow-2xl" : ""}`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`p-2.5 rounded-xl transition-all duration-300 ${
                destaque
                  ? "bg-gradient-to-br from-amber-500/30 to-amber-600/20"
                  : "bg-gradient-to-br from-blue-500/20 to-purple-500/20"
              } ${isHovered ? "scale-110 rotate-3" : ""}`}
            >
              <IconComponent
                className={`w-5 h-5 transition-all duration-300 ${
                  destaque ? "text-amber-400" : "text-blue-400"
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-white text-sm sm:text-base truncate">
                  {titulo}
                </h3>
                {destaque && (
                  <Icons.Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 animate-pulse" />
                )}
              </div>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {descricao}
              </p>
              {valor && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, type: "spring" }}
                  className="mt-2 text-base sm:text-lg font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent"
                >
                  {valor}
                </motion.div>
              )}
            </div>
          </div>
        </GlassCard>
      </motion.div>
    );
  },
);

BeneficioCard.displayName = "BeneficioCard";

const BeneficioCardSkeleton = () => (
  <div className="p-5 h-full rounded-xl bg-slate-800/50 animate-pulse">
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-slate-700" />
      <div className="flex-1">
        <div className="h-5 bg-slate-700 rounded w-3/4 mb-2" />
        <div className="h-4 bg-slate-700 rounded w-full mb-1" />
        <div className="h-4 bg-slate-700 rounded w-2/3" />
      </div>
    </div>
  </div>
);

export function BeneficiosSection() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({
    threshold: 0.05,
    once: true,
  });

  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const visibleBeneficios = BENEFICIOS.slice(0, visibleCount);
  const hasMore = visibleCount < BENEFICIOS.length;

  const loadMore = useCallback(async () => {
    setIsLoadingMore(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setVisibleCount((prev) => Math.min(prev + 6, BENEFICIOS.length));
    setIsLoadingMore(false);
  }, []);

  const salarios = {
    inicial: "R$ 5.000+",
    progresso: "R$ 10.000+",
    topo: "R$ 15.000+",
  };

  return (
    <section ref={ref} className="scroll-mt-20 py-8">
      <SectionTitle
        icon={Icons.PiggyBank}
        title="Remuneração e Benefícios"
        subtitle="Sua recompensa pela dedicação: carreira estável e bem remunerada na PRF"
      />

      {/* Cards de salário */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8"
      >
        {[
          {
            value: salarios.inicial,
            label: "Salário Inicial",
            desc: "Líquido aproximado",
            color: "emerald",
          },
          {
            value: salarios.progresso,
            label: "Após Progressos",
            desc: "Com gratificações",
            color: "blue",
          },
          {
            value: salarios.topo,
            label: "Topo da Carreira",
            desc: "Especialista/Coordenador",
            color: "purple",
          },
        ].map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 + idx * 0.1, type: "spring" }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="group"
          >
            <GlassCard
              className={`p-5 text-center bg-gradient-to-br from-${item.color}-500/10 to-${item.color}-600/5 border-${item.color}-500/30 overflow-hidden relative`}
            >
              <div
                className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-${item.color}-500/20 to-transparent rounded-full blur-2xl`}
              />
              <p className="text-slate-400 text-xs sm:text-sm mb-1">
                {item.label}
              </p>
              <p
                className={`text-3xl sm:text-4xl font-black bg-gradient-to-r from-${item.color}-400 to-${item.color}-300 bg-clip-text text-transparent group-hover:scale-105 transition-transform inline-block`}
              >
                {item.value}
              </p>
              <p className="text-[10px] sm:text-xs text-slate-500 mt-1">
                {item.desc}
              </p>
              <div className="mt-2 h-0.5 w-12 mx-auto bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Grid de benefícios */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate={isVisible ? "animate" : "initial"}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {visibleBeneficios.map((beneficio, index) => (
          <BeneficioCard key={beneficio.titulo} index={index} {...beneficio} />
        ))}

        {isLoadingMore && (
          <>
            <BeneficioCardSkeleton />
            <BeneficioCardSkeleton />
            <BeneficioCardSkeleton />
          </>
        )}
      </motion.div>

      {/* Botão "Ver mais" */}
      {hasMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <motion.button
            onClick={loadMore}
            disabled={isLoadingMore}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative overflow-hidden group px-6 py-3 rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-slate-200 text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            {isLoadingMore ? (
              <span className="flex items-center gap-2">
                <Icons.Loader2 className="w-4 h-4 animate-spin" />
                Carregando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Ver mais benefícios
                <Icons.ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                <span className="text-emerald-400 text-xs bg-slate-900/50 px-1.5 py-0.5 rounded-full">
                  +{BENEFICIOS.length - visibleCount}
                </span>
              </span>
            )}
          </motion.button>
        </motion.div>
      )}

      {/* Contador */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center text-[10px] text-slate-500 mt-5"
      >
        Exibindo {visibleBeneficios.length} de {BENEFICIOS.length} benefícios
      </motion.p>
    </section>
  );
}
