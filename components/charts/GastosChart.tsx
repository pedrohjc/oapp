"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface GastoCategoria {
  tipo: string;
  valor: number;
  percentual: number;
}

interface Props {
  data: GastoCategoria[];
  total: number;
}

function formatBRLShort(value: number): string {
  if (value >= 1000) return `R$ ${(value / 1000).toFixed(1)}k`;
  return `R$ ${value.toFixed(0)}`;
}

const COLORS = ["#137fec", "#3b9ef8", "#6db5fa", "#9dcbfb", "#cde4fd"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as GastoCategoria;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-4 text-sm max-w-xs">
      <p className="font-semibold text-slate-900 mb-1 leading-tight">{d.tipo}</p>
      <p className="text-[#137fec] font-black text-lg">
        {d.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
      </p>
      <p className="text-slate-400 text-xs mt-0.5">{d.percentual.toFixed(1)}% do total</p>
    </div>
  );
}

export default function GastosChart({ data, total }: Props) {
  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-slate-400">
        <span className="material-symbols-outlined text-4xl mb-2">bar_chart</span>
        <p className="text-sm">Sem dados de gastos disponíveis</p>
      </div>
    );
  }

  return (
    <div>
      {/* Total */}
      <div className="flex items-baseline gap-2 mb-6">
        <span className="text-3xl font-black text-[#137fec]">
          {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </span>
        <span className="text-slate-400 text-sm">total no período</span>
      </div>

      {/* Gráfico de barras horizontal */}
      <ResponsiveContainer width="100%" height={data.length * 52 + 20}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 60, bottom: 0, left: 0 }}
          barCategoryGap="30%"
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
          <XAxis
            type="number"
            tickFormatter={formatBRLShort}
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="tipo"
            width={180}
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: string) =>
              v.length > 28 ? v.slice(0, 28) + "…" : v
            }
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
          <Bar dataKey="valor" radius={[0, 6, 6, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legenda percentual */}
      <div className="mt-4 space-y-2">
        {data.map((d, i) => (
          <div key={d.tipo} className="flex items-center gap-3">
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: COLORS[i % COLORS.length] }}
            />
            <span className="text-xs text-slate-500 flex-1 truncate">{d.tipo}</span>
            <span className="text-xs font-bold text-slate-700">
              {d.percentual.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
