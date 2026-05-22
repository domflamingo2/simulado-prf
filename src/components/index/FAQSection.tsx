// src/components/como-funciona/FAQSection.tsx
"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { FAQS } from "@/constants/faqs";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  Filter,
  HelpCircle,
  MessageCircle,
  Search,
  Sparkles,
  ThumbsUp,
  TrendingUp,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { SectionTitle } from "./SectionTitle";

/* ================= ANIMAÇÃO ================= */

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" },
};

const staggerContainer = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

/* ================= SEARCH BAR ================= */

const SearchBar = ({ onSearch, onClear }: any) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: any) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <motion.div variants={fadeInUp} className="relative mb-5">
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-md transition-opacity duration-300 ${isFocused ? "opacity-100" : "opacity-0"}`}
      />

      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />

        <input
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Buscar dúvida..."
          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-800/50 border border-white/10 text-sm text-slate-200 placeholder:text-slate-500 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
        />

        {query && (
          <button
            onClick={() => {
              setQuery("");
              onClear();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-500 hover:text-white hover:bg-slate-700 transition-all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

/* ================= CATEGORY FILTER ================= */

const CategoryFilter = ({ categories, selected, onSelect }: any) => (
  <motion.div variants={fadeInUp} className="flex flex-wrap gap-2 mb-5">
    <button
      onClick={() => onSelect(null)}
      className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
        !selected
          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
          : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
      }`}
    >
      Todas
    </button>

    {categories.map((c: string) => (
      <button
        key={c}
        onClick={() => onSelect(c)}
        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
          selected === c
            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
            : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
        }`}
      >
        {c}
      </button>
    ))}
  </motion.div>
);

/* ================= FAQ ITEM ================= */

const FAQItem = ({ pergunta, resposta, categoria, index }: any) => {
  const [open, setOpen] = useState(false);
  const [useful, setUseful] = useState<boolean | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      className="border-b border-white/10 last:border-0 group"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full py-4 flex justify-between items-center text-left group-hover:bg-white/5 px-3 -mx-3 rounded-lg transition-all duration-200"
      >
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm text-slate-200 group-hover:text-blue-400 transition-colors font-medium">
              {pergunta}
            </p>
            {categoria && (
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-400">
                {categoria}
              </span>
            )}
          </div>
        </div>

        <motion.div
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-3"
        >
          <ChevronRight
            className={`w-4 h-4 ${open ? "text-blue-400" : "text-slate-500"}`}
          />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-5 pl-3 pr-3 text-sm text-slate-300 leading-relaxed">
              {resposta}

              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/10">
                <span className="text-xs text-slate-500">
                  Esta resposta foi útil?
                </span>

                <div className="flex gap-1.5">
                  <button
                    onClick={() => setUseful(true)}
                    className={`p-1.5 rounded-lg transition-all duration-200 ${
                      useful === true
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "text-slate-500 hover:bg-slate-700 hover:text-emerald-400"
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setUseful(false)}
                    className={`p-1.5 rounded-lg transition-all duration-200 ${
                      useful === false
                        ? "bg-rose-500/20 text-rose-400"
                        : "text-slate-500 hover:bg-slate-700 hover:text-rose-400"
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5 rotate-180" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ================= HELPERS ================= */

const getCategory = (q: string) => {
  const t = q.toLowerCase();
  if (
    t.includes("salário") ||
    t.includes("remuneração") ||
    t.includes("benefício")
  )
    return "💰 Carreira";
  if (t.includes("ia") || t.includes("adaptativo")) return "🤖 IA";
  if (t.includes("offline") || t.includes("download")) return "📱 Offline";
  if (t.includes("questão") || t.includes("simulado")) return "📝 Simulado";
  if (t.includes("treino") || t.includes("prática")) return "🎯 Treino";
  if (t.includes("estatística") || t.includes("gráfico"))
    return "📊 Estatísticas";
  return "ℹ️ Geral";
};

/* ================= MAIN COMPONENT ================= */

export function FAQSection() {
  const { ref, isVisible } = useScrollReveal({ once: true, threshold: 0.1 });

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const processed = useMemo(
    () =>
      FAQS.map((f) => ({
        ...f,
        categoria: getCategory(f.pergunta),
      })),
    [],
  );

  const filtered = useMemo(() => {
    return processed.filter((f) => {
      const matchQuery =
        f.pergunta.toLowerCase().includes(query.toLowerCase()) ||
        f.resposta.toLowerCase().includes(query.toLowerCase());
      const matchCat = !category || f.categoria === category;
      return matchQuery && matchCat;
    });
  }, [processed, query, category]);

  const categories = [...new Set(processed.map((f) => f.categoria))];

  return (
    <div ref={ref} className="py-8">
      <SectionTitle
        icon={HelpCircle}
        title="Perguntas Frequentes"
        subtitle="Tire suas dúvidas sobre o simulado"
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <GlassCard className="p-5 sm:p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 to-purple-500/10 rounded-full blur-2xl" />

          <SearchBar onSearch={setQuery} onClear={() => setQuery("")} />

          <CategoryFilter
            categories={categories}
            selected={category}
            onSelect={setCategory}
          />

          {/* Header com contador */}
          <motion.div
            variants={fadeInUp}
            className="mb-4 flex justify-between items-center pb-2 border-b border-white/10"
          >
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-blue-500/20">
                <MessageCircle className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <span className="text-xs font-medium text-slate-400">
                {filtered.length}{" "}
                {filtered.length === 1 ? "resultado" : "resultados"}
              </span>
              {filtered.length > 0 && (
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-2.5 h-2.5" />
                  {Math.round((filtered.length / processed.length) * 100)}% do
                  total
                </span>
              )}
            </div>

            {(query || category) && (
              <button
                onClick={() => {
                  setQuery("");
                  setCategory(null);
                }}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
              >
                <Filter className="w-3 h-3" />
                Limpar filtros
              </button>
            )}
          </motion.div>

          {/* Lista de FAQs */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-1"
          >
            {filtered.length > 0 ? (
              filtered.map((faq, i) => <FAQItem key={i} {...faq} index={i} />)
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="text-5xl mb-3">🔍</div>
                <p className="text-slate-500 text-sm">
                  Nenhuma dúvida encontrada
                </p>
                <button
                  onClick={() => {
                    setQuery("");
                    setCategory(null);
                  }}
                  className="mt-3 px-4 py-2 rounded-lg bg-slate-800 text-blue-400 text-xs hover:bg-slate-700 transition-all"
                >
                  Limpar filtros
                </button>
              </motion.div>
            )}
          </motion.div>

          {/* Dica adicional */}
          {filtered.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-5 pt-3 border-t border-white/10 text-center"
            >
              <p className="text-[10px] text-slate-500 flex items-center justify-center gap-1.5">
                <Sparkles className="w-3 h-3 text-yellow-500" />
                Não encontrou sua dúvida? Entre em contato conosco!
              </p>
            </motion.div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
}
