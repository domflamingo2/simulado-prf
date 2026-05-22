// src/app/VideoAulas/components/OrdenacaoFiltros.tsx

"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ArrowDownUp,
  CheckCircle2,
  ChevronDown,
  Clock,
  Filter,
  Search,
  Star,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export type OrdenacaoType =
  | "padrao"
  | "nao-assistidos"
  | "assistidos"
  | "mais-longos"
  | "mais-curtos"
  | "favoritos";

interface OrdenacaoFiltrosProps {
  ordenacao: OrdenacaoType;
  onOrdenacaoChange: (ordenacao: OrdenacaoType) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  placeholder?: string;
}

interface OpcaoOrdenacao {
  value: OrdenacaoType;
  label: string;
  icon: LucideIcon;
  description?: string;
}

const opcoesOrdenacao: OpcaoOrdenacao[] = [
  {
    value: "padrao",
    label: "Padrão",
    icon: ArrowDownUp,
    description: "Ordem original dos vídeos",
  },
  {
    value: "nao-assistidos",
    label: "Não assistidos",
    icon: Clock,
    description: "Mostra primeiro os não assistidos",
  },
  {
    value: "assistidos",
    label: "Assistidos",
    icon: CheckCircle2,
    description: "Mostra primeiro os assistidos",
  },
  {
    value: "favoritos",
    label: "Favoritos",
    icon: Star,
    description: "Prioriza vídeos favoritos",
  },
  {
    value: "mais-longos",
    label: "Mais longos",
    icon: TrendingUp,
    description: "Do maior para o menor tempo",
  },
  {
    value: "mais-curtos",
    label: "Mais curtos",
    icon: TrendingDown,
    description: "Do menor para o maior tempo",
  },
];

export function OrdenacaoFiltros({
  ordenacao,
  onOrdenacaoChange,
  searchTerm,
  onSearchChange,
  placeholder = "Buscar vídeos por título, descrição...",
}: OrdenacaoFiltrosProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Fecha ao clicar fora
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  // Fecha com Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [isOpen]);

  // Atalho Ctrl+K para focar busca
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const opcaoAtual = useMemo(
    () =>
      opcoesOrdenacao.find((o) => o.value === ordenacao) ?? opcoesOrdenacao[0],
    [ordenacao],
  );

  const CurrentIcon = opcaoAtual.icon;
  const temBusca = searchTerm.length > 0;

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* ── Busca com efeito de glow ── */}
      <div className="relative flex-1 group">
        {/* Efeito de glow no foco */}
        {isFocused && (
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-md transition-opacity duration-300" />
        )}

        <div className="relative">
          <Search
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors pointer-events-none z-10"
          />

          <input
            ref={searchRef}
            type="search"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            aria-label="Buscar vídeos"
            className="
              w-full pl-9 pr-8 py-2.5
              rounded-xl bg-slate-900/70 border border-white/10
              text-sm text-slate-200 placeholder:text-slate-500
              outline-none transition-all backdrop-blur-md
              focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:bg-slate-900
              [&::-webkit-search-cancel-button]:hidden
            "
          />

          {/* Botão limpar busca */}
          <AnimatePresence>
            {temBusca && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                onClick={() => {
                  onSearchChange("");
                  searchRef.current?.focus();
                }}
                aria-label="Limpar busca"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-500 hover:text-white hover:bg-slate-700 transition-colors z-10"
              >
                <X className="w-3.5 h-3.5" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Atalho de teclado */}
          {!temBusca && !isFocused && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-800/50 border border-white/10">
              <kbd className="text-[9px] font-mono text-slate-500">Ctrl</kbd>
              <span className="text-[9px] text-slate-500">+</span>
              <kbd className="text-[9px] font-mono text-slate-500">K</kbd>
            </div>
          )}
        </div>
      </div>

      {/* ── Dropdown de ordenação ── */}
      <div className="relative shrink-0" ref={dropdownRef}>
        <motion.button
          type="button"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setIsOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={`Ordenar por: ${opcaoAtual.label}`}
          className="
            w-full sm:w-auto flex items-center justify-between gap-2
            px-3.5 py-2.5 min-w-[180px]
            rounded-xl bg-slate-900/70 border border-white/10
            hover:bg-slate-800/80 hover:border-white/20
            text-sm transition-all backdrop-blur-md
            focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40
          "
        >
          <div className="flex items-center gap-2">
            <div className="p-0.5 rounded-md bg-blue-500/20">
              <Filter aria-hidden="true" className="w-3 h-3 text-blue-400" />
            </div>
            <CurrentIcon
              aria-hidden="true"
              className="w-3.5 h-3.5 text-blue-400"
            />
            <span className="text-slate-200 font-medium">
              {opcaoAtual.label}
            </span>
          </div>

          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            aria-hidden="true"
          >
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </motion.span>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.ul
              role="listbox"
              aria-label="Opções de ordenação"
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="
                absolute right-0 mt-2 w-full sm:w-64
                bg-slate-900/95 backdrop-blur-xl
                border border-white/10 rounded-xl shadow-2xl
                overflow-hidden z-[70] py-1
              "
            >
              {opcoesOrdenacao.map((opcao, idx) => {
                const Icon = opcao.icon;
                const ativo = ordenacao === opcao.value;

                return (
                  <motion.li
                    key={opcao.value}
                    role="option"
                    aria-selected={ativo}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.02 }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onOrdenacaoChange(opcao.value);
                        setIsOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-3
                        px-3 py-2.5 text-sm transition-all duration-150
                        ${
                          ativo
                            ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300"
                            : "text-slate-300 hover:bg-white/5 hover:text-white"
                        }
                      `}
                    >
                      <div
                        className={`p-1 rounded-md ${ativo ? "bg-blue-500/20" : "bg-slate-800"}`}
                      >
                        <Icon
                          aria-hidden="true"
                          className={`w-4 h-4 shrink-0 ${ativo ? "text-blue-400" : "text-slate-500"}`}
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <span className="block text-sm font-medium">
                          {opcao.label}
                        </span>
                        {opcao.description && (
                          <span className="block text-[10px] text-slate-500 mt-0.5">
                            {opcao.description}
                          </span>
                        )}
                      </div>
                      {ativo && (
                        <CheckCircle2
                          aria-hidden="true"
                          className="w-3.5 h-3.5 text-blue-400 shrink-0"
                        />
                      )}
                    </button>
                  </motion.li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
