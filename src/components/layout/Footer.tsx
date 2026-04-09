// src/components/layout/Footer.tsx

"use client";

import {
  frasesMotivacionais,
  legal,
  linksRapidos,
  recursos,
  tecnologias,
} from "@/config/footer";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Coffee,
  Heart,
  Shield,
  Star,
  Target,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

const Footer = () => {
  const anoAtual = new Date().getFullYear();
  const shouldReduceMotion = useReducedMotion();

  const frase = useMemo(() => {
    return frasesMotivacionais[
      Math.floor(Math.random() * frasesMotivacionais.length)
    ];
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: shouldReduceMotion ? 0 : 0.5 },
  };

  return (
    <footer className="relative border-t border-slate-800 bg-gradient-to-b from-slate-950 via-slate-950 to-black overflow-hidden mt-24">
      {/* Background */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[28rem] h-[28rem] bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[28rem] h-[28rem] bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-indigo-500/10 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.04)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black,transparent)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14">
          {/* SOBRE */}
          <motion.div {...fadeInUp} className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/30 blur-md rounded-xl" />
                <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                  <Target className="w-5 h-5 text-white" />
                </div>
              </div>

              <div>
                <span className="font-bold text-lg bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  PRF Simulado
                </span>
                <p className="text-[10px] text-slate-500">Beta • v2.0.0</p>
              </div>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed">
              Plataforma completa para sua aprovação na PRF com foco na banca
              CEBRASPE.
            </p>

            <div className="text-xs text-slate-500">
              +5.000 questões • Atualizado 2026
            </div>

            <div className="text-xs text-blue-400 italic">{frase}</div>

            <div className="flex flex-wrap gap-2 pt-2">
              {tecnologias.map((tech) => (
                <span
                  key={tech}
                  className="text-[10px] px-2 py-1 rounded bg-slate-800/60 text-slate-400"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>

          {/* LINKS */}
          <motion.div {...fadeInUp}>
            <h3 className="footer-title">Links</h3>
            <ul className="footer-list">
              {linksRapidos.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="footer-link">
                    <span className="flex items-center gap-2">
                      {link.icon} {link.label}
                    </span>
                    <ArrowUpRight className="footer-arrow" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* RECURSOS */}
          <motion.div {...fadeInUp}>
            <h3 className="footer-title">Recursos</h3>
            <ul className="footer-list">
              {recursos.map((item) => (
                <li key={item} className="text-slate-400 text-sm">
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* LEGAL */}
          <motion.div {...fadeInUp}>
            <h3 className="footer-title">Legal</h3>
            <ul className="footer-list">
              {legal.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="footer-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

        {/* DEV BADGE */}
        <div className="flex justify-center mb-6">
          <div className="px-4 py-2 rounded-full bg-slate-900/80 border border-slate-700 shadow-lg backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Coffee className="w-3.5 h-3.5 text-amber-400" />
              Desenvolvido com <Heart className="w-3 text-red-400" /> por{" "}
              <span className="text-blue-400">Gabriel Dev</span>
              <Shield className="w-3 text-emerald-400/50" />
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {anoAtual} PRF Simulado. Todos os direitos reservados.</p>

          <p className="flex items-center gap-1 text-[10px] text-slate-600">
            <Zap className="w-3" />
            Plataforma independente • Não afiliado à PRF
            <Star className="w-3 text-amber-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
