// src/components/como-funciona/TooltipCorrigido.tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import React, { useState } from "react";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
  showIcon?: boolean;
  icon?: React.ReactNode;
}

export const Tooltip = React.memo(
  ({
    children,
    content,
    position = "top",
    delay = 200,
    showIcon = false,
    icon,
  }: TooltipProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
      const id = setTimeout(() => setIsVisible(true), delay);
      setTimeoutId(id);
    };

    const handleMouseLeave = () => {
      if (timeoutId) clearTimeout(timeoutId);
      setIsVisible(false);
    };

    const positionClasses = {
      top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
      bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
      left: "right-full top-1/2 -translate-y-1/2 mr-2",
      right: "left-full top-1/2 -translate-y-1/2 ml-2",
    };

    const arrowClasses = {
      top: "bottom-[-4px] left-1/2 -translate-x-1/2",
      bottom: "top-[-4px] left-1/2 -translate-x-1/2",
      left: "right-[-4px] top-1/2 -translate-y-1/2",
      right: "left-[-4px] top-1/2 -translate-y-1/2",
    };

    return (
      <div
        className="relative inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {showIcon ? (
          <div className="flex items-center gap-1.5">
            {children}
            {icon || (
              <HelpCircle className="w-3.5 h-3.5 text-slate-500 cursor-help hover:text-blue-400 transition-colors" />
            )}
          </div>
        ) : (
          children
        )}

        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
                y: position === "top" ? 5 : position === "bottom" ? -5 : 0,
              }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{
                opacity: 0,
                scale: 0.9,
                y: position === "top" ? 5 : position === "bottom" ? -5 : 0,
              }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className={`
                absolute z-50
                ${positionClasses[position]}
                px-3 py-2
                bg-gradient-to-br from-slate-800 to-slate-900
                text-white
                text-xs
                rounded-xl
                pointer-events-none
                whitespace-normal
                break-words
                max-w-[220px]
                sm:max-w-[280px]
                text-center
                shadow-2xl
                border border-white/10
                backdrop-blur-sm
              `}
            >
              {/* Conteúdo do tooltip */}
              <div className="relative z-10">{content}</div>

              {/* Seta do tooltip */}
              <div
                className={`
                  absolute w-2.5 h-2.5 bg-slate-800 rotate-45 border border-white/10
                  ${arrowClasses[position]}
                  ${position === "top" ? "border-t-0 border-l-0" : ""}
                  ${position === "bottom" ? "border-b-0 border-r-0" : ""}
                  ${position === "left" ? "border-l-0 border-b-0" : ""}
                  ${position === "right" ? "border-r-0 border-t-0" : ""}
                `}
                style={{
                  backgroundColor:
                    position === "top" ? "rgb(30 41 59)" : "rgb(30 41 59)",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  },
);

Tooltip.displayName = "Tooltip";

// Tooltip simplificado para uso rápido
export const SimpleTooltip = React.memo(
  ({ children, content }: { children: React.ReactNode; content: string }) => (
    <Tooltip content={content} position="top" showIcon={false}>
      {children}
    </Tooltip>
  ),
);

SimpleTooltip.displayName = "SimpleTooltip";

// Tooltip com ícone (para ajudar em labels)
export const IconTooltip = React.memo(
  ({ content, icon }: { content: string; icon?: React.ReactNode }) => (
    <Tooltip content={content} position="top" showIcon={true} icon={icon}>
      <span className="sr-only">Ajuda</span>
    </Tooltip>
  ),
);

IconTooltip.displayName = "IconTooltip";
