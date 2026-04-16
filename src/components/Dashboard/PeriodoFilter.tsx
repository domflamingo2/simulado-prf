"use client";

type PeriodoFiltro = "7" | "30" | "90" | "todos";

interface PeriodoFilterProps {
  periodo: PeriodoFiltro;
  onChange: (periodo: PeriodoFiltro) => void;
  hasDataInPeriod: boolean;
}

export function PeriodoFilter({
  periodo,
  onChange,
  hasDataInPeriod,
}: PeriodoFilterProps) {
  const opcoes: Array<{ value: PeriodoFiltro; label: string }> = [
    { value: "7", label: "7 dias" },
    { value: "30", label: "30 dias" },
    { value: "90", label: "3 meses" },
    { value: "todos", label: "Todo histórico" },
  ];

  return (
    <nav
      aria-label="Filtro de período"
      className="flex flex-wrap items-center gap-2"
    >
      <span className="text-xs text-slate-500 font-medium">Período:</span>
      {opcoes.map((p) => (
        <button
          key={p.value}
          onClick={() => onChange(p.value)}
          aria-pressed={periodo === p.value}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
            periodo === p.value
              ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
          }`}
        >
          {p.label}
        </button>
      ))}

      {periodo !== "todos" && !hasDataInPeriod && (
        <span className="text-xs text-amber-400/80 ml-2">
          Nenhum simulado neste período
        </span>
      )}
    </nav>
  );
}
