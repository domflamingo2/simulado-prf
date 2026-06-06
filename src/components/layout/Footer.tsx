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
import { getTotalQuestoes } from "@/data/questoes/index";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
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
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

// ─── Tipos internos ──────────────────────────────────────────────────────────

interface BackToTopProps {
  opacity: MotionValue<number>;
}

// ─── Constantes ──────────────────────────────────────────────────────────────

const ANO_ATUAL = new Date().getFullYear();
const SCROLL_THRESHOLD = 500;

// ─── Variantes de animação (criadas fora do componente — estáveis) ────────────

const makeVariants = (
  reducedMotion: boolean,
): { fadeInUp: Variants; stagger: Variants } => ({
  fadeInUp: {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reducedMotion ? 0 : 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  },
  stagger: {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.1,
        delayChildren: reducedMotion ? 0 : 0.2,
      },
    },
  },
});

// ─── Componentes auxiliares memorizados ──────────────────────────────────────

/** Renderiza ícone Lucide de forma segura, sem `any` */
const SafeIcon = memo(function SafeIcon({
  icon: Icon,
  className,
}: {
  icon: LucideIcon | undefined | null;
  className?: string;
}) {
  if (!Icon) return null;
  return <Icon className={className ?? "w-4 h-4"} aria-hidden="true" />;
});

/** Frase motivacional com fade entre trocas */
const FraseMotivacional = memo(function FraseMotivacional({
  frase,
}: {
  frase: string;
}) {
  return (
    <div
      className="relative px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-slate-700/50 backdrop-blur-sm overflow-hidden"
      aria-label="Frase motivacional"
    >
      {/* Aspas decorativas — aria-hidden para não poluir leitores de tela */}
      <span
        className="absolute top-0 left-3 text-3xl text-blue-500/20 select-none"
        aria-hidden="true"
      >
        &ldquo;
      </span>
      <AnimatePresence mode="wait">
        <motion.p
          key={frase}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.35 }}
          className="text-xs text-blue-300/90 italic leading-relaxed pl-2 pr-6"
        >
          {frase}
        </motion.p>
      </AnimatePresence>
      <span
        className="absolute bottom-0 right-3 text-3xl text-blue-500/20 select-none"
        aria-hidden="true"
      >
        &rdquo;
      </span>
      <Sparkles
        className="absolute bottom-1 right-1 w-3 h-3 text-blue-500/30"
        aria-hidden="true"
      />
    </div>
  );
});

/** Badge de total de questões */
const BadgeQuestoes = memo(function BadgeQuestoes({
  total,
}: {
  total: number | null;
}) {
  return (
    <div className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/15 transition-all duration-300">
      <span className="text-xs text-emerald-400 font-medium">
        {total !== null
          ? `+${total.toLocaleString("pt-BR")} questões`
          : "Carregando..."}
      </span>
    </div>
  );
});

