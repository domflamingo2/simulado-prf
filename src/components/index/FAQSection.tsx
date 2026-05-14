"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { FAQS } from "@/constants/faqs";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  HelpCircle,
  MessageCircle,
  Search,
  ThumbsUp,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { SectionTitle } from "./SectionTitle";

/* ================= ANIMAÇÃO ================= */

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

/* ================= SEARCH ================= */

const SearchBar = ({ onSearch, onClear }: any) => {
  const [query, setQuery] = useState("");

  const handleChange = (e: any) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <motion.div variants={fadeInUp} className="relative mb-5">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />

      <input
        value={query}
        onChange={handleChange}
        placeholder="Buscar dúvida..."
        className="w-full pl-9 pr-10 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-slate-200 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none transition"
      />

      {query && (
        <button
          onClick={() => {
            setQuery("");
            onClear();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          <X className="w-4 h-4 text-slate-500 hover:text-white" />
        </button>
      )}
    </motion.div>
  );
};

/* ================= CATEGORY ================= */

const CategoryFilter = ({ categories, selected, onSelect }: any) => (
  <motion.div variants={fadeInUp} className="flex flex-wrap gap-2 mb-5">
    <button
      onClick={() => onSelect(null)}
      className={`px-3 py-1.5 rounded-full text-xs ${
        !selected
          ? "bg-blue-500 text-white"
          : "bg-white/5 text-slate-400 hover:bg-white/10"
      }`}
    >
      Todas
    </button>

    {categories.map((c: string) => (
      <button
        key={c}
        onClick={() => onSelect(c)}
        className={`px-3 py-1.5 rounded-full text-xs ${
          selected === c
            ? "bg-blue-500 text-white"
            : "bg-white/5 text-slate-400 hover:bg-white/10"
        }`}
      >
        {c}
      </button>
    ))}
  </motion.div>
);

/* ================= ITEM ================= */

const FAQItem = ({ pergunta, resposta, categoria, index }: any) => {
  const [open, setOpen] = useState(false);
  const [useful, setUseful] = useState<boolean | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className="border-b border-white/10"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full py-4 flex justify-between items-center text-left group"
      >
        <div>
          <p className="text-sm text-slate-200 group-hover:text-blue-400 transition">
            {pergunta}
          </p>
          {categoria && (
            <span className="text-[10px] text-slate-500">{categoria}</span>
          )}
        </div>

        <ChevronRight
          className={`w-4 h-4 transition ${
            open ? "rotate-90 text-blue-400" : "text-slate-500"
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-4 text-sm text-slate-300">
              {resposta}

              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/10">
                <span className="text-xs text-slate-500">Foi útil?</span>

                <button
                  onClick={() => setUseful(true)}
                  className={`p-1 ${
                    useful === true
                      ? "text-emerald-400"
                      : "text-slate-500 hover:text-emerald-400"
                  }`}
                >
                  <ThumbsUp className="w-3 h-3" />
                </button>

                <button
                  onClick={() => setUseful(false)}
                  className={`p-1 ${
                    useful === false
                      ? "text-rose-400"
                      : "text-slate-500 hover:text-rose-400"
                  }`}
                >
                  <ThumbsUp className="w-3 h-3 rotate-180" />
                </button>
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
  if (t.includes("salário")) return "Carreira";
  if (t.includes("ia")) return "IA";
  if (t.includes("offline")) return "Offline";
  return "Geral";
};

/* ================= MAIN ================= */

export function FAQSection() {
  const { ref } = useScrollReveal({ once: true });

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
    <div ref={ref}>
      <SectionTitle
        icon={HelpCircle}
        title="Perguntas Frequentes"
        subtitle="Tire suas dúvidas"
      />

      <GlassCard className="p-4 sm:p-6">
        <SearchBar onSearch={setQuery} onClear={() => setQuery("")} />

        <CategoryFilter
          categories={categories}
          selected={category}
          onSelect={setCategory}
        />

        {/* HEADER LIMPO */}
        <motion.div
          variants={fadeInUp}
          className="mb-5 flex justify-between items-center"
        >
          <span className="text-sm text-slate-400 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-blue-400" />
            {filtered.length} resultados
          </span>

          {(query || category) && (
            <button
              onClick={() => {
                setQuery("");
                setCategory(null);
              }}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              Limpar filtros
            </button>
          )}
        </motion.div>

        {/* LISTA */}
        <div>
          {filtered.length > 0 ? (
            filtered.map((faq, i) => <FAQItem key={i} {...faq} index={i} />)
          ) : (
            <div className="text-center py-10 text-slate-500">
              Nenhuma dúvida encontrada
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
