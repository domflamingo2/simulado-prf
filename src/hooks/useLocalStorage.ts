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

  // Validação
  schema?: ZodSchema<T>;

  // Sync
  syncAcrossTabs?: boolean;

  // Versionamento
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
// SAFE PARSE
// ═══════════════════════════════════════

function parseStoredData<T>(raw: string): StoredData<T> | null {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
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

  // ═══════════════════════════════════════
  // INIT
  // ═══════════════════════════════════════

  const [value, setValueState] = useState<StorageValue<T>>(() => {
    if (!isClient) return defaultRef.current;

    try {
      const raw = localStorage.getItem(key);
      if (!raw) return defaultRef.current;

      const parsed = parseStoredData<T>(raw);
      if (!parsed) return defaultRef.current;

      let data = parsed.data;

      // VERSION
      if (parsed.v !== version) {
        if (migrate) {
          data = migrate(parsed.data, parsed.v);
        } else {
          return defaultRef.current;
        }
      }

      // ZOD
      if (schemaRef.current) {
        const result = schemaRef.current.safeParse(data);
        if (!result.success) {
          console.warn("Zod validation failed", result.error);
          return defaultRef.current;
        }
        return result.data;
      }

      return data;
    } catch (err) {
      console.error("read error", err);
      return defaultRef.current;
    }
  });

  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ═══════════════════════════════════════
  // WRITE
  // ═══════════════════════════════════════

  const writeToStorage = useCallback(
    (newValue: StorageValue<T>) => {
      if (!isClient) return;

      try {
        if (newValue === undefined) {
          localStorage.removeItem(key);
        } else {
          const payload: StoredData<T> = {
            v: version,
            data: newValue,
          };

          localStorage.setItem(key, JSON.stringify(payload));
        }

        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    },
    [key, isClient, version],
  );

  // ═══════════════════════════════════════
  // SET
  // ═══════════════════════════════════════

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

  // ═══════════════════════════════════════
  // REMOVE
  // ═══════════════════════════════════════

  const removeValue = useCallback(() => {
    setValueState(defaultRef.current);
    writeToStorage(undefined);
  }, [writeToStorage]);

  // ═══════════════════════════════════════
  // SYNC
  // ═══════════════════════════════════════

  useEffect(() => {
    if (!syncAcrossTabs || !isClient) return;

    const handler = (event: StorageEvent) => {
      if (event.key !== key) return;

      try {
        if (!event.newValue) {
          setValueState(defaultRef.current);
          return;
        }

        const parsed = parseStoredData<T>(event.newValue);
        if (!parsed) return;

        let data = parsed.data;

        if (parsed.v !== version && migrate) {
          data = migrate(parsed.data, parsed.v);
        }

        if (schemaRef.current) {
          const result = schemaRef.current.safeParse(data);
          if (!result.success) return;
          data = result.data;
        }

        setValueState(data);
      } catch (err) {
        console.error("sync error", err);
      }
    };

    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [key, syncAcrossTabs, isClient, version, migrate]);

  // ═══════════════════════════════════════
  // REFRESH
  // ═══════════════════════════════════════

  const refresh = useCallback(() => {
    if (!isClient) return;

    setIsLoading(true);

    try {
      const raw = localStorage.getItem(key);

      if (!raw) {
        setValueState(defaultRef.current);
      } else {
        const parsed = parseStoredData<T>(raw);
        if (!parsed) return;

        let data = parsed.data;

        if (parsed.v !== version && migrate) {
          data = migrate(parsed.data, parsed.v);
          11;
        }

        if (schemaRef.current) {
          const result = schemaRef.current.safeParse(data);
          data = result.success ? result.data : defaultRef.current;
        }

        setValueState(data);
      }

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [key, isClient, version, migrate]);

  return {
    value,
    setValue,
    removeValue,
    isLoading,
    error,
    refresh,
  };
}