/** Coluna de links rápidos */
const ColunLinksRapidos = memo(function ColunaLinksRapidos({
  links,
  fadeInUp,
}: {
  links: LinkItem[];
  fadeInUp: Variants;
}) {
  return (
    <motion.div variants={fadeInUp} className="lg:col-span-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
        <span
          className="w-1 h-4 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full"
          aria-hidden="true"
        />
        Links Rápidos
      </h3>
      <ul className="space-y-3" role="list">
        {links.map((link, idx) => (
          <motion.li
            key={link.label}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05, duration: 0.3 }}
          >
            <Link
              href={link.href}
              className="group flex items-center justify-between text-slate-400 hover:text-white transition-all duration-200 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
            >
              <span className="flex items-center gap-2.5">
                <span className="text-blue-400/50 group-hover:text-blue-400 transition-all duration-200">
                  <SafeIcon icon={link.icon} />
                </span>
                <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                  {link.label}
                </span>
              </span>
              {/* ✅ FIX: seta aponta para cima-direita, que é semântico para "ir para" */}
              <ArrowUp
                className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
                aria-hidden="true"
              />
            </Link>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
});

/** Coluna de recursos */
const ColunaRecursos = memo(function ColunaRecursos({
  items,
  fadeInUp,
}: {
  items: RecursoItem[];
  fadeInUp: Variants;
}) {
  return (
    <motion.div variants={fadeInUp} className="lg:col-span-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
        <span
          className="w-1 h-4 bg-gradient-to-b from-purple-400 to-pink-500 rounded-full"
          aria-hidden="true"
        />
        Recursos
      </h3>
      <ul className="space-y-2.5" role="list">
        {items.map((item, index) => (
          <motion.li
            key={`${item.name}-${index}`}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="text-slate-400 text-sm hover:text-slate-200 transition-all duration-200 cursor-default flex items-center gap-2 group"
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0"
              aria-hidden="true"
            />
            {item.name}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
});

// ─── BackToTopButton ──────────────────────────────────────────────────────────

/**
 * ✅ FIX: `opacity` da MotionValue do scroll NÃO controla visibilidade diretamente —
 * usamos estado local `isVisible` para montar/desmontar e a MotionValue só para
 * o fade suave via `style`. Isso evita o botão "fantasma" clicável quando invisível.
 */
const BackToTopButton = memo(function BackToTopButton({
  opacity,
}: BackToTopProps) {
  const [isVisible, setIsVisible] = useState(false);
  // ✅ FIX: useRef para evitar recriação do listener e permitir cleanup correto
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      // ✅ FIX: throttle via rAF para não bloquear a thread principal
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        setIsVisible(window.scrollY > SCROLL_THRESHOLD);
        rafRef.current = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Checar posição inicial (caso a página já esteja scrollada)
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // ✅ FIX: AnimatePresence para entrada/saída suave sem deixar elemento "fantasma"
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          key="back-to-top"
          style={{ opacity }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-blue-500/30 transition-shadow duration-300 hover:scale-110 group"
          aria-label="Voltar ao topo da página"
          title="Voltar ao topo"
        >
          <ArrowUp
            className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform duration-200"
            aria-hidden="true"
          />
          {/* ✅ FIX: pointer-events-none no tooltip para não bloquear cliques */}
          <span
            className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 text-[10px] font-medium text-white bg-slate-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none select-none"
            role="tooltip"
          >
            Voltar ao topo
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
});

// ─── Footer principal ─────────────────────────────────────────────────────────

const Footer = () => {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  // ✅ FIX: range [0.8, 1.0] — usar 1.0 em vez de 0.95 evita corte prematuro no iOS Safari
  const opacity = useTransform(scrollYProgress, [0.8, 1.0], [0, 1]);

  const [frase, setFrase] = useState(frasesMotivacionais[0]);
  const [mounted, setMounted] = useState(false);
  const [totalQuestoes, setTotalQuestoes] = useState<number | null>(null);

  // ✅ FIX: variantes memorizadas — não recriadas a cada render
  const { fadeInUp, stagger } = useMemo(
    () => makeVariants(!!shouldReduceMotion),
    [shouldReduceMotion],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFrase(
      frasesMotivacionais[
        Math.floor(Math.random() * frasesMotivacionais.length)
      ],
    );

    setTotalQuestoes(getTotalQuestoes());
  }, []);

  // ✅ FIX: suprimir renderização no servidor para evitar hydration mismatch
  // de conteúdo dinâmico (frase aleatória, totalQuestoes, anoAtual)
  if (!mounted) return null;

  return (
    <footer
      className="relative border-t border-slate-800 bg-gradient-to-b from-slate-950 via-slate-950 to-black overflow-hidden"
      role="contentinfo"
      aria-label="Rodapé do site"
    >
      {/* ── Background Animado ───────────────────────────────────────────── */}
      {/* ✅ FIX: pointer-events-none E aria-hidden para não aparecer em leitores de tela */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        aria-hidden="true"
      >
        <motion.div
          className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 lg:w-[28rem] lg:h-[28rem] bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
          animate={shouldReduceMotion ? {} : { x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-96 sm:h-96 lg:w-[28rem] lg:h-[28rem] bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-indigo-500/20 rounded-full blur-3xl"
          animate={shouldReduceMotion ? {} : { x: [0, -30, 0], y: [0, -15, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* ── Grid Pattern ─────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:30px_30px] sm:bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black,transparent)] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* ── Grid Principal ───────────────────────────────────────────────── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12"
        >
          {/* Coluna 1: Sobre — 6 colunas desktop */}
          <motion.div variants={fadeInUp} className="lg:col-span-6 space-y-5">
            {/* Logo e Título */}
            <div className="flex items-center gap-3">
              <div className="relative group" aria-hidden="true">
                <div className="absolute inset-0 bg-blue-500/30 blur-md rounded-xl group-hover:blur-xl transition-all duration-300" />
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                  <Target className="w-5 h-5 text-white" aria-hidden="true" />
                </div>
              </div>

              <div>
                {/* ✅ FIX: h2 no footer — semântica correta, não polui hierarquia da página */}
                <h2 className="font-bold text-xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  PRF Simulado
                </h2>
                <div
                  className="flex items-center gap-2 mt-0.5"
                  aria-label="Versão Beta 2.0.0"
                >
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-800/50 px-1.5 py-0.5 rounded">
                    Beta
                  </span>
                  <span
                    className="w-1 h-1 rounded-full bg-slate-600"
                    aria-hidden="true"
                  />
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

            {/* Badge de questões */}
            <div className="flex flex-wrap gap-2">
              <BadgeQuestoes total={totalQuestoes} />
            </div>

            {/* Frase motivacional */}
            <FraseMotivacional frase={frase} />

            {/* Stack de tecnologias */}
            <div
              className="flex flex-wrap gap-1.5 pt-1"
              role="list"
              aria-label="Tecnologias utilizadas"
            >
              {(tecnologias as Tecnologia[]).map((tech, index) => (
                <span
                  key={`${tech.name}-${index}`}
                  role="listitem"
                  className="text-[10px] font-mono px-2 py-1 rounded-md bg-slate-800/60 text-slate-400 hover:bg-slate-700/60 hover:text-slate-200 hover:scale-105 transition-all duration-200 cursor-default"
                  title={
                    tech.version ? `${tech.name} ${tech.version}` : tech.name
                  }
                >
                  {tech.name}
                  {tech.version && (
                    <span className="text-slate-600 ml-1">{tech.version}</span>
                  )}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Coluna 2: Links Rápidos — 3 colunas desktop */}
          <ColunLinksRapidos
            links={linksRapidos as LinkItem[]}
            fadeInUp={fadeInUp}
          />

          {/* Coluna 3: Recursos — 3 colunas desktop */}
          <ColunaRecursos
            items={recursos as RecursoItem[]}
            fadeInUp={fadeInUp}
          />
        </motion.div>

        {/* ── Divider ──────────────────────────────────────────────────────── */}
        <div className="my-10 lg:my-12" aria-hidden="true">
          <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
        </div>

        {/* ── Dev Badge ────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center mb-8"
        >
          <div className="group relative px-5 py-2.5 rounded-full bg-slate-900/80 border border-slate-700 shadow-lg backdrop-blur-md hover:scale-[1.02] hover:border-slate-600 transition-all duration-300">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Coffee
                className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform duration-300"
                aria-hidden="true"
              />
              <span>Desenvolvido com</span>
              {/* ✅ FIX: Heart precisa de tamanho explícito; "animate-pulse" está correto */}
              <Heart
                className="w-3 h-3 text-red-400 animate-pulse"
                aria-hidden="true"
              />
              <span>por</span>
              <span className="text-blue-400 font-medium hover:text-blue-300 transition-colors">
                Gabriel Dev
              </span>
              <Shield
                className="w-3 h-3 text-emerald-400/50"
                aria-hidden="true"
              />
            </div>
            {/* Glow sutil no hover */}
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              aria-hidden="true"
            />
          </div>
        </motion.div>

        {/* ── Bottom Bar ───────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          {/* ✅ FIX: usar <small> para copyright — semântica HTML correta */}
          <small className="text-center sm:text-left not-italic">
            © {ANO_ATUAL} PRF Simulado. Todos os direitos reservados.
          </small>

          <div className="flex flex-wrap items-center justify-center gap-3 text-[10px]">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-yellow-500" aria-hidden="true" />
              Plataforma independente
            </span>
            <span
              className="hidden sm:block w-1 h-1 rounded-full bg-slate-600"
              aria-hidden="true"
            />
            <span className="flex items-center gap-1.5">
              Não afiliado à PRF
              <Star className="w-3 h-3 text-amber-500" aria-hidden="true" />
            </span>
          </div>
        </div>
      </div>

      {/* ── Back to Top ──────────────────────────────────────────────────── */}
      <BackToTopButton opacity={opacity} />
    </footer>
  );
};

export default Footer;
