// src/components/layout/Footer.tsx

"use client";

import {
  frasesMotivacionais,
  linksRapidos,
  recursos,
  tecnologias,
  type LinkItem,
  type RecursoItem,
  type Tecnologia,
} from "@/config/footer";

import { motion, useReducedMotion, type Variants } from "framer-motion";
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
import { useEffect, useState } from "react";

const Footer = () => {
  const anoAtual = new Date().getFullYear();
  const shouldReduceMotion = useReducedMotion();

  // ✅ ZERO HYDRATION ISSUE
  const [frase, setFrase] = useState(frasesMotivacionais[0]);

  useEffect(() => {
    const random =
      frasesMotivacionais[
        Math.floor(Math.random() * frasesMotivacionais.length)
      ];
    setFrase(random);
  }, []);

  // 🎬 animação base (TIPADA CORRETAMENTE)
  const fadeInUp: Variants = {
    initial: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 24,
    },
    whileInView: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const staggerContainer: Variants = {
    initial: {},
    whileInView: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  // Função para renderizar ícone
  const renderIcon = (icon: any) => {
    if (!icon) return null;
    const IconComponent = icon;
    return <IconComponent className="w-4 h-4" />;
  };

  return (
    <footer className="relative border-t border-slate-800 bg-gradient-to-b from-slate-950 via-slate-950 to-black overflow-hidden mt-24">
      {/* 🌌 BACKGROUND ANIMADO */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-[28rem] h-[28rem] bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-[28rem] h-[28rem] bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-indigo-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -40, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* GRID PATTERN */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.04)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black,transparent)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* MAIN GRID */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 xl:gap-16"
        >
          {/* SEÇÃO SOBRE */}
          <motion.div variants={fadeInUp} className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-blue-500/30 blur-md rounded-xl group-hover:blur-xl transition-all duration-300" />
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                  <Target className="w-5 h-5 text-white" />
                </div>
              </div>

              <div>
                <span className="font-bold text-xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  PRF Simulado
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-[10px] text-slate-500">Beta</p>
                  <span className="w-1 h-1 rounded-full bg-slate-600" />
                  <p className="text-[10px] text-slate-500">v2.0.0</p>
                </div>
              </div>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed">
              Plataforma completa para sua aprovação na PRF com foco na banca
              CEBRASPE.
            </p>

            <div className="flex items-center gap-2 text-xs">
              <div className="px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                +5.000 questões
              </div>
              <div className="px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400">
                Atualizado 2026
              </div>
            </div>

            {/* 💬 FRASE MOTIVACIONAL */}
            <div className="relative px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-slate-700/50">
              <div className="absolute top-0 left-4 text-2xl text-blue-500/20 select-none">
                "
              </div>
              <p className="text-xs text-blue-300 italic leading-relaxed">
                {frase}
              </p>
              <div className="absolute bottom-0 right-4 text-2xl text-blue-500/20 select-none">
                "
              </div>
            </div>

            {/* TECNOLOGIAS */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {tecnologias.map((tech: Tecnologia, index: number) => (
                <span
                  key={`${tech.name}-${index}`}
                  className="text-[10px] px-2 py-1 rounded-md bg-slate-800/60 text-slate-400 hover:bg-slate-700/60 hover:text-slate-200 transition-all duration-200 cursor-default"
                >
                  {tech.name} {tech.version}
                </span>
              ))}
            </div>
          </motion.div>

          {/* SEÇÃO LINKS RÁPIDOS */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Links Rápidos
            </h3>
            <ul className="space-y-2.5">
              {linksRapidos.map((link: LinkItem) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group flex items-center justify-between text-slate-400 hover:text-white transition-all duration-200 text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-blue-400/50 group-hover:text-blue-400 transition-colors">
                        {renderIcon(link.icon)}
                      </span>
                      {link.label}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* SEÇÃO RECURSOS */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Recursos
            </h3>
            <ul className="space-y-2.5">
              {recursos.map((item: RecursoItem, index: number) => (
                <li
                  key={`${item.name}-${index}`}
                  className="text-slate-400 text-sm hover:text-slate-200 transition-colors duration-200 cursor-default flex items-center gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-blue-400/50" />
                  {item.name}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* DIVIDER COM GRADIENTE */}
        <div className="my-10 lg:my-12 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />

        {/* DEV BADGE COM ANIMAÇÃO */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex justify-center mb-8"
        >
          <div className="group px-5 py-2.5 rounded-full bg-slate-900/80 border border-slate-700 shadow-lg backdrop-blur-md hover:scale-[1.02] hover:border-slate-600 transition-all duration-300">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Coffee className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
              <span>Desenvolvido com</span>
              <Heart className="w-3 text-red-400 animate-pulse" />
              <span>por</span>
              <span className="text-blue-400 font-medium">Gabriel Dev</span>
              <Shield className="w-3 text-emerald-400/50" />
            </div>
          </div>
        </motion.div>

        {/* BOTTOM BAR RESPONSIVA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="text-center sm:text-left">
            © {anoAtual} PRF Simulado. Todos os direitos reservados.
          </p>

          <div className="flex items-center gap-3 text-[10px]">
            <span className="flex items-center gap-1">
              <Zap className="w-3 text-yellow-500" />
              Plataforma independente
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span className="flex items-center gap-1">
              Não afiliado à PRF
              <Star className="w-3 text-amber-500" />
            </span>
          </div>
        </div>

        {/* BACK TO TOP BUTTON - RESPONSIVO */}
        <BackToTopButton />
      </div>
    </footer>
  );
};

// COMPONENTE BACK TO TOP
const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 p-2.5 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-110"
      aria-label="Voltar ao topo"
    >
      <ArrowUpRight className="w-4 h-4 rotate-[-45deg]" />
    </motion.button>
  );
};

export default Footer;
