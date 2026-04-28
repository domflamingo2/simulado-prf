// src/components/como-funciona/CalculadoraNota.tsx (VERSÃO OTIMIZADA)
"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  calcularNotaCEBRASPE,
  formatarNotaParaExibicao,
  NotaCEBRASPE,
} from "@/utils/calcularNotaCEBRASPE";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Brain,
  Calculator,
  CheckCircle2,
  RefreshCw,
  Target,
} from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";
import { SectionTitle } from "./SectionTitle";

// Componente de input range memoizado
const RangeInput = memo(
  ({
    label,
    value,
    onChange,
    max,
    color,
    icon: Icon,
  }: {
    label: string;
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    max: number;
    color: "emerald" | "rose";
    icon: React.ElementType;
  }) => {
    const gradientColor = color === "emerald" ? "#10b981" : "#ef4444";
    const percentage = (value / max) * 100;

    return (
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          <span className="flex items-center gap-2">
            <Icon
              className={`w-4 h-4 ${color === "emerald" ? "text-emerald-400" : "text-rose-400"}`}
            />
            {label} ({value})
          </span>
        </label>
        <input
          type="range"
          min="0"
          max={max}
          value={value}
          onChange={onChange}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer transition-all duration-200"
          style={{
            background: `linear-gradient(to right, ${gradientColor} 0%, ${gradientColor} ${percentage}%, #334155 ${percentage}%)`,
          }}
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1 px-1">
          <span>0</span>
          <span>{Math.floor(max / 4)}</span>
          <span>{Math.floor(max / 2)}</span>
          <span>{Math.floor(max * 0.75)}</span>
          <span>{max}</span>
        </div>
      </div>
    );
  },
);

RangeInput.displayName = "RangeInput";

