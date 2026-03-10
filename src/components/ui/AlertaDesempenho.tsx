import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

type AlertType = "critico" | "alerta" | "info";

interface AlertaDesempenhoProps {
  tipo: AlertType;
  mensagem: string;
  acao?: { label: string; href: string };
}

const configs: Record<
  AlertType,
  { bg: string; border: string; text: string; icon: LucideIcon }
> = {
  critico: {
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    text: "text-rose-300",
    icon: require("lucide-react").AlertTriangle,
  },
  alerta: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-300",
    icon: require("lucide-react").RotateCcw,
  },
  info: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-300",
    icon: require("lucide-react").TrendingUp,
  },
};

export default function AlertaDesempenho({
  tipo,
  mensagem,
  acao,
}: AlertaDesempenhoProps) {
  const config = configs[tipo];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, y: -10, height: 0 }}
      className={`p-4 rounded-xl ${config.bg} border ${config.border} flex items-center gap-3`}
    >
      <Icon className={`w-5 h-5 ${config.text} flex-shrink-0`} />
      <div className="flex-1 min-w-0">
        <p className={`font-medium ${config.text} text-sm`}>{mensagem}</p>
      </div>
      {acao && (
        <Link
          href={acao.href}
          className={`
            px-3 py-1.5 rounded-lg ${config.bg} ${config.text} 
            text-xs font-semibold hover:bg-current/20 transition-colors 
            flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-current/50
          `}
        >
          {acao.label}
        </Link>
      )}
    </motion.div>
  );
}
