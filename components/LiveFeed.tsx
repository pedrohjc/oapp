import { getDeputados, getDespesasDeputado } from "@/lib/camara";
import { formatBRL, formatDate, getInitials, getRiscoLabel, anoAtual } from "@/lib/format";

async function fetchGastosRecentes() {
  try {
    // Pega 8 deputados e busca a despesa mais recente de cada um
    const deputados = await getDeputados({ itens: 8 });

    const rows = await Promise.all(
      deputados.map(async (dep) => {
        try {
          const despesas = await getDespesasDeputado(dep.id, anoAtual());
          const top = despesas[0];
          if (!top) return null;
          return { dep, despesa: top };
        } catch {
          return null;
        }
      })
    );

    return rows
      .filter((r): r is NonNullable<typeof r> => r !== null && r.despesa.valorLiquido > 0)
      .slice(0, 5);
  } catch {
    return [];
  }
}

export default async function LiveFeed() {
  const gastos = await fetchGastosRecentes();

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gastos Recentes sob Análise</h2>
          <p className="text-slate-400 text-sm mt-1">Dados em tempo real da API da Câmara dos Deputados</p>
        </div>
        <button className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#137fec] transition-colors">
          <span className="material-symbols-outlined text-lg">filter_list</span>
          Filtrar
        </button>
      </div>

      <div className="overflow-hidden border border-slate-100 rounded-xl bg-white shadow-sm">
        {gastos.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <span className="material-symbols-outlined text-4xl block mb-2">cloud_off</span>
            Não foi possível carregar os dados agora.
          </div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50">
                <tr>
                  {["Parlamentar", "Tipo de Despesa", "Fornecedor", "Data", "Valor", "Risco", ""].map((col) => (
                    <th key={col} className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {gastos.map(({ dep, despesa }) => {
                  const risco = getRiscoLabel(despesa.valorLiquido);
                  return (
                    <tr key={`${dep.id}-${despesa.codDocumento}`} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {dep.urlFoto ? (
                            <img
                              src={dep.urlFoto}
                              alt={dep.nome}
                              className="w-8 h-8 rounded-full object-cover flex-shrink-0 bg-slate-100"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-[#137fec]/10 text-[#137fec] flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {getInitials(dep.nome)}
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-bold text-slate-900 leading-tight">{dep.nome}</div>
                            <div className="text-xs text-slate-400">{dep.siglaPartido} · {dep.siglaUf}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 max-w-[160px] truncate">{despesa.tipoDespesa}</td>
                      <td className="px-6 py-4 text-sm text-slate-400 max-w-[160px] truncate">{despesa.nomeFornecedor || "—"}</td>
                      <td className="px-6 py-4 text-sm text-slate-400 whitespace-nowrap">{formatDate(despesa.dataDocumento)}</td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-900 whitespace-nowrap">{formatBRL(despesa.valorLiquido)}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${risco.color}`}>
                          {risco.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <a
                          href={`/parlamentar/${dep.id}`}
                          className="text-[#137fec] text-sm font-medium hover:underline"
                        >
                          Detalhes
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="p-4 text-center border-t border-slate-50">
              <a href="/ranking" className="text-sm font-semibold text-[#137fec] hover:underline">
                Ver todo o histórico
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
