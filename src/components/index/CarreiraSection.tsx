"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Crown,
  DollarSign,
  Shield,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { useCallback, useState } from "react";
import { SectionTitle } from "./SectionTitle";

/* ================= ANIMAÇÕES ================= */

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

/* ================= ETAPAS ================= */

const ETAPAS = [
  {
    numero: 1,
    titulo: "Agente Administrativo",
    icon: Briefcase,
    descricao: "Entrada na carreira com estágio probatório.",
    tempo: "0-3 anos",
    salario: "R$ 5.000+",
    beneficios: ["Vale", "Plano de saúde", "Capacitação"],
  },
  {
    numero: 2,
    titulo: "Especialista",
    icon: Award,
    descricao: "Atuação técnica especializada.",
    tempo: "3-8 anos",
    salario: "R$ 8.000+",
    beneficios: ["Gratificação", "Projetos", "Cursos"],
  },
  {
    numero: 3,
    titulo: "Coordenador",
    icon: Users,
    descricao: "Gestão de equipes e liderança.",
    tempo: "8-15 anos",
    salario: "R$ 11.000+",
    beneficios: ["Bônus", "Liderança"],
  },
  {
    numero: 4,
    titulo: "Diretor",
    icon: Crown,
    descricao: "Alta gestão estratégica.",
    tempo: "15+ anos",
    salario: "R$ 15.000+",
    beneficios: ["Executivo", "Viagens"],
  },
];

/* ================= COMPONENTE ETAPA ================= */

const CarreiraEtapa = ({ etapa, isOpen, onClick }: any) => {
  const Icon = etapa.icon;

  return (
    <motion.div variants={fadeIn} className="relative">
      {/* Linha */}
      <div className="absolute left-6 top-6 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-purple-500/40 to-transparent" />

      <div className="flex gap-4">
        {/* Número */}
        <div className="relative z-10">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
            {etapa.numero}
          </div>
        </div>

        {/* Card */}
        <div
          onClick={onClick}
          className={`flex-1 p-5 rounded-xl border cursor-pointer transition-all duration-300 
          ${
            isOpen
              ? "bg-white/10 border-blue-500/40 shadow-lg shadow-blue-500/10"
              : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-blue-500/30"
          }`}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Icon className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-base">
                  {etapa.titulo}
                </h4>
                <p className="text-xs text-slate-400">{etapa.tempo}</p>
              </div>
            </div>

            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
              {etapa.salario}
            </span>
          </div>

          <p className="text-sm text-slate-300">{etapa.descricao}</p>

          {/* EXPAND */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-slate-700"
              >
                <div className="flex flex-wrap gap-2">
                  {etapa.beneficios.map((b: string, i: number) => (
                    <span
                      key={i}
                      className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {b}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Arrow */}
          <div className="flex justify-end mt-3">
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ================= COMPONENTE PRINCIPAL ================= */

export function CarreiraSection() {
  const { ref, isVisible } = useScrollReveal({ once: true });
  const [open, setOpen] = useState<number | null>(null);

  const toggle = useCallback((id: number) => {
    setOpen((prev) => (prev === id ? null : id));
  }, []);

  return (
    <section ref={ref} className="space-y-8">
      <SectionTitle
        icon={Sparkles}
        title="Carreira na PRF"
        subtitle="Evolução profissional moderna"
      />

      {/* GRID */}
      <div className="grid xl:grid-cols-[1.2fr_0.8fr] gap-6">
        {/* ESQUERDA */}
        <GlassCard className="p-6">
          <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-400" />
            Etapas da Carreira
          </h3>

          <div className="space-y-5">
            {ETAPAS.map((e) => (
              <CarreiraEtapa
                key={e.numero}
                etapa={e}
                isOpen={open === e.numero}
                onClick={() => toggle(e.numero)}
              />
            ))}
          </div>
        </GlassCard>

        {/* DIREITA */}
        <div className="space-y-4">
          {/* JORNADA */}
          <GlassCard className="p-6">
            <h3 className="text-white mb-4 font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              Jornada
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Carga", value: "40h", icon: Clock },
                { label: "Férias", value: "30 dias", icon: Calendar },
                { label: "Home", value: "Parcial", icon: Building2 },
                { label: "Equipe", value: "15+", icon: Users },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex flex-col gap-1"
                >
                  <item.icon className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-slate-400">{item.label}</span>
                  <span className="text-white font-bold text-sm">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* ESTABILIDADE */}
          <GlassCard className="p-6 border border-emerald-500/20 bg-emerald-500/5">
            <div className="flex gap-3">
              <Shield className="text-emerald-400" />
              <p className="text-sm text-slate-300">
                Estabilidade após 3 anos de serviço público.
              </p>
            </div>
          </GlassCard>

          {/* PROGRESSÃO */}
          <GlassCard className="p-6">
            <h3 className="text-sm text-slate-300 mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-400" />
              Progressão Salarial
            </h3>

            {[5000, 8000, 11000, 15000].map((val, i) => {
              const percent = (val / 15000) * 100;

              return (
                <div key={i} className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span>{i === 0 ? "Início" : `${i * 4} anos`}</span>
                    <span className="text-emerald-400">R$ {val}</span>
                  </div>

                  <div className="relative bg-slate-700 h-2 rounded-full">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
