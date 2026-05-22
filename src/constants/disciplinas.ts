type DisciplinaCor = {
  bg: string;
  text: string;
  border: string;
  light: string;
};

export const DISCIPLINAS_NOME: Record<string, string> = {
  PORTUGUES: "Língua Portuguesa",
  ETICA: "Ética e Conduta",
  RACIOCINIO_LOGICO: "Raciocínio Lógico",
  DIREITO_CONSTITUCIONAL: "Direito Constitucional",
  DIREITO_ADMINISTRATIVO: "Direito Administrativo",
  ADMINISTRACAO: "Administração",
  ARQUIVOLOGIA: "Arquivologia",
  INFORMATICA: "Informática",
  LEGISLACAO_PRF: "Legislação PRF",
};

// Para o gráfico Radar - nomes abreviados
export const DISCIPLINAS_RADAR: Record<string, string> = {
  PORTUGUES: "Português",
  ETICA: "Ética",
  RACIOCINIO_LOGICO: "Rac. Lógico",
  DIREITO_CONSTITUCIONAL: "Dir. Const.",
  DIREITO_ADMINISTRATIVO: "Dir. Admin.",
  ADMINISTRACAO: "Administração",
  ARQUIVOLOGIA: "Arquivologia",
  INFORMATICA: "Informática",
  LEGISLACAO_PRF: "Leg. PRF",
};

export const DISCIPLINAS_COR: Record<string, DisciplinaCor> = {
  PORTUGUES: {
    bg: "bg-blue-500/20",
    text: "text-blue-400",
    border: "border-blue-500/30",
    light: "bg-blue-500/10",
  },

  ETICA: {
    bg: "bg-purple-500/20",
    text: "text-purple-400",
    border: "border-purple-500/30",
    light: "bg-purple-500/10",
  },

  RACIOCINIO_LOGICO: {
    bg: "bg-cyan-500/20",
    text: "text-cyan-400",
    border: "border-cyan-500/30",
    light: "bg-cyan-500/10",
  },

  DIREITO_CONSTITUCIONAL: {
    bg: "bg-amber-500/20",
    text: "text-amber-400",
    border: "border-amber-500/30",
    light: "bg-amber-500/10",
  },

  DIREITO_ADMINISTRATIVO: {
    bg: "bg-orange-500/20",
    text: "text-orange-400",
    border: "border-orange-500/30",
    light: "bg-orange-500/10",
  },

  ADMINISTRACAO: {
    bg: "bg-emerald-500/20",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
    light: "bg-emerald-500/10",
  },

  ARQUIVOLOGIA: {
    bg: "bg-pink-500/20",
    text: "text-pink-400",
    border: "border-pink-500/30",
    light: "bg-pink-500/10",
  },

  INFORMATICA: {
    bg: "bg-indigo-500/20",
    text: "text-indigo-400",
    border: "border-indigo-500/30",
    light: "bg-indigo-500/10",
  },

  LEGISLACAO_PRF: {
    bg: "bg-red-500/20",
    text: "text-red-400",
    border: "border-red-500/30",
    light: "bg-red-500/10",
  },
};
