"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Command,
  Database,
  Home,
  Loader2,
  Search,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { toast } from "sonner";

// ═══════════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════════

export interface HeaderBancoProps {
  total?: number;
  isLoading?: boolean;
  onBuscaRapida?: (termo: string) => Promise<void> | void;
}

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════

function formatNumber(num?: number): string {
  if (num == null || num < 0) return "0";
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}k`;
  return num.toLocaleString("pt-BR");
}

// ═══════════════════════════════════════════════════════════
// SKELETON
// ═══════════════════════════════════════════════════════════

function SkeletonHeader() {
  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4"
      aria-busy="true"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-800/60 rounded-xl animate-pulse" />
          <div className="space-y-2">
            <div className="h-6 w-48 bg-slate-800/60 rounded-lg animate-pulse" />
            <div className="h-3 w-32 bg-slate-800/60 rounded animate-pulse" />
          </div>
        </div>
        <div className="w-24 h-9 bg-slate-800/60 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MODAL DE BUSCA RÁPIDA
// ═══════════════════════════════════════════════════════════

interface BuscaRapidaModalProps {
  onBuscar: (termo: string) => Promise<void>;
  onFechar: () => void;
}

function BuscaRapidaModal({ onBuscar, onFechar }: BuscaRapidaModalProps) {
  const [termo, setTermo] = useState("");
  const [buscando, setBuscando] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogId = useId();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleBuscar = useCallback(async () => {
    const t = termo.trim();
    if (!t) {
      toast.error("Digite um termo para buscar");
      return;
    }

    setBuscando(true);
    try {
      await onBuscar(t);
      onFechar();
      toast.success(`🔍 Buscando por: "${t}"`);
    } catch {
      toast.error("Erro ao realizar busca. Tente novamente.");
    } finally {
      setBuscando(false);
    }
  }, [termo, onBuscar, onFechar]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-start justify-center pt-[15vh] px-4"
      onClick={onFechar}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: -20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: -20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${dialogId}-title`}
        className="w-full max-w-md bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
      >
        {/* Header do modal */}
        <div className="px-5 pt-5 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
              <Search className="w-3.5 h-3.5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Busca Rápida</h3>
          </div>
          <p className="text-[11px] text-slate-500">
            Encontre questões por palavra-chave
          </p>
        </div>

        {/* Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
          <Search className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <input
            ref={inputRef}
            id={`${dialogId}-title`}
            type="text"
            placeholder="Digite um termo, assunto ou tag..."
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleBuscar();
              if (e.key === "Escape") onFechar();
            }}
            disabled={buscando}
            className="flex-1 bg-transparent text-white text-sm placeholder-slate-500 outline-none disabled:opacity-50"
            autoComplete="off"
          />
          {termo && !buscando && (
            <button
              onClick={() => {
                setTermo("");
                inputRef.current?.focus();
              }}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Ações */}
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-center gap-3 text-[10px] text-slate-600">
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-0.5 bg-slate-800 rounded text-[9px] font-mono border border-white/10">
                ↵
              </kbd>
              <span>Buscar</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-0.5 bg-slate-800 rounded text-[9px] font-mono border border-white/10">
                Esc
              </kbd>
              <span>Fechar</span>
            </span>
          </div>

          <button
            onClick={handleBuscar}
            disabled={buscando || !termo.trim()}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
          >
            {buscando ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Buscando...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Buscar{termo.trim() ? ` por "${termo.trim()}"` : ""}
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════

export function HeaderBanco({
  total = 0,
  isLoading = false,
  onBuscaRapida,
}: HeaderBancoProps) {
  const router = useRouter();
  const [modalAberto, setModalAberto] = useState(false);
  const onBuscaRapidaRef = useRef(onBuscaRapida);

  useEffect(() => {
    onBuscaRapidaRef.current = onBuscaRapida;
  });

  // Atalhos de teclado
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K → abre busca
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        const active = document.activeElement;
        const isInput =
          active?.tagName === "INPUT" || active?.tagName === "TEXTAREA";
        if (isInput && modalAberto) return;
        e.preventDefault();
        setModalAberto((p) => !p);
        return;
      }

      // ESC fecha modal
      if (e.key === "Escape") {
        setModalAberto(false);
        return;
      }

      // Alt + ← volta
      if (e.altKey && e.key === "ArrowLeft") {
        e.preventDefault();
        router.back();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, modalAberto]);

  const handleBuscar = useCallback(async (termo: string) => {
    await onBuscaRapidaRef.current?.(termo);
  }, []);

  const fecharModal = useCallback(() => setModalAberto(false), []);
  const abrirModal = useCallback(() => setModalAberto(true), []);

  if (isLoading) return <SkeletonHeader />;

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, type: "spring" }}
        className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-white/10 shadow-lg"
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Lado esquerdo */}
            <div className="flex items-center gap-3 min-w-0">
              {/* Botão voltar */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/"
                  className="flex-shrink-0 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-all group"
                  aria-label="Voltar ao início"
                >
                  <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                </Link>
              </motion.div>

              {/* Ícone e título */}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25">
                    <Database className="w-4 h-4 text-white" />
                  </div>
                  <h1 className="text-lg sm:text-xl font-bold text-white truncate">
                    Banco de Questões
                  </h1>
                  {total > 0 && (
                    <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-[11px] font-semibold text-blue-400">
                      {formatNumber(total)} questões
                    </span>
                  )}
                </div>

                {/* Breadcrumb */}
                <nav className="mt-0.5">
                  <ol className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <li>
                      <Link
                        href="/"
                        className="flex items-center gap-1 hover:text-slate-300 transition-colors"
                      >
                        <Home className="w-3 h-3" />
                        Início
                      </Link>
                    </li>
                    <li className="text-slate-600">/</li>
                    <li className="text-slate-400">Banco de Questões</li>
                  </ol>
                </nav>
              </div>
            </div>

            {/* Lado direito - Busca rápida */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {total > 0 && (
                <span className="sm:hidden text-[11px] font-semibold text-blue-400 tabular-nums">
                  {formatNumber(total)} questões
                </span>
              )}

              {onBuscaRapida && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={abrirModal}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm border border-slate-700/60 bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200 hover:border-slate-600 transition-all group"
                  aria-label="Abrir busca rápida (Ctrl+K)"
                  aria-expanded={modalAberto}
                >
                  <Search className="w-4 h-4 group-hover:text-blue-400 transition-colors" />
                  <span className="hidden md:inline text-xs">
                    Buscar questões
                  </span>
                  <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-slate-700/80 rounded text-[10px] text-slate-400">
                    <Command className="w-2.5 h-2.5" />K
                  </kbd>
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {/* Barra decorativa */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 origin-left"
        />
      </motion.header>

      {/* Modal de busca rápida */}
      <AnimatePresence>
        {modalAberto && (
          <BuscaRapidaModal onBuscar={handleBuscar} onFechar={fecharModal} />
        )}
      </AnimatePresence>
    </>
  );
}
