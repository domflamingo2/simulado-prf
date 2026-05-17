// src/app/video-aulas/hooks/useVideoProgress.ts
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface VideoProgressData {
  assistido: boolean;
  ultimoAcesso: string;
  progresso?: number; // 0-100
  tempoAssistido?: number; // segundos
  ultimaPosicao?: number; // segundos (onde parou)
  vezesAssistido?: number; // contador de vezes
}

interface VideoProgress {
  [videoId: string]: VideoProgressData;
}

const STORAGE_KEY = "prf_video_progress";
const AUTO_SAVE_DELAY = 500; // ms

// ========================================
// Utils
// ========================================

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function loadProgress(): VideoProgress {
  if (!isBrowser()) return {};

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return {};

    const parsed = JSON.parse(saved);
    if (!parsed || typeof parsed !== "object") return {};

    return parsed;
  } catch (error) {
    console.error("Erro ao carregar progresso dos vídeos:", error);
    return {};
  }
}

function saveProgress(progress: VideoProgress): void {
  if (!isBrowser()) return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error("Erro ao salvar progresso:", error);
  }
}

// ========================================
// Hook principal
// ========================================

export function useVideoProgress() {
  const [progress, setProgress] = useState<VideoProgress>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ========================================
  // Carregamento inicial
  // ========================================

  useEffect(() => {
    const data = loadProgress();
    setProgress(data);
    setIsLoaded(true);
  }, []);

  // ========================================
  // Persistência automática com debounce
  // ========================================

  useEffect(() => {
    if (!isLoaded) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveProgress(progress);
    }, AUTO_SAVE_DELAY);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [progress, isLoaded]);

  // ========================================
  // Marcar assistido
  // ========================================

  const marcarAssistido = useCallback((videoId: string) => {
    setProgress((prev) => {
      const existing = prev[videoId];
      const vezesAssistido = (existing?.vezesAssistido || 0) + 1;

      return {
        ...prev,
        [videoId]: {
          assistido: true,
          progresso: 100,
          ultimoAcesso: new Date().toISOString(),
          ultimaPosicao: 0,
          vezesAssistido,
          tempoAssistido: existing?.tempoAssistido || 0,
        },
      };
    });
  }, []);

  // ========================================
  // Desmarcar assistido
  // ========================================

  const desmarcarAssistido = useCallback((videoId: string) => {
    setProgress((prev) => {
      const novo = { ...prev };
      delete novo[videoId];
      return novo;
    });
  }, []);

  // ========================================
  // Atualizar progresso (com salvamento de posição)
  // ========================================

  const atualizarProgresso = useCallback(
    (
      videoId: string,
      progresso: number,
      tempoAssistido?: number,
      posicao?: number,
    ) => {
      const progressoLimitado = Math.max(0, Math.min(100, progresso));
      const isNowComplete = progressoLimitado >= 95; // 95% considera completo

      setProgress((prev) => {
        const existing = prev[videoId];
        const vezesAssistido =
          existing?.vezesAssistido ||
          (isNowComplete && !existing?.assistido ? 1 : 0);

        return {
          ...prev,
          [videoId]: {
            ...existing,
            progresso: progressoLimitado,
            tempoAssistido: tempoAssistido ?? existing?.tempoAssistido,
            ultimaPosicao: posicao ?? existing?.ultimaPosicao,
            assistido: isNowComplete || existing?.assistido || false,
            ultimoAcesso: new Date().toISOString(),
            vezesAssistido:
              isNowComplete && !existing?.assistido
                ? vezesAssistido + 1
                : vezesAssistido,
          },
        };
      });
    },
    [],
  );

  // ========================================
  // Salvar posição atual (onde parou)
  // ========================================

  const salvarPosicao = useCallback(
    (videoId: string, posicao: number, duracaoTotal: number) => {
      const progressoCalculado = Math.min(
        100,
        Math.floor((posicao / duracaoTotal) * 100),
      );

      setProgress((prev) => ({
        ...prev,
        [videoId]: {
          ...prev[videoId],
          ultimaPosicao: posicao,
          progresso: Math.max(
            prev[videoId]?.progresso || 0,
            progressoCalculado,
          ),
          ultimoAcesso: new Date().toISOString(),
        },
      }));
    },
    [],
  );

  // ========================================
  // Buscar status
  // ========================================

  const isAssistido = useCallback(
    (videoId: string) => {
      return progress[videoId]?.assistido ?? false;
    },
    [progress],
  );

  const getProgresso = useCallback(
    (videoId: string) => {
      return progress[videoId]?.progresso ?? 0;
    },
    [progress],
  );

  const getTempoAssistido = useCallback(
    (videoId: string) => {
      return progress[videoId]?.tempoAssistido ?? 0;
    },
    [progress],
  );

  const getUltimaPosicao = useCallback(
    (videoId: string) => {
      return progress[videoId]?.ultimaPosicao ?? 0;
    },
    [progress],
  );

  const getVezesAssistido = useCallback(
    (videoId: string) => {
      return progress[videoId]?.vezesAssistido ?? 0;
    },
    [progress],
  );

  // ========================================
  // Últimos assistidos
  // ========================================

  const getUltimosAssistidos = useCallback(
    (limit: number = 5) => {
      return Object.entries(progress)
        .filter(([, data]) => data.assistido)
        .sort(
          (a, b) =>
            new Date(b[1].ultimoAcesso).getTime() -
            new Date(a[1].ultimoAcesso).getTime(),
        )
        .slice(0, limit)
        .map(([id]) => id);
    },
    [progress],
  );

  // ========================================
  // Vídeos recentemente assistidos (últimos 7 dias)
  // ========================================

  const getRecentes = useCallback(
    (dias: number = 7) => {
      const dataLimite = new Date();
      dataLimite.setDate(dataLimite.getDate() - dias);

      return Object.entries(progress)
        .filter(([, data]) => new Date(data.ultimoAcesso) >= dataLimite)
        .sort(
          (a, b) =>
            new Date(b[1].ultimoAcesso).getTime() -
            new Date(a[1].ultimoAcesso).getTime(),
        )
        .map(([id]) => id);
    },
    [progress],
  );

  // ========================================
  // Estatísticas detalhadas
  // ========================================

  const totalAssistidos = useMemo(() => {
    return Object.values(progress).filter((p) => p.assistido).length;
  }, [progress]);

  const totalEmAndamento = useMemo(() => {
    return Object.values(progress).filter(
      (p) => !p.assistido && (p.progresso ?? 0) > 0 && (p.progresso ?? 0) < 95,
    ).length;
  }, [progress]);

  const totalNaoIniciados = useMemo(() => {
    // Isso precisa ser calculado fora do hook (baseado no total de vídeos)
    return 0;
  }, [progress]);

  const percentualMedio = useMemo(() => {
    const values = Object.values(progress).filter((p) => !p.assistido);
    if (values.length === 0) return 0;
    const total = values.reduce((acc, item) => acc + (item.progresso ?? 0), 0);
    return Math.round(total / values.length);
  }, [progress]);

  const tempoTotalAssistido = useMemo(() => {
    return Object.values(progress).reduce(
      (acc, item) => acc + (item.tempoAssistido ?? 0),
      0,
    );
  }, [progress]);

  const tempoTotalAssistidoFormatado = useMemo(() => {
    const horas = Math.floor(tempoTotalAssistido / 3600);
    const minutos = Math.floor((tempoTotalAssistido % 3600) / 60);

    if (horas > 0) {
      return `${horas}h ${minutos}min`;
    }
    return `${minutos}min`;
  }, [tempoTotalAssistido]);

  const streakDias = useMemo(() => {
    const datasAcessos = Object.values(progress)
      .map((p) => new Date(p.ultimoAcesso).toDateString())
      .filter((value, index, self) => self.indexOf(value) === index);

    // Ordena e calcula streak (simplificado)
    return datasAcessos.length;
  }, [progress]);

  // ========================================
  // Limpar progresso
  // ========================================

  const limparProgresso = useCallback(() => {
    setProgress({});
    if (isBrowser()) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.error("Erro ao limpar progresso:", error);
      }
    }
  }, []);

  // ========================================
  // Resetar vídeo específico
  // ========================================

  const resetarVideo = useCallback((videoId: string) => {
    setProgress((prev) => {
      const novo = { ...prev };
      delete novo[videoId];
      return novo;
    });
  }, []);

  // ========================================
  // Exportar/Importar progresso
  // ========================================

  const exportarProgresso = useCallback(() => {
    const data = {
      version: "1.0",
      exportadoEm: new Date().toISOString(),
      progresso: progress,
    };
    return JSON.stringify(data, null, 2);
  }, [progress]);

  const importarProgresso = useCallback((jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.progresso && typeof data.progresso === "object") {
        setProgress(data.progresso);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao importar progresso:", error);
      return false;
    }
  }, []);

  return {
    // Dados
    progress,
    isLoaded,

    // Ações principais
    marcarAssistido,
    desmarcarAssistido,
    atualizarProgresso,
    salvarPosicao,

    // Consultas
    isAssistido,
    getProgresso,
    getTempoAssistido,
    getUltimaPosicao,
    getVezesAssistido,
    getUltimosAssistidos,
    getRecentes,

    // Estatísticas
    totalAssistidos,
    totalEmAndamento,
    totalNaoIniciados,
    percentualMedio,
    tempoTotalAssistido,
    tempoTotalAssistidoFormatado,
    streakDias,

    // Gerenciamento
    limparProgresso,
    resetarVideo,
    exportarProgresso,
    importarProgresso,
  };
}
