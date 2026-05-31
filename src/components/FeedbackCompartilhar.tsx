"use client";

import { AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";

export interface FeedbackCompartilharProps {
  gerandoImagem: boolean;
  progresso: number;
  erro: string | null;
  sucesso?: boolean | null;

  onCompartilhar?: () => void;
  onSalvar?: () => void;
  onCompartilharWeb?: () => void;
  onCancelar?: () => void;

  className?: string;
}

export default function FeedbackCompartilhar({
  gerandoImagem,
  progresso,
  erro,
  sucesso,
  onCancelar,
  className = "",
}: FeedbackCompartilharProps) {
  const mostrarPainel = gerandoImagem || !!erro || sucesso === true;

  if (!mostrarPainel) {
    return null;
  }

  const mensagemProgresso =
    progresso < 25
      ? "Preparando captura..."
      : progresso < 50
        ? "Renderizando conteúdo..."
        : progresso < 75
          ? "Gerando imagem..."
          : progresso < 95
            ? "Finalizando..."
            : "Concluindo...";

  return (
    <div
      className={`fixed bottom-6 right-6 z-[9999] w-[320px] max-w-[calc(100vw-32px)] ${className}`}
    >
      {/* LOADING */}

      {gerandoImagem && (
        <div className="rounded-2xl border border-slate-700 bg-slate-900/95 backdrop-blur-md shadow-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />

              <span className="text-sm font-medium text-slate-100">
                {mensagemProgresso}
              </span>
            </div>

            {onCancelar && (
              <button
                onClick={onCancelar}
                className="text-slate-400 hover:text-red-400 transition-colors"
                aria-label="Cancelar operação"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-300"
              style={{
                width: `${Math.max(0, Math.min(100, progresso))}%`,
              }}
            />
          </div>

          <div className="mt-2 text-right text-xs text-slate-400">
            {Math.round(progresso)}%
          </div>
        </div>
      )}

      {/* SUCESSO */}

      {!gerandoImagem && sucesso && !erro && (
        <div className="rounded-2xl border border-emerald-700 bg-emerald-950/95 backdrop-blur-md shadow-2xl p-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />

            <div>
              <h3 className="text-sm font-semibold text-emerald-300">
                Operação concluída
              </h3>

              <p className="text-xs text-emerald-200 mt-1">
                Imagem gerada com sucesso.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ERRO */}

      {!gerandoImagem && erro && (
        <div
          role="alert"
          className="rounded-2xl border border-red-700 bg-red-950/95 backdrop-blur-md shadow-2xl p-4"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />

            <div>
              <h3 className="text-sm font-semibold text-red-300">
                Erro ao compartilhar
              </h3>

              <p className="text-xs text-red-200 mt-1">{erro}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
