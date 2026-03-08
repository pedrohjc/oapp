import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const tabs = ["Patrimônio", "Gastos de Gabinete", "Votações", "Financiadores de Campanha"];

const bens = [
  { icon: "apartment", iconBg: "bg-blue-50", iconColor: "text-blue-600", nome: "Apartamento Residencial", detalhe: "São Paulo, SP", valor: "R$ 1.500.000" },
  { icon: "savings", iconBg: "bg-green-50", iconColor: "text-green-600", nome: "Aplicação de Renda Fixa", detalhe: "Banco do Brasil S.A.", valor: "R$ 1.250.000" },
  { icon: "directions_car", iconBg: "bg-purple-50", iconColor: "text-purple-600", nome: "Veículo Automotor", detalhe: "Toyota Hilux SW4 2021", valor: "R$ 380.000" },
];

const comissoes = [
  { icon: "gavel", label: "Constituição e Justiça e de Cidadania" },
  { icon: "payments", label: "Finanças e Tributação" },
  { icon: "school", label: "Educação (Suplente)" },
];

const stats = [
  { label: "Assiduidade", icon: "event_available", value: "98.2%", sub: null, bar: 98.2 },
  { label: "Projetos de Lei", icon: "description", value: "142", sub: "+12 este mês", bar: null },
  { label: "Votações", icon: "how_to_reg", value: "2.481", sub: "Total de sessões", bar: null },
  { label: "Mandatos", icon: "history_edu", value: "02", sub: "Eleito em 2018, 2022", bar: null },
];

const chartBars = [
  { year: "2014", height: "30%", opacity: "bg-[#137fec]/20" },
  { year: "2018", height: "55%", opacity: "bg-[#137fec]/50" },
  { year: "2022", height: "100%", opacity: "bg-[#137fec]" },
];

export default function ParlamentarPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Profile Header */}
        <section className="flex flex-col md:flex-row gap-8 items-start md:items-end mb-12">
          <div className="w-40 h-40 rounded-2xl bg-[#137fec]/10 flex items-center justify-center shadow-lg border-4 border-white flex-shrink-0">
            <span className="material-symbols-outlined text-[#137fec] text-7xl">person</span>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Alexandre Silva</h1>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#137fec]/10 text-[#137fec] border border-[#137fec]/20 self-start md:self-auto">
                EM EXERCÍCIO
              </span>
            </div>
            <p className="text-lg text-slate-500 font-medium">
              Partido Progressista (PP) <span className="mx-2">•</span> São Paulo - SP
            </p>
            <p className="text-slate-400 text-sm">Deputado Federal • 56ª Legislatura</p>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-2.5 bg-[#137fec] text-white font-semibold rounded-lg shadow-lg shadow-[#137fec]/25 hover:opacity-90 transition-all">
              Seguir
            </button>
            <button className="px-6 py-2.5 bg-white border border-slate-200 font-semibold rounded-lg hover:bg-slate-50 transition-all text-slate-700">
              Contato
            </button>
          </div>
        </section>

        {/* Stats Strip */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {stats.map((s) => (
            <div key={s.label} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:scale-[1.02] transition-transform">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm font-medium">{s.label}</span>
                <span className="material-symbols-outlined text-[#137fec] text-xl">{s.icon}</span>
              </div>
              <div className="text-3xl font-bold text-slate-900">{s.value}</div>
              {s.bar !== null && (
                <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-[#137fec] h-1.5 rounded-full" style={{ width: `${s.bar}%` }} />
                </div>
              )}
              {s.sub && <div className="text-xs text-green-500 mt-2 font-medium">{s.sub}</div>}
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 mb-8">
          <nav className="flex gap-8 overflow-x-auto">
            {tabs.map((tab, i) => (
              <a
                key={tab}
                href="#"
                className={`pb-4 border-b-2 text-sm font-medium whitespace-nowrap transition-colors ${
                  i === 0
                    ? "border-[#137fec] text-[#137fec] font-bold"
                    : "border-transparent text-slate-400 hover:text-slate-700"
                }`}
              >
                {tab}
              </a>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Chart + Bens */}
          <div className="lg:col-span-2 space-y-8">
            {/* Chart */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Evolução Patrimonial</h3>
                  <p className="text-slate-400 text-sm mt-1">Declarado ao TSE (2014 - 2022)</p>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-sm block">Total Atual Declarado</span>
                  <span className="text-2xl font-black text-[#137fec]">R$ 4.280.000,00</span>
                </div>
              </div>
              <div className="h-52 flex items-end justify-around gap-4 px-4">
                {chartBars.map((bar) => (
                  <div key={bar.year} className="w-full flex flex-col items-center gap-2">
                    <div
                      className={`w-full ${bar.opacity} rounded-t-lg transition-all hover:opacity-80`}
                      style={{ height: bar.height }}
                    />
                    <span className="text-xs font-bold text-slate-400">{bar.year}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bens */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-900">Detalhamento de Bens (2022)</h3>
                <button className="text-[#137fec] text-sm font-semibold hover:underline">Ver todos</button>
              </div>
              <div className="divide-y divide-slate-50">
                {bens.map((b) => (
                  <div key={b.nome} className="p-6 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className={`size-10 rounded-lg ${b.iconBg} flex items-center justify-center`}>
                        <span className={`material-symbols-outlined ${b.iconColor}`}>{b.icon}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-900">{b.nome}</p>
                        <p className="text-xs text-slate-400">{b.detalhe}</p>
                      </div>
                    </div>
                    <p className="font-bold text-sm text-slate-900">{b.valor}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Comissões */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h4 className="font-bold mb-4 text-xs uppercase tracking-wider text-slate-400">Comissões Atuais</h4>
              <ul className="space-y-4">
                {comissoes.map((c) => (
                  <li key={c.label} className="flex gap-3 items-start">
                    <span className="material-symbols-outlined text-[#137fec] text-xl mt-0.5">{c.icon}</span>
                    <span className="text-sm font-medium text-slate-700">{c.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Relatório PDF */}
            <div className="bg-slate-900 text-white p-8 rounded-2xl relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="text-xl font-bold mb-2">Relatório de Transparência</h4>
                <p className="text-slate-400 text-sm mb-6">
                  Baixe o dossiê completo consolidado com dados oficiais do TSE, Câmara e Receita Federal.
                </p>
                <button className="w-full py-3 bg-[#137fec] rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-[#137fec]/90 transition-all">
                  <span className="material-symbols-outlined">download</span>
                  Baixar PDF
                </button>
              </div>
              <div className="absolute -bottom-6 -right-6 opacity-10">
                <span className="material-symbols-outlined text-[120px]">article</span>
              </div>
            </div>

            {/* Pendências */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h4 className="font-bold mb-4 flex items-center gap-2 text-slate-900">
                <span className="material-symbols-outlined text-amber-500">warning</span>
                Pendências Judiciais
              </h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                Não foram encontradas condenações em segunda instância até a última atualização desta página.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-50">
                <a href="#" className="text-xs font-bold text-[#137fec] flex items-center justify-between hover:underline">
                  VER CERTIDÕES NEGATIVAS
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
