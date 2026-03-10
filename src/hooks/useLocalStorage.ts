"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// ═══════════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════
// SERIALIZADORES PADRÃO
// ═══════════════════════════════════════════════════════════

const defaultSerializer = <T>(value: T): string => JSON.stringify(value);
const defaultDeserializer = <T>(value: string): T => JSON.parse(value);

// ═══════════════════════════════════════════════════════════
// HOOK PRINCIPAL
// ═══════════════════════════════════════════════════════════

export function useLocalStorage<T>({
  key,
  defaultValue = undefined,
  serializer = defaultSerializer,
  deserializer = defaultDeserializer,
  syncAcrossTabs = true,
  validate,
}: UseLocalStorageOptions<T>): UseLocalStorageReturn<T> {
  const [value, setInternalValue] = useState<StorageValue<T>>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // CORREÇÃO: useRef para garantir execução única do carregamento inicial
  const didInitRef = useRef(false);

  // ═══════════════════════════════════════════════════════════
  // FUNÇÕES AUXILIARES - CORREÇÃO: useCallback com dependências estáveis
  // ═══════════════════════════════════════════════════════════

  const readValue = useCallback((): StorageValue<T> => {
    if (typeof window === "undefined") {
      return defaultValue;
    }

    try {
      const item = window.localStorage.getItem(key);

      if (item === null) {
        return defaultValue;
      }

      const parsed = deserializer(item);

      if (validate && !validate(parsed)) {
        console.warn(`[useLocalStorage] Valor inválido para chave "${key}"`);
        return defaultValue;
      }

      return parsed;
    } catch (err) {
      console.error(`[useLocalStorage] Erro ao ler "${key}":`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return defaultValue;
    }
  }, [key, defaultValue, deserializer, validate]);

  const writeValue = useCallback(
    (newValue: StorageValue<T>) => {
      if (typeof window === "undefined") {
        return;
      }

      try {
        if (newValue === undefined) {
          window.localStorage.removeItem(key);
        } else {
          const serialized = serializer(newValue);
          window.localStorage.setItem(key, serialized);
        }

        setError(null);
      } catch (err) {
        console.error(`[useLocalStorage] Erro ao escrever "${key}":`, err);
        setError(err instanceof Error ? err : new Error(String(err)));

        if (err instanceof Error && err.name === "QuotaExceededError") {
          console.warn(
            `[useLocalStorage] Limite de armazenamento excedido para "${key}"`,
          );
        }
      }
    },
    [key, serializer],
  );

  // ═══════════════════════════════════════════════════════════
  // EFEITOS - CORREÇÃO: Array de dependências constante
  // ═══════════════════════════════════════════════════════════

  // Carregamento inicial - executa apenas uma vez
  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;

    const initialValue = readValue();
    setInternalValue(initialValue);
    setIsLoading(false);
  }, []); // Array vazio - executa uma vez só

  // Sincronização entre abas/janelas
  useEffect(() => {
    if (!syncAcrossTabs || typeof window === "undefined") return;

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== key) return;

      if (event.newValue === null) {
        setInternalValue(defaultValue);
      } else {
        try {
          const newValue = deserializer(event.newValue);
          if (!validate || validate(newValue)) {
            setInternalValue(newValue);
          }
        } catch (err) {
          console.error(
            `[useLocalStorage] Erro na sincronização de "${key}":`,
            err,
          );
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key, defaultValue, deserializer, syncAcrossTabs, validate]);

  // ═══════════════════════════════════════════════════════════
  // API PÚBLICA
  // ═══════════════════════════════════════════════════════════

  const setValue = useCallback(
    (valueOrUpdater: T | ((prev: T | undefined) => T | undefined)) => {
      setInternalValue((prev) => {
        const nextValue =
          valueOrUpdater instanceof Function
            ? valueOrUpdater(prev)
            : valueOrUpdater;

        writeValue(nextValue);
        return nextValue;
      });
    },
    [writeValue],
  );

  const removeValue = useCallback(() => {
    setInternalValue(defaultValue);
    writeValue(undefined);
  }, [defaultValue, writeValue]);

  const refresh = useCallback(() => {
    setIsLoading(true);
    const freshValue = readValue();
    setInternalValue(freshValue);
    setIsLoading(false);
  }, [readValue]);

  return {
    value,
    setValue,
    removeValue,
    isLoading,
    error,
    refresh,
  };
}

// ═══════════════════════════════════════════════════════════
// VARIANTES ESPECIALIZADAS
// ═══════════════════════════════════════════════════════════

