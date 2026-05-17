// src/hooks/useFavoritos.ts

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface FavoritoData {
  adicionadoEm: string;
  notas?: string;
  tags?: string[];
}

interface FavoritosState {
  [videoId: string]: FavoritoData;
}

const STORAGE_KEY = "prf_video_favoritos";
const STORAGE_VERSION = "2.0";

// ========================================
// Utils
// ========================================

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function loadFavoritos(): FavoritosState {
  if (!isBrowser()) return {};

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return {};

    const parsed = JSON.parse(saved);

    // Suporte ao formato antigo (Array de strings)
    if (Array.isArray(parsed)) {
      const novoFormato: FavoritosState = {};
      parsed.forEach((id: string) => {
        novoFormato[id] = {
          adicionadoEm: new Date().toISOString(),
        };
      });
      return novoFormato;
    }

    return parsed;
  } catch (error) {
    console.error("Erro ao carregar favoritos:", error);
    return {};
  }
}

function saveFavoritos(favoritos: FavoritosState): void {
  if (!isBrowser()) return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoritos));
  } catch (error) {
    console.error("Erro ao salvar favoritos:", error);
  }
}

// ========================================
// Hook principal
// ========================================

export function useFavoritos() {
  const [favoritos, setFavoritos] = useState<FavoritosState>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ========================================
  // Carregamento inicial
  // ========================================

  useEffect(() => {
    const data = loadFavoritos();
    setFavoritos(data);
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
      saveFavoritos(favoritos);
    }, 300);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [favoritos, isLoaded]);

  // ========================================
  // Adicionar favorito
  // ========================================

  const adicionarFavorito = useCallback(
    (videoId: string, notas?: string, tags?: string[]) => {
      setFavoritos((prev) => {
        if (prev[videoId]) return prev;

        return {
          ...prev,
          [videoId]: {
            adicionadoEm: new Date().toISOString(),
            notas,
            tags,
          },
        };
      });
    },
    [],
  );

  // ========================================
  // Remover favorito
  // ========================================

  const removerFavorito = useCallback((videoId: string) => {
    setFavoritos((prev) => {
      const novo = { ...prev };
      delete novo[videoId];
      return novo;
    });
  }, []);

  // ========================================
  // Toggle favorito
  // ========================================

  const toggleFavorito = useCallback(
    (videoId: string, notas?: string, tags?: string[]) => {
      setFavoritos((prev) => {
        const novo = { ...prev };
        if (novo[videoId]) {
          delete novo[videoId];
        } else {
          novo[videoId] = {
            adicionadoEm: new Date().toISOString(),
            notas,
            tags,
          };
        }
        return novo;
      });
    },
    [],
  );

  // ========================================
  // Verificar se é favorito
  // ========================================

  const isFavorito = useCallback(
    (videoId: string): boolean => {
      return !!favoritos[videoId];
    },
    [favoritos],
  );

  // ========================================
  // Obter dados do favorito
  // ========================================

  const getFavoritoData = useCallback(
    (videoId: string): FavoritoData | null => {
      return favoritos[videoId] || null;
    },
    [favoritos],
  );

  // ========================================
  // Atualizar notas/tags
  // ========================================

  const atualizarNotas = useCallback((videoId: string, notas: string) => {
    setFavoritos((prev) => {
      if (!prev[videoId]) return prev;

      return {
        ...prev,
        [videoId]: {
          ...prev[videoId],
          notas,
        },
      };
    });
  }, []);

  const atualizarTags = useCallback((videoId: string, tags: string[]) => {
    setFavoritos((prev) => {
      if (!prev[videoId]) return prev;

      return {
        ...prev,
        [videoId]: {
          ...prev[videoId],
          tags,
        },
      };
    });
  }, []);

  // ========================================
  // Listas de favoritos
  // ========================================

  const listaFavoritos = useMemo(() => {
    return Object.keys(favoritos);
  }, [favoritos]);

  const favoritosComDados = useMemo(() => {
    return Object.entries(favoritos).map(([id, data]) => ({
      id,
      adicionadoEm: data.adicionadoEm,
      notas: data.notas,
      tags: data.tags,
    }));
  }, [favoritos]);

  const totalFavoritos = useMemo(() => {
    return Object.keys(favoritos).length;
  }, [favoritos]);

  // ========================================
  // Favoritos ordenados por data
  // ========================================

  const favoritosRecentes = useMemo(() => {
    return Object.entries(favoritos)
      .sort(
        (a, b) =>
          new Date(b[1].adicionadoEm).getTime() -
          new Date(a[1].adicionadoEm).getTime(),
      )
      .slice(0, 10)
      .map(([id]) => id);
  }, [favoritos]);

  const favoritosAntigos = useMemo(() => {
    return Object.entries(favoritos)
      .sort(
        (a, b) =>
          new Date(a[1].adicionadoEm).getTime() -
          new Date(b[1].adicionadoEm).getTime(),
      )
      .slice(0, 10)
      .map(([id]) => id);
  }, [favoritos]);

  // ========================================
  // Buscar favoritos por tag
  // ========================================

  const buscarPorTag = useCallback(
    (tag: string): string[] => {
      return Object.entries(favoritos)
        .filter(([, data]) => data.tags?.includes(tag))
        .map(([id]) => id);
    },
    [favoritos],
  );

  // ========================================
  // Todas as tags únicas
  // ========================================

  const todasTags = useMemo(() => {
    const tags = new Set<string>();
    Object.values(favoritos).forEach((data) => {
      data.tags?.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  }, [favoritos]);

  // ========================================
  // Limpar todos favoritos
  // ========================================

  const limparFavoritos = useCallback(() => {
    setFavoritos({});
  }, []);

  // ========================================
  // Exportar/Importar
  // ========================================

  const exportarFavoritos = useCallback(() => {
    const data = {
      version: STORAGE_VERSION,
      exportadoEm: new Date().toISOString(),
      favoritos,
    };
    return JSON.stringify(data, null, 2);
  }, [favoritos]);

  const importarFavoritos = useCallback((jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.favoritos && typeof data.favoritos === "object") {
        setFavoritos(data.favoritos);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao importar favoritos:", error);
      return false;
    }
  }, []);

  return {
    // Dados
    favoritos,
    favoritosComDados,
    isLoaded,

    // Ações principais
    adicionarFavorito,
    removerFavorito,
    toggleFavorito,

    // Consultas
    isFavorito,
    getFavoritoData,

    // Atualizações
    atualizarNotas,
    atualizarTags,

    // Listas
    listaFavoritos,
    totalFavoritos,
    favoritosRecentes,
    favoritosAntigos,

    // Busca
    buscarPorTag,
    todasTags,

    // Gerenciamento
    limparFavoritos,
    exportarFavoritos,
    importarFavoritos,
  };
}

// ========================================
// Hook auxiliar: Verificar múltiplos favoritos
// ========================================

export function useMultiFavoritos(videoIds: string[]) {
  const { isFavorito } = useFavoritos();

  const favoritosMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    for (const id of videoIds) {
      map[id] = isFavorito(id);
    }
    return map;
  }, [videoIds, isFavorito]);

  const totalFavoritos = useMemo(() => {
    return Object.values(favoritosMap).filter(Boolean).length;
  }, [favoritosMap]);

  return { favoritosMap, totalFavoritos };
}
