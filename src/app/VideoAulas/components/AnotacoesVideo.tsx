"use client";

import { Anotacao } from "@/hooks/useAnotacoes";
import { AnimatePresence, motion } from "framer-motion";
import {
  Clock,
  Pin,
  Plus,
  Save,
  Sparkles,
  StickyNote,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface AnotacoesVideoProps {
  videoId: string;
  videoTitle: string;
  anotacoes: Anotacao[];
  onSalvar: (texto: string, timestamp: number) => void;
  onDeletar: (id: string) => void;
  currentTime: number;
}

const MAX_CHARS = 500;

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function AnotacoesVideo({
  videoTitle,
  anotacoes,
  onSalvar,
  onDeletar,
  currentTime,
}: AnotacoesVideoProps) {
  const [novaAnotacao, setNovaAnotacao] = useState("");
  const [showAnotacoes, setShowAnotacoes] = useState(false);
  const [deletandoId, setDeletandoId] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const charsRestantes = MAX_CHARS - novaAnotacao.length;
  const podesSalvar = novaAnotacao.trim().length > 0 && charsRestantes >= 0;
  const badgeCount = Math.min(anotacoes.length, 99);

  // Foca o textarea ao abrir
  useEffect(() => {
    if (showAnotacoes) {
      setTimeout(() => textareaRef.current?.focus(), 150);
    }
  }, [showAnotacoes]);

  // Fecha ao pressionar Escape
  useEffect(() => {
    if (!showAnotacoes) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setShowAnotacoes(false);
      }
    };
    window.addEventListener("keydown", handleKey, true);
    return () => window.removeEventListener("keydown", handleKey, true);
  }, [showAnotacoes]);

  const handleSalvar = () => {
    if (!podesSalvar) return;
    onSalvar(novaAnotacao.trim(), currentTime);
    setNovaAnotacao("");
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSalvar();
    }
  };

  const handleDeletar = (id: string) => {
    setDeletandoId(id);
    setTimeout(() => {
      onDeletar(id);
      setDeletandoId(null);
    }, 200);
  };

  const anotacoesOrdenadas = [...anotacoes].sort(
    (a, b) => b.timestamp - a.timestamp,
  );

  return (
    <>
      {/* Botão que abre o painel */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowAnotacoes((v) => !v)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label={`Anotações (${anotacoes.length})`}
        aria-expanded={showAnotacoes}
        className={`relative p-2 rounded-xl transition-all duration-200 ${
          showAnotacoes
            ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border border-yellow-500/30"
            : "bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
        }`}
      >
        <div className="relative">
          <StickyNote className="w-4 h-4" />
          {isHovered && anotacoes.length === 0 && (
            <Plus className="w-2.5 h-2.5 absolute -bottom-1 -right-1 text-emerald-400" />
          )}
        </div>
        {anotacoes.length > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            aria-hidden="true"
            className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5 text-[10px] font-bold flex items-center justify-center bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full shadow-md"
          >
            {badgeCount}
          </motion.span>
        )}
      </motion.button>

      {/* Painel lateral */}
      <AnimatePresence>
        {showAnotacoes && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
              onClick={() => setShowAnotacoes(false)}
              aria-hidden="true"
            />

            {/* Painel */}
            <motion.div
              key="panel"
              ref={panelRef}
              role="dialog"
              aria-label="Anotações do vídeo"
              aria-modal="true"
              initial={{ opacity: 0, x: 400 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 400 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-gradient-to-b from-slate-900 to-slate-950 border-l border-white/10 shadow-2xl z-[61] flex flex-col"
            >
              {/* Header com gradiente */}
              <div className="relative px-5 py-4 border-b border-white/10 shrink-0">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-yellow-500/10 to-orange-500/5 rounded-full blur-2xl" />

                <div className="flex items-center justify-between relative">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg">
                      <StickyNote className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                        Anotações
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400">
                          {anotacoes.length}
                        </span>
                      </h3>
                      <p
                        className="text-[10px] text-slate-500 truncate mt-0.5"
                        title={videoTitle}
                      >
                        {videoTitle}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAnotacoes(false)}
                    aria-label="Fechar anotações"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Corpo scrollável */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5 overscroll-contain custom-scrollbar">
                {/* Nova anotação */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30">
                      <Clock className="w-3 h-3 text-yellow-400" />
                      <span className="text-yellow-400 font-mono text-[11px]">
                        {formatTime(currentTime)}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Momento atual
                    </span>
                  </div>

                  <div className="relative">
                    <textarea
                      ref={textareaRef}
                      value={novaAnotacao}
                      onChange={(e) => {
                        if (e.target.value.length <= MAX_CHARS) {
                          setNovaAnotacao(e.target.value);
                        }
                      }}
                      onKeyDown={handleKeyDown}
                      placeholder="Digite sua anotação… (Ctrl+Enter para salvar)"
                      rows={3}
                      className="w-full p-3 rounded-xl bg-slate-800/80 border border-white/10 focus:border-yellow-500/50 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 text-sm resize-none text-slate-200 placeholder:text-slate-600 transition-all"
                    />
                    <div className="absolute bottom-2 right-2">
                      <span
                        className={`text-[10px] font-mono ${
                          charsRestantes < 50
                            ? "text-orange-400 animate-pulse"
                            : "text-slate-600"
                        }`}
                      >
                        {charsRestantes}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleSalvar}
                    disabled={!podesSalvar}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-medium text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-yellow-500/20"
                  >
                    <Save className="w-4 h-4" />
                    Salvar Anotação
                  </button>
                </div>

                {/* Divisor decorativo */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-2 text-[10px] text-slate-600 bg-slate-900">
                      Anotações Salvas
                    </span>
                  </div>
                </div>

                {/* Lista de anotações */}
                {anotacoes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-600">
                    <div className="p-4 rounded-full bg-slate-800/50">
                      <StickyNote className="w-10 h-10 opacity-40" />
                    </div>
                    <p className="text-sm text-slate-500">
                      Nenhuma anotação ainda
                    </p>
                    <p className="text-xs text-slate-600 text-center">
                      Adicione uma anotação acima para
                      <br />
                      registrar pontos importantes
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Pin className="w-3 h-3 text-yellow-500" />
                      <p className="text-[11px] text-slate-500 uppercase tracking-wider">
                        {anotacoes.length}{" "}
                        {anotacoes.length === 1 ? "anotação" : "anotações"}
                      </p>
                    </div>

                    <AnimatePresence initial={false}>
                      {anotacoesOrdenadas.map((anotacao, idx) => (
                        <motion.div
                          key={anotacao.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{
                            opacity: deletandoId === anotacao.id ? 0 : 1,
                            y: 0,
                            scale: deletandoId === anotacao.id ? 0.95 : 1,
                          }}
                          exit={{ opacity: 0, scale: 0.95, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="group relative bg-gradient-to-r from-slate-800/80 to-slate-800/60 rounded-xl p-3 border border-white/5 hover:border-yellow-500/30 transition-all duration-200"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center">
                                <span className="text-[10px] font-bold text-yellow-400">
                                  {anotacoesOrdenadas.length - idx}
                                </span>
                              </div>
                              <span className="text-[11px] text-yellow-400 flex items-center gap-1 font-mono">
                                <Clock className="w-3 h-3" />
                                {anotacao.timestampFormatado}
                              </span>
                            </div>
                            <button
                              onClick={() => handleDeletar(anotacao.id)}
                              aria-label="Deletar anotação"
                              className="p-1 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-400/10 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap break-words pl-7">
                            {anotacao.texto}
                          </p>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Footer com dica */}
              <div className="p-4 border-t border-white/10 shrink-0">
                <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500">
                  <Sparkles className="w-3 h-3 text-yellow-500" />
                  <span>Dica: Use Ctrl+Enter para salvar rapidamente</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </>
  );
}
