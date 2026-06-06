// src/components/como-funciona/CarreiraSection.tsx
"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { AnimatePresence, motion, Variants } from "framer-motion";
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
  Rocket,
  Shield,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { useCallback, useState } from "react";
import { SectionTitle } from "./SectionTitle";

const fadeIn: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      type: "spring",
    },
  },
};

const ETAPAS = [
  {
    numero: 1,
    titulo: "Agente Administrativo",
    icon: Briefcase,
    descricao: "Entrada na carreira com estágio probatório e formação inicial.",
    tempo: "0-3 anos",
    salario: "R$ 5.000+",
    beneficios: [
      "Vale Alimentação",
      "Plano de saúde",
      "Capacitação",
      "Auxílio Creche",
    ],
    cor: "emerald",
  },
  {
    numero: 2,
    titulo: "Especialista",
    icon: Award,
    descricao: "Atuação técnica especializada com certificações.",
    tempo: "3-8 años",
    salario: "R$ 8.000+",
    beneficios: [
      "Gratificação Técnica",
      "Projetos Estratégicos",
      "Cursos Avançados",
    ],
    cor: "blue",
  },
  {
    numero: 3,
    titulo: "Coordenador",
    icon: Users,
    descricao: "Gestão de equipes e liderança estratégica.",
    tempo: "8-15 anos",
    salario: "R$ 11.000+",
    beneficios: [
      "Bônus de Liderança",
      "Participação Estratégica",
      "Carro",
      "Assessoria",
    ],
    cor: "purple",
  },
  {
    numero: 4,
    titulo: "Diretor",
    icon: Crown,
    descricao: "Alta gestão estratégica e direção.",
    tempo: "15+ anos",
    salario: "R$ 15.000+",
    beneficios: [
      "Executivo",
      "Viagens Nacionais",
      "Seguro de Vida",
      "Bônus Gestão",
    ],
    cor: "rose",
  },
];

interface EtapaProps {
  etapa: {
    numero: number;
    titulo: string;
    icon: React.ElementType;
    descricao: string;
    tempo: string;
    salario: string;
    beneficios: string[];
    cor: string;
  };
  isOpen: boolean;
  onClick: () => void;
}

