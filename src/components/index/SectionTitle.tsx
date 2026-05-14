// src/components/como-funciona/SectionTitle.tsx
"use client";

import { motion } from "framer-motion";
import React from "react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

interface SectionTitleProps {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
}

export const SectionTitle = React.memo(({ icon: Icon, title, subtitle }: SectionTitleProps) => (
  <motion.div
    variants={fadeInUp}
    initial="initial"
    whileInView="animate"
    viewport={{ once: true }}
    className="text-center mb-8 sm:mb-12"
  >
    <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 mb-4">
      <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
    </div>
    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">{title}</h2>
    {subtitle && <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto px-4">{subtitle}</p>}
  </motion.div>
));

SectionTitle.displayName = "SectionTitle";