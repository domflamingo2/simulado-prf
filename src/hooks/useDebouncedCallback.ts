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
    leading?: boolean;
    trailing?: boolean;
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

  // Sincroniza o callback mais recente
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cleanup seguro (executado apenas no unmount)
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (maxWaitTimeoutRef.current) clearTimeout(maxWaitTimeoutRef.current);
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
    // Não reseta lastArgs ou lastCallTime aqui para permitir que flush funcione se desejado,
    // mas reseta a flag de leading para permitir nova execução imediata
    isLeadingCalledRef.current = false;
  }, []);

  const flush = useCallback(
    (...args: Parameters<T>) => {
      cancel();
      // Executa e limpa argumentos
      callbackRef.current(...args);
      lastArgsRef.current = null;
      lastCallTimeRef.current = null;
    },
    [cancel],
  );

  const isPending = useCallback(() => {
    return timeoutRef.current !== null || maxWaitTimeoutRef.current !== null;
  }, []);

  const debounced = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const shouldCallLeading = leading && !isLeadingCalledRef.current;

      // Armazena argumentos para trailing ou maxWait
      lastArgsRef.current = args;
      lastCallTimeRef.current = now;

      // 1. Lógica Leading Edge (Executa imediatamente se configurado e permitido)
      if (shouldCallLeading) {
        isLeadingCalledRef.current = true;
        callbackRef.current(...args);

        // Agenda o reset da flag de leading.
        // Usamos o mesmo 'delay' para garantir que a janela de bloqueio dure o tempo do debounce.
        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = null;
          isLeadingCalledRef.current = false;
        }, delay);

        // Se não tem maxWait e não tem trailing, acabou aqui.
        if (!maxWait && !trailing) return;
      }

      // 2. Gerencia o MaxWait
      if (maxWait) {
        // Se o maxWait já estiver rodando, não precisa recriar (ele sempre rola do último call)
        if (!maxWaitTimeoutRef.current) {
          maxWaitTimeoutRef.current = setTimeout(() => {
            // Ao disparar o maxWait, executamos com os últimos argumentos
            if (lastArgsRef.current) {
              callbackRef.current(...lastArgsRef.current);
            }
            // Reseta estado de "bloqueio" para permitir novos ciclos
            cancel();
          }, maxWait);
        }
      }

      // 3. Lógica Trailing Edge
      if (trailing) {
        // Se já executou no leading, o timeoutRef já está setado para resetar a flag.
        // Se NÃO executou no leading (leading=false ou já estava bloqueado),
        // precisamos setar o timeout para executar no final.
        if (!shouldCallLeading) {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);

          timeoutRef.current = setTimeout(() => {
            if (lastArgsRef.current && !isLeadingCalledRef.current) {
              callbackRef.current(...lastArgsRef.current);
            }
            // Limpeza final do ciclo de trailing
            cancel();
          }, delay);
        }
      }
    },
    [delay, leading, trailing, maxWait, cancel],
  );

  // Attach métodos
  (debounced as UseDebouncedCallbackReturn<T>).cancel = cancel;
  (debounced as UseDebouncedCallbackReturn<T>).flush = flush;
  (debounced as UseDebouncedCallbackReturn<T>).isPending = isPending;

  return debounced as UseDebouncedCallbackReturn<T>;
}