const CarreiraEtapa = ({ etapa, isOpen, onClick }: EtapaProps) => {
  const Icon = etapa.icon;
  const cores: Record<string, string> = {
    emerald: "from-emerald-500 to-teal-500",
    blue: "from-blue-500 to-cyan-500",
    purple: "from-purple-500 to-pink-500",
    rose: "from-rose-500 to-red-500",
  };
  const gradiente = cores[etapa.cor] || cores.emerald;

  return (
    <motion.div variants={fadeIn} className="relative group">
      <div className="absolute left-6 top-6 bottom-0 w-px bg-gradient-to-b from-blue-500/40 via-purple-500/30 to-transparent" />

      <div className="flex gap-4">
        <div className="relative z-10">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradiente} flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20`}
          >
            {etapa.numero}
          </motion.div>
        </div>

        <div
          onClick={onClick}
          className={`flex-1 p-5 rounded-xl border cursor-pointer transition-all duration-300 
          ${
            isOpen
              ? "bg-gradient-to-br from-white/10 to-white/5 border-white/20 shadow-xl"
              : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-blue-500/30"
          }`}
        >
          <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-${etapa.cor}-500/20`}>
                <Icon className={`w-5 h-5 text-${etapa.cor}-400`} />
              </div>
              <div>
                <h4 className="text-white font-semibold text-base">
                  {etapa.titulo}
                </h4>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {etapa.tempo}
                </p>
              </div>
            </div>

            <span
              className={`text-xs font-bold text-${etapa.cor}-400 bg-${etapa.cor}-500/10 px-3 py-1 rounded-full`}
            >
              {etapa.salario}
            </span>
          </div>

          <p className="text-sm text-slate-300">{etapa.descricao}</p>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="mt-4 pt-4 border-t border-white/10"
              >
                <div className="flex flex-wrap gap-2">
                  {etapa.beneficios.map((b: string, i: number) => (
                    <span
                      key={i}
                      className={`text-xs bg-${etapa.cor}-500/10 text-${etapa.cor}-400 px-2 py-1 rounded-full flex items-center gap-1.5`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {b}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-end mt-3">
            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export function CarreiraSection() {
  const { ref, isVisible } = useScrollReveal({ once: true, threshold: 0.1 });
  const [open, setOpen] = useState<number | null>(null);

  const toggle = useCallback((id: number) => {
    setOpen((prev) => (prev === id ? null : id));
  }, []);

  const stats = [
    { label: "Carga Horária", value: "40h", icon: Clock, cor: "emerald" },
    { label: "Férias", value: "30 dias", icon: Calendar, cor: "blue" },
    { label: "Home Office", value: "Parcial", icon: Building2, cor: "purple" },
    { label: "Equipe", value: "15+ membros", icon: Users, cor: "cyan" },
  ];

  const salarios = [
    { nivel: "Início", valor: 5000, anos: 0 },
    { nivel: "4 anos", valor: 8000, anos: 4 },
    { nivel: "8 anos", valor: 11000, anos: 8 },
    { nivel: "15 anos", valor: 15000, anos: 15 },
  ];

  return (
    <section ref={ref} className="space-y-8 py-8">
      <SectionTitle
        icon={Sparkles}
        title="Carreira na PRF"
        subtitle="Evolução profissional e progressão de carreira"
      />

      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
        {/* Coluna Esquerda - Etapas */}
        <GlassCard className="p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 to-purple-500/10 rounded-full blur-2xl" />

          <div className="flex items-center gap-2 mb-6 pb-2 border-b border-white/10">
            <div className="p-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
              <Target className="w-3.5 h-3.5 text-white" />
            </div>
            <h3 className="text-base font-semibold text-white">
              Etapas da Carreira
            </h3>
            <span className="ml-auto text-[10px] text-slate-500">4 níveis</span>
          </div>

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

        {/* Coluna Direita - Informações complementares */}
        <div className="space-y-5">
          {/* Jornada */}
          <GlassCard className="p-5">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
              <div className="p-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500">
                <Calendar className="w-3.5 h-3.5 text-white" />
              </div>
              <h3 className="text-base font-semibold text-white">
                Jornada de Trabalho
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className={`p-3 rounded-xl bg-gradient-to-br from-${stat.cor}-500/10 to-${stat.cor}-600/5 border border-${stat.cor}-500/20 group hover:scale-105 transition-transform duration-200`}
                >
                  <stat.icon className={`w-4 h-4 text-${stat.cor}-400 mb-2`} />
                  <p className="text-[10px] text-slate-500">{stat.label}</p>
                  <p className="text-white font-bold text-sm">{stat.value}</p>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* Estabilidade */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4 }}
          >
            <GlassCard className="p-4 border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-emerald-600/5">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <Shield className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-400">
                    Estabilidade Garantida
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Após 3 anos de serviço público efetivo, você adquire
                    estabilidade na carreira.
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Progressão Salarial */}
          <GlassCard className="p-5">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
              <div className="p-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
                <DollarSign className="w-3.5 h-3.5 text-white" />
              </div>
              <h3 className="text-base font-semibold text-white">
                Progressão Salarial
              </h3>
              <TrendingUp className="ml-auto w-3.5 h-3.5 text-emerald-400" />
            </div>

            <div className="space-y-3">
              {salarios.map((item, i) => {
                const percent = (item.valor / 15000) * 100;
                return (
                  <motion.div
                    key={item.nivel}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isVisible ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">{item.nivel}</span>
                      <span className="text-emerald-400 font-mono">
                        R$ {item.valor.toLocaleString()}
                      </span>
                    </div>
                    <div className="relative bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={isVisible ? { width: `${percent}%` } : {}}
                        transition={{ duration: 0.8, delay: 0.6 + i * 0.1 }}
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Rocket className="w-3 h-3 text-blue-400" />
                  Potencial de crescimento
                </span>
                <span className="text-emerald-400">+200%</span>
              </div>
            </div>
          </GlassCard>

          {/* Badge motivacional */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center gap-2 text-[10px] text-slate-500"
          >
            <Star className="w-3 h-3 text-yellow-500" />
            <span>Carreira com estabilidade e reconhecimento</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
