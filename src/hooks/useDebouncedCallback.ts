import { useCallback, useEffect, useMemo, useRef } from "react";

// ============================================================================
// TIPOS
// ============================================================================

export interface UseDebouncedCallbackOptions {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
}

export interface UseDebouncedCallbackReturn<
  T extends (...args: unknown[]) => unknown,
> {
  /** Chama a função debounced */
  (...args: Parameters<T>): void;
  /** Cancela qualquer execução pendente */
  cancel: () => void;
  /**
   * Executa imediatamente com os argumentos pendentes (ou com os fornecidos)
   * e cancela qualquer timer pendente.
   */
  flush: (...args: Parameters<T>) => void;
  /** Retorna true se há uma execução trailing pendente */
  isPending: () => boolean;
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * Retorna uma versão debounced estável de `callback`.
 *
 * A referência da função retornada é estável entre renders —
 * ela só muda se `delay`, `leading`, `trailing` ou `maxWait` mudarem.
 * O `callback` mais recente é sempre usado via ref, sem re-criar a função.
 *
 * Comportamento:
 * - `leading=false, trailing=true` (padrão): executa após o delay
 * - `leading=true, trailing=false`: executa imediatamente, ignora chamadas subsequentes até o delay acabar
 * - `leading=true, trailing=true`: executa imediatamente na primeira chamada;
 *   se houver chamadas subsequentes dentro do delay, executa novamente no trailing
 * - `maxWait`: garante que o callback execute ao menos uma vez a cada `maxWait` ms,
 *   mesmo que chamadas continuem chegando
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay = 300,
  options: UseDebouncedCallbackOptions = {},
): UseDebouncedCallbackReturn<T> {
  const { leading = false, trailing = true, maxWait } = options;

  // ── Refs de estado ─────────────────────────────────────────────────────────

  // Sempre aponta para o callback mais recente — sem re-criar debounced
  const callbackRef = useRef<T>(callback);
  useEffect(() => {
    callbackRef.current = callback;
  });
  // Nota: sem deps no effect — queremos sincronizar a cada render onde callback
  // pode ter mudado. Usar [callback] seria equivalente mas mais explícito.

  // Timer do trailing/leading
  const trailingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Timer do maxWait (separado para não interferir com o trailing)
  const maxWaitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Últimos argumentos recebidos (para trailing e maxWait)
  const lastArgsRef = useRef<Parameters<T> | null>(null);

  // Controla se o leading já foi chamado no ciclo atual
  // FIX: separado do trailingTimer para que leading+trailing funcione corretamente
  const leadingCalledRef = useRef(false);

  // FIX: `lastCallTimeRef` foi removido — era armazenado mas nunca lido

  // ── Cleanup no unmount ────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      if (trailingTimerRef.current) clearTimeout(trailingTimerRef.current);
      if (maxWaitTimerRef.current) clearTimeout(maxWaitTimerRef.current);
    };
  }, []);

  // ── Funções utilitárias estáveis ───────────────────────────────────────────
  //
  // FIX: `cancel`, `flush` e `isPending` são criados com `useCallback` e deps
  // vazias — são verdadeiramente estáveis e acessam estado via refs.

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

  /**
   * FIX: flush sem argumentos obrigatórios.
   * Se chamado sem args, usa os últimos argumentos pendentes.
   * Se chamado com args, usa os fornecidos.
   */
  const flush = useCallback((...args: Parameters<T> | []) => {
    const argsToUse =
      args.length > 0 ? (args as Parameters<T>) : lastArgsRef.current;

    // Cancela timers pendentes antes de executar
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

  /**
   * FIX: isPending reflete apenas se há trailing pendente.
   * O maxWait timer é auxiliar e não indica "chamada pendente" per se.
   */
  const isPending = useCallback(() => {
    return trailingTimerRef.current !== null;
  }, []);

  // ── Função debounced principal ─────────────────────────────────────────────
  //
  // FIX: `debounced` é estável — só muda se as opções numéricas/booleanas mudarem.
  // O callback mais recente é sempre acessado via `callbackRef`.

  const debounced = useCallback(
    (...args: Parameters<T>) => {
      lastArgsRef.current = args;

      // ── Leading edge ────────────────────────────────────────────────────────
      if (leading && !leadingCalledRef.current) {
        leadingCalledRef.current = true;
        callbackRef.current(...args);

        // Agenda o reset da flag de leading após o delay
        // (sem executar trailing aqui — trailing é gerenciado abaixo)
        if (!trailing) {
          // leading-only: apenas reseta a flag no final do delay
          if (trailingTimerRef.current) clearTimeout(trailingTimerRef.current);
          trailingTimerRef.current = setTimeout(() => {
            trailingTimerRef.current = null;
            leadingCalledRef.current = false;
            lastArgsRef.current = null;
          }, delay);
          return; // Se trailing=false, para aqui
        }
      }

      // ── Trailing edge ────────────────────────────────────────────────────────
      if (trailing) {
        // Sempre reinicia o trailing timer a cada chamada (debounce real)
        if (trailingTimerRef.current) clearTimeout(trailingTimerRef.current);

        trailingTimerRef.current = setTimeout(() => {
          trailingTimerRef.current = null;

          // FIX: com leading+trailing, só executa trailing se houve chamadas
          // APÓS o leading (ou seja, se ainda há args pendentes).
          // leadingCalledRef.current = true indica que o leading foi chamado.
          // Se houver args e leading foi chamado antes, executa trailing.
          // Se leading=false, executa normalmente.
          const shouldExecuteTrailing =
            lastArgsRef.current !== null &&
            (!leading || leadingCalledRef.current);

          // FIX crítico: reseta o estado ANTES de executar para evitar
          // que uma chamada dentro do callback reactive o leading
          const argsToCall = lastArgsRef.current;
          leadingCalledRef.current = false;
          lastArgsRef.current = null;

          // Cancela maxWait pois o trailing executou
          if (maxWaitTimerRef.current) {
            clearTimeout(maxWaitTimerRef.current);
            maxWaitTimerRef.current = null;
          }

          if (shouldExecuteTrailing) {
            callbackRef.current(...argsToCall!);
          }
        }, delay);
      }

      // ── MaxWait ─────────────────────────────────────────────────────────────
      // Garante execução periódica durante streams de chamadas contínuas
      if (maxWait != null && !maxWaitTimerRef.current) {
        maxWaitTimerRef.current = setTimeout(() => {
          // FIX: limpa o ref ANTES de chamar cancel/callback para evitar
          // que cancel() encontre um timer "pendente" que já disparou
          maxWaitTimerRef.current = null;

          const argsToCall = lastArgsRef.current;

          // Cancela o trailing pois maxWait vai executar agora
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
    // FIX: deps apenas com primitivos estáveis — callback é acessado via ref
    [delay, leading, trailing, maxWait],
  );

  // ── Retorno com métodos anexados ───────────────────────────────────────────
  //
  // FIX: usa `useMemo` para construir o objeto final apenas quando `debounced`,
  // `cancel`, `flush` ou `isPending` mudam. Isso garante que:
  // 1. O objeto retornado tem identidade estável
  // 2. Os métodos anexados sempre apontam para as versões corretas
  // 3. Não há reatribuição de propriedades a cada render

  const result = useMemo(() => {
    // Cria um wrapper que delega para `debounced` e carrega os métodos
    const fn = (...args: Parameters<T>) => debounced(...args);
    fn.cancel = cancel;
    fn.flush = flush as UseDebouncedCallbackReturn<T>["flush"];
    fn.isPending = isPending;
    return fn as UseDebouncedCallbackReturn<T>;
  }, [debounced, cancel, flush, isPending]);

  return result;
}
