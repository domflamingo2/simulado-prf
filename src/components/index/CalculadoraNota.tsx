// src/components/como-funciona/CalculadoraNota.tsx
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
  Award,
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
      <div className="group">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          <span className="flex items-center gap-2">
            <div
              className={`p-1 rounded-lg ${color === "emerald" ? "bg-emerald-500/20" : "bg-rose-500/20"}`}
            >
              <Icon
                className={`w-3.5 h-3.5 ${color === "emerald" ? "text-emerald-400" : "text-rose-400"}`}
              />
            </div>
            {label} ({value})
          </span>
        </label>
        <div className="relative">
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
          <div className="flex justify-between text-[10px] text-slate-500 mt-1.5 px-1">
            <span>0</span>
            <span>{Math.floor(max / 4)}</span>
            <span>{Math.floor(max / 2)}</span>
            <span>{Math.floor(max * 0.75)}</span>
            <span>{max}</span>
          </div>
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
    if (resultado.cor === "text-purple-400")
      return "from-purple-500/20 to-purple-600/10 border-purple-500/30";
    if (resultado.cor === "text-blue-400")
      return "from-blue-500/20 to-blue-600/10 border-blue-500/30";
    if (resultado.cor === "text-yellow-400")
      return "from-yellow-500/20 to-yellow-600/10 border-yellow-500/30";
    if (resultado.cor === "text-orange-400")
      return "from-orange-500/20 to-orange-600/10 border-orange-500/30";
    return "from-rose-500/20 to-rose-600/10 border-rose-500/30";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4, type: "spring" }}
      className={`p-5 rounded-xl bg-gradient-to-br ${getGradientClasses()} border relative overflow-hidden`}
    >
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/5 to-transparent rounded-full blur-xl" />

      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Award className={`w-4 h-4 ${resultado.cor}`} />
          <span className={`text-xs font-medium ${resultado.cor}`}>
            Pontuação CEBRASPE
          </span>
        </div>
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className={`text-5xl font-black ${resultado.cor} mb-1`}
        >
          {resultado.notaFinal}
        </motion.div>
        <div className="text-[10px] text-slate-500">
          pontos (acertos - erros)
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-[10px] text-slate-500 mb-1">
          <span>0</span>
          <span>15</span>
          <span>30</span>
          <span>45</span>
          <span>60</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(resultado.notaFinal / 60) * 100}%` }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`h-full ${formatado.barraProgresso.cor} rounded-full`}
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 rounded-lg bg-black/20 text-center">
            <span className="text-[10px] text-slate-400">Acertos</span>
            <span className="text-lg font-bold text-emerald-400 block">
              {resultado.acertos}
            </span>
          </div>
          <div className="p-2 rounded-lg bg-black/20 text-center">
            <span className="text-[10px] text-slate-400">Erros</span>
            <span className="text-lg font-bold text-rose-400 block">
              {resultado.erros}
            </span>
          </div>
          <div className="p-2 rounded-lg bg-black/20 text-center">
            <span className="text-[10px] text-slate-400">Em branco</span>
            <span className="text-lg font-bold text-slate-400 block">
              {resultado.brancos}
            </span>
          </div>
          <div className="p-2 rounded-lg bg-black/20 text-center">
            <span className="text-[10px] text-slate-400">% Acertos</span>
            <span className="text-lg font-bold text-blue-400 block">
              {resultado.porcentagemAcertos.toFixed(0)}%
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center p-2 rounded-lg bg-black/20">
          <span className="text-xs text-slate-400">Classificação:</span>
          <span
            className={`font-bold text-sm ${resultado.cor} flex items-center gap-1`}
          >
            <Target className="w-3 h-3" />
            {resultado.classificacao}
          </span>
        </div>

        <div className="flex items-start gap-2 p-2 rounded-lg bg-black/20">
          {resultado.classificacao === "Excelente" ||
          resultado.classificacao === "Bom" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          )}
          <p className="text-xs text-slate-300 leading-relaxed">
            {resultado.mensagem}
          </p>
        </div>
      </div>

      {resultado.dicas && resultado.dicas.length > 0 && (
        <div className="mt-3 p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-center gap-1.5 text-blue-400 text-xs mb-1.5">
            <Brain className="w-3.5 h-3.5" />
            <span className="font-medium">Dicas para melhorar:</span>
          </div>
          <ul className="space-y-1">
            {resultado.dicas.slice(0, 2).map((dica, index) => (
              <li
                key={index}
                className="text-slate-300 text-[10px] flex items-start gap-1.5"
              >
                <ArrowRight className="w-2.5 h-2.5 text-blue-400 mt-0.5 flex-shrink-0" />
                {dica}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
});

ResultadoCard.displayName = "ResultadoCard";

// Componente principal
export function CalculadoraNota() {
  const { ref } = useScrollReveal<HTMLDivElement>({
    threshold: 0.1,
    once: true,
  });

  const [acertos, setAcertos] = useState(30);
  const [erros, setErros] = useState(15);
  const [autoCalculate, setAutoCalculate] = useState(false);

  const emBranco = 60 - acertos - erros;

  const resultado = useMemo(() => {
    if (!autoCalculate) return null;
    return calcularNotaCEBRASPE(acertos, erros);
  }, [acertos, erros, autoCalculate]);

  const handleAcertosChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = Math.min(60, Math.max(0, parseInt(e.target.value) || 0));
      // Garantir que acertos + erros não ultrapasse 60
      if (value + erros > 60) value = 60 - erros;
      setAcertos(value);
    },
    [erros],
  );

  const handleErrosChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = Math.min(60, Math.max(0, parseInt(e.target.value) || 0));
      if (acertos + value > 60) value = 60 - acertos;
      setErros(value);
    },
    [acertos],
  );

  const handleReset = useCallback(() => {
    setAcertos(30);
    setErros(15);
    setAutoCalculate(false);
  }, []);

  const toggleAutoCalculate = useCallback(() => {
    setAutoCalculate((prev) => !prev);
  }, []);

  return (
    <section ref={ref} className="scroll-mt-20 py-8">
      <SectionTitle
        icon={Calculator}
        title="Calculadora de Nota CEBRASPE"
        subtitle="Simule sua pontuação e veja se está no caminho da aprovação"
      />

      <GlassCard className="p-5 sm:p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 to-purple-500/10 rounded-full blur-2xl" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="space-y-5">
            <RangeInput
              label="Acertos"
              value={acertos}
              onChange={handleAcertosChange}
              max={60 - erros}
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

            <motion.div
              className="p-3 rounded-lg bg-slate-800/50 border border-white/10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                <span>Em branco:</span>
                <span className="text-slate-300 font-medium">
                  {emBranco} questões
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                <div className="flex h-full">
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
                </div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-1.5">
                <span>✅ {acertos}</span>
                <span>❌ {erros}</span>
                <span>⬜ {emBranco}</span>
              </div>
            </motion.div>

            <div className="flex gap-3">
              <motion.button
                onClick={handleReset}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
              >
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Resetar
                </span>
              </motion.button>
            </div>

            <button
              onClick={toggleAutoCalculate}
              className={`w-full py-2 rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 ${
                autoCalculate
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              {autoCalculate
                ? "Cálculo automático ativado"
                : "Ativar cálculo automático"}
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
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-3">
                  <Calculator className="w-8 h-8 text-slate-600" />
                </div>
                <p className="text-slate-400 text-sm text-center">
                  Ative o cálculo automático
                  <br />
                  ou ajuste os sliders
                </p>
                <p className="text-[10px] text-slate-500 mt-2">
                  para ver a pontuação
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </GlassCard>
    </section>
  );
}