// Componente de resultado memoizado
const ResultadoCard = memo(({ resultado }: { resultado: NotaCEBRASPE }) => {
  const formatado = useMemo(
    () => formatarNotaParaExibicao(resultado),
    [resultado],
  );

  const getGradientClasses = () => {
    if (resultado.cor === "text-purple-400") {
      return "from-purple-500/20 to-purple-600/10 border-purple-500/30";
    }
    if (resultado.cor === "text-blue-400") {
      return "from-blue-500/20 to-blue-600/10 border-blue-500/30";
    }
    if (resultado.cor === "text-yellow-400") {
      return "from-yellow-500/20 to-yellow-600/10 border-yellow-500/30";
    }
    if (resultado.cor === "text-orange-400") {
      return "from-orange-500/20 to-orange-600/10 border-orange-500/30";
    }
    return "from-rose-500/20 to-rose-600/10 border-rose-500/30";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className={`p-6 rounded-xl bg-gradient-to-br ${getGradientClasses()} border`}
    >
      {/* Nota principal */}
      <div className="text-center mb-4">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className={`text-6xl font-black ${resultado.cor} mb-2`}
        >
          {resultado.notaFinal}
        </motion.div>
        <div className="text-sm text-slate-400">Pontos (acertos - erros)</div>
      </div>

      {/* Barra de progresso da nota */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>0</span>
          <span>15</span>
          <span>30</span>
          <span>45</span>
          <span>60</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(resultado.notaFinal / 60) * 100}%` }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`h-full ${formatado.barraProgresso.cor} rounded-full`}
          />
        </div>
      </div>

      {/* Estatísticas */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col p-3 rounded-lg bg-black/20">
            <span className="text-xs text-slate-400">Acertos</span>
            <span className="text-xl font-bold text-emerald-400">
              {resultado.acertos}
            </span>
          </div>
          <div className="flex flex-col p-3 rounded-lg bg-black/20">
            <span className="text-xs text-slate-400">Erros</span>
            <span className="text-xl font-bold text-rose-400">
              {resultado.erros}
            </span>
          </div>
          <div className="flex flex-col p-3 rounded-lg bg-black/20">
            <span className="text-xs text-slate-400">Em branco</span>
            <span className="text-xl font-bold text-slate-400">
              {resultado.brancos}
            </span>
          </div>
          <div className="flex flex-col p-3 rounded-lg bg-black/20">
            <span className="text-xs text-slate-400">% Acertos</span>
            <span className="text-xl font-bold text-blue-400">
              {resultado.porcentagemAcertos.toFixed(0)}%
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center p-3 rounded-lg bg-black/20">
          <span className="text-slate-300">Classificação:</span>
          <span
            className={`font-bold ${resultado.cor} flex items-center gap-1`}
          >
            <Target className="w-3 h-3" />
            {resultado.classificacao}
          </span>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-lg bg-black/20">
          {resultado.classificacao === "Excelente" ||
          resultado.classificacao === "Bom" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          )}
          <p className="text-slate-300 text-sm leading-relaxed">
            {resultado.mensagem}
          </p>
        </div>
      </div>

      {/* Dicas adicionais */}
      {resultado.dicas && resultado.dicas.length > 0 && (
        <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-center gap-2 text-blue-400 text-sm mb-2">
            <Brain className="w-4 h-4" />
            <span className="font-medium">Dicas para melhorar:</span>
          </div>
          <ul className="space-y-1">
            {resultado.dicas.slice(0, 2).map((dica, index) => (
              <li
                key={index}
                className="text-slate-300 text-xs flex items-start gap-2"
              >
                <ArrowRight className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                {dica}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Estatísticas de aprovação */}
      {resultado.estatisticas && (
        <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Média necessária:</span>
            <span className="text-emerald-400 font-bold">
              {resultado.estatisticas.notaMinimaAprovacao} acertos
            </span>
          </div>
          <div className="flex justify-between items-center text-xs mt-1">
            <span className="text-slate-400">Chances de aprovação:</span>
            <span
              className={`font-bold ${
                resultado.estatisticas.chances === "Alta"
                  ? "text-emerald-400"
                  : resultado.estatisticas.chances === "Média"
                    ? "text-yellow-400"
                    : resultado.estatisticas.chances === "Baixa"
                      ? "text-orange-400"
                      : "text-rose-400"
              }`}
            >
              {resultado.estatisticas.chances}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
});

ResultadoCard.displayName = "ResultadoCard";

// Componente principal
export function CalculadoraNota() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({
    threshold: 0.1,
    once: true,
  });

  const [acertos, setAcertos] = useState(30);
  const [erros, setErros] = useState(15);
  const [resultado, setResultado] = useState<NotaCEBRASPE | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const emBranco = useMemo(() => 60 - acertos - erros, [acertos, erros]);

  const calcular = useCallback(() => {
    setIsCalculating(true);

    // Pequeno delay para mostrar feedback visual
    setTimeout(() => {
      const resultadoCalculado = calcularNotaCEBRASPE(acertos, erros);
      setResultado(resultadoCalculado);
      setIsCalculating(false);
    }, 100);
  }, [acertos, erros]);

  const handleAcertosChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Math.min(60, Math.max(0, parseInt(e.target.value) || 0));
      setAcertos(value);
      if (value + erros > 60) {
        setErros(60 - value);
      }
    },
    [erros],
  );

  const handleErrosChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Math.min(60, Math.max(0, parseInt(e.target.value) || 0));
      setErros(value);
      if (acertos + value > 60) {
        setAcertos(60 - value);
      }
    },
    [acertos],
  );

  const handleReset = useCallback(() => {
    setAcertos(30);
    setErros(15);
    setResultado(null);
  }, []);

  // Calcular automaticamente quando os valores mudarem (opcional)
  const handleAutoCalculate = useCallback(() => {
    const resultadoCalculado = calcularNotaCEBRASPE(acertos, erros);
    setResultado(resultadoCalculado);
  }, [acertos, erros]);

  return (
    <section ref={ref} className="scroll-mt-20">
      <SectionTitle
        icon={Calculator}
        title="Calculadora de Nota CEBRASPE"
        subtitle="Simule sua pontuação e veja se está no caminho da aprovação"
      />

      <GlassCard className="p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="space-y-6">
            <RangeInput
              label="Acertos"
              value={acertos}
              onChange={handleAcertosChange}
              max={60}
              color="emerald"
              icon={CheckCircle2}
            />

            <RangeInput
              label="Erros"
              value={erros}
              onChange={handleErrosChange}
              max={60 - acertos}
              color="rose"
              icon={AlertCircle}
            />

            {/* Resumo */}
            <motion.div
              className="p-4 rounded-lg bg-slate-800/50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Em branco:</span>
                <span className="text-slate-300 font-medium">
                  {emBranco} questões
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="flex h-full"
                  animate={{
                    width: "100%",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className="bg-emerald-500 h-full"
                    style={{ width: `${(acertos / 60) * 100}%` }}
                  />
                  <div
                    className="bg-rose-500 h-full"
                    style={{ width: `${(erros / 60) * 100}%` }}
                  />
                  <div
                    className="bg-slate-600 h-full"
                    style={{ width: `${(emBranco / 60) * 100}%` }}
                  />
                </motion.div>
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>✅ Acertos: {acertos}</span>
                <span>❌ Erros: {erros}</span>
                <span>⬜ Brancos: {emBranco}</span>
              </div>
            </motion.div>

            {/* Botões */}
            <div className="flex gap-3">
              <motion.button
                onClick={calcular}
                disabled={isCalculating}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCalculating ? (
                  <span className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Calculando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Calcular Nota
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </motion.button>

              <motion.button
                onClick={handleReset}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-all"
              >
                <RefreshCw className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Botão de cálculo automático */}
            <button
              onClick={handleAutoCalculate}
              className="w-full text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center justify-center gap-1"
            >
              <Brain className="w-3 h-3" />
              Calcular automaticamente
            </button>
          </div>

          {/* Resultado */}
          <AnimatePresence mode="wait">
            {resultado && <ResultadoCard resultado={resultado} />}
            {!resultado && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center p-8 rounded-xl bg-slate-800/30 border border-dashed border-slate-700"
              >
                <Calculator className="w-12 h-12 text-slate-600 mb-3" />
                <p className="text-slate-400 text-sm text-center">
                  Ajuste os valores e clique em
                  <br />
                  <span className="text-blue-400 font-medium">
                    "Calcular Nota"
                  </span>{" "}
                  para ver o resultado
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </GlassCard>
    </section>
  );
}
