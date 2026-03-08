import { notFound } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GastosChart from "@/components/charts/GastosChart";
import {
  getDeputadoDetalhe,
  getDespesasRecentes,
  getDiscursosDeputado,
  getOrgaosDeputado,
} from "@/lib/camara";
import { formatBRL, formatDate, getInitials } from "@/lib/format";
import { corPartido } from "@/lib/partidos";
import { getCNPJ } from "@/lib/brasilapi";
import { calcularRisco } from "@/lib/risco";
import RiscoPanel from "@/components/RiscoPanel";

const tabs = ["Gastos", "Discursos", "Comissões", "Despesas"];

export default async function ParlamentarPerfilPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const depId = parseInt(id, 10);
  if (isNaN(depId)) notFound();

  const [dep, { despesas, ano: anoExibicao }, discursos, orgaos] = await Promise.all([
    getDeputadoDetalhe(depId).catch(() => null),
    getDespesasRecentes(depId).catch(() => ({ despesas: [], ano: new Date().getFullYear() })),
    getDiscursosDeputado(depId).catch(() => []),
    getOrgaosDeputado(depId).catch(() => []),
  ]);

  if (!dep) notFound();

  const status = dep.ultimoStatus;
  const totalGastos = despesas.reduce((acc, d) => acc + (d.valorLiquido ?? 0), 0);
  const cor = corPartido(status.siglaPartido);

  // Lookup CNPJ dos top 4 fornecedores para análise de risco
  const porCnpj = despesas.reduce<Record<string, number>>((acc, d) => {
    if (d.cnpjCpfFornecedor?.length === 14) {
      acc[d.cnpjCpfFornecedor] = (acc[d.cnpjCpfFornecedor] ?? 0) + (d.valorLiquido ?? 0);
    }
    return acc;
  }, {});
  const topCnpjs = Object.entries(porCnpj)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([cnpj]) => cnpj);
  const empresas = Object.fromEntries(
    await Promise.all(topCnpjs.map(async (cnpj) => [cnpj, await getCNPJ(cnpj)]))
  );
  const risco = calcularRisco(despesas, empresas);

  // Agrupa por categoria para o gráfico
  const porTipo = despesas.reduce<Record<string, number>>((acc, d) => {
    acc[d.tipoDespesa] = (acc[d.tipoDespesa] ?? 0) + d.valorLiquido;
    return acc;
  }, {});

  const chartData = Object.entries(porTipo)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([tipo, valor]) => ({
      tipo: tipo.replace(/\.$/, "").toLowerCase().replace(/^\w/, (c) => c.toUpperCase()),
      valor,
      percentual: totalGastos > 0 ? (valor / totalGastos) * 100 : 0,
    }));

  const nomeExibicao = status.nomeEleitoral || dep.nome || "Parlamentar";

  const formataTipoDiscurso = (tipo: string) =>
    tipo.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Profile Header ── */}
        <section className="flex flex-col md:flex-row gap-8 items-start md:items-center mb-10">
          {/* Foto */}
          <div className="relative flex-shrink-0">
            {dep.urlFoto ? (
              <div className="w-36 h-36 rounded-2xl overflow-hidden shadow-lg border-4 border-white ring-1 ring-slate-200">
                <Image
                  src={dep.urlFoto}
                  alt={nomeExibicao}
                  width={144}
                  height={144}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              </div>
            ) : (
              <div
                className="w-36 h-36 rounded-2xl shadow-lg border-4 border-white flex items-center justify-center text-white text-4xl font-black"
                style={{ backgroundColor: cor }}
              >
                {getInitials(nomeExibicao)}
              </div>
            )}
            {/* Badge partido */}
            <span
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-white text-xs font-bold shadow-md whitespace-nowrap"
              style={{ backgroundColor: cor }}
            >
              {status.siglaPartido}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-2 mt-4 md:mt-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                {nomeExibicao}
              </h1>
              {status.situacao && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                  ● {status.situacao}
                </span>
              )}
            </div>
            <p className="text-lg text-slate-500 font-medium">
              Deputado Federal
              <span className="mx-2 text-slate-300">·</span>
              {status.siglaUf}
              <span className="mx-2 text-slate-300">·</span>
              {status.idLegislatura}ª Legislatura
            </p>
            {dep.email && (
              <a href={`mailto:${dep.email}`} className="inline-flex items-center gap-1 text-sm text-[#137fec] hover:underline">
                <span className="material-symbols-outlined text-base">mail</span>
                {dep.email}
              </a>
            )}
          </div>

          {/* Ações */}
          <div className="flex gap-3 flex-shrink-0">
            <button className="px-6 py-2.5 bg-[#137fec] text-white font-semibold rounded-lg shadow-md shadow-[#137fec]/25 hover:opacity-90 transition-all">
              Seguir
            </button>
            <button className="px-6 py-2.5 bg-white border border-slate-200 font-semibold rounded-lg hover:bg-slate-50 transition-all text-slate-700">
              Compartilhar
            </button>
          </div>
        </section>

        {/* ── Stats Strip ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: `Total Gastos ${anoExibicao}`, value: formatBRL(totalGastos), sub: `${despesas.length} lançamentos`, icon: "payments", color: "text-[#137fec]" },
            { label: "Discursos recentes", value: discursos.length.toString(), sub: "Últimas sessões", icon: "record_voice_over", color: "text-emerald-600" },
            { label: "Comissões", value: orgaos.length.toString(), sub: "Atualmente ativo", icon: "groups", color: "text-amber-600" },
            { label: "Legislatura", value: `${status.idLegislatura}ª`, sub: "Mandato atual", icon: "history_edu", color: "text-purple-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-400 text-xs font-medium uppercase tracking-wide">{s.label}</span>
                <span className={`material-symbols-outlined ${s.color} text-xl`}>{s.icon}</span>
              </div>
              <div className="text-2xl font-black text-slate-900">{s.value}</div>
              <div className="text-xs text-slate-400 mt-1">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Radar de Risco ── */}
        <RiscoPanel risco={risco} />

        {/* ── Tabs ── */}
        <div className="border-b border-slate-200 mb-8">
          <nav className="flex gap-8 overflow-x-auto">
            {tabs.map((tab, i) => (
              <a key={tab} href={`#${tab.toLowerCase()}`} className={`pb-4 border-b-2 text-sm font-medium whitespace-nowrap transition-colors ${i === 0 ? "border-[#137fec] text-[#137fec] font-bold" : "border-transparent text-slate-400 hover:text-slate-700"}`}>
                {tab}
              </a>
            ))}
          </nav>
        </div>

        {/* ── Main Content ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── LEFT: Gráfico + Discursos + Despesas ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Gráfico real com Recharts */}
            <div id="gastos" className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Gastos por Categoria</h3>
                  <p className="text-slate-400 text-sm mt-1">CEAP — {anoExibicao} · Dados oficiais da Câmara</p>
                </div>
              </div>
              <GastosChart data={chartData} total={totalGastos} />
            </div>

            {/* Discursos */}
            <div id="discursos" className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">Discursos Recentes</h3>
                <span className="text-xs text-slate-400">{discursos.length} registros</span>
              </div>
              {discursos.length === 0 ? (
                <div className="p-10 text-center text-slate-400">
                  <span className="material-symbols-outlined text-4xl block mb-2">record_voice_over</span>
                  <p className="text-sm">Sem discursos registrados no período.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {discursos.slice(0, 8).map((d, i) => {
                    const preview = d.sumario ?? (d.transcricao ? d.transcricao.slice(0, 160) + "…" : null);
                    return (
                      <div key={i} className="p-5 flex gap-4 items-start hover:bg-slate-50/50 transition-colors">
                        <div className="size-9 rounded-lg bg-[#137fec]/10 flex items-center justify-center flex-shrink-0">
                          <span className="material-symbols-outlined text-[#137fec] text-lg">mic</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold uppercase tracking-wide text-[#137fec] mb-1">
                            {formataTipoDiscurso(d.tipoDiscurso)}
                          </p>
                          {preview && (
                            <p className="text-sm text-slate-700 leading-snug line-clamp-3">
                              {preview}
                            </p>
                          )}
                          <p className="text-xs text-slate-400 mt-1.5">
                            {formatDate(d.dataHoraInicio)}
                          </p>
                        </div>
                        {d.urlVideo && (
                          <a href={d.urlVideo} target="_blank" rel="noopener noreferrer"
                            className="flex-shrink-0 size-8 rounded-lg bg-slate-100 flex items-center justify-center hover:bg-[#137fec]/10 transition-colors">
                            <span className="material-symbols-outlined text-slate-400 text-base">play_circle</span>
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Despesas detalhadas */}
            <div id="despesas" className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-900">Despesas Detalhadas</h3>
                <span className="text-xs text-slate-400">{despesas.length} registros em {anoExibicao}</span>
              </div>
              <div className="divide-y divide-slate-50">
                {despesas.slice(0, 10).map((d, i) => (
                  <div key={i} className="px-6 py-4 flex justify-between items-start hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="size-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-slate-400 text-lg">receipt_long</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-slate-900 leading-tight">
                          {d.tipoDespesa.replace(/\.$/, "").toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5 truncate">{d.nomeFornecedor || "—"}</p>
                        <p className="text-xs text-slate-300 mt-0.5">{formatDate(d.dataDocumento)}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="font-bold text-sm text-slate-900">{formatBRL(d.valorLiquido)}</p>
                      {d.urlDocumento && (
                        <a href={d.urlDocumento} target="_blank" rel="noopener noreferrer"
                           className="text-xs text-[#137fec] hover:underline flex items-center gap-0.5 justify-end mt-1">
                          <span className="material-symbols-outlined text-xs">open_in_new</span>
                          Nota fiscal
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT Sidebar ── */}
          <div className="space-y-6">

            {/* Comissões */}
            {orgaos.length > 0 && (
              <div id="comissões" className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h4 className="font-bold mb-4 text-xs uppercase tracking-wider text-slate-400">Comissões Atuais</h4>
                <ul className="space-y-4">
                  {orgaos.slice(0, 6).map((org) => (
                    <li key={org.idOrgao} className="flex gap-3 items-start">
                      <div className="size-8 rounded-lg bg-[#137fec]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-[#137fec] text-sm">gavel</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700 leading-tight">{org.nomePublicacao || org.nomeOrgao}</p>
                        {org.titulo && <p className="text-xs text-slate-400 mt-0.5">{org.titulo}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Partido Card */}
            <div
              className="p-6 rounded-2xl text-white relative overflow-hidden"
              style={{ backgroundColor: cor }}
            >
              <div className="relative z-10">
                <p className="text-white/70 text-xs font-bold uppercase tracking-wider mb-1">Partido</p>
                <p className="text-3xl font-black mb-1">{status.siglaPartido}</p>
                <p className="text-white/80 text-sm">{status.siglaUf} · {status.idLegislatura}ª Legislatura</p>
              </div>
              <div className="absolute -bottom-4 -right-4 opacity-10 text-[100px] font-black">
                {status.siglaPartido}
              </div>
            </div>

            {/* Relatório */}
            <div className="bg-slate-900 text-white p-6 rounded-2xl relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="text-lg font-bold mb-2">Relatório de Transparência</h4>
                <p className="text-slate-400 text-sm mb-5">
                  Dossiê completo com dados da Câmara, TSE e Receita Federal.
                </p>
                <button className="w-full py-3 bg-[#137fec] rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-[#137fec]/90 transition-all text-sm">
                  <span className="material-symbols-outlined text-sm">download</span>
                  Baixar PDF
                </button>
              </div>
              <div className="absolute -bottom-6 -right-6 opacity-10">
                <span className="material-symbols-outlined text-[120px]">article</span>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
