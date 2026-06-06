// src/hooks/useAnotacoes.ts

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
  cor?: string;
  importancia?: "baixa" | "media" | "alta" | "critica";
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
const AUTO_SAVE_DELAY = 500;

// ─── Utils ────────────────────────────────────────────────────────────────────

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function formatarTimestamp(segundos: number): string {
  if (!Number.isFinite(segundos) || segundos < 0) return "00:00";
  const horas = Math.floor(segundos / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  const segs = Math.floor(segundos % 60);
  if (horas > 0) {
    return `${horas}:${minutos.toString().padStart(2, "0")}:${segs.toString().padStart(2, "0")}`;
  }
  return `${minutos.toString().padStart(2, "0")}:${segs.toString().padStart(2, "0")}`;
}

function parseTimestamp(timestampStr: string): number {
  // FIX: `"abc".split(":").map(Number)` produz `[NaN]` sem erro.
  // Agora valida cada parte antes de somar.
  if (!timestampStr?.trim()) return 0;
  const partes = timestampStr.split(":").map((p) => {
    const n = parseInt(p.trim(), 10);
    return Number.isNaN(n) ? 0 : n;
  });
  if (partes.length === 3) return partes[0] * 3600 + partes[1] * 60 + partes[2];
  if (partes.length === 2) return partes[0] * 60 + partes[1];
  return partes[0] ?? 0;
}

const CORES_DISPONIVEIS = [
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#f43f5e", // rose
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#06b6d4", // cyan
] as const;

function gerarCorAleatoria(): string {
  return CORES_DISPONIVEIS[
    Math.floor(Math.random() * CORES_DISPONIVEIS.length)
  ];
}

// ─── Validação de forma de Anotacao ──────────────────────────────────────────

// FIX: validação mínima dos campos obrigatórios — evita que dados corrompidos
// no localStorage causem erros de runtime ao acessar .id, .videoId, etc.
function isAnotacaoValida(item: unknown): item is Anotacao {
  if (typeof item !== "object" || item === null) return false;
  const a = item as Record<string, unknown>;
  return (
    typeof a.id === "string" &&
    a.id.length > 0 &&
    typeof a.videoId === "string" &&
    typeof a.texto === "string" &&
    typeof a.timestamp === "number" &&
    typeof a.createdAt === "string"
  );
}

// ─── Persistência ────────────────────────────────────────────────────────────

function salvarLocalStorage(anotacoes: Anotacao[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: STORAGE_VERSION,
        updatedAt: new Date().toISOString(),
        anotacoes,
      }),
    );
  } catch (error) {
    // QuotaExceededError e SecurityError são os casos mais comuns
    if (process.env.NODE_ENV === "development") {
      console.error("[useAnotacoes] Erro ao salvar no localStorage:", error);
    }
  }
}

