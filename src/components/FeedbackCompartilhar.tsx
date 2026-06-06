"use client";

import { AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";
import { useEffect } from "react";

export interface FeedbackCompartilharProps {
  gerandoImagem: boolean;
  progresso: number;
  erro: string | null;
  sucesso?: boolean | null;

  // Removidas: onCompartilhar, onSalvar, onCompartilharWeb
  onCancelar?: () => void;
  onFecharSucesso?: () => void;

  className?: string;
}

export default function FeedbackCompartilhar({
  gerandoImagem,
  progresso,
  erro,
  sucesso,
  onCancelar,
  onFecharSucesso,
  className = "",
}: FeedbackCompartilharProps) {
  const mostrarPainel = gerandoImagem || !!erro || sucesso === true;
  const progressoSeguro = Math.max(0, Math.min(100, progresso));

  useEffect(() => {
    if (!sucesso || !onFecharSucesso) return;
    const timeout = setTimeout(() => {
      onFecharSucesso();
    }, 3000);
    return () => clearTimeout(timeout);
  }, [sucesso, onFecharSucesso]);

  if (!mostrarPainel) return null;

  const mensagemProgresso =
    progressoSeguro < 25
      ? "Preparando captura..."
      : progressoSeguro < 50
        ? "Renderizando conteúdo..."
        : progressoSeguro < 75
          ? "Gerando imagem..."
          : progressoSeguro < 95
            ? "Finalizando..."
            : "Concluindo...";

  const baseCard = "rounded-2xl backdrop-blur-md shadow-2xl p-4";

  return (
    <div
      className={`fixed bottom-6 right-6 z-[9999] w-[320px] max-w-[calc(100vw-32px)] animate-in slide-in-from-bottom-4 fade-in duration-300 ${className}`}
    >
      {gerandoImagem && (
        <div
          aria-live="polite"
          aria-busy={true}
          className={`${baseCard} border border-slate-700 bg-slate-900/95`}
        >
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
                aria-label="Cancelar operação"
                className="text-slate-400 hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-300 transition-[width] duration-500 ease-out"
              style={{ width: `${progressoSeguro}%` }}
            />
          </div>
          <div className="mt-2 text-right text-xs text-slate-400">
            {Math.round(progressoSeguro)}%
          </div>
        </div>
      )}

      {!gerandoImagem && sucesso && !erro && (
        <div
          role="status"
          aria-live="polite"
          className={`${baseCard} border border-emerald-700 bg-emerald-950/95`}
        >
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

      {!gerandoImagem && erro && (
        <div
          role="alert"
          className={`${baseCard} border border-red-700 bg-red-950/95`}
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
