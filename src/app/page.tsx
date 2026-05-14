// src/app/page.tsx
"use client";

import Footer from "@/components/layout/Footer";
import { Loader2 } from "lucide-react";
import { Suspense, lazy, useEffect } from "react";

// Componente de loading reutilizável
const SectionLoader = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} animate-pulse bg-slate-800/50 rounded-2xl flex items-center justify-center`}
  >
    <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
  </div>
);

// Lazy loading com nomes mais descritivos
const HeroSection = lazy(() =>
  import("../components/index/HeroSection").then((mod) => ({
    default: mod.HeroSection,
  })),
);

const BeneficiosSection = lazy(() =>
  import("../components/index/BeneficiosSection").then((mod) => ({
    default: mod.BeneficiosSection,
  })),
);

const CarreiraSection = lazy(() =>
  import("../components/index/CarreiraSection").then((mod) => ({
    default: mod.CarreiraSection,
  })),
);

const RegraCEBRASPESection = lazy(() =>
  import("../components/index/RegraCEBRASPESection").then((mod) => ({
    default: mod.RegraCEBRASPESection,
  })),
);

const EstruturaProvaSection = lazy(() =>
  import("../components/index/EstruturaProvaSection").then((mod) => ({
    default: mod.EstruturaProvaSection,
  })),
);

const ModosEstudoSection = lazy(() =>
  import("../components/index/ModosEstudoSection").then((mod) => ({
    default: mod.ModosEstudoSection,
  })),
);

const CalculadoraNota = lazy(() =>
  import("../components/index/CalculadoraNota").then((mod) => ({
    default: mod.CalculadoraNota,
  })),
);

const FAQSection = lazy(() =>
  import("../components/index/FAQSection").then((mod) => ({
    default: mod.FAQSection,
  })),
);

// Componente de scroll to top
const ScrollToTop = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!showScrollTop) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg transition-all hover:scale-110"
      aria-label="Voltar ao topo"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  );
};

// Componente Header separado para melhor organização
const PageHeader = () => (
  <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        <a href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 5v2m0 4v2m0 4v2M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              PRF Simulado
            </h1>
            <p className="text-xs text-slate-400">Banca CEBRASPE</p>
          </div>
        </a>

        <div className="flex items-center gap-3">
          <a
            href="/"
            className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors text-sm font-medium"
          >
            Começar Agora
          </a>
        </div>
      </div>
    </div>
  </header>
);

// Componente principal
export default function ComoFuncionaPage() {
  // Pré-carregar componentes críticos quando o mouse se aproxima do link
  useEffect(() => {
    const prefetchComponents = () => {
      const links = document.querySelectorAll('a[href="/"]');
      links.forEach((link) => {
        link.addEventListener("mouseenter", () => {
          // Pré-carregar componentes importantes
          import("../components/index/HeroSection");
          import("../components/index/BeneficiosSection");
        });
      });
    };

    prefetchComponents();
  }, []);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        Pular para conteúdo principal
      </a>

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
        <PageHeader />

        <main
          id="main-content"
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16 sm:space-y-20"
        >
          <Suspense fallback={<SectionLoader height="h-96" />}>
            <HeroSection />
          </Suspense>

          <Suspense fallback={<SectionLoader height="h-96" />}>
            <BeneficiosSection />
          </Suspense>

          <Suspense fallback={<SectionLoader height="h-64" />}>
            <CarreiraSection />
          </Suspense>

          <Suspense fallback={<SectionLoader height="h-64" />}>
            <RegraCEBRASPESection />
          </Suspense>

          <Suspense fallback={<SectionLoader height="h-64" />}>
            <EstruturaProvaSection />
          </Suspense>

          <Suspense fallback={<SectionLoader height="h-64" />}>
            <ModosEstudoSection />
          </Suspense>

          <Suspense fallback={<SectionLoader height="h-96" />}>
            <CalculadoraNota />
          </Suspense>

          <Suspense fallback={<SectionLoader height="h-64" />}>
            <FAQSection />
          </Suspense>
        </main>

        <Footer />
        <ScrollToTop />
      </div>
    </>
  );
}

// Import necessário
import { useState } from "react";
