"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Keyboard, Search, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

interface SearchModosProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchModos({ value, onChange }: SearchModosProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Atalho de teclado Ctrl+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        document.getElementById("search-modos")?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative group">
      {/* Efeito de glow no fundo */}
      {isFocused && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-lg"
        />
      )}

      <div className="relative">
        {/* Input principal */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 transition-all duration-300 group-focus-within:text-blue-400" />

          <input
            id="search-modos"
            type="text"
            placeholder="Buscar modos de estudo..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="w-full pl-10 pr-28 py-3 rounded-xl bg-slate-800/50 backdrop-blur-sm border text-sm text-white placeholder-slate-500 focus:outline-none transition-all duration-300"
            style={{
              borderColor: isFocused ? "#3b82f650" : "#334155",
              boxShadow: isFocused ? "0 0 0 2px #3b82f620" : "none",
            }}
          />

          {/* Botão limpar */}
          <AnimatePresence>
            {value && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => onChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-700 transition-all duration-200"
                aria-label="Limpar busca"
              >
                <X className="w-3.5 h-3.5" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Badge de atalho */}
          <motion.div
            animate={{
              opacity: isFocused || isHovered ? 0 : 1,
              scale: isFocused || isHovered ? 0.9 : 1,
            }}
            transition={{ duration: 0.2 }}
            className="hidden sm:flex items-center gap-1.5 absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 rounded-md bg-slate-800/80 border border-white/10"
          >
            <Keyboard className="w-3 h-3 text-slate-500" />
            <span className="text-[10px] font-mono text-slate-500">
              Ctrl + S
            </span>
          </motion.div>
        </div>

        {/* Indicador de busca ativa */}
        {value && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-6 left-0 flex items-center gap-1.5"
          >
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/30">
              <Sparkles className="w-2.5 h-2.5 text-blue-400" />
              <span className="text-[10px] text-blue-400">
                Buscando: "{value}"
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Dica de busca (apenas quando vazio) */}
      {!value && !isFocused && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          className="text-[10px] text-slate-500 mt-2 ml-1"
        >
          💡 Dica: Busque por "simulado", "turbo", "treino" ou "erros"
        </motion.p>
      )}
    </div>
  );
}
