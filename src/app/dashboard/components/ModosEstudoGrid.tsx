"use client";

import type { ModoVariant } from "@/components/ui/ModoCard";
import { AnimatePresence, motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Search, Star, X } from "lucide-react";

import ModoCard from "@/components/ui/ModoCard";

interface ModoEstudoItem {
  href: string;
  icon: LucideIcon;
  variant: ModoVariant;
  title: string;
  description: string;
  xp: string;
  tag: string;
  shortcut?: string;
}

interface ModosEstudoGridProps {
  modos: ModoEstudoItem[];
  searchTerm: string;
  onClearSearch: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export function ModosEstudoGrid({
  modos,
  searchTerm,
  onClearSearch,
}: ModosEstudoGridProps) {
  const hasResults = modos.length > 0;
  const resultCount = modos.length;

  return (
    <section aria-label="Modos de estudo" className="mb-8">
      {/* Header da seção */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/25">
            <Star className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-200">
              Escolha seu Modo
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Selecione a melhor forma de estudar
            </p>
          </div>
        </div>

        {/* Contador de resultados */}
        {searchTerm && hasResults && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-blue-500/20 border border-blue-500/30"
          >
            <Search className="w-3 h-3 text-blue-400" />
            <span className="text-xs text-blue-400">
              {resultCount} resultado{resultCount !== 1 ? "s" : ""}
            </span>
          </motion.div>
        )}
      </div>

      {/* Estado vazio com animação */}
      <AnimatePresence mode="wait">
        {!hasResults ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/40 to-slate-900/30 border border-white/10 p-8 text-center"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl" />

            <div className="relative">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/50 flex items-center justify-center border border-white/10">
                <Search className="w-8 h-8 text-slate-500" />
              </div>
              <p className="text-slate-400 font-medium">
                Nenhum modo encontrado para
              </p>
              <p className="text-white font-semibold mt-1">"{searchTerm}"</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClearSearch}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-sm font-medium transition-all"
              >
                <X className="w-3.5 h-3.5" />
                Limpar busca
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {modos.map((modo, index) => (
              <motion.div
                key={modo.href}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.4 }}
              >
                <ModoCard {...modo} index={index} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dica de atalhos (apenas quando há resultados) */}
      {hasResults && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-5 flex items-center justify-center gap-4 text-[10px] text-slate-500"
        >
          <div className="flex items-center gap-1.5">
            <div className="px-1.5 py-0.5 rounded bg-slate-800 font-mono">
              Ctrl
            </div>
            <span>+</span>
            <div className="px-1.5 py-0.5 rounded bg-slate-800 font-mono">
              N
            </div>
            <span>Simulado</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-700" />
          <div className="flex items-center gap-1.5">
            <div className="px-1.5 py-0.5 rounded bg-slate-800 font-mono">
              Ctrl
            </div>
            <span>+</span>
            <div className="px-1.5 py-0.5 rounded bg-slate-800 font-mono">
              T
            </div>
            <span>Turbo</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-700" />
          <div className="flex items-center gap-1.5">
            <div className="px-1.5 py-0.5 rounded bg-slate-800 font-mono">
              Ctrl
            </div>
            <span>+</span>
            <div className="px-1.5 py-0.5 rounded bg-slate-800 font-mono">
              E
            </div>
            <span>Erros</span>
          </div>
        </motion.div>
      )}
    </section>
  );
}
