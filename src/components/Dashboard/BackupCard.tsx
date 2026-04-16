"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Download, Settings, Upload } from "lucide-react";
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

  return (
    <>
      <GlassCard className="p-5">
        <h3 className="font-bold text-base mb-4 flex items-center gap-2 text-slate-200">
          <Settings className="w-5 h-5 text-purple-400" /> Backup e
          Sincronização
        </h3>

        {exportError && (
          <p className="text-xs text-rose-400 mb-3 p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
            {exportError}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowExportModal(true)}
            disabled={isExporting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {isExporting ? "Exportando…" : "Exportar Dados"}
          </button>
          <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-300 hover:bg-slate-700 cursor-pointer transition-all text-sm font-medium">
            <Upload className="w-4 h-4" /> Importar
            <input
              type="file"
              accept=".json"
              onChange={onImport}
              className="hidden"
            />
          </label>
        </div>
        <p className="text-[10px] text-slate-600 mt-3">
          {totalSimulados} simulados salvos localmente
        </p>
      </GlassCard>

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

// Subcomponente do modal
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl"
      >
        <h3 className="text-lg font-bold text-white mb-2">Exportar Dados</h3>
        <p className="text-sm text-slate-400 mb-4">
          Seus dados serão salvos em um arquivo JSON que pode ser reimportado
          neste app.
        </p>
        <div className="bg-slate-800/50 rounded-lg p-3 mb-4 text-xs text-slate-500 font-mono space-y-1">
          <p>{totalSimulados} simulados</p>
          <p>Streak: {streakDias} dias</p>
        </div>

        {exportError && (
          <p className="text-xs text-rose-400 mb-3 p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
            {exportError}
          </p>
        )}

        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={isExporting}
            className="flex-1 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white font-medium transition-colors flex items-center justify-center gap-2"
          >
            {isExporting && (
              <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
            )}
            {isExporting ? "Exportando…" : "Confirmar"}
          </button>
          <button
            onClick={onCancel}
            disabled={isExporting}
            className="flex-1 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
