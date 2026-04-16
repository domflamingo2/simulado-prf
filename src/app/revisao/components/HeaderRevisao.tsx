"use client";

import { CheckCircle2, Home, Trophy, XCircle } from "lucide-react";
import Link from "next/link";

import { StatBadge } from "./StatBadge";

interface HeaderRevisaoProps {
  data: string;
  classificacaoMensagem: string;
  estatisticas: {
    acertos: number;
    erros: number;
    pontuacao: number;
  };
  progresso: {
    atual: number;
    total: number;
  };
}

export function HeaderRevisao({
  data,
  classificacaoMensagem,
  estatisticas,
  progresso,
}: HeaderRevisaoProps) {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <Home className="w-5 h-5 text-slate-400" />
            </Link>

            <div>
              <h1 className="text-lg font-bold text-white">Revisão</h1>
              <p className="text-xs text-slate-400">
                {data} • {classificacaoMensagem}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <StatBadge
              icon={CheckCircle2}
              label="Acertos"
              value={estatisticas.acertos}
              color="emerald"
            />
            <StatBadge
              icon={XCircle}
              label="Erros"
              value={estatisticas.erros}
              color="rose"
            />
            <StatBadge
              icon={Trophy}
              label="Nota"
              value={estatisticas.pontuacao}
              color="amber"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${(progresso.atual / progresso.total) * 100}%` }}
            />
          </div>
          <span className="text-sm text-slate-400 whitespace-nowrap">
            {progresso.atual} / {progresso.total}
          </span>
        </div>
      </div>
    </header>
  );
}
