"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { type ZodSchema } from "zod";

// ═══════════════════════════════════════
// TYPES
// ═══════════════════════════════════════

type StorageValue<T> = T | undefined;

interface UseLocalStorageOptions<T> {
  key: string;
  defaultValue?: T;
  schema?: ZodSchema<T>;
  syncAcrossTabs?: boolean;
  version?: number;
  migrate?: (oldData: unknown, oldVersion: number) => T;
}

interface UseLocalStorageReturn<T> {
  value: T | undefined;
  setValue: (value: T | ((prev: T | undefined) => T | undefined)) => void;
  removeValue: () => void;
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
}

// ═══════════════════════════════════════
// INTERNAL STORAGE FORMAT
// ═══════════════════════════════════════

interface StoredData<T> {
  v: number;
  data: T | undefined;
}

// ═══════════════════════════════════════
// SAFE PARSE — com retrocompatibilidade
// ═══════════════════════════════════════

/**
 * Lê e normaliza um valor do localStorage.
 *
 * Suporta dois formatos:
 *   1. Novo (v2+): { v: number, data: T }
 *   2. Legado (v1): o dado salvo diretamente sem wrapper
 *      (ex: arrays ou objetos gravados por código anterior)
 *
 * Se o JSON for válido mas não tiver a estrutura `{ v, data }`,
 * assume que é dado legado e o envolve em { v: 0, data: valor }.
 * Isso aciona a função `migrate` caso ela exista.
 */
function parseStoredData<T>(raw: string): StoredData<T> | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  // Formato novo: objeto com as chaves v e data
  if (
    parsed !== null &&
    typeof parsed === "object" &&
    !Array.isArray(parsed) &&
    "v" in (parsed as object) &&
    "data" in (parsed as object)
  ) {
    return parsed as StoredData<T>;
  }

  // FIX: Formato legado — o dado foi salvo diretamente (sem wrapper).
  // Envolve em { v: 0, data: valor } para acionar migrate se configurado,
  // ou para ser usado diretamente se a versão esperada for 1 e não houver migrate.
  return { v: 0, data: parsed as T };
}

// ═══════════════════════════════════════
// HOOK
// ═══════════════════════════════════════

export function useLocalStorage<T>({
  key,
  defaultValue,
  schema,
  syncAcrossTabs = true,
  version = 1,
  migrate,
}: UseLocalStorageOptions<T>): UseLocalStorageReturn<T> {
  const isClient = typeof window !== "undefined";

  const defaultRef = useRef(defaultValue);
  const schemaRef = useRef(schema);

  // ─── Resolve um StoredData<T> para o valor final T ──────────────────────────
  /**
   * Aplica migração (se necessário) e validação Zod (se configurada).
   * Retorna o dado resolvido ou `defaultRef.current` em caso de falha.
   */
  const resolveData = useCallback(
    (parsed: StoredData<T>): StorageValue<T> => {
      let data: StorageValue<T> = parsed.data;

      // Migração: versão armazenada difere da versão esperada
      if (parsed.v !== version) {
        if (migrate) {
          try {
            data = migrate(parsed.data, parsed.v);
          } catch {
            return defaultRef.current;
          }
        } else if (parsed.v === 0) {
          // FIX: dado legado sem migrate configurado.
          // Versão 0 = dado salvo diretamente (formato antigo).
          // Aceita o dado como está — é melhor renderizar dados legítimos
          // do que apagá-los silenciosamente.
          data = parsed.data;
        } else {
          // Versão incompatível sem migrate → reseta para o padrão
          return defaultRef.current;
        }
      }

      // Validação Zod
      if (schemaRef.current) {
        const result = schemaRef.current.safeParse(data);
        if (!result.success) {
          if (process.env.NODE_ENV === "development") {
            console.warn(
              `[useLocalStorage] Zod validation failed for key "${key}":`,
              result.error.flatten(),
            );
          }
          return defaultRef.current;
        }
        return result.data;
      }

      return data;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key, version, migrate],
  );

  // ─── Leitura inicial do localStorage ────────────────────────────────────────

  const [value, setValueState] = useState<StorageValue<T>>(() => {
    if (!isClient) return defaultRef.current;

    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return defaultRef.current;

      const parsed = parseStoredData<T>(raw);
      if (!parsed) return defaultRef.current;

      return resolveData(parsed);
    } catch {
      return defaultRef.current;
    }
  });

  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ─── Escrita no localStorage ─────────────────────────────────────────────────

  const writeToStorage = useCallback(
    (newValue: StorageValue<T>) => {
      if (!isClient) return;

      try {
        if (newValue === undefined) {
          localStorage.removeItem(key);
        } else {
          // FIX: sempre salva no formato novo { v, data }
          // Isso garante que escritas futuras sejam legíveis pelo hook.
          const payload: StoredData<T> = { v: version, data: newValue };
          localStorage.setItem(key, JSON.stringify(payload));
        }
        setError(null);
      } catch (err) {
        const e = err instanceof Error ? err : new Error(String(err));
        setError(e);
        if (process.env.NODE_ENV === "development") {
          console.error(`[useLocalStorage] Write error for key "${key}":`, e);
        }
      }
    },
    [key, isClient, version],
  );

  // ─── setValue ────────────────────────────────────────────────────────────────

  const setValue = useCallback(
    (valueOrUpdater: T | ((prev: T | undefined) => T | undefined)) => {
      setValueState((prev) => {
        const next =
          typeof valueOrUpdater === "function"
            ? (valueOrUpdater as (prev: T | undefined) => T | undefined)(prev)
            : valueOrUpdater;

        // Evita re-render e re-escrita se o valor não mudou
        if (Object.is(prev, next)) return prev;

        writeToStorage(next);
        return next;
      });
    },
    [writeToStorage],
  );

  // ─── removeValue ─────────────────────────────────────────────────────────────

  const removeValue = useCallback(() => {
    setValueState(defaultRef.current);
    writeToStorage(undefined);
  }, [writeToStorage]);

  // ─── Sincronização entre abas ────────────────────────────────────────────────

  useEffect(() => {
    if (!syncAcrossTabs || !isClient) return;

    const handler = (event: StorageEvent) => {
      if (event.key !== key) return;

      if (!event.newValue) {
        setValueState(defaultRef.current);
        return;
      }

      try {
        const parsed = parseStoredData<T>(event.newValue);
        if (!parsed) return;
        setValueState(resolveData(parsed));
      } catch {
        // ignora erros de parse silenciosamente — outra aba pode ter salvo
        // um formato diferente que não é de responsabilidade desta
      }
    };

    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [key, syncAcrossTabs, isClient, resolveData]);

  // ─── refresh ─────────────────────────────────────────────────────────────────

  const refresh = useCallback(() => {
    if (!isClient) return;

    setIsLoading(true);
    try {
      const raw = localStorage.getItem(key);

      if (raw === null) {
        setValueState(defaultRef.current);
      } else {
        const parsed = parseStoredData<T>(raw);
        if (parsed) {
          setValueState(resolveData(parsed));
        }
      }

      setError(null);
    } catch (err) {
      const e = err instanceof Error ? err : new Error(String(err));
      setError(e);
    } finally {
      setIsLoading(false);
    }
  }, [key, isClient, resolveData]);

  return { value, setValue, removeValue, isLoading, error, refresh };
}
