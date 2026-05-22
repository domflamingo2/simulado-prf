"use client";

import { motion } from "framer-motion";
import { ArrowRight, Brain, Download, RotateCcw, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface AcoesResultadoProps {
  gerandoImagem: boolean;
  onRefazer: () => void;
  onCompartilhar: () => void;
  onSalvarImagem: () => void;
  simuladoId?: string;
}

export function AcoesResultado({
  gerandoImagem,
  onRefazer,
  onCompartilhar,
  onSalvarImagem,
  simuladoId,
}: AcoesResultadoProps) {
  const router = useRouter();

  const handleRevisar = () => {
    if (simuladoId) {
      router.push(`/revisao?id=${simuladoId}`);
    } else {
      router.push("/revisao");
    }
  };

  // Animações dos botões
  const buttonVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { scale: 1.02, y: -2 },
    tap: { scale: 0.98 },
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.8,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="w-full max-w-4xl mx-auto mt-8 pt-6 border-t border-white/10"
    >
      {/* Título da seção */}
      <motion.div variants={buttonVariants} className="text-center mb-5">
        <p className="text-xs text-slate-500 uppercase tracking-wider">
          Próximos passos
        </p>
        <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-2" />
      </motion.div>

      {/* Grid de botões */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Botão Revisar */}
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={handleRevisar}
          className="group relative overflow-hidden flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-500/20"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          <Brain className="w-4.5 h-4.5 group-hover:scale-110 transition-transform duration-300" />
          <span className="text-sm">Revisar Questões</span>
          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
        </motion.button>

        {/* Botão Refazer */}
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={onRefazer}
          className="group relative overflow-hidden flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 bg-slate-800 hover:bg-slate-700 border border-white/10 hover:border-white/20 shadow-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          <RotateCcw className="w-4.5 h-4.5 group-hover:rotate-[-180deg] transition-transform duration-500" />
          <span className="text-sm">Refazer Simulado</span>
        </motion.button>

        {/* Botão Compartilhar */}
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={onCompartilhar}
          disabled={gerandoImagem}
          className="group relative overflow-hidden flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl font-semibold transition-all duration-300 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/50 shadow-lg shadow-emerald-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          {gerandoImagem ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4.5 h-4.5 border-2 border-emerald-400 border-t-transparent rounded-full"
              />
              <span className="text-sm">Gerando...</span>
            </>
          ) : (
            <>
              <Share2 className="w-4.5 h-4.5 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-sm">Compartilhar</span>
            </>
          )}
        </motion.button>

        {/* Botão Salvar Imagem */}
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={onSalvarImagem}
          disabled={gerandoImagem}
          className="group relative overflow-hidden flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl font-semibold transition-all duration-300 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:border-purple-500/50 shadow-lg shadow-purple-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          <Download className="w-4.5 h-4.5 group-hover:-translate-y-1 transition-transform duration-300" />
          <span className="text-sm">Salvar Imagem</span>
        </motion.button>
      </div>

      {/* Dica adicional */}
      <motion.p
        variants={buttonVariants}
        className="text-center text-[11px] text-slate-500 mt-5"
      >
        💡 Compartilhe seu resultado com amigos ou salve como imagem para
        acompanhar sua evolução
      </motion.p>
    </motion.div>
  );
}
