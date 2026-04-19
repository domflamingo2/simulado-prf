import { useCallback, useEffect, useMemo, useRef } from "react";

// ============================================================================
// TIPOS
// ============================================================================

export interface UseDebouncedCallbackOptions {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
}

export interface UseDebouncedCallbackReturn<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: (...args: Parameters<T>) => void;
  isPending: () => boolean;
}

// ============================================================================
// HOOK
// ============================================================================

export function useDebouncedCallback<T extends (...args: any[]) => any>(
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

  // ── Utils ───────────────────────────────────────────────────────────────

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

  const isPending = useCallback(() => {
    return trailingTimerRef.current !== null;
  }, []);

  // ── Debounced ───────────────────────────────────────────────────────────

  const debounced = useCallback(
    (...args: Parameters<T>) => {
      lastArgsRef.current = args;

      // Leading
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

      // Trailing
      if (trailing) {
        if (trailingTimerRef.current) {
          clearTimeout(trailingTimerRef.current);
        }

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

  // ── Return ───────────────────────────────────────────────────────────────

  const result = useMemo(() => {
    const fn = (...args: Parameters<T>) => debounced(...args);

    (fn as UseDebouncedCallbackReturn<T>).cancel = cancel;
    (fn as UseDebouncedCallbackReturn<T>).flush = flush;
    (fn as UseDebouncedCallbackReturn<T>).isPending = isPending;

    return fn as UseDebouncedCallbackReturn<T>;
  }, [debounced, cancel, flush, isPending]);

  return result;
}