export function useLocalStorageArray<T>(
  options: Omit<UseLocalStorageOptions<T[]>, "defaultValue">,
) {
  const { value, setValue, ...rest } = useLocalStorage<T[]>({
    ...options,
    defaultValue: [],
  });

  const push = useCallback(
    (item: T) => {
      setValue((prev) => [...(prev || []), item]);
    },
    [setValue],
  );

  const unshift = useCallback(
    (item: T) => {
      setValue((prev) => [item, ...(prev || [])]);
    },
    [setValue],
  );

  const filter = useCallback(
    (predicate: (item: T) => boolean) => {
      setValue((prev) => (prev || []).filter(predicate));
    },
    [setValue],
  );

  const map = useCallback(
    <U>(fn: (item: T, index: number) => U): U[] => {
      return (value || []).map(fn);
    },
    [value],
  );

  const find = useCallback(
    (predicate: (item: T) => boolean): T | undefined => {
      return (value || []).find(predicate);
    },
    [value],
  );

  const some = useCallback(
    (predicate: (item: T) => boolean): boolean => {
      return (value || []).some(predicate);
    },
    [value],
  );

  const every = useCallback(
    (predicate: (item: T) => boolean): boolean => {
      return (value || []).every(predicate);
    },
    [value],
  );

  const length = value?.length || 0;

  return {
    value: value || [],
    setValue,
    push,
    unshift,
    filter,
    map,
    find,
    some,
    every,
    length,
    ...rest,
  };
}

export function useLocalStorageObject<T extends Record<string, unknown>>(
  options: Omit<UseLocalStorageOptions<T>, "defaultValue"> & {
    defaultValue?: Partial<T>;
  },
) {
  const fullDefault = { ...options.defaultValue } as T;

  const { value, setValue, ...rest } = useLocalStorage<T>({
    ...options,
    defaultValue: fullDefault,
    deserializer: (str) => {
      const parsed = JSON.parse(str);
      return { ...fullDefault, ...parsed };
    },
  });

  const update = useCallback(
    (updates: Partial<T> | ((prev: T) => Partial<T>)) => {
      setValue((prev) => {
        const current = prev || fullDefault;
        const newValues =
          updates instanceof Function ? updates(current) : updates;
        return { ...current, ...newValues };
      });
    },
    [setValue, fullDefault],
  );

  const reset = useCallback(() => {
    setValue(fullDefault);
  }, [setValue, fullDefault]);

  return {
    value: value || fullDefault,
    setValue,
    update,
    reset,
    ...rest,
  };
}

export function useLocalStorageNumber(
  options: Omit<UseLocalStorageOptions<number>, "defaultValue"> & {
    defaultValue?: number;
  },
) {
  const { value, setValue, ...rest } = useLocalStorage<number>({
    ...options,
    defaultValue: options.defaultValue ?? 0,
  });

  const increment = useCallback(
    (amount = 1) => {
      setValue((prev) => (prev ?? 0) + amount);
    },
    [setValue],
  );

  const decrement = useCallback(
    (amount = 1) => {
      setValue((prev) => (prev ?? 0) - amount);
    },
    [setValue],
  );

  const multiply = useCallback(
    (factor: number) => {
      setValue((prev) => (prev ?? 0) * factor);
    },
    [setValue],
  );

  const divide = useCallback(
    (divisor: number) => {
      setValue((prev) => (divisor !== 0 ? (prev ?? 0) / divisor : (prev ?? 0)));
    },
    [setValue],
  );

  return {
    value: value ?? 0,
    setValue,
    increment,
    decrement,
    multiply,
    divide,
    ...rest,
  };
}

export function useLocalStorageBoolean(
  options: Omit<UseLocalStorageOptions<boolean>, "defaultValue"> & {
    defaultValue?: boolean;
  },
) {
  const { value, setValue, ...rest } = useLocalStorage<boolean>({
    ...options,
    defaultValue: options.defaultValue ?? false,
  });

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, [setValue]);

  const setTrue = useCallback(() => setValue(true), [setValue]);
  const setFalse = useCallback(() => setValue(false), [setValue]);

  return {
    value: value ?? false,
    toggle,
    setTrue,
    setFalse,
    setValue,
    ...rest,
  };
}

// ═══════════════════════════════════════════════════════════
// UTILITÁRIOS
// ═══════════════════════════════════════════════════════════

export function clearLocalStorageByPrefix(prefix: string): void {
  if (typeof window === "undefined") return;

  const keysToRemove: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(prefix)) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => localStorage.removeItem(key));
}

export function getLocalStorageInfo(): {
  used: number;
  total: number;
  remaining: number;
} {
  if (typeof window === "undefined") {
    return { used: 0, total: 0, remaining: 0 };
  }

  let used = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const value = localStorage.getItem(key) || "";
      used += key.length + value.length;
    }
  }

  const total = 5 * 1024 * 1024;
  const remaining = total - used;

  return { used, total, remaining };
}

export const validators = {
  isString: (value: unknown): value is string => typeof value === "string",
  isNumber: (value: unknown): value is number =>
    typeof value === "number" && !isNaN(value),
  isBoolean: (value: unknown): value is boolean => typeof value === "boolean",
  isArray: <T>(value: unknown): value is T[] => Array.isArray(value),
  isObject: (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null && !Array.isArray(value),
  isDateString: (value: unknown): value is string =>
    typeof value === "string" && !isNaN(Date.parse(value)),
};
