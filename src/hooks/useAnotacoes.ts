// src/app/video-aulas/hooks/useAnotacoes.ts
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface Anotacao {
  id: string;
  videoId: string;
  texto: string;
  timestamp: number;
  timestampFormatado: string;
  createdAt: string;
  updatedAt?: string;
  cor?: string; // cor personalizada
  importancia?: "baixa" | "media" | "alta" | "critica"; // nível de importância
}

export interface FiltroAnotacoes {
  videoId?: string;
  importancia?: Anotacao["importancia"];
  dataInicio?: Date;
  dataFim?: Date;
  searchTerm?: string;
}

const STORAGE_KEY = "prf_video_anotacoes";
const STORAGE_VERSION = "2.0";
const AUTO_SAVE_DELAY = 500; // ms

// ========================================
// Utils
// ========================================

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function formatarTimestamp(segundos: number): string {
  if (!isFinite(segundos) || segundos < 0) return "00:00";

  const horas = Math.floor(segundos / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  const segs = Math.floor(segundos % 60);

  if (horas > 0) {
    return `${horas}:${minutos.toString().padStart(2, "0")}:${segs.toString().padStart(2, "0")}`;
  }

  return `${minutos.toString().padStart(2, "0")}:${segs.toString().padStart(2, "0")}`;
}

function parseTimestamp(timestampStr: string): number {
  const partes = timestampStr.split(":").map(Number);

  if (partes.length === 3) {
    return partes[0] * 3600 + partes[1] * 60 + partes[2];
  }
  if (partes.length === 2) {
    return partes[0] * 60 + partes[1];
  }
  return 0;
}

function gerarCorAleatoria(): string {
  const cores = [
    "#3b82f6", // blue
    "#8b5cf6", // purple
    "#ec4899", // pink
    "#f43f5e", // rose
    "#10b981", // emerald
    "#f59e0b", // amber
    "#ef4444", // red
    "#06b6d4", // cyan
  ];
  return cores[Math.floor(Math.random() * cores.length)];
}

function salvarLocalStorage(anotacoes: Anotacao[]): void {
  if (!isBrowser()) return;

  try {
    const data = {
      version: STORAGE_VERSION,
      updatedAt: new Date().toISOString(),
      anotacoes,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Erro ao salvar anotações:", error);
  }
}

function carregarLocalStorage(): Anotacao[] {
  if (!isBrowser()) return [];

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];

    const parsed = JSON.parse(saved);

    // Novo formato (com versionamento)
    if (parsed.version && parsed.anotacoes && Array.isArray(parsed.anotacoes)) {
      return parsed.anotacoes.filter((item: unknown): item is Anotacao => {
        return (
          typeof item === "object" &&
          item !== null &&
          typeof (item as Anotacao).id === "string"
        );
      });
    }

    // Formato antigo (array puro)
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is Anotacao => {
        return (
          typeof item === "object" &&
          item !== null &&
          typeof item.id === "string"
        );
      });
    }

    return [];
  } catch (error) {
    console.error("Erro ao carregar anotações:", error);
    return [];
  }
}

// ========================================
// Hook
// ========================================

