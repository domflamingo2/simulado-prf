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
} from "@/components/layout/config/footer";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import {
  ArrowUp,
  Coffee,
  Heart,
  Shield,
  Sparkles,
  Star,
  Target,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { getTotalQuestoes } from "./../../data/index"; // Função para obter o total de questões

const Footer = () => {
  const anoAtual = new Date().getFullYear();
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0.8, 0.95], [0, 1]);

  const [frase, setFrase] = useState(frasesMotivacionais[0]);
  const [mounted, setMounted] = useState(false);
  const [totalQuestoes, setTotalQuestoes] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    const randomIndex = Math.floor(Math.random() * frasesMotivacionais.length);
    setFrase(frasesMotivacionais[randomIndex]);

    // Carregar total de questões
    const total = getTotalQuestoes();
    setTotalQuestoes(total);
  }, []);

  const fadeInUp: Variants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const staggerContainer: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const renderIcon = (IconComponent: any) => {
    if (!IconComponent) return null;
    return <IconComponent className="w-4 h-4" />;
  };

  if (!mounted) return null;

  return (
    <footer className="relative border-t border-slate-800 bg-gradient-to-b from-slate-950 via-slate-950 to-black overflow-hidden">
      {/* Background Animado Otimizado */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 lg:w-[28rem] lg:h-[28rem] bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-96 sm:h-96 lg:w-[28rem] lg:h-[28rem] bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-indigo-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Grid Pattern Responsivo */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:30px_30px] sm:bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black,transparent)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Grid Principal */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12"
        >
          {/* Coluna 1: Sobre - 6 colunas no desktop */}
          <motion.div variants={fadeInUp} className="lg:col-span-6 space-y-5">
            {/* Logo e Título */}
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-blue-500/30 blur-md rounded-xl group-hover:blur-xl transition-all duration-300" />
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                  <Target className="w-5 h-5 text-white" />
                </div>
              </div>

              <div>
                <h2 className="font-bold text-xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  PRF Simulado
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-800/50 px-1.5 py-0.5 rounded">
                    Beta
                  </span>
                  <span className="w-1 h-1 rounded-full bg-slate-600" />
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-800/50 px-1.5 py-0.5 rounded">
                    v2.0.0
                  </span>
                </div>
              </div>
            </div>

            {/* Descrição */}
            <p className="text-slate-400 text-sm leading-relaxed">
              Plataforma completa para sua aprovação na PRF com foco na banca
              CEBRASPE. Simulados, treinos específicos e estatísticas
              detalhadas.
            </p>

            {/* Badges de Estatísticas - Dinâmico */}
            <div className="flex flex-wrap gap-2">
              <div className="group px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/15 transition-all duration-300">
                <span className="text-xs text-emerald-400 font-medium">
                  {totalQuestoes !== null
                    ? `+${totalQuestoes.toLocaleString()} questões`
                    : "Carregando..."}
                </span>
              </div>
            </div>

            {/* Frase Motivacional */}
            <div className="relative px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-slate-700/50 backdrop-blur-sm overflow-hidden">
              <div className="absolute top-0 left-3 text-3xl text-blue-500/20 select-none">
                "
              </div>
              <p className="text-xs text-blue-300/90 italic leading-relaxed pl-2 pr-6">
                {frase}
              </p>
              <div className="absolute bottom-0 right-3 text-3xl text-blue-500/20 select-none">
                "
              </div>
              <Sparkles className="absolute bottom-1 right-1 w-3 h-3 text-blue-500/30" />
            </div>

            {/* Tecnologias */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {tecnologias.map((tech: Tecnologia, index: number) => (
                <span
                  key={`${tech.name}-${index}`}
                  className="text-[10px] font-mono px-2 py-1 rounded-md bg-slate-800/60 text-slate-400 hover:bg-slate-700/60 hover:text-slate-200 hover:scale-105 transition-all duration-200 cursor-default"
                >
                  {tech.name} {tech.version}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Coluna 2: Links Rápidos - 3 colunas no desktop */}
          <motion.div variants={fadeInUp} className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full" />
              Links Rápidos
            </h3>
            <ul className="space-y-3">
              {linksRapidos.map((link: LinkItem, idx: number) => (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="group flex items-center justify-between text-slate-400 hover:text-white transition-all duration-200 text-sm"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="text-blue-400/50 group-hover:text-blue-400 transition-all duration-200">
                        {renderIcon(link.icon)}
                      </span>
                      <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                        {link.label}
                      </span>
                    </span>
                    <ArrowUp className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Coluna 3: Recursos - 3 colunas no desktop */}
          <motion.div variants={fadeInUp} className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-purple-400 to-pink-500 rounded-full" />
              Recursos
            </h3>
            <ul className="space-y-2.5">
              {recursos.map((item: RecursoItem, index: number) => (
                <motion.li
                  key={`${item.name}-${index}`}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="text-slate-400 text-sm hover:text-slate-200 transition-all duration-200 cursor-default flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-60 group-hover:opacity-100 transition-opacity" />
                  {item.name}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Divider com Gradiente */}
        <div className="my-10 lg:my-12">
          <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
        </div>

        {/* Dev Badge com Animação */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center mb-8"
        >
          <div className="group relative px-5 py-2.5 rounded-full bg-slate-900/80 border border-slate-700 shadow-lg backdrop-blur-md hover:scale-[1.02] hover:border-slate-600 transition-all duration-300">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Coffee className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
              <span>Desenvolvido com</span>
              <Heart className="w-3 text-red-400 animate-pulse" />
              <span>por</span>
              <span className="text-blue-400 font-medium hover:text-blue-300 transition-colors cursor-pointer">
                Gabriel Dev
              </span>
              <Shield className="w-3 text-emerald-400/50" />
            </div>
            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </motion.div>

        {/* Bottom Bar Responsiva */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="text-center sm:text-left">
            © {anoAtual} PRF Simulado. Todos os direitos reservados.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-[10px]">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3 text-yellow-500" />
              Plataforma independente
            </span>
            <span className="hidden sm:block w-1 h-1 rounded-full bg-slate-600" />
            <span className="flex items-center gap-1.5">
              Não afiliado à PRF
              <Star className="w-3 text-amber-500" />
            </span>
          </div>
        </div>

        {/* Back to Top Button */}
        <BackToTopButton opacity={opacity} />
      </div>
    </footer>
  );
};

// Componente Back to Top Melhorado
const BackToTopButton = ({ opacity }: { opacity: any }) => {
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

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  if (!isVisible) return null;

  return (
    <motion.button
      style={{ opacity }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-110 group"
      aria-label="Voltar ao topo"
    >
      <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform duration-200" />
      {/* Tooltip */}
      <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 text-[10px] font-medium text-white bg-slate-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
        Voltar ao topo
      </span>
    </motion.button>
  );
};

export default Footer;
