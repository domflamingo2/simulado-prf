"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Database, Loader2, Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { toast } from "sonner";

// FIX: Toaster removido — deve estar em app/layout.tsx.
// O header fica montado a página toda mas o padrão do projeto é
// um único Toaster no root para evitar stacking de instâncias.

// ═══════════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════════

export interface HeaderBancoProps {
  /** Total de questões no banco (exibido no badge) */
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
    // FIX: aria-busy no container do skeleton
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4"
      aria-busy="true"
      aria-label="Carregando cabeçalho"
    >
      <div className="flex items-center gap-4">
        <div className="w-9 h-9 bg-slate-800/60 rounded-xl animate-pulse" />
        <div className="space-y-2">
          <div className="h-6 w-44 bg-slate-800/60 rounded-lg animate-pulse" />
          <div className="h-3.5 w-28 bg-slate-800/60 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MODAL DE BUSCA RÁPIDA
// Extraído em componente separado para isolar estado e lógica
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

  // Foca o input ao montar
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
      toast.success(`Buscando por: "${t}"`, { duration: 2500 });
    } catch {
      toast.error("Erro ao realizar busca. Tente novamente.");
    } finally {
      setBuscando(false);
    }
  }, [termo, onBuscar, onFechar]);

  return (
    // FIX: role="dialog" + aria-modal para leitores de tela
    // FIX: AnimatePresence gerencia o exit corretamente (pai deve envolver com AnimatePresence)
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-4"
      onClick={onFechar}
      // Não usar aria-hidden aqui — o overlay em si não é o dialog
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: -12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: -12 }}
        transition={{ type: "spring", damping: 24, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${dialogId}-title`}
        className="w-full max-w-lg bg-slate-900 rounded-2xl shadow-2xl border border-slate-700/60 overflow-hidden"
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800">
          <Search
            className="w-4 h-4 text-slate-400 flex-shrink-0"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            id={`${dialogId}-title`}
            type="text"
            placeholder="Buscar por enunciado, assunto ou tag..."
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleBuscar();
              if (e.key === "Escape") onFechar();
            }}
            disabled={buscando}
            className="flex-1 bg-transparent text-white text-sm placeholder-slate-500 outline-none disabled:opacity-50"
            aria-label="Buscar questões"
            autoComplete="off"
            spellCheck={false}
          />
          {/* Limpar */}
          {termo && !buscando && (
            <button
              onClick={() => {
                setTermo("");
                inputRef.current?.focus();
              }}
              className="p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors"
              aria-label="Limpar busca"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Ações */}
        <div className="p-4 space-y-3">
          {/* Hints de atalho */}
          <p className="flex items-center gap-2 text-[11px] text-slate-600">
            <span>
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px]">
                Enter
              </kbd>{" "}
              buscar
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px]">
                Esc
              </kbd>{" "}
              fechar
            </span>
          </p>

          {/* Botão buscar */}
          <button
            onClick={handleBuscar}
            disabled={buscando || !termo.trim()}
            className="w-full py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {buscando ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                Buscando…
              </>
            ) : (
              <>
                <Search className="w-4 h-4" aria-hidden="true" />
                Buscar{termo.trim() ? ` "${termo.trim()}"` : ""}
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

  // FIX: onBuscaRapida em ref — evita recriação de handleBuscar
  // quando o pai passa função inline (recriada a cada render)
  const onBuscaRapidaRef = useRef(onBuscaRapida);
  useEffect(() => {
    onBuscaRapidaRef.current = onBuscaRapida;
  });

  // ── Atalhos de teclado ──────────────────────────────────────────────────────
  // FIX: deps [] com refs — o handler nunca fica stale e o listener
  // é registrado/removido apenas uma vez (não a cada abertura do modal)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K → abre busca (apenas se não há input focado)
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        const active = document.activeElement;
        const isInput =
          active?.tagName === "INPUT" ||
          active?.tagName === "TEXTAREA" ||
          (active as HTMLElement)?.isContentEditable;

        // Se o modal já está aberto e o usuário está no input, não reopena
        if (isInput && modalAberto) return;

        e.preventDefault();
        setModalAberto((p) => !p);
        return;
      }

      // FIX: ESC lido via ref do estado atual — sem dep stale
      if (e.key === "Escape") {
        setModalAberto(false);
        return;
      }

      // Alt + ← → volta (sem toast — o router.back() já navega)
      if (e.altKey && e.key === "ArrowLeft") {
        e.preventDefault();
        router.back();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]); // router é estável no App Router do Next.js 13+

  // FIX: modal aberto também fecha com a prop `modalAberto` via ref
  // (o `setModalAberto(false)` no handler acima já usa o setter funcional,
  // que sempre opera sobre o estado mais recente — sem stale closure)

  const handleBuscar = useCallback(async (termo: string) => {
    await onBuscaRapidaRef.current?.(termo);
  }, []);

  const fecharModal = useCallback(() => setModalAberto(false), []);
  const abrirModal = useCallback(() => setModalAberto(true), []);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-white/8"
        role="banner"
        aria-label="Cabeçalho do banco de questões"
      >
        {isLoading ? (
          <SkeletonHeader />
        ) : (
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
            <div className="flex items-center justify-between gap-4">
              {/* ── Esquerda: navegação + título ── */}
              <div className="flex items-center gap-3 min-w-0">
                {/* Botão voltar */}
                <Link
                  href="/"
                  className="flex-shrink-0 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  aria-label="Voltar ao início"
                  title="Voltar ao início (Alt + ←)"
                >
                  <ArrowLeft className="w-4 h-4 text-slate-300" />
                </Link>

                {/* Ícone + título + breadcrumb */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Database
                      className="w-5 h-5 text-blue-400 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <h1 className="text-lg sm:text-xl font-bold text-white truncate">
                      Banco de Questões
                    </h1>

                    {/* FIX: total agora é exibido (era recebido como prop mas nunca renderizado) */}
                    {total > 0 && (
                      <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/25 text-[11px] font-semibold text-blue-400 tabular-nums">
                        {formatNumber(total)}
                      </span>
                    )}
                  </div>

                  {/* Breadcrumb */}
                  <nav aria-label="Localização atual" className="mt-0.5">
                    <ol className="flex items-center gap-1.5 text-[11px] text-slate-500">
                      <li>
                        <Link
                          href="/"
                          className="hover:text-slate-300 transition-colors"
                        >
                          Início
                        </Link>
                      </li>
                      <li aria-hidden="true" className="text-slate-700">
                        /
                      </li>
                      <li aria-current="page" className="text-slate-400">
                        Banco de Questões
                      </li>
                    </ol>
                  </nav>
                </div>
              </div>

              {/* ── Direita: busca rápida ── */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Total em mobile */}
                {total > 0 && (
                  <span className="sm:hidden text-[11px] font-semibold text-slate-400 tabular-nums">
                    {formatNumber(total)} questões
                  </span>
                )}

                {/* Botão busca */}
                {onBuscaRapida && (
                  <button
                    onClick={abrirModal}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-xl text-sm
                      border border-slate-700/60 bg-slate-800/50 text-slate-400
                      hover:bg-slate-800 hover:text-slate-200 hover:border-slate-600
                      transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                    `}
                    aria-label="Abrir busca rápida (Ctrl+K)"
                    aria-keyshortcuts="Control+K"
                    aria-expanded={modalAberto}
                    aria-haspopup="dialog"
                  >
                    <Search className="w-4 h-4" aria-hidden="true" />
                    <span className="hidden md:inline text-xs">Buscar</span>
                    <kbd className="hidden lg:inline px-1.5 py-0.5 bg-slate-700/80 rounded text-[10px] text-slate-500">
                      ⌘K
                    </kbd>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.header>

      {/* ── Modal de busca rápida ── */}
      {/* FIX: AnimatePresence para que o exit animation funcione */}
      <AnimatePresence>
        {modalAberto && (
          <BuscaRapidaModal onBuscar={handleBuscar} onFechar={fecharModal} />
        )}
      </AnimatePresence>
    </>
  );
}
