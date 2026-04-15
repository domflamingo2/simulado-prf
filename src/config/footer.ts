// src/config/footer.ts

import {
  BarChart3,
  BookOpen,
  Clock,
  FileText,
  Home,
  Settings,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

// TIPAGEM PARA ÍCONES
export type IconComponent = React.ComponentType<{ className?: string }>;

// INTERFACE PARA LINKS
export interface LinkItem {
  href: string;
  label: string;
  icon: IconComponent;
  description?: string;
  isExternal?: boolean;
  badge?: string;
}

// INTERFACE PARA RECURSOS
export interface RecursoItem {
  name: string;
  description: string;
  icon: IconComponent;
  highlight?: boolean;
}

// INTERFACE PARA LINKS LEGAIS
export interface LegalItem {
  label: string;
  href: string;
  icon: IconComponent;
  description?: string;
  isExternal?: boolean;
}

// INTERFACE PARA TECNOLOGIAS
export interface Tecnologia {
  name: string;
  version: string;
  color?: string;
}

// ============ LINKS RÁPIDOS OTIMIZADOS ============
export const linksRapidos: LinkItem[] = [
  {
    href: "/",
    label: "Início",
    icon: Home,
    description: "Página principal",
  },
  {
    href: "/simulado",
    label: "Simulados",
    icon: FileText,
    description: "Teste seus conhecimentos",
    badge: "Popular",
  },
  {
    href: "/estatisticas",
    label: "Estatísticas",
    icon: BarChart3,
    description: "Acompanhe seu progresso",
  },
  {
    href: "/como-funciona",
    label: "Como Funciona",
    icon: Settings,
    description: "Guia da plataforma",
  },
  {
    href: "/questoes",
    label: "Banco de Questões",
    icon: BookOpen,
    description: "+5.000 questões",
    badge: "Novo",
  },
];

// ============ RECURSOS PRINCIPAIS ============
export const recursos: RecursoItem[] = [
  {
    name: "Simulados inteligentes",
    description: "Adaptados ao seu nível de conhecimento",
    icon: Zap,
    highlight: true,
  },
  {
    name: "Correção automática",
    description: "Resultados imediatos e detalhados",
    icon: Target,
  },
  {
    name: "Estatísticas detalhadas",
    description: "Análise completa do seu desempenho",
    icon: TrendingUp,
  },
  {
    name: "Questões comentadas",
    description: "Aprenda com explicações detalhadas",
    icon: Users,
    highlight: true,
  },
  {
    name: "Simulados cronometrados",
    description: "Treine para o dia da prova",
    icon: Clock,
  },
];

// ============ TECNOLOGIAS COM VERSÕES ============
export const tecnologias: Tecnologia[] = [
  { name: "Next.js", version: "14.2", color: "from-black to-gray-700" },
  { name: "React", version: "18.3", color: "from-cyan-500 to-blue-500" },
  { name: "TypeScript", version: "5.4", color: "from-blue-600 to-blue-400" },
  { name: "Tailwind CSS", version: "3.4", color: "from-teal-500 to-cyan-500" },
  {
    name: "Framer Motion",
    version: "11.0",
    color: "from-purple-500 to-pink-500",
  },
  { name: "Lucide Icons", version: "0.4", color: "from-red-500 to-orange-500" },
];

// ============ FRASES MOTIVACIONAIS EXPANDIDAS ============
export const frasesMotivacionais: string[] = [
  "✨ Sua aprovação começa hoje. Cada questão é um passo mais perto da PRF!",
  "🎯 Disciplina vence talento quando talento não trabalha duro.",
  "📚 O sucesso é a soma de pequenos esforços repetidos dia após dia.",
  "💪 A única maneira de fazer um excelente trabalho é amar o que você faz.",
  "🌟 Não espere por oportunidades, crie-as com cada simulado realizado.",
  "🚀 O limite é apenas uma linha imaginária que você decide cruzar ou não.",
  "🏆 Campeões não são feitos nos ringues, são feitos do suor e da dedicação.",
  "📈 Cada erro é uma lição, cada acerto é uma conquista.",
  "⏰ O agora é o momento mais importante. Comece hoje, colha amanhã.",
  "🔥 A consistência é mais importante que a intensidade. Mantenha o ritmo!",
  "🎓 Sonhe grande, estude maior, conquiste tudo.",
  "⚡ Pequenos progressos diários geram grandes resultados.",
];

// ============ INFORMAÇÕES ADICIONAIS ============
export const footerInfo = {
  version: "2.0.0",
  beta: true,
  year: new Date().getFullYear(),
  stats: {
    questions: 5000,
    users: 12500,
    simulados: 45000,
  },
  author: {
    name: "Gabriel Dev",
    role: "Full Stack Developer",
    github: "https://github.com/gabrieldev",
  },
};

// ============ LINKS ÚTEIS ADICIONAIS ============
export const linksUteis: LinkItem[] = [
  {
    href: "/faq",
    label: "FAQ",
    icon: Users,
    description: "Perguntas frequentes",
  },
];

// ============ HELPERS ============
export const getRandomMotivationalPhrase = (): string => {
  return frasesMotivacionais[
    Math.floor(Math.random() * frasesMotivacionais.length)
  ];
};

export const getTechStack = () => {
  return tecnologias.map((tech) => tech.name).join(" • ");
};

export const getFooterStats = () => {
  return footerInfo.stats;
};
