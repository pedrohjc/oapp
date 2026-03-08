import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getDeputados, getDespesasDeputado, type Deputado } from "@/lib/camara";
import { getSenadores, type Senador } from "@/lib/senado";
import { formatBRL, getInitials, anoAtual } from "@/lib/format";

const tabs = ["Deputados", "Senadores", "Por Partido", "Por Estado"];

type DeputadoRanking = Deputado & { totalGastos: number };

async function fetchRankingDeputados(): Promise<DeputadoRanking[]> {
  try {
    const deputados = await getDeputados({ itens: 30 });
    const ano = anoAtual();

    const comGastos = await Promise.allSettled(
      deputados.map(async (dep) => {
        const despesas = await getDespesasDeputado(dep.id, ano);
        const total = despesas.reduce((acc, d) => acc + (d.valorLiquido ?? 0), 0);
        return { ...dep, totalGastos: total };
      })
    );

    return comGastos
      .filter((r): r is PromiseFulfilledResult<DeputadoRanking> => r.status === "fulfilled")
      .map((r) => r.value)
      .sort((a, b) => b.totalGastos - a.totalGastos);
  } catch {
    return [];
  }
}

function BadgeGastos({ total }: { total: number }) {
  if (total > 30000)
    return <span className="px-3 py-1 text-xs font-bold rounded-full bg-red-100 text-red-700">Alto Gasto</span>;
  if (total > 10000)
    return <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-700">Moderado</span>;
  return <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700">Dentro do Limite</span>;
}

function SenadorCard({ senador }: { senador: Senador }) {
  const id = senador.IdentificacaoParlamentar;
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
      <div className="flex items-start gap-4">
        {id.UrlFotoParlamentar ? (
          <img src={id.UrlFotoParlamentar} alt={id.NomeParlamentar} className="size-16 rounded-xl object-cover bg-slate-100 flex-shrink-0" />
        ) : (
          <div className="size-16 rounded-xl bg-[#137fec]/10 text-[#137fec] flex items-center justify-center text-lg font-black flex-shrink-0">
            {getInitials(id.NomeParlamentar)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 group-hover:text-[#137fec] transition-colors truncate">{id.NomeParlamentar}</h3>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-0.5">
            {id.UfParlamentar} · {id.SiglaPartidoParlamentar}
          </p>
          <span className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#137fec]/10 text-[#137fec]">
            SENADOR
          </span>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
        <a href={`/parlamentar/senador-${id.CodigoParlamentar}`} className="text-xs font-semibold text-[#137fec] hover:underline">
          Ver perfil →
        </a>
        <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700">Em Exercício</span>
      </div>
    </div>
  );
}

export default async function RankingPage() {
  const [deputados, senadores] = await Promise.all([
    fetchRankingDeputados(),
    getSenadores(),
  ]);

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">Rankings Nacionais</h1>
            <p className="text-slate-500 mt-2 max-w-lg">
              Métricas de gastos baseadas em dados reais da CEAP (Cota para Exercício da Atividade Parlamentar) — {anoAtual()}.
            </p>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 shadow-sm">
              <span className="material-symbols-outlined text-lg text-slate-400">calendar_today</span>
              {anoAtual()}
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#137fec] text-white rounded-lg text-sm font-semibold shadow-lg shadow-[#137fec]/20 hover:bg-[#137fec]/90 transition-all">
              <span className="material-symbols-outlined text-lg">download</span>
              Exportar
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 p-1.5 bg-slate-100 rounded-xl w-fit">
          {tabs.map((tab, i) => (
            <button key={tab} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${i === 0 ? "bg-white shadow-sm text-[#137fec] font-semibold" : "text-slate-500 hover:bg-white/50"}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* ── Deputados ── */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-bold text-slate-900">Maiores Gastadores — Câmara</h2>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs font-bold rounded-full">{deputados.length} deputados</span>
          </div>

          {deputados.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400">
              <span className="material-symbols-outlined text-4xl block mb-2">cloud_off</span>
              Não foi possível carregar os dados agora.
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-slate-100">
                <thead className="bg-slate-50">
                  <tr>
                    {["#", "Deputado", "Partido", "UF", "Total Gastos (CEAP)", ""].map((col) => (
                      <th key={col} className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {deputados.map((dep, idx) => (
                    <tr key={dep.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-slate-400 w-10">
                        {idx < 3 ? (
                          <span className={`inline-flex items-center justify-center size-7 rounded-full text-white text-xs font-black ${idx === 0 ? "bg-amber-400" : idx === 1 ? "bg-slate-400" : "bg-orange-400"}`}>
                            {idx + 1}
                          </span>
                        ) : (
                          <span className="text-slate-300">{idx + 1}</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {dep.urlFoto ? (
                            <img src={dep.urlFoto} alt={dep.nome} className="w-9 h-9 rounded-full object-cover bg-slate-100 flex-shrink-0" />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-[#137fec]/10 text-[#137fec] flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {getInitials(dep.nome)}
                            </div>
                          )}
                          <span className="text-sm font-bold text-slate-900">{dep.nome}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded">{dep.siglaPartido}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 font-medium">{dep.siglaUf}</td>
                      <td className="px-6 py-4 text-sm font-black text-slate-900">{formatBRL(dep.totalGastos)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <BadgeGastos total={dep.totalGastos} />
                          <a href={`/parlamentar/${dep.id}`} className="text-[#137fec] text-sm font-medium hover:underline">
                            Ver perfil
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ── Senadores ── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-bold text-slate-900">Senadores em Exercício</h2>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs font-bold rounded-full">{senadores.length} senadores</span>
          </div>
          {senadores.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400">
              <span className="material-symbols-outlined text-4xl block mb-2">cloud_off</span>
              Não foi possível carregar os dados agora.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {senadores.slice(0, 12).map((s) => (
                <SenadorCard key={s.IdentificacaoParlamentar.CodigoParlamentar} senador={s} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
