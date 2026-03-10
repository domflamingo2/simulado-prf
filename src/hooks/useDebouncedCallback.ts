import { useCallback, useRef } from "react";

export function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number = 300,
) {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay],
  );
}