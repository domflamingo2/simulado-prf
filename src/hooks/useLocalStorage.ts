"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type StorageValue<T> = T | undefined;

interface UseLocalStorageOptions<T> {
  key: string;
  defaultValue?: T;
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
  syncAcrossTabs?: boolean;
  validate?: (value: unknown) => value is T;
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
// DEFAULTS (ESTÁVEIS)
// ═══════════════════════════════════════

const defaultSerializer = <T>(value: T) => JSON.stringify(value);
const defaultDeserializer = <T>(value: string) => JSON.parse(value) as T;

// ═══════════════════════════════════════
// HOOK
// ═══════════════════════════════════════

export function useLocalStorage<T>({
  key,
  defaultValue,
  serializer = defaultSerializer,
  deserializer = defaultDeserializer,
  syncAcrossTabs = true,
  validate,
}: UseLocalStorageOptions<T>): UseLocalStorageReturn<T> {
  const isClient = typeof window !== "undefined";

  // 🔒 refs estáveis (NUNCA mudam)
  const defaultRef = useRef(defaultValue);
  const serializerRef = useRef(serializer);
  const deserializerRef = useRef(deserializer);
  const validateRef = useRef(validate);

  const [value, setValueState] = useState<StorageValue<T>>(() => {
    if (!isClient) return defaultRef.current;

    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultRef.current;

      const parsed = deserializerRef.current(item);

      if (validateRef.current && !validateRef.current(parsed)) {
        return defaultRef.current;
      }

      return parsed;
    } catch {
      return defaultRef.current;
    }
  });

  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ═══════════════════════════════════════
  // WRITE (isolado)
  // ═══════════════════════════════════════

  const writeToStorage = useCallback(
    (newValue: StorageValue<T>) => {
      if (!isClient) return;

      try {
        if (newValue === undefined) {
          localStorage.removeItem(key);
        } else {
          const serialized = serializerRef.current(newValue);
          localStorage.setItem(key, serialized);
        }

        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    },
    [key, isClient],
  );

  // ═══════════════════════════════════════
  // SET VALUE (ANTI-LOOP)
  // ═══════════════════════════════════════

  const setValue = useCallback(
    (valueOrUpdater: T | ((prev: T | undefined) => T | undefined)) => {
      setValueState((prev) => {
        const nextValue =
          valueOrUpdater instanceof Function
            ? valueOrUpdater(prev)
            : valueOrUpdater;

        // 🛑 evita loop infinito
        if (Object.is(prev, nextValue)) return prev;

        writeToStorage(nextValue);
        return nextValue;
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
  // SYNC ENTRE ABAS
  // ═══════════════════════════════════════

  useEffect(() => {
    if (!syncAcrossTabs || !isClient) return;

    const handler = (event: StorageEvent) => {
      if (event.key !== key) return;

      try {
        if (event.newValue === null) {
          setValueState(defaultRef.current);
          return;
        }

        const parsed = deserializerRef.current(event.newValue);

        if (validateRef.current && !validateRef.current(parsed)) return;

        setValueState((prev) => {
          if (Object.is(prev, parsed)) return prev;
          return parsed;
        });
      } catch {
        // ignora erro silenciosamente
      }
    };

    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [key, syncAcrossTabs, isClient]);

  // ═══════════════════════════════════════
  // REFRESH
  // ═══════════════════════════════════════

  const refresh = useCallback(() => {
    if (!isClient) return;

    setIsLoading(true);

    try {
      const item = localStorage.getItem(key);

      if (item === null) {
        setValueState(defaultRef.current);
      } else {
        const parsed = deserializerRef.current(item);

        if (!validateRef.current || validateRef.current(parsed)) {
          setValueState(parsed);
        }
      }

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [key, isClient]);

  return {
    value,
    setValue,
    removeValue,
    isLoading,
    error,
    refresh,
  };
}
