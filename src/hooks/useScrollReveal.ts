// src/hooks/useScrollReveal.ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  root?: Element | Document | null;
  delay?: number; // Delay para animação em ms
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollRevealOptions = {},
) {
  const {
    threshold = 0.1,
    rootMargin = "0px 0px -100px 0px",
    once = true,
    root = null,
    delay = 0,
  } = options;

  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // Callback para lidar com a visibilidade
  const handleVisibilityChange = useCallback(
    (entry: IntersectionObserverEntry) => {
      if (!isMountedRef.current) return;

      if (entry.isIntersecting) {
        if (delay > 0) {
          // Aplicar delay se configurado
          timeoutRef.current = setTimeout(() => {
            if (isMountedRef.current) {
              setIsVisible(true);
              setHasAnimated(true);
            }
          }, delay);
        } else {
          setIsVisible(true);
          setHasAnimated(true);
        }

        // Se once for true, desconectar o observer
        if (once && observerRef.current && ref.current) {
          observerRef.current.unobserve(ref.current);
        }
      } else if (!once) {
        // Se não for once, pode esconder novamente
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        setIsVisible(false);
      }
    },
    [once, delay],
  );

  useEffect(() => {
    isMountedRef.current = true;
    const element = ref.current;

    if (!element) return;

    // Criar observer com opções otimizadas
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Processar apenas a primeira entrada (mais eficiente)
        const entry = entries[0];
        if (entry) {
          handleVisibilityChange(entry);
        }
      },
      {
        threshold,
        rootMargin,
        root,
      },
    );

    observerRef.current.observe(element);

    // Cleanup function
    return () => {
      isMountedRef.current = false;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (observerRef.current) {
        observerRef.current.disconnect(); // Disconnect all observers at once
        observerRef.current = null;
      }
    };
  }, [threshold, rootMargin, root, once, handleVisibilityChange]);

  // Reset visibility when component unmounts (opcional)
  useEffect(() => {
    return () => {
      setIsVisible(false);
      setHasAnimated(false);
    };
  }, []);

  return { ref, isVisible, hasAnimated };
}
