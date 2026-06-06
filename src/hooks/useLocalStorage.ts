// src/hooks/useLocalStorage.ts

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
    "v" in parsed &&
    "data" in parsed
  ) {
    return parsed as StoredData<T>;
  }

  // Formato legado — o dado foi salvo diretamente (sem wrapper).
  // Envolve em { v: 0, data: valor } para acionar migrate se configurado.
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

  // Ref para acessar o defaultValue atual em callbacks (fora da renderização)
  const defaultRef = useRef(defaultValue);
  const schemaRef = useRef(schema);

  // Mantém a ref atualizada se defaultValue mudar (raro, mas suportado)
  useEffect(() => {
    defaultRef.current = defaultValue;
  }, [defaultValue]);

  useEffect(() => {
    schemaRef.current = schema;
  }, [schema]);

  // ─── Resolve um StoredData<T> para o valor final T ──────────────────────────
  // O parâmetro `fallback` evita ler defaultRef.current durante a renderização.
  const resolveData = useCallback(
    (
      parsed: StoredData<T>,
      fallback: StorageValue<T> = defaultRef.current,
    ): StorageValue<T> => {
      let data: StorageValue<T> = parsed.data;

      // Migração: versão armazenada difere da versão esperada
      if (parsed.v !== version) {
        if (migrate) {
          try {
            data = migrate(parsed.data, parsed.v);
          } catch {
            return fallback;
          }
        } else if (parsed.v === 0) {
          // Dado legado sem migrate configurado — aceita como está
          data = parsed.data;
        } else {
          // Versão incompatível sem migrate → usa fallback
          return fallback;
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
          return fallback;
        }
        return result.data;
      }

      return data;
    },
    [key, version, migrate],
  );

  // ─── Leitura inicial do localStorage ────────────────────────────────────────
  // ✅ Agora usa o valor `defaultValue` diretamente, sem acessar defaultRef.current
  const [value, setValueState] = useState<StorageValue<T>>(() => {
    if (!isClient) return defaultValue;

    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return defaultValue;

      const parsed = parseStoredData<T>(raw);
      if (!parsed) return defaultValue;

      // Passamos explicitamente o fallback para evitar leitura da ref
      return resolveData(parsed, defaultValue);
    } catch {
      return defaultValue;
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

        if (Object.is(prev, next)) return prev;

        writeToStorage(next);
        return next;
      });
    },
    [writeToStorage],
  );

  // ─── removeValue ─────────────────────────────────────────────────────────────

  const removeValue = useCallback(() => {
    setValueState(defaultValue);
    writeToStorage(undefined);
  }, [writeToStorage, defaultValue]);

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
        // Fora da renderização, podemos usar defaultRef.current
        setValueState(resolveData(parsed));
      } catch {
        // ignora erros de parse silenciosamente
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
