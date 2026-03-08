import type { AnaliseResult } from "@/lib/risco";

interface Props {
  risco: AnaliseResult;
}

const nivelConfig = {
  atencao: {
    bg: "bg-red-50",
    border: "border-red-200",
    badge: "bg-red-500 text-white",
    titulo: "text-red-800",
    flagBg: "bg-red-50 border-red-100",
    flagIcon: "text-red-500",
    bar: "bg-red-500",
    label: "Padrões Relevantes",
    icon: "flag",
  },
  observacao: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    badge: "bg-amber-500 text-white",
    titulo: "text-amber-800",
    flagBg: "bg-amber-50 border-amber-100",
    flagIcon: "text-amber-500",
    bar: "bg-amber-400",
    label: "Em Observação",
    icon: "info",
  },
  normal: {
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    badge: "bg-emerald-500 text-white",
    titulo: "text-emerald-800",
    flagBg: "bg-emerald-50 border-emerald-100",
    flagIcon: "text-emerald-500",
    bar: "bg-emerald-400",
    label: "Sem Alertas",
    icon: "check_circle",
  },
};

export default function RiscoPanel({ risco }: Props) {
  if (risco.alertas.length === 0 && risco.nivel === "normal") return null;

  const cfg = nivelConfig[risco.nivel];

  return (
    <div className={`rounded-2xl border p-6 ${cfg.bg} ${cfg.border} mb-8`}>
      {/* Aviso de transparência no topo */}
      <div className="flex items-start gap-2 mb-5 p-3 bg-white/60 rounded-xl border border-slate-200">
        <span className="material-symbols-outlined text-slate-400 text-base flex-shrink-0 mt-0.5">info</span>
        <p className="text-xs text-slate-500 leading-relaxed">
          Os alertas abaixo são gerados automaticamente com base em padrões estatísticos identificados nos dados públicos da Câmara dos Deputados e da Receita Federal (via BrasilAPI).
          Não constituem acusação, indiciamento ou qualquer juízo de valor sobre o parlamentar ou os fornecedores citados.
          Consulte sempre as fontes originais antes de qualquer conclusão.
        </p>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className={`size-10 rounded-xl flex items-center justify-center ${cfg.badge}`}>
          <span className="material-symbols-outlined text-lg">{cfg.icon}</span>
        </div>
        <div>
          <h3 className={`font-bold text-lg ${cfg.titulo}`}>Alertas de Transparência — {cfg.label}</h3>
          <p className="text-sm text-slate-500">Padrões detectados nos dados públicos desta cota</p>
        </div>
      </div>

      {/* Alertas */}
      <div className="space-y-3">
        {risco.alertas.map((alerta) => {
          const fc = nivelConfig[alerta.nivel];
          return (
            <div key={alerta.id} className={`rounded-xl border p-4 flex gap-3 ${fc.flagBg} ${fc.border}`}>
              <span className={`material-symbols-outlined text-lg flex-shrink-0 mt-0.5 ${fc.flagIcon}`}>
                {alerta.nivel === "atencao" ? "error_outline" : "report_problem"}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold uppercase tracking-wide ${fc.flagIcon}`}>
                    {alerta.nivel === "atencao" ? "● Padrão Incomum" : "● Em Observação"}
                  </span>
                </div>
                <p className="font-semibold text-sm text-slate-800">{alerta.titulo}</p>
                <p className="text-sm text-slate-600 mt-0.5 leading-snug">{alerta.descricao}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