function carregarLocalStorage(): Anotacao[] {
  if (!isBrowser()) return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];

    const parsed = JSON.parse(saved);

    // Formato novo (com versionamento)
    if (parsed?.version && Array.isArray(parsed.anotacoes)) {
      return parsed.anotacoes.filter(isAnotacaoValida);
    }

    // Formato legado (array puro)
    if (Array.isArray(parsed)) {
      return parsed.filter(isAnotacaoValida);
    }

    return [];
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[useAnotacoes] Erro ao carregar do localStorage:", error);
    }
    return [];
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAnotacoes() {
  const [anotacoes, setAnotacoes] = useState<Anotacao[]>([]);
  const [loading, setLoading] = useState(true);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // FIX: `isInitializedRef` evita que o efeito de auto-save dispare na
  // montagem, antes mesmo do carregamento ter terminado — o guard `loading`
  // não é suficiente porque o setState é assíncrono e o efeito pode rodar
  // com `loading = false` mas `anotacoes = []` (estado inicial, não carregado).
  const isInitializedRef = useRef(false);

  // ── Carregamento inicial ────────────────────────────────────────────────────

  useEffect(() => {
    const data = carregarLocalStorage();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnotacoes(data);
    setLoading(false);
    isInitializedRef.current = true;
  }, []);

  // ── Auto-save com debounce ──────────────────────────────────────────────────

  useEffect(() => {
    // FIX: usa ref em vez de `loading` para garantir que o save só ocorre
    // após a inicialização, independente da ordem de execução dos effects.
    if (!isInitializedRef.current) return;

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(() => {
      salvarLocalStorage(anotacoes);
    }, AUTO_SAVE_DELAY);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [anotacoes]);

  // ── Criar ───────────────────────────────────────────────────────────────────

  const salvarAnotacao = useCallback(
    (
      videoId: string,
      texto: string,
      timestamp: number,
      importancia?: Anotacao["importancia"],
      cor?: string,
    ): Anotacao | null => {
      const textoLimpo = texto.trim();
      if (!textoLimpo) return null;

      // FIX: timestamp inválido (NaN, negativo) é normalizado para 0
      const timestampSeguro =
        Number.isFinite(timestamp) && timestamp >= 0 ? timestamp : 0;

      const novaAnotacao: Anotacao = {
        id: crypto.randomUUID(),
        videoId,
        texto: textoLimpo,
        timestamp: timestampSeguro,
        timestampFormatado: formatarTimestamp(timestampSeguro),
        createdAt: new Date().toISOString(),
        importancia: importancia ?? "media",
        cor: cor ?? gerarCorAleatoria(),
      };

      setAnotacoes((prev) => [novaAnotacao, ...prev]);
      return novaAnotacao;
    },
    [],
  );

  // ── Deletar ─────────────────────────────────────────────────────────────────

  const deletarAnotacao = useCallback((id: string) => {
    setAnotacoes((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const deletarMultiplasAnotacoes = useCallback((ids: string[]) => {
    // FIX: `ids` pode ser grande — Set é O(1) por lookup, evita O(n²)
    const idsSet = new Set(ids);
    setAnotacoes((prev) => prev.filter((a) => !idsSet.has(a.id)));
  }, []);

  const deletarAnotacoesPorVideo = useCallback((videoId: string) => {
    setAnotacoes((prev) => prev.filter((a) => a.videoId !== videoId));
  }, []);

  // ── Editar ──────────────────────────────────────────────────────────────────

  const editarAnotacao = useCallback(
    (id: string, novoTexto: string): boolean => {
      const textoLimpo = novoTexto.trim();
      if (!textoLimpo) return false; // FIX: retorna false em vez de retornar silenciosamente

      setAnotacoes((prev) =>
        prev.map((a) =>
          a.id !== id
            ? a
            : { ...a, texto: textoLimpo, updatedAt: new Date().toISOString() },
        ),
      );
      return true;
    },
    [],
  );

  // ── Atualizar campos ────────────────────────────────────────────────────────

  const atualizarImportancia = useCallback(
    (id: string, importancia: Anotacao["importancia"]) => {
      setAnotacoes((prev) =>
        prev.map((a) =>
          a.id !== id
            ? a
            : { ...a, importancia, updatedAt: new Date().toISOString() },
        ),
      );
    },
    [],
  );

  const atualizarCor = useCallback((id: string, cor: string) => {
    // FIX: cor vazia ou inválida (não começa com #) é ignorada
    if (!cor?.trim() || !cor.startsWith("#")) return;
    setAnotacoes((prev) =>
      prev.map((a) =>
        a.id !== id ? a : { ...a, cor, updatedAt: new Date().toISOString() },
      ),
    );
  }, []);

  // ── Busca e filtro ──────────────────────────────────────────────────────────

  const getAnotacoesPorVideo = useCallback(
    (videoId: string): Anotacao[] =>
      anotacoes
        .filter((a) => a.videoId === videoId)
        .sort((a, b) => b.timestamp - a.timestamp),
    [anotacoes],
  );

  const filtrarAnotacoes = useCallback(
    (filtro: FiltroAnotacoes): Anotacao[] => {
      let resultado = anotacoes;

      if (filtro.videoId) {
        resultado = resultado.filter((a) => a.videoId === filtro.videoId);
      }
      if (filtro.importancia) {
        resultado = resultado.filter(
          (a) => a.importancia === filtro.importancia,
        );
      }
      if (filtro.dataInicio) {
        // FIX: `new Date(a.createdAt)` é chamado por item a cada filtro.
        // Para listas grandes, comparar via timestamp é mais eficiente.
        const inicio = filtro.dataInicio.getTime();
        resultado = resultado.filter(
          (a) => new Date(a.createdAt).getTime() >= inicio,
        );
      }
      if (filtro.dataFim) {
        const fim = filtro.dataFim.getTime();
        resultado = resultado.filter(
          (a) => new Date(a.createdAt).getTime() <= fim,
        );
      }
      if (filtro.searchTerm) {
        const term = filtro.searchTerm.toLowerCase();
        resultado = resultado.filter((a) =>
          a.texto.toLowerCase().includes(term),
        );
      }

      return [...resultado].sort((a, b) => b.timestamp - a.timestamp);
    },
    [anotacoes],
  );

  // ── Estatísticas ────────────────────────────────────────────────────────────

  const totalAnotacoes = anotacoes.length;

  const videosComAnotacoes = useMemo(
    () => new Set(anotacoes.map((a) => a.videoId)).size,
    [anotacoes],
  );

  const anotacoesPorImportancia = useMemo(
    () => ({
      baixa: anotacoes.filter((a) => a.importancia === "baixa").length,
      media: anotacoes.filter((a) => a.importancia === "media").length,
      alta: anotacoes.filter((a) => a.importancia === "alta").length,
      critica: anotacoes.filter((a) => a.importancia === "critica").length,
    }),
    [anotacoes],
  );

  const [anotacoesUltimos7Dias, setAnotacoesUltimos7Dias] = useState(0);

  useEffect(() => {
    const limite = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const count = anotacoes.filter(
      (a) => new Date(a.createdAt).getTime() >= limite,
    ).length;
    setAnotacoesUltimos7Dias(count);
  }, [anotacoes]);

  const anotacoesMaisRecentes = useMemo(
    () =>
      [...anotacoes]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 10),
    [anotacoes],
  );

  // ── Export / Import ─────────────────────────────────────────────────────────

  const exportarAnotacoes = useCallback(
    (): string =>
      JSON.stringify(
        {
          version: STORAGE_VERSION,
          exportadoEm: new Date().toISOString(),
          anotacoes,
          estatisticas: {
            total: totalAnotacoes,
            videos: videosComAnotacoes,
            porImportancia: anotacoesPorImportancia,
          },
        },
        null,
        2,
      ),
    [anotacoes, totalAnotacoes, videosComAnotacoes, anotacoesPorImportancia],
  );

  const importarAnotacoes = useCallback((jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      let candidatas: unknown[] = [];

      if (Array.isArray(data?.anotacoes)) {
        candidatas = data.anotacoes;
      } else if (Array.isArray(data)) {
        candidatas = data;
      } else {
        return false;
      }

      // FIX: a versão anterior substituía o estado com dados não validados.
      // Agora filtra com o mesmo guard usado no carregamento do localStorage.
      const validas = candidatas.filter(isAnotacaoValida);
      if (validas.length === 0 && candidatas.length > 0) return false;

      setAnotacoes(validas);
      return true;
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("[useAnotacoes] Erro ao importar anotações:", error);
      }
      return false;
    }
  }, []);

  // ── Limpar tudo ─────────────────────────────────────────────────────────────

  // FIX: `confirm()` dentro de um hook é um anti-pattern —
  // bloqueia a thread e não funciona em ambientes SSR/testes.
  // A confirmação deve ser feita pelo componente antes de chamar esta função.
  const limparAnotacoes = useCallback(() => {
    setAnotacoes([]);
    if (isBrowser()) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("[useAnotacoes] Erro ao limpar localStorage:", error);
        }
      }
    }
  }, []);

  // ── Retorno ─────────────────────────────────────────────────────────────────

  return {
    anotacoes,
    loading,

    salvarAnotacao,
    deletarAnotacao,
    deletarMultiplasAnotacoes,
    deletarAnotacoesPorVideo,
    editarAnotacao,
    limparAnotacoes,

    atualizarImportancia,
    atualizarCor,

    getAnotacoesPorVideo,
    filtrarAnotacoes,

    totalAnotacoes,
    videosComAnotacoes,
    anotacoesPorImportancia,
    anotacoesUltimos7Dias,
    anotacoesMaisRecentes,

    formatarTimestamp,
    parseTimestamp,

    exportarAnotacoes,
    importarAnotacoes,
  };
}
