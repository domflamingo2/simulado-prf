"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Award,
  BarChart3,
  BookOpen,
  Brain,
  Briefcase,
  Building2,
  Calendar,
  Car,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  Flame,
  GraduationCap,
  HeartPulse,
  HelpCircle,
  Home,
  Keyboard,
  Medal,
  PiggyBank,
  Plane,
  Play,
  RotateCcw,
  Save,
  Share2,
  Shield,
  Sparkles,
  Stethoscope,
  Target,
  TrendingUp,
  Trophy,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";

import GlassCard from "@/components/ui/GlassCard";

// ═══════════════════════════════════════════════════════════
// ANIMAÇÕES
// ═══════════════════════════════════════════════════════════

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// ═══════════════════════════════════════════════════════════
// COMPONENTES
// ═══════════════════════════════════════════════════════════

const SectionTitle = ({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: typeof Trophy;
  title: string;
  subtitle?: string;
}) => (
  <div className="mb-8">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
        <Icon className="w-6 h-6 text-blue-400" />
      </div>
      <h2 className="text-2xl font-bold text-white">{title}</h2>
    </div>
    {subtitle && <p className="text-slate-400 ml-11">{subtitle}</p>}
  </div>
);

const RegraCard = ({
  titulo,
  valor,
  descricao,
  cor,
}: {
  titulo: string;
  valor: string;
  descricao: string;
  cor: "emerald" | "rose" | "slate";
}) => {
  const cores = {
    emerald:
      "from-emerald-500/20 to-emerald-600/10 text-emerald-400 border-emerald-500/30",
    rose: "from-rose-500/20 to-rose-600/10 text-rose-400 border-rose-500/30",
    slate:
      "from-slate-500/20 to-slate-600/10 text-slate-400 border-slate-500/30",
  };

  return (
    <div className={`p-6 rounded-xl bg-gradient-to-br ${cores[cor]} border`}>
      <div className="text-3xl font-bold mb-2">{valor}</div>
      <div className="font-semibold mb-1">{titulo}</div>
      <div className="text-sm opacity-80">{descricao}</div>
    </div>
  );
};

