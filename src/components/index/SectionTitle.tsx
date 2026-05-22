// src/components/como-funciona/SectionTitle.tsx
"use client";

import { motion, type Variants } from "framer-motion";
import React from "react";

const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      type: "spring",
      stiffness: 120,
      damping: 14,
    },
  },
};

interface SectionTitleProps {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  centered?: boolean;
  gradient?: boolean;
}

export const SectionTitle = React.memo(
  ({
    icon: Icon,
    title,
    subtitle,
    centered = true,
    gradient = true,
  }: SectionTitleProps) => (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={`mb-10 sm:mb-12 ${centered ? "text-center" : "text-left"}`}
    >
      {/* Ícone com gradiente animado */}
      <div
        className={`flex ${centered ? "justify-center" : "justify-start"} mb-4`}
      >
        <div className="relative group">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Container do ícone */}
          <div className="relative p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/10 shadow-lg">
            <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
          </div>
        </div>
      </div>

      {/* Título com gradiente opcional */}
      {gradient ? (
        <h2
          className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent ${centered ? "text-center" : "text-left"}`}
        >
          {title}
        </h2>
      ) : (
        <h2
          className={`text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 ${centered ? "text-center" : "text-left"}`}
        >
          {title}
        </h2>
      )}

      {/* Linha decorativa */}
      <div
        className={`flex ${centered ? "justify-center" : "justify-start"} mb-3`}
      >
        <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
      </div>

      {/* Subtítulo */}
      {subtitle && (
        <p
          className={`text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed ${centered ? "mx-auto text-center" : "text-left"}`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  ),
);

SectionTitle.displayName = "SectionTitle";
