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
}

const opcoesOrdenacao: OpcaoOrdenacao[] = [
  { value: "padrao", label: "Padrão", icon: ArrowDownUp },
  { value: "nao-assistidos", label: "Não assistidos", icon: Clock },
  { value: "assistidos", label: "Assistidos", icon: CheckCircle2 },
  { value: "favoritos", label: "Favoritos", icon: Star },
  { value: "mais-longos", label: "Mais longos", icon: TrendingUp },
  // Corrigido: "mais-curtos" usava o mesmo ícone TrendingUp que "mais-longos"
  { value: "mais-curtos", label: "Mais curtos", icon: TrendingDown },
];

export function OrdenacaoFiltros({
  ordenacao,
  onOrdenacaoChange,
  searchTerm,
  onSearchChange,
  placeholder = "Buscar vídeos...",
}: OrdenacaoFiltrosProps) {
  const [isOpen, setIsOpen] = useState(false);
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

  // Fecha com Escape — sem propagar para o VideoPlayer ou outros listeners
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setIsOpen(false);
      }
    };
    // capture:true para interceptar antes dos outros listeners
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [isOpen]);

  const opcaoAtual = useMemo(
    () =>
      opcoesOrdenacao.find((o) => o.value === ordenacao) ?? opcoesOrdenacao[0],
    [ordenacao],
  );

  const CurrentIcon = opcaoAtual.icon;
  const temBusca = searchTerm.length > 0;

  return (
    // mb removido daqui — responsabilidade do pai espaçar os filhos
    <div className="flex flex-col sm:flex-row gap-3">
      {/* ── Busca ── */}
      <div className="relative flex-1 group">
        <Search
          aria-hidden="true"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors pointer-events-none"
        />

        <input
          ref={searchRef}
          type="search"
          // "search" nativo já oferece botão de limpar no iOS/Safari
          // mas adicionamos o nosso para consistência visual cross-browser
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Buscar vídeos"
          className="
            w-full pl-9 pr-8 py-2.5
            rounded-xl bg-slate-900/70 border border-white/10
            text-sm text-slate-200 placeholder:text-slate-500
            outline-none transition-all backdrop-blur-md
            focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/15 focus:bg-slate-900
            [&::-webkit-search-cancel-button]:hidden
          "
        />

        {/* Botão limpar busca — visível apenas quando há texto */}
        <AnimatePresence>
          {temBusca && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.1 }}
              onClick={() => {
                onSearchChange("");
                searchRef.current?.focus();
              }}
              aria-label="Limpar busca"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── Dropdown de ordenação ── */}
      <div className="relative shrink-0" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={`Ordenar por: ${opcaoAtual.label}`}
          className="
            w-full sm:w-auto flex items-center justify-between gap-2
            px-3.5 py-2.5 min-w-[200px]
            rounded-xl bg-slate-900/70 border border-white/10
            hover:bg-slate-800/80 hover:border-white/20
            text-sm transition-all backdrop-blur-md
            focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40
          "
        >
          <div className="flex items-center gap-2">
            <Filter
              aria-hidden="true"
              className="w-3.5 h-3.5 text-slate-400 shrink-0"
            />
            <CurrentIcon
              aria-hidden="true"
              className="w-3.5 h-3.5 text-blue-400 shrink-0"
            />
            <span className="text-slate-200 font-medium">
              {opcaoAtual.label}
            </span>
          </div>

          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.18 }}
            aria-hidden="true"
          >
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </motion.span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.ul
              role="listbox"
              aria-label="Opções de ordenação"
              initial={{ opacity: 0, y: 6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.97 }}
              transition={{ duration: 0.13 }}
              // z-[70] para ficar acima de qualquer outro overlay da página
              className="
                absolute right-0 mt-2 w-full sm:w-56
                bg-slate-900/95 backdrop-blur-xl
                border border-white/10 rounded-xl shadow-2xl
                overflow-hidden z-[70] py-1
              "
            >
              {opcoesOrdenacao.map((opcao) => {
                const Icon = opcao.icon;
                const ativo = ordenacao === opcao.value;

                return (
                  <li key={opcao.value} role="option" aria-selected={ativo}>
                    <button
                      type="button"
                      onClick={() => {
                        onOrdenacaoChange(opcao.value);
                        setIsOpen(false);
                      }}
                      className={`
                        w-full flex items-center gap-2.5
                        px-3 py-2 text-sm transition-colors
                        ${
                          ativo
                            ? "bg-blue-500/15 text-blue-300"
                            : "text-slate-300 hover:bg-white/5 hover:text-white"
                        }
                      `}
                    >
                      <Icon
                        aria-hidden="true"
                        className={`w-4 h-4 shrink-0 ${ativo ? "text-blue-400" : "text-slate-500"}`}
                      />
                      <span className="flex-1 text-left">{opcao.label}</span>
                      {ativo && (
                        <CheckCircle2
                          aria-hidden="true"
                          className="w-3.5 h-3.5 text-blue-400 shrink-0"
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
