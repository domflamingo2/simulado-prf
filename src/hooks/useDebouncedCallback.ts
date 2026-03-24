import { useCallback, useEffect, useRef } from "react";

export interface UseDebouncedCallbackReturn<T extends (...args: any[]) => any> {
  /** Função debounced */
  (...args: Parameters<T>): void;
  /** Cancela o timeout pendente */
  cancel: () => void;
  /** Executa imediatamente (flush) e cancela o pendente */
  flush: (...args: Parameters<T>) => void;
  /** Verifica se há execução pendente */
  isPending: () => boolean;
}

export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300,
  options: {
    /** Executa na leading edge (primeiro call imediato) */
    leading?: boolean;
    /** Executa na trailing edge (último call após delay) - padrão: true */
    trailing?: boolean;
    /** Max tempo de espera antes de forçar execução */
    maxWait?: number;
  } = {},
): UseDebouncedCallbackReturn<T> {
  const { leading = false, trailing = true, maxWait } = options;

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxWaitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastCallTimeRef = useRef<number | null>(null);
  const lastArgsRef = useRef<Parameters<T> | null>(null);
  const callbackRef = useRef(callback);
  const isLeadingCalledRef = useRef(false);

  // Sincroniza callback sem causar re-render
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cleanup seguro no unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (maxWaitTimeoutRef.current) {
        clearTimeout(maxWaitTimeoutRef.current);
      }
    };
  }, []);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (maxWaitTimeoutRef.current) {
      clearTimeout(maxWaitTimeoutRef.current);
      maxWaitTimeoutRef.current = null;
    }
    lastArgsRef.current = null;
    lastCallTimeRef.current = null;
    isLeadingCalledRef.current = false;
  }, []);

  const flush = useCallback(
    (...args: Parameters<T>) => {
      cancel();
      callbackRef.current(...args);
    },
    [cancel],
  );

  const isPending = useCallback(() => {
    return timeoutRef.current !== null || maxWaitTimeoutRef.current !== null;
  }, []);

  const debounced = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      lastArgsRef.current = args;
      lastCallTimeRef.current = now;

      // Leading edge: executa imediatamente no primeiro call
      if (leading && !isLeadingCalledRef.current && !timeoutRef.current) {
        isLeadingCalledRef.current = true;
        callbackRef.current(...args);

        // Reseta flag após delay para permitir próximo leading
        timeoutRef.current = setTimeout(() => {
          isLeadingCalledRef.current = false;
          timeoutRef.current = null;
        }, delay);
        return;
      }

      // Cancela timeout anterior
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Setup maxWait se configurado
      if (maxWait && !maxWaitTimeoutRef.current) {
        maxWaitTimeoutRef.current = setTimeout(() => {
          if (lastArgsRef.current) {
            callbackRef.current(...lastArgsRef.current);
            cancel();
          }
        }, maxWait);
      }

      // Setup trailing edge
      if (trailing) {
        timeoutRef.current = setTimeout(() => {
          if (lastArgsRef.current) {
            callbackRef.current(...lastArgsRef.current);
          }
          cancel();
        }, delay);
      }
    },
    [delay, leading, trailing, maxWait, cancel],
  );

  // Attach métodos utilitários
  (debounced as UseDebouncedCallbackReturn<T>).cancel = cancel;
  (debounced as UseDebouncedCallbackReturn<T>).flush = flush;
  (debounced as UseDebouncedCallbackReturn<T>).isPending = isPending;

  return debounced as UseDebouncedCallbackReturn<T>;
}