const ModoCard = ({
  icon: Icon,
  titulo,
  descricao,
  detalhes,
  cor,
}: {
  icon: typeof Play;
  titulo: string;
  descricao: string;
  detalhes: string[];
  cor: string;
}) => (
  <motion.div variants={fadeInUp} className="group">
    <GlassCard className="p-6 h-full hover:border-blue-500/30 transition-colors">
      <div
        className={`w-12 h-12 rounded-xl ${cor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{titulo}</h3>
      <p className="text-slate-400 text-sm mb-4">{descricao}</p>
      <ul className="space-y-2">
        {detalhes.map((detalhe, idx) => (
          <li
            key={idx}
            className="flex items-center gap-2 text-xs text-slate-500"
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
            {detalhe}
          </li>
        ))}
      </ul>
    </GlassCard>
  </motion.div>
);

const BeneficioCard = ({
  icon: Icon,
  titulo,
  descricao,
  valor,
  destaque,
}: {
  icon: typeof Home;
  titulo: string;
  descricao: string;
  valor?: string;
  destaque?: boolean;
}) => (
  <motion.div variants={fadeInUp}>
    <GlassCard
      className={`p-6 h-full ${destaque ? "border-amber-500/30 bg-amber-500/5" : ""}`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`p-3 rounded-xl ${destaque ? "bg-amber-500/20" : "bg-blue-500/10"}`}
        >
          <Icon
            className={`w-6 h-6 ${destaque ? "text-amber-400" : "text-blue-400"}`}
          />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-white mb-1 flex items-center gap-2">
            {titulo}
            {destaque && <Sparkles className="w-4 h-4 text-amber-400" />}
          </h3>
          <p className="text-slate-400 text-sm mb-2">{descricao}</p>
          {valor && (
            <div className="text-lg font-bold text-emerald-400">{valor}</div>
          )}
        </div>
      </div>
    </GlassCard>
  </motion.div>
);

const CarreiraEtapa = ({
  numero,
  titulo,
  descricao,
  tempo,
}: {
  numero: number;
  titulo: string;
  descricao: string;
  tempo: string;
}) => (
  <div className="relative pl-8 pb-8 last:pb-0 border-l-2 border-slate-700 last:border-0">
    <div className="absolute left-0 top-0 -translate-x-1/2 w-8 h-8 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center text-blue-400 font-bold text-sm">
      {numero}
    </div>
    <div className="bg-slate-800/50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-bold text-white">{titulo}</h4>
        <span className="text-xs text-slate-500 bg-slate-700 px-2 py-1 rounded">
          {tempo}
        </span>
      </div>
      <p className="text-slate-400 text-sm">{descricao}</p>
    </div>
  </div>
);

const FAQItem = ({
  pergunta,
  resposta,
}: {
  pergunta: string;
  resposta: string;
}) => {
  const [aberto, setAberto] = useState(false);

  return (
    <div className="border-b border-slate-800 last:border-0">
      <button
        onClick={() => setAberto(!aberto)}
        className="w-full py-4 flex items-center justify-between text-left hover:bg-slate-800/30 px-4 -mx-4 rounded-lg transition-colors"
      >
        <span className="font-medium text-slate-200 pr-4">{pergunta}</span>
        <ChevronRight
          className={`w-5 h-5 text-slate-500 flex-shrink-0 transition-transform ${aberto ? "rotate-90" : ""}`}
        />
      </button>
      {aberto && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="pb-4 text-slate-400 text-sm leading-relaxed"
        >
          {resposta}
        </motion.div>
      )}
    </div>
  );
};

const DepoimentoCard = ({
  nome,
  cargo,
  texto,
  aprovado,
}: {
  nome: string;
  cargo: string;
  texto: string;
  aprovado?: boolean;
}) => (
  <GlassCard className="p-6 h-full">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
        {nome.charAt(0)}
      </div>
      <div>
        <h4 className="font-bold text-white">{nome}</h4>
        <p className="text-xs text-slate-400">{cargo}</p>
      </div>
      {aprovado && (
        <div className="ml-auto px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          Aprovado
        </div>
      )}
    </div>
    <p className="text-slate-300 text-sm italic leading-relaxed">"{texto}"</p>
  </GlassCard>
);

// ═══════════════════════════════════════════════════════════
// CONTEÚDO
// ═══════════════════════════════════════════════════════════

const MODOS = [
  {
    icon: Play,
    titulo: "Simulado Completo",
    descricao: "Experiência fiel à prova real da PRF",
    detalhes: [
      "60 questões",
      "4 horas de duração",
      "Mesma distribuição CEBRASPE",
      "Ambiente de prova real",
    ],
    cor: "bg-blue-500",
  },
  {
    icon: Zap,
    titulo: "Modo Turbo",
    descricao: "Treino rápido para revisão intensiva",
    detalhes: [
      "50 questões aleatórias",
      "40 minutos",
      "Todas as disciplinas",
      "Foco em velocidade",
    ],
    cor: "bg-amber-500",
  },
  {
    icon: BookOpen,
    titulo: "Treino Específico",
    descricao: "Foque na sua disciplina mais fraca",
    detalhes: [
      "Escolha a disciplina",
      "Explicação imediata",
      "Sem limite de tempo",
      "Aprendizado dirigido",
    ],
    cor: "bg-emerald-500",
  },
  {
    icon: XCircle,
    titulo: "Revisar Erros",
    descricao: "Banco inteligente de questões erradas",
    detalhes: [
      "Histórico de erros",
      "Repetição espaçada",
      "Foco em pontos fracos",
      "Remoção após acerto",
    ],
    cor: "bg-rose-500",
  },
  {
    icon: Brain,
    titulo: "Adaptativo IA",
    descricao: "Inteligência artificial personaliza seu treino",
    detalhes: [
      "Analisa seu desempenho",
      "Prioriza disciplinas fracas",
      "Maior probabilidade de erros",
      "Evolução contínua",
    ],
    cor: "bg-purple-500",
  },
  {
    icon: BarChart3,
    titulo: "Estatísticas",
    descricao: "Análise profunda do seu desempenho",
    detalhes: [
      "Gráficos de evolução",
      "Por disciplina",
      "Heatmap de estudos",
      "Comparativo temporal",
    ],
    cor: "bg-cyan-500",
  },
];

const BENEFICIOS = [
  {
    icon: PiggyBank,
    titulo: "Salário Inicial",
    descricao:
      "Remuneração competitiva para início de carreira na administração pública federal",
    valor: "R$ 5.000 - R$ 7.000",
    destaque: true,
  },
  {
    icon: TrendingUp,
    titulo: "Progressão na Carreira",
    descricao:
      "Aumentos periódicos por tempo de serviço e capacitação profissional",
    valor: "Até R$ 15.000+",
    destaque: true,
  },
  {
    icon: Stethoscope,
    titulo: "Plano de Saúde",
    descricao: "Assistência médica e odontológica para você e dependentes",
    destaque: false,
  },
  {
    icon: GraduationCap,
    titulo: "Auxílio Educação",
    descricao:
      "Incentivo à capacitação profissional e cursos de especialização",
    destaque: false,
  },
  {
    icon: Home,
    titulo: "Auxílio Moradia",
    descricao: "Benefício para quem precisa se deslocar para outra cidade",
    destaque: false,
  },
  {
    icon: Car,
    titulo: "Auxílio Transporte",
    descricao: "Reembolso de despesas com locomoção para o trabalho",
    destaque: false,
  },
  {
    icon: Plane,
    titulo: "Férias Anuais",
    descricao:
      "30 dias de recesso remunerado, com possibilidade de venda de 1/3",
    destaque: false,
  },
  {
    icon: HeartPulse,
    titulo: "Previdência Privada",
    descricao: "Complementação da aposentadoria através do Funpresp",
    destaque: false,
  },
  {
    icon: Briefcase,
    titulo: "Estabilidade",
    descricao:
      "Cargo público federal com estabilidade após 3 anos de efetivo exercício",
    destaque: true,
  },
  {
    icon: Medal,
    titulo: "Gratificações",
    descricao:
      "Adicionais por insalubridade, periculosidade e serviços extraordinários",
    destaque: false,
  },
  {
    icon: Building2,
    titulo: "Lazer e Convênios",
    descricao:
      "Acesso a clubes, parques e convênios com instituições de ensino",
    destaque: false,
  },
  {
    icon: Users,
    titulo: "Licenças Especiais",
    descricao:
      "Licença maternidade/paternidade ampliada, licença para tratamento de saúde",
    destaque: false,
  },
];

const FAQS = [
  {
    pergunta: "Como funciona a pontuação CEBRASPE?",
    resposta:
      "A banca CEBRASPE utiliza o sistema de acerto/erro: cada acerto vale +1 ponto, cada erro vale -1 ponto, e questões em branco valem 0. Isso significa que um erro anula um acerto. Nossa plataforma replica exatamente essa regra para você treinar na mesma condição da prova real.",
  },
  {
    pergunta: "Meus dados são salvos onde?",
    resposta:
      "Todos os dados são armazenados localmente no seu navegador (localStorage). Nada é enviado para servidores externos. Você pode exportar seus dados a qualquer momento para fazer backup ou transferir para outro dispositivo.",
  },
  {
    pergunta: "Posso usar offline?",
    resposta:
      "Sim! Após carregar a página uma vez, você pode usar sem internet. As questões e seu progresso ficam disponíveis localmente. Perfeito para estudar em qualquer lugar.",
  },
  {
    pergunta: "Como o modo Adaptativo funciona?",
    resposta:
      "A IA analisa seu histórico de erros e identifica quais disciplinas você tem maior dificuldade. Ao iniciar um simulado adaptativo, o sistema seleciona mais questões dessas áreas, aumentando a probabilidade de você enfrentar seus pontos fracos e melhorar neles.",
  },
  {
    pergunta: "O que é o sistema de níveis e XP?",
    resposta:
      "Gamificação para manter sua motivação! Você ganha XP ao completar simulados, manter sequências de estudo (streaks) e desbloquear conquistas. Subir de nível desbloqueia novos recursos visuais e acompanhamento de progresso.",
  },
  {
    pergunta: "Como funciona o banco de erros?",
    resposta:
      "Toda questão que você erra é automaticamente salva no banco de erros. Você pode revisá-las a qualquer momento no modo 'Revisar Erros'. Ao acertar uma questão nesse modo, ela é removida do banco. O sistema também conta quantas vezes você errou cada questão.",
  },
  {
    pergunta: "Qual o salário real de um Agente Administrativo da PRF?",
    resposta:
      "O salário inicial varia entre R$ 5.000 e R$ 7.000, dependendo da localidade (auxílio moradia em algumas regiões). Com gratificações, progressões e benefícios, é possível alcançar R$ 10.000 a R$ 15.000 ao longo da carreira. Além disso, há plano de saúde, previdência complementar e estabilidade garantida.",
  },
];

// ═══════════════════════════════════════════════════════════
// PÁGINA PRINCIPAL
// ═══════════════════════════════════════════════════════════

export default function ComoFuncionaPage() {
  const prefersReducedMotion = useReducedMotion();
  const [copiado, setCopiado] = useState(false);

  const compartilhar = useCallback(() => {
    const url = window.location.origin;
    navigator.clipboard.writeText(url);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  PRF Simulado
                </h1>
                <p className="text-xs text-slate-400">Banca CEBRASPE</p>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={compartilhar}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors text-sm"
              >
                {copiado ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    Compartilhar
                  </>
                )}
              </button>
              <Link
                href="/"
                className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors text-sm font-medium"
              >
                Começar Agora
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
        {/* Hero */}
        <section className="text-center">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              Plataforma completa para aprovação na PRF
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Como Funciona
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Simulados realistas da banca CEBRASPE, estatísticas detalhadas, IA
              adaptativa e gamificação para maximizar sua aprovação na
              <span className="text-white font-semibold">
                {" "}
                Polícia Rodoviária Federal
              </span>
              .
            </p>
          </motion.div>
        </section>

        {/* REMUNERAÇÃO E BENEFÍCIOS - NOVA SEÇÃO DESTACADA */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 rounded-3xl blur-3xl" />

          <div className="relative">
            <SectionTitle
              icon={PiggyBank}
              title="Remuneração e Benefícios"
              subtitle="Sua recompensa pela dedicação: carreira estável e bem remunerada na PRF"
            />

            {/* Destaque Salarial */}
            <GlassCard className="p-8 mb-6 border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <p className="text-slate-400 text-sm mb-2">Salário Inicial</p>
                  <p className="text-4xl font-black text-emerald-400">
                    R$ 5.000+
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Líquido aproximado
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-2">
                    Após Progressões
                  </p>
                  <p className="text-4xl font-black text-blue-400">
                    R$ 10.000+
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Com gratificações
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-2">
                    Topo da Carreira
                  </p>
                  <p className="text-4xl font-black text-purple-400">
                    R$ 15.000+
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Especialista/Coordenador
                  </p>
                </div>
              </div>
            </GlassCard>

            {/* Grid de Benefícios */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {BENEFICIOS.map((beneficio) => (
                <BeneficioCard key={beneficio.titulo} {...beneficio} />
              ))}
            </motion.div>

            {/* Citação Motivacional */}
            <GlassCard className="mt-6 p-6 border-l-4 border-l-amber-500">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-amber-500/20">
                  <Flame className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-lg text-slate-200 italic mb-2">
                    "A PRF oferece não apenas uma remuneração justa, mas uma
                    carreira com propósito: proteger nossas rodovias e salvar
                    vidas. É trabalho com significado."
                  </p>
                  <p className="text-sm text-slate-500">
                    — Diretor da PRF, em entrevista sobre carreira
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* Carreira na PRF - NOVA SEÇÃO */}
        <section>
          <SectionTitle
            icon={Briefcase}
            title="Carreira na PRF"
            subtitle="Evolução profissional do Agente Administrativo"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <GlassCard className="p-6">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-400" />
                Etapas da Carreira
              </h3>
              <div className="space-y-0">
                <CarreiraEtapa
                  numero={1}
                  titulo="Agente Administrativo"
                  descricao="Entrada na carreira. Período de estágio probatório de 3 anos."
                  tempo="0-3 anos"
                />
                <CarreiraEtapa
                  numero={2}
                  titulo="Especialista"
                  descricao="Aprovação em concurso de especialização ou por tempo de serviço."
                  tempo="3-8 anos"
                />
                <CarreiraEtapa
                  numero={3}
                  titulo="Coordenador"
                  descricao="Gestão de equipes e processos administrativos."
                  tempo="8-15 anos"
                />
                <CarreiraEtapa
                  numero={4}
                  titulo="Gerente/Diretor"
                  descricao="Alta gestão, planejamento estratégico e decisões institucionais."
                  tempo="15+ anos"
                />
              </div>
            </GlassCard>

            <div className="space-y-4">
              <GlassCard className="p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                  Jornada de Trabalho
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                    <span className="text-slate-300">Carga horária</span>
                    <span className="text-emerald-400 font-semibold">
                      40h semanais
                    </span>
                  </li>
                  <li className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                    <span className="text-slate-300">Horário flexível</span>
                    <span className="text-emerald-400 font-semibold">
                      Possível
                    </span>
                  </li>
                  <li className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                    <span className="text-slate-300">Home office</span>
                    <span className="text-emerald-400 font-semibold">
                      Parcial
                    </span>
                  </li>
                  <li className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                    <span className="text-slate-300">Férias anuais</span>
                    <span className="text-emerald-400 font-semibold">
                      30 dias
                    </span>
                  </li>
                </ul>
              </GlassCard>

              <GlassCard className="p-6 border-emerald-500/30 bg-emerald-500/5">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-6 h-6 text-emerald-400" />
                  <h3 className="font-bold text-white">
                    Estabilidade Garantida
                  </h3>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Após 3 anos de efetivo exercício, o servidor público federal
                  adquire estabilidade, garantindo segurança profissional para
                  você e sua família.
                </p>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* Regras CEBRASPE */}
        <section>
          <SectionTitle
            icon={Shield}
            title="Regra de Pontuação CEBRASPE"
            subtitle="O mesmo sistema da prova real, para você treinar na condição exata"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <RegraCard
              titulo="Acerto"
              valor="+1"
              descricao="Ganha 1 ponto a favor"
              cor="emerald"
            />
            <RegraCard
              titulo="Erro"
              valor="-1"
              descricao="Perde 1 ponto (anula um acerto)"
              cor="rose"
            />
            <RegraCard
              titulo="Em Branco"
              valor="0"
              descricao="Não altera a pontuação"
              cor="slate"
            />
          </div>

          <GlassCard className="mt-6 p-6">
            <div className="flex items-start gap-4">
              <HelpCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-white mb-2">
                  Exemplo prático
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Se você acerta 40 questões e erra 20, sua pontuação final é{" "}
                  <span className="text-emerald-400 font-bold">20 pontos</span>{" "}
                  (40 - 20 = 20). Se deixasse as 20 em branco, seriam{" "}
                  <span className="text-emerald-400 font-bold">40 pontos</span>.
                  Por isso, no CEBRASPE,{" "}
                  <span className="text-white">chutar não piora sua nota</span>{" "}
                  — mas acertar melhora!
                </p>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* Estrutura da Prova */}
        <section>
          <SectionTitle
            icon={BookOpen}
            title="Estrutura da Prova PRF"
            subtitle="Distribuição oficial de questões por disciplina"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard className="p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <span className="text-blue-400 font-bold">1</span>
                </div>
                Conhecimentos Básicos (24 questões)
              </h3>
              <ul className="space-y-3">
                {[
                  { nome: "Língua Portuguesa", qtd: 12 },
                  { nome: "Ética e Conduta Pública", qtd: 6 },
                  { nome: "Raciocínio Lógico", qtd: 6 },
                ].map((item) => (
                  <li
                    key={item.nome}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50"
                  >
                    <span className="text-slate-300">{item.nome}</span>
                    <span className="text-blue-400 font-bold">{item.qtd}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <span className="text-purple-400 font-bold">2</span>
                </div>
                Conhecimentos Específicos (36 questões)
              </h3>
              <ul className="space-y-3">
                {[
                  { nome: "Direito Constitucional", qtd: 6 },
                  { nome: "Direito Administrativo", qtd: 6 },
                  { nome: "Administração", qtd: 6 },
                  { nome: "Arquivologia", qtd: 6 },
                  { nome: "Informática", qtd: 6 },
                  { nome: "Legislação PRF", qtd: 6 },
                ].map((item) => (
                  <li
                    key={item.nome}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50"
                  >
                    <span className="text-slate-300">{item.nome}</span>
                    <span className="text-purple-400 font-bold">
                      {item.qtd}
                    </span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-400" />
            <p className="text-sm text-amber-300">
              <span className="font-semibold">Tempo total:</span> 4 horas para
              resolver as 60 questões
            </p>
          </div>
        </section>

        {/* Modos de Estudo */}
        <section>
          <SectionTitle
            icon={Zap}
            title="Modos de Estudo"
            subtitle="6 formas diferentes de treinar, cada uma para um objetivo específico"
          />

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {MODOS.map((modo) => (
              <ModoCard key={modo.titulo} {...modo} />
            ))}
          </motion.div>
        </section>

        {/* Gamificação */}
        <section>
          <SectionTitle
            icon={Trophy}
            title="Sistema de Progressão"
            subtitle="Gamificação para manter sua motivação em alta"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <Flame className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Streaks</h3>
              <p className="text-slate-400 text-sm">
                Mantenha sequências de dias estudando. Quanto mais dias
                consecutivos, maior o bônus de XP e visualizações especiais.
              </p>
            </GlassCard>

            <GlassCard className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Conquistas</h3>
              <p className="text-slate-400 text-sm">
                Desbloqueie badges por feitos especiais: primeiro simulado, 7
                dias de streak, velocista, cebraspe-master e mais.
              </p>
            </GlassCard>

            <GlassCard className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                <RotateCcw className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Níveis</h3>
              <p className="text-slate-400 text-sm">
                Suba de nível acumulando XP. Cada nível novo desbloqueia títulos
                exclusivos e acompanhamento visual de evolução.
              </p>
            </GlassCard>
          </div>
        </section>

        {/* Atalhos */}
        <section>
          <SectionTitle
            icon={Keyboard}
            title="Atalhos de Teclado"
            subtitle="Navegue mais rápido com comandos de teclado"
          />

          <GlassCard className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { tecla: "Ctrl + N", acao: "Novo simulado completo" },
                { tecla: "Ctrl + T", acao: "Modo Turbo" },
                { tecla: "Ctrl + E", acao: "Revisar erros" },
                { tecla: "Ctrl + S", acao: "Buscar modos" },
              ].map((atalho) => (
                <div
                  key={atalho.tecla}
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50"
                >
                  <kbd className="px-3 py-1.5 rounded bg-slate-700 text-slate-300 text-xs font-mono border border-slate-600">
                    {atalho.tecla}
                  </kbd>
                  <span className="text-sm text-slate-400">{atalho.acao}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </section>

        {/* Backup */}
        <section>
          <SectionTitle
            icon={Save}
            title="Backup e Privacidade"
            subtitle="Seus dados são seus. Sempre."
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <Shield className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2">100% Local</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Todos os dados são armazenados no navegador do seu
                    dispositivo. Nenhuma informação é enviada para servidores
                    externos. Você tem controle total sobre seus dados.
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <Download className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2">
                    Exporte quando quiser
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-3">
                    Faça backup dos seus simulados, conquistas e progresso em um
                    arquivo JSON. Importe em outro dispositivo e continue de
                    onde parou.
                  </p>
                  <p className="text-xs text-slate-500">
                    Disponível no Dashboard → Backup e Sincronização
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <SectionTitle
            icon={HelpCircle}
            title="Perguntas Frequentes"
            subtitle="Tire suas dúvidas sobre a plataforma"
          />

          <GlassCard className="p-6">
            <div className="space-y-2">
              {FAQS.map((faq) => (
                <FAQItem key={faq.pergunta} {...faq} />
              ))}
            </div>
          </GlassCard>
        </section>

        {/* CTA Final */}
        <section className="text-center">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-8 sm:p-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30"
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Sua aprovação começa aqui
            </h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Milhares de candidatos já usam nossa plataforma para conquistar
              uma carreira estável, bem remunerada e com propósito na PRF. O
              próximo pode ser você.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold transition-all hover:scale-105 shadow-lg shadow-blue-500/25"
              >
                <Play className="w-5 h-5" />
                Iniciar Primeiro Simulado
              </Link>
              <Link
                href="/estatisticas"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all"
              >
                <BarChart3 className="w-5 h-5" />
                Ver Estatísticas
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              © 2024 PRF Simulado. Plataforma de estudos independente.
            </p>
            <p className="text-slate-600 text-xs">
              Não afiliado à CEBRASPE ou PRF. Uso educacional.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