export function useAnotacoes() {
  const [anotacoes, setAnotacoes] = useState<Anotacao[]>([]);
  const [loading, setLoading] = useState(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ========================================
  // Carregar do localStorage
  // ========================================

  useEffect(() => {
    const data = carregarLocalStorage();
    setAnotacoes(data);
    setLoading(false);
  }, []);

  // ========================================
  // Persistência automática com debounce
  // ========================================

  useEffect(() => {
    if (loading) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      salvarLocalStorage(anotacoes);
    }, AUTO_SAVE_DELAY);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [anotacoes, loading]);

  // ========================================
  // Criar anotação
  // ========================================

  const salvarAnotacao = useCallback(
    (
      videoId: string,
      texto: string,
      timestamp: number,
      importancia?: Anotacao["importancia"],
      cor?: string,
    ) => {
      const textoLimpo = texto.trim();
      if (!textoLimpo) return null;

      const novaAnotacao: Anotacao = {
        id: crypto.randomUUID(),
        videoId,
        texto: textoLimpo,
        timestamp,
        timestampFormatado: formatarTimestamp(timestamp),
        createdAt: new Date().toISOString(),
        importancia: importancia || "media",
        cor: cor || gerarCorAleatoria(),
      };

      setAnotacoes((prev) => [novaAnotacao, ...prev]);
      return novaAnotacao;
    },
    [],
  );

  // ========================================
  // Deletar anotação
  // ========================================

  const deletarAnotacao = useCallback((id: string) => {
    setAnotacoes((prev) => prev.filter((a) => a.id !== id));
  }, []);

  // ========================================
  // Deletar várias anotações
  // ========================================

  const deletarMultiplasAnotacoes = useCallback((ids: string[]) => {
    const idsSet = new Set(ids);
    setAnotacoes((prev) => prev.filter((a) => !idsSet.has(a.id)));
  }, []);

  // ========================================
  // Deletar todas anotações de um vídeo
  // ========================================

  const deletarAnotacoesPorVideo = useCallback((videoId: string) => {
    setAnotacoes((prev) => prev.filter((a) => a.videoId !== videoId));
  }, []);

  // ========================================
  // Editar anotação
  // ========================================

  const editarAnotacao = useCallback((id: string, novoTexto: string) => {
    const textoLimpo = novoTexto.trim();
    if (!textoLimpo) return;

    setAnotacoes((prev) =>
      prev.map((anotacao) => {
        if (anotacao.id !== id) return anotacao;
        return {
          ...anotacao,
          texto: textoLimpo,
          updatedAt: new Date().toISOString(),
        };
      }),
    );
  }, []);

  // ========================================
  // Atualizar importância
  // ========================================

  const atualizarImportancia = useCallback(
    (id: string, importancia: Anotacao["importancia"]) => {
      setAnotacoes((prev) =>
        prev.map((anotacao) => {
          if (anotacao.id !== id) return anotacao;
          return {
            ...anotacao,
            importancia,
            updatedAt: new Date().toISOString(),
          };
        }),
      );
    },
    [],
  );

  // ========================================
  // Atualizar cor
  // ========================================

  const atualizarCor = useCallback((id: string, cor: string) => {
    setAnotacoes((prev) =>
      prev.map((anotacao) => {
        if (anotacao.id !== id) return anotacao;
        return {
          ...anotacao,
          cor,
          updatedAt: new Date().toISOString(),
        };
      }),
    );
  }, []);

  // ========================================
  // Buscar por vídeo
  // ========================================

  const getAnotacoesPorVideo = useCallback(
    (videoId: string) => {
      return anotacoes
        .filter((a) => a.videoId === videoId)
        .sort((a, b) => b.timestamp - a.timestamp);
    },
    [anotacoes],
  );

  // ========================================
  // Filtro avançado
  // ========================================

  const filtrarAnotacoes = useCallback(
    (filtro: FiltroAnotacoes) => {
      let resultado = [...anotacoes];

      if (filtro.videoId) {
        resultado = resultado.filter((a) => a.videoId === filtro.videoId);
      }

      if (filtro.importancia) {
        resultado = resultado.filter(
          (a) => a.importancia === filtro.importancia,
        );
      }

      if (filtro.dataInicio) {
        resultado = resultado.filter(
          (a) => new Date(a.createdAt) >= filtro.dataInicio!,
        );
      }

      if (filtro.dataFim) {
        resultado = resultado.filter(
          (a) => new Date(a.createdAt) <= filtro.dataFim!,
        );
      }

      if (filtro.searchTerm) {
        const term = filtro.searchTerm.toLowerCase();
        resultado = resultado.filter((a) =>
          a.texto.toLowerCase().includes(term),
        );
      }

      return resultado.sort((a, b) => b.timestamp - a.timestamp);
    },
    [anotacoes],
  );

  // ========================================
  // Estatísticas
  // ========================================

  const totalAnotacoes = anotacoes.length;

  const videosComAnotacoes = useMemo(() => {
    return new Set(anotacoes.map((a) => a.videoId)).size;
  }, [anotacoes]);

  const anotacoesPorImportancia = useMemo(() => {
    return {
      baixa: anotacoes.filter((a) => a.importancia === "baixa").length,
      media: anotacoes.filter((a) => a.importancia === "media").length,
      alta: anotacoes.filter((a) => a.importancia === "alta").length,
      critica: anotacoes.filter((a) => a.importancia === "critica").length,
    };
  }, [anotacoes]);

  const anotacoesUltimos7Dias = useMemo(() => {
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - 7);
    return anotacoes.filter((a) => new Date(a.createdAt) >= dataLimite).length;
  }, [anotacoes]);

  const anotacoesMaisRecentes = useMemo(() => {
    return [...anotacoes]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 10);
  }, [anotacoes]);

  // ========================================
  // Exportar/Importar
  // ========================================

  const exportarAnotacoes = useCallback((): string => {
    const data = {
      version: STORAGE_VERSION,
      exportadoEm: new Date().toISOString(),
      anotacoes,
      estatisticas: {
        total: totalAnotacoes,
        videos: videosComAnotacoes,
        porImportancia: anotacoesPorImportancia,
      },
    };
    return JSON.stringify(data, null, 2);
  }, [anotacoes, totalAnotacoes, videosComAnotacoes, anotacoesPorImportancia]);

  const importarAnotacoes = useCallback((jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      let novasAnotacoes: Anotacao[] = [];

      if (data.anotacoes && Array.isArray(data.anotacoes)) {
        novasAnotacoes = data.anotacoes;
      } else if (Array.isArray(data)) {
        novasAnotacoes = data;
      } else {
        return false;
      }

      setAnotacoes(novasAnotacoes);
      return true;
    } catch (error) {
      console.error("Erro ao importar anotações:", error);
      return false;
    }
  }, []);

  // ========================================
  // Limpar tudo
  // ========================================

  const limparAnotacoes = useCallback(() => {
    if (confirm("Tem certeza que deseja excluir TODAS as anotações?")) {
      setAnotacoes([]);
      if (isBrowser()) {
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
          console.error("Erro ao limpar anotações:", error);
        }
      }
    }
  }, []);

  return {
    anotacoes,
    loading,

    // Ações principais
    salvarAnotacao,
    deletarAnotacao,
    deletarMultiplasAnotacoes,
    deletarAnotacoesPorVideo,
    editarAnotacao,
    limparAnotacoes,

    // Atualizações
    atualizarImportancia,
    atualizarCor,

    // Busca e filtro
    getAnotacoesPorVideo,
    filtrarAnotacoes,

    // Estatísticas
    totalAnotacoes,
    videosComAnotacoes,
    anotacoesPorImportancia,
    anotacoesUltimos7Dias,
    anotacoesMaisRecentes,

    // Utilitários
    formatarTimestamp,
    parseTimestamp,

    // Import/Export
    exportarAnotacoes,
    importarAnotacoes,
  };
}
