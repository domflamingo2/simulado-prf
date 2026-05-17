"use client";

import { Anotacao } from "@/hooks/useAnotacoes";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Save, StickyNote, Trash2, X } from "lucide-react";
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const charsRestantes = MAX_CHARS - novaAnotacao.length;
  const podesSalvar = novaAnotacao.trim().length > 0 && charsRestantes >= 0;

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
        e.stopPropagation(); // não propaga para o VideoPlayer
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
    // Ctrl+Enter ou Cmd+Enter salva
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSalvar();
    }
  };

  const handleDeletar = (id: string) => {
    setDeletandoId(id);
    // Pequeno delay para a animação de saída
    setTimeout(() => {
      onDeletar(id);
      setDeletandoId(null);
    }, 200);
  };

  const badgeCount = Math.min(anotacoes.length, 99);

  const stopKeyboardPropagation = (
  e: React.KeyboardEvent<
    HTMLTextAreaElement | HTMLInputElement
  >,
) => {
  e.stopPropagation();
};

  return (
    <>
      {/* Botão que abre o painel */}
      <button
        onClick={() => setShowAnotacoes((v) => !v)}
        aria-label={`Anotações (${anotacoes.length})`}
        aria-expanded={showAnotacoes}
        className={`relative p-2 rounded-lg transition-colors ${
          showAnotacoes
            ? "bg-yellow-500/20 text-yellow-300"
            : "bg-slate-800 hover:bg-slate-700 text-white/70 hover:text-white"
        }`}
      >
        <StickyNote className="w-4 h-4" />
        {anotacoes.length > 0 && (
          <span
            aria-hidden="true"
            className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5 text-[10px] font-bold flex items-center justify-center bg-yellow-500 text-black rounded-full leading-none"
          >
            {badgeCount}
          </span>
        )}
      </button>

      {/* Painel lateral */}
      <AnimatePresence>
        {showAnotacoes && (
          <>
            {/* Backdrop semitransparente para fechar ao clicar fora */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-[60] bg-black/40"
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
              initial={{ opacity: 0, x: 320 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 320 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="fixed right-0 top-0 bottom-0 w-80 sm:w-96 bg-slate-900 border-l border-white/10 shadow-2xl z-[61] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between shrink-0">
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-200 text-sm">
                    Anotações
                  </h3>
                  <p
                    className="text-xs text-slate-500 truncate mt-0.5"
                    title={videoTitle}
                  >
                    {videoTitle}
                  </p>
                </div>
                <button
                  onClick={() => setShowAnotacoes(false)}
                  aria-label="Fechar anotações"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors ml-2 shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Corpo scrollável */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 overscroll-contain">
                {/* Nova anotação */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-yellow-400">
                    <Clock className="w-3 h-3 shrink-0" />
                    <span>Tempo: {formatTime(currentTime)}</span>
                  </div>

                  <textarea
                    ref={textareaRef}
                    value={novaAnotacao}
                    onChange={(e) => {
                      if (e.target.value.length <= MAX_CHARS) {
                        setNovaAnotacao(e.target.value);
                      }
                    }}
                    onKeyDown={(e) => {
                      e.stopPropagation(); // Evita que as setas e outras teclas afetem o vídeo
                      handleKeyDown(e);
                    }}
                    placeholder="Digite sua anotação… (Ctrl+Enter para salvar)"
                    rows={3}
                    className="w-full p-3 rounded-lg bg-slate-800 border border-white/10 focus:border-yellow-500/50 focus:outline-none focus:ring-1 focus:ring-yellow-500/30 text-sm resize-none text-slate-200 placeholder:text-slate-600 transition-colors"
                  />

                  {/* Contador de caracteres */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs tabular-nums ${
                        charsRestantes < 50
                          ? "text-orange-400"
                          : "text-slate-600"
                      }`}
                    >
                      {charsRestantes} restantes
                    </span>
                    <button
                      onClick={handleSalvar}
                      disabled={!podesSalvar}
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium text-xs flex items-center gap-1.5 transition-all hover:opacity-90 hover:shadow-md hover:shadow-yellow-500/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                      <Save className="w-3 h-3" />
                      Salvar
                    </button>
                  </div>
                </div>

                {/* Divisor */}
                <div className="border-t border-white/10" />

                {/* Lista de anotações */}
                {anotacoes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-2 text-slate-600">
                    <StickyNote className="w-8 h-8 opacity-40" />
                    <p className="text-sm">Nenhuma anotação ainda</p>
                    <p className="text-xs opacity-70">
                      Adicione uma acima para começar
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-slate-600 uppercase tracking-wider">
                      {anotacoes.length}{" "}
                      {anotacoes.length === 1 ? "anotação" : "anotações"}
                    </p>
                    <AnimatePresence initial={false}>
                      {anotacoes.map((anotacao) => (
                        <motion.div
                          key={anotacao.id}
                          layout
                          initial={{ opacity: 0, y: 8 }}
                          animate={{
                            opacity: deletandoId === anotacao.id ? 0 : 1,
                            y: 0,
                            scale: deletandoId === anotacao.id ? 0.95 : 1,
                          }}
                          exit={{ opacity: 0, scale: 0.95, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="bg-slate-800/60 rounded-xl p-3 border border-white/5"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-yellow-400 flex items-center gap-1 font-mono">
                              <Clock className="w-3 h-3 shrink-0" />
                              {anotacao.timestampFormatado}
                            </span>
                            <button
                              onClick={() => handleDeletar(anotacao.id)}
                              aria-label="Deletar anotação"
                              className="p-1 rounded text-slate-600 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap break-words">
                            {anotacao.texto}
                          </p>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
