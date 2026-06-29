"use client";

import { type Easing, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Clock, Sparkles, Target } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface TempoRestante {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
}

interface HeroSectionProps {
  prefersReducedMotion?: boolean;
}

function useContador(dataConcurso: string) {
  const [tempo, setTempo] = useState<TempoRestante>({
    dias: 0,
    horas: 0,
    minutos: 0,
    segundos: 0,
  });
  const [expirado, setExpirado] = useState(false);

  useEffect(() => {
    const alvo = new Date(dataConcurso).getTime();

    const tick = () => {
      const diff = alvo - Date.now();
      if (diff <= 0) {
        setExpirado(true);
        return;
      }
      setTempo({
        dias: Math.floor(diff / 86_400_000),
        horas: Math.floor((diff % 86_400_000) / 3_600_000),
        minutos: Math.floor((diff % 3_600_000) / 60_000),
        segundos: Math.floor((diff % 60_000) / 1_000),
      });
    };

    tick();
    const id = setInterval(tick, 1_000);
    return () => clearInterval(id);
  }, [dataConcurso]);

  return { ...tempo, expirado };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

const UNIDADES = [
  { chave: "dias" as const, label: "Dias", classe: "text-blue-400" },
  { chave: "horas" as const, label: "Horas", classe: "text-slate-300" },
  { chave: "minutos" as const, label: "Min", classe: "text-slate-300" },
  { chave: "segundos" as const, label: "Seg", classe: "text-slate-500" },
] as const;

export function HeroSection({
  prefersReducedMotion: propPref,
}: HeroSectionProps) {
  const hookPref = useReducedMotion();
  const reduced = propPref ?? hookPref ?? false;

  const { dias, horas, minutos, segundos, expirado } = useContador(
    "2026-10-25T09:00:00",
  );

  const fadeUp = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.45, delay, ease: "easeOut" as Easing },
        };

  return (
    <section className="relative text-center py-12 px-4 overflow-hidden">
      {/* Badge */}
      <motion.div {...fadeUp(0)}>
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          Plataforma completa para aprovação na PRF
        </span>
      </motion.div>

      {/* Título */}
      <motion.h1
        {...fadeUp(0.08)}
        className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-4 text-white"
      >
        Como <span className="text-blue-400">Funciona</span>
      </motion.h1>

      {/* Subtítulo */}
      <motion.p
        {...fadeUp(0.16)}
        className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto leading-relaxed mb-8"
      >
        Simulados realistas da banca CEBRASPE, estatísticas detalhadas, IA
        adaptativa e gamificação para maximizar sua aprovação na{" "}
        <span className="text-white font-medium">
          Polícia Rodoviária Federal
        </span>
        .
      </motion.p>

      {/* Contador */}
      <motion.div {...fadeUp(0.24)} className="mb-8">
        {!expirado ? (
          <div className="inline-flex flex-col items-center gap-3 px-6 py-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium uppercase tracking-widest">
              <Clock className="w-3.5 h-3.5 text-blue-400" aria-hidden="true" />
              Próximo concurso PRF
            </div>

            <div className="flex items-start gap-4 sm:gap-6">
              {UNIDADES.map((u, i) => (
                <div key={u.chave} className="flex items-start">
                  <div className="flex flex-col items-center min-w-[52px]">
                    <span
                      className={`text-3xl sm:text-4xl font-bold tabular-nums leading-none ${u.classe}`}
                    >
                      {u.chave === "dias"
                        ? dias
                        : pad({ horas, minutos, segundos }[u.chave])}
                    </span>
                    <span className="text-[10px] text-slate-600 tracking-widest mt-1.5">
                      {u.label}
                    </span>
                  </div>
                  {i < UNIDADES.length - 1 && (
                    <span className="text-2xl text-slate-700 font-bold leading-none mt-0.5 ml-4 sm:ml-6">
                      :
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500/10 border border-amber-500/20">
            <span className="text-amber-400 font-medium text-sm">
              🎉 Concurso em andamento — boa sorte!
            </span>
          </div>
        )}
      </motion.div>

      {/* CTA */}
      <motion.div {...fadeUp(0.32)}>
        <Link
          href="/dashboard"
          className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base transition-colors duration-200"
        >
          <Target className="w-5 h-5" aria-hidden="true" />
          Começar agora
          <ArrowRight
            className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>

        <p className="text-xs text-slate-600 mt-3">
          Gratuito · Sem compromisso · Acesso imediato
        </p>
      </motion.div>
    </section>
  );
}
