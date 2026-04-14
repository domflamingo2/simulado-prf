// src/hooks/useContadorConcurso.ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ================= TYPES ================= */

interface TempoRestante {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
  totalMs: number;
  expirado: boolean;
  formatado: string;
}

interface UseContadorConcursoOptions {
  dataConcurso: Date | string;
  intervalo?: number; // ms (default: 1000)
  autoStart?: boolean;
  onExpirado?: () => void;
  onTick?: (tempo: TempoRestante) => void;
}

/* ================= HELPERS ================= */

const parseDate = (date: Date | string) => {
  if (date instanceof Date) return date;

  // ⚠️ Correção de timezone: evita bug com string ISO sem timezone
  return new Date(date.includes("T") ? date : `${date}T00:00:00`);
};

const formatTime = (h: number, m: number, s: number) =>
  `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(
    s,
  ).padStart(2, "0")}`;

/* ================= HOOK ================= */

export function useContadorConcurso({
  dataConcurso,
  intervalo = 1000,
  autoStart = true,
  onExpirado,
  onTick,
}: UseContadorConcursoOptions) {
  const [tempo, setTempo] = useState<TempoRestante>({
    dias: 0,
    horas: 0,
    minutos: 0,
    segundos: 0,
    totalMs: 0,
    expirado: false,
    formatado: "00:00:00",
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const expiradoChamadoRef = useRef(false);

  const dataRef = useRef(parseDate(dataConcurso));
  const onExpiradoRef = useRef(onExpirado);
  const onTickRef = useRef(onTick);

  useEffect(() => {
    dataRef.current = parseDate(dataConcurso);
    expiradoChamadoRef.current = false;
  }, [dataConcurso]);

  useEffect(() => {
    onExpiradoRef.current = onExpirado;
    onTickRef.current = onTick;
  }, [onExpirado, onTick]);

  /* ================= CORE ================= */

  const calcular = useCallback(() => {
    const agora = Date.now();
    const diff = dataRef.current.getTime() - agora;

    if (diff <= 0) {
      const finalState: TempoRestante = {
        dias: 0,
        horas: 0,
        minutos: 0,
        segundos: 0,
        totalMs: 0,
        expirado: true,
        formatado: "00:00:00",
      };

      setTempo(finalState);

      if (!expiradoChamadoRef.current) {
        expiradoChamadoRef.current = true;
        onExpiradoRef.current?.();
      }

      stop();
      return;
    }

    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutos = Math.floor((diff / (1000 * 60)) % 60);
    const segundos = Math.floor((diff / 1000) % 60);

    const novoEstado: TempoRestante = {
      dias,
      horas,
      minutos,
      segundos,
      totalMs: diff,
      expirado: false,
      formatado: formatTime(horas + dias * 24, minutos, segundos),
    };

    setTempo((prev) => {
      // evita re-render inútil
      if (
        prev.segundos === novoEstado.segundos &&
        prev.minutos === novoEstado.minutos &&
        prev.horas === novoEstado.horas &&
        prev.dias === novoEstado.dias
      ) {
        return prev;
      }
      return novoEstado;
    });

    onTickRef.current?.(novoEstado);
  }, []);

  /* ================= CONTROLES ================= */

  const start = useCallback(() => {
    if (intervalRef.current) return;

    calcular();

    intervalRef.current = setInterval(calcular, intervalo);
  }, [calcular, intervalo]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    stop();
    expiradoChamadoRef.current = false;
    calcular();
  }, [calcular, stop]);

  /* ================= EFFECT ================= */

  useEffect(() => {
    if (autoStart) start();
    return stop;
  }, [autoStart, start, stop]);

  /* ================= RETURN ================= */

  return {
    ...tempo,
    start,
    stop,
    reset,
  };
}
