"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle,
  Database,
  Download,
  Settings,
  Shield,
  Upload,
} from "lucide-react";
import { useState } from "react";

import { GlassCard } from "@/components/ui/GlassCard";

interface BackupCardProps {
  totalSimulados: number;
  streakDias: number;
  onExport: () => Promise<void>;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  isExporting: boolean;
  exportError: string | null;
}

export function BackupCard({
  totalSimulados,
  streakDias,
  onExport,
  onImport,
  isExporting,
  exportError,
}: BackupCardProps) {
  const [showExportModal, setShowExportModal] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await onImport(e);
    setImportSuccess(true);
    setTimeout(() => setImportSuccess(false), 3000);
  };

  return (
    <>
      <GlassCard className="p-5 overflow-hidden group">
        {/* Efeito de gradiente de fundo */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative">
          {/* Header com ícone animado */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/25">
                <Settings className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-200">
                  Backup e Sincronização
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Proteja seus dados de estudo
                </p>
              </div>
            </div>

            {/* Ícone decorativo */}
            <Database className="w-8 h-8 text-slate-700/30 group-hover:text-slate-600/50 transition-all duration-300" />
          </div>

          {/* Mensagem de erro */}
          <AnimatePresence>
            {exportError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-3 p-2 rounded-lg bg-rose-500/10 border border-rose-500/20"
              >
                <p className="text-xs text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {exportError}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mensagem de sucesso no import */}
          <AnimatePresence>
            {importSuccess && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-3 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
              >
                <p className="text-xs text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Dados importados com sucesso!
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Botões de ação */}
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowExportModal(true)}
              disabled={isExporting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white transition-all text-sm font-medium shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {isExporting ? "Exportando..." : "Exportar Dados"}
            </motion.button>

            <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-300 hover:text-white cursor-pointer transition-all text-sm font-medium">
              <Upload className="w-4 h-4" />
              Importar Backup
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>

          {/* Stats de backup */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <div className="flex items-center gap-2">
              <Shield className="w-3 h-3 text-slate-500" />
              <span className="text-[10px] text-slate-500">
                {totalSimulados} simulados salvos
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-slate-600">
                Streak: {streakDias} dias
              </span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Modal de confirmação */}
      <AnimatePresence>
        {showExportModal && (
          <ExportModal
            totalSimulados={totalSimulados}
            streakDias={streakDias}
            isExporting={isExporting}
            exportError={exportError}
            onConfirm={async () => {
              await onExport();
              setShowExportModal(false);
            }}
            onCancel={() => setShowExportModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// Modal de exportação melhorado
function ExportModal({
  totalSimulados,
  streakDias,
  isExporting,
  exportError,
  onConfirm,
  onCancel,
}: {
  totalSimulados: number;
  streakDias: number;
  isExporting: boolean;
  exportError: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl overflow-hidden"
      >
        {/* Gradiente decorativo */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Exportar Dados</h3>
              <p className="text-xs text-slate-400">
                Faça backup do seu progresso
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-400 mb-4 leading-relaxed">
            Seus dados serão salvos em um arquivo JSON. Você poderá importá-lo
            depois para restaurar seu progresso.
          </p>

          <div className="bg-slate-800/50 rounded-xl p-3 mb-4">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>📊 Simulados</span>
              <span className="font-mono text-slate-300">{totalSimulados}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>🔥 Streak atual</span>
              <span className="font-mono text-slate-300">
                {streakDias} dias
              </span>
            </div>
          </div>

          {exportError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-2 rounded-lg bg-rose-500/10 border border-rose-500/20"
            >
              <p className="text-xs text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {exportError}
              </p>
            </motion.div>
          )}

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onConfirm}
              disabled={isExporting}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-blue-600/50 disabled:to-blue-500/50 disabled:cursor-not-allowed text-white font-medium transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
            >
              {isExporting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {isExporting ? "Exportando..." : "Confirmar"}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCancel}
              disabled={isExporting}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 transition-all"
            >
              Cancelar
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
