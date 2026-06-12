// src/hooks/useDebouncedCallback.ts

import { useCallback, useEffect, useMemo, useRef } from "react";

// ============================================================================
// TIPOS
// ============================================================================

export interface UseDebouncedCallbackOptions {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
}

// ❗ Agora retornamos um objeto com a função debounced + métodos
export interface UseDebouncedCallbackReturn<
  T extends (...args: unknown[]) => unknown,
> {
  /** Função debounced */
  debounced: (...args: Parameters<T>) => void;
  /** Cancela qualquer execução pendente */
  cancel: () => void;
  /** Executa imediatamente a função com os últimos argumentos */
  flush: (...args: Parameters<T>) => void;
  /** Indica se há uma execução pendente */
  isPending: () => boolean;
}

// ============================================================================
// HOOK
// ============================================================================

export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay = 300,
  options: UseDebouncedCallbackOptions = {},
): UseDebouncedCallbackReturn<T> {
  const { leading = false, trailing = true, maxWait } = options;

  // ── Refs ────────────────────────────────────────────────────────────────
  const callbackRef = useRef<T>(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const trailingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxWaitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastArgsRef = useRef<Parameters<T> | null>(null);
  const leadingCalledRef = useRef(false);

  // ── Cleanup ─────────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (trailingTimerRef.current) clearTimeout(trailingTimerRef.current);
      if (maxWaitTimerRef.current) clearTimeout(maxWaitTimerRef.current);
    };
  }, []);

  // ── Métodos auxiliares ─────────────────────────────────────────────────
  const cancel = useCallback(() => {
    if (trailingTimerRef.current) {
      clearTimeout(trailingTimerRef.current);
      trailingTimerRef.current = null;
    }
    if (maxWaitTimerRef.current) {
      clearTimeout(maxWaitTimerRef.current);
      maxWaitTimerRef.current = null;
    }
    leadingCalledRef.current = false;
    lastArgsRef.current = null;
  }, []);

  const flush = useCallback((...args: Parameters<T>) => {
    const argsToUse = args.length > 0 ? args : lastArgsRef.current;
    if (trailingTimerRef.current) {
      clearTimeout(trailingTimerRef.current);
      trailingTimerRef.current = null;
    }
    if (maxWaitTimerRef.current) {
      clearTimeout(maxWaitTimerRef.current);
      maxWaitTimerRef.current = null;
    }
    leadingCalledRef.current = false;
    lastArgsRef.current = null;
    if (argsToUse) {
      callbackRef.current(...argsToUse);
    }
  }, []);

  const isPending = useCallback(() => trailingTimerRef.current !== null, []);

  // ── Função debounced ───────────────────────────────────────────────────
  const debounced = useCallback(
    (...args: Parameters<T>) => {
      lastArgsRef.current = args;

      // Leading edge
      if (leading && !leadingCalledRef.current) {
        leadingCalledRef.current = true;
        callbackRef.current(...args);
        if (!trailing) {
          trailingTimerRef.current = setTimeout(() => {
            trailingTimerRef.current = null;
            leadingCalledRef.current = false;
            lastArgsRef.current = null;
          }, delay);
          return;
        }
      }

      // Trailing edge
      if (trailing) {
        if (trailingTimerRef.current) clearTimeout(trailingTimerRef.current);
        trailingTimerRef.current = setTimeout(() => {
          trailingTimerRef.current = null;
          const argsToCall = lastArgsRef.current;
          const shouldExecute =
            argsToCall && (!leading || leadingCalledRef.current);
          leadingCalledRef.current = false;
          lastArgsRef.current = null;
          if (maxWaitTimerRef.current) {
            clearTimeout(maxWaitTimerRef.current);
            maxWaitTimerRef.current = null;
          }
          if (shouldExecute && argsToCall) {
            callbackRef.current(...argsToCall);
          }
        }, delay);
      }

      // MaxWait
      if (maxWait != null && !maxWaitTimerRef.current) {
        maxWaitTimerRef.current = setTimeout(() => {
          maxWaitTimerRef.current = null;
          const argsToCall = lastArgsRef.current;
          if (trailingTimerRef.current) {
            clearTimeout(trailingTimerRef.current);
            trailingTimerRef.current = null;
          }
          leadingCalledRef.current = false;
          lastArgsRef.current = null;
          if (argsToCall) {
            callbackRef.current(...argsToCall);
          }
        }, maxWait);
      }
    },
    [delay, leading, trailing, maxWait],
  );

  // ── Retorno (agora um objeto imutável) ─────────────────────────────────
  return useMemo(
    () => ({
      debounced,
      cancel,
      flush,
      isPending,
    }),
    [debounced, cancel, flush, isPending],
  );
}
