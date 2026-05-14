// src/components/como-funciona/BeneficiosSection.tsx (VERSÃO CORRIGIDA E OTIMIZADA)
"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { BENEFICIOS } from "@/constants/beneficios";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import React, { memo, useCallback, useState } from "react";
import { SectionTitle } from "./SectionTitle";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

// Mapeamento de ícones com cache
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

// Componente memoizado para performance - CORRIGIDO: sem motion() wrapper deprecated
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

    return (
      <motion.div
        custom={index}
        variants={fadeInUp}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="h-full"
      >
        <GlassCard
          className={`p-4 sm:p-6 h-full transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 ${
            destaque ? "border-amber-500/30 bg-amber-500/5" : ""
          }`}
        >
          <div className="flex items-start gap-3 sm:gap-4">
            <div
              className={`p-2 sm:p-3 rounded-xl transition-colors duration-200 ${
                destaque ? "bg-amber-500/20" : "bg-blue-500/10"
              }`}
            >
              <IconComponent
                className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 group-hover:scale-110 ${
                  destaque ? "text-amber-400" : "text-blue-400"
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white mb-1 flex items-center gap-2 text-sm sm:text-base">
                <span className="truncate">{titulo}</span>
                {destaque && (
                  <Icons.Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400 flex-shrink-0 animate-pulse" />
                )}
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm mb-2 line-clamp-2 leading-relaxed">
                {descricao}
              </p>
              {valor && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-base sm:text-lg font-bold text-emerald-400"
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

// Componente de loading skeleton
const BeneficioCardSkeleton = () => (
  <div className="p-4 sm:p-6 h-full rounded-xl bg-slate-800/50 animate-pulse">
    <div className="flex items-start gap-3 sm:gap-4">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-700" />
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

  // Paginação/virtualização para lista grande
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const visibleBeneficios = BENEFICIOS.slice(0, visibleCount);
  const hasMore = visibleCount < BENEFICIOS.length;

  const loadMore = useCallback(async () => {
    setIsLoadingMore(true);
    // Simular delay para carregamento suave
    await new Promise((resolve) => setTimeout(resolve, 300));
    setVisibleCount((prev) => Math.min(prev + 6, BENEFICIOS.length));
    setIsLoadingMore(false);
  }, []);

  // Valores de destaque
  const salarios = {
    inicial: "R$ 5.000+",
    progresso: "R$ 10.000+",
    topo: "R$ 15.000+",
  };

  return (
    <section ref={ref} className="scroll-mt-20">
      <SectionTitle
        icon={Icons.PiggyBank}
        title="Remuneração e Benefícios"
        subtitle="Sua recompensa pela dedicação: carreira estável e bem remunerada na PRF"
      />

      {/* Cards de salário - versão melhorada */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
      >
        <GlassCard className="p-4 sm:p-6 border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 text-center group hover:scale-105 transition-transform duration-300">
          <p className="text-slate-300 text-xs sm:text-sm mb-2">
            Salário Inicial
          </p>
          <p className="text-2xl sm:text-4xl font-black text-emerald-400 group-hover:scale-110 transition-transform inline-block">
            {salarios.inicial}
          </p>
          <p className="text-[10px] sm:text-xs text-slate-500 mt-1">
            Líquido aproximado
          </p>
        </GlassCard>

        <GlassCard className="p-4 sm:p-6 border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-blue-600/5 text-center group hover:scale-105 transition-transform duration-300">
          <p className="text-slate-300 text-xs sm:text-sm mb-2">
            Após Progressos
          </p>
          <p className="text-2xl sm:text-4xl font-black text-blue-400 group-hover:scale-110 transition-transform inline-block">
            {salarios.progresso}
          </p>
          <p className="text-[10px] sm:text-xs text-slate-500 mt-1">
            Com gratificações
          </p>
        </GlassCard>

        <GlassCard className="p-4 sm:p-6 border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-purple-600/5 text-center group hover:scale-105 transition-transform duration-300">
          <p className="text-slate-300 text-xs sm:text-sm mb-2">
            Topo da Carreira
          </p>
          <p className="text-2xl sm:text-4xl font-black text-purple-400 group-hover:scale-110 transition-transform inline-block">
            {salarios.topo}
          </p>
          <p className="text-[10px] sm:text-xs text-slate-500 mt-1">
            Especialista/Coordenador
          </p>
        </GlassCard>
      </motion.div>

      {/* Grid de benefícios */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate={isVisible ? "animate" : "initial"}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
      >
        {visibleBeneficios.map((beneficio, index) => (
          <BeneficioCard key={beneficio.titulo} index={index} {...beneficio} />
        ))}

        {/* Skeletons durante loading */}
        {isLoadingMore && (
          <>
            <BeneficioCardSkeleton />
            <BeneficioCardSkeleton />
            <BeneficioCardSkeleton />
          </>
        )}
      </motion.div>

      {/* Botão "Ver mais" com animação */}
      {hasMore && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-center"
        >
          <motion.button
            onClick={loadMore}
            disabled={isLoadingMore}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-slate-200 text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingMore ? (
              <span className="flex items-center gap-2">
                <Icons.Loader2 className="w-4 h-4 animate-spin" />
                Carregando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Ver mais benefícios
                <Icons.ChevronDown className="w-4 h-4" />
                <span className="text-emerald-400">
                  (+{BENEFICIOS.length - visibleCount})
                </span>
              </span>
            )}
          </motion.button>
        </motion.div>
      )}

      {/* Contador de benefícios visíveis */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center text-xs text-slate-500 mt-6"
      >
        Exibindo {visibleBeneficios.length} de {BENEFICIOS.length} benefícios
      </motion.p>
    </section>
  );
}
