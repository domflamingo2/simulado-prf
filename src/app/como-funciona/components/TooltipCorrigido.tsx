// src/components/como-funciona/TooltipCorrigido.tsx
"use client";

import React from "react";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
}

// TOOLTIP CORRIGIDO - Sem overflow em mobile
export const Tooltip = React.memo(
  ({ children, content, position = "top" }: TooltipProps) => {
    const positionClasses = {
      top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
      bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
      left: "right-full top-1/2 -translate-y-1/2 mr-2",
      right: "left-full top-1/2 -translate-y-1/2 ml-2",
    };

    return (
      <div className="relative group inline-block">
        {children}
        <div
          className={`
          absolute z-20
          ${positionClasses[position]}
          px-2 py-1 
          bg-slate-800 
          text-white 
          text-xs 
          rounded 
          opacity-0 
          group-hover:opacity-100 
          transition-opacity 
          pointer-events-none
          whitespace-normal 
          break-words
          max-w-[200px] 
          sm:max-w-[250px]
          text-center
          shadow-lg
          border border-slate-700
        `}
        >
          {content}
          {/* Seta do tooltip */}
          <div
            className={`
            absolute w-2 h-2 bg-slate-800 rotate-45
            ${position === "top" ? "bottom-[-4px] left-1/2 -translate-x-1/2" : ""}
            ${position === "bottom" ? "top-[-4px] left-1/2 -translate-x-1/2" : ""}
            ${position === "left" ? "right-[-4px] top-1/2 -translate-y-1/2" : ""}
            ${position === "right" ? "left-[-4px] top-1/2 -translate-y-1/2" : ""}
          `}
          />
        </div>
      </div>
    );
  },
);

Tooltip.displayName = "Tooltip";
