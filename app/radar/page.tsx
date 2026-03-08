import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getDeputados, getDespesasDeputado } from "@/lib/camara";
import { calcularRisco } from "@/lib/risco";
import { formatBRL, getInitials } from "@/lib/format";
import { corPartido } from "@/lib/partidos";

export const revalidate = 3600;

export default async function RadarPage() {
  const ano = new Date().getFullYear();

  const deputados = await getDeputados({ itens: 100 });

  const resultados = (
    await Promise.all(
      deputados.map(async (dep) => {
        try {
          let despesas = await getDespesasDeputado(dep.id, ano).catch(() => []);
          if (despesas.length === 0)
            despesas = await getDespesasDeputado(dep.id, ano - 1).catch(() => []);
          const risco = calcularRisco(despesas);
          const total = despesas.reduce((acc, d) => acc + (d.valorLiquido ?? 0), 0);
          return { dep, risco, total };
        } catch {
          return null;
        }
      })
    )
  )
    .filter(
      (r): r is NonNullable<typeof r> => r !== null && r.risco.alertas.length > 0
    )
    .sort((a, b) => b.risco.indice - a.risco.indice);

  const atencao = resultados.filter((r) => r.risco.nivel === "atencao");
  const observacao = resultados.filter((r) => r.risco.nivel === "observacao");

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Header ── */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="size-11 rounded-2xl bg-amber-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-amber-500 text-2xl">manage_search</span>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">Alertas de Transparência</h1>
              <p className="text-slate-400 text-sm">Padrões estatísticos detectados automaticamente nos dados públicos da CEAP</p>
            </div>
          </div>

          {/* Aviso legal */}
          <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2">
            <span className="material-symbols-outlined text-slate-400 text-base flex-shrink-0 mt-0.5">info</span>
            <p className="text-xs text-slate-500 leading-relaxed">
              Os padrões abaixo são detectados automaticamente com base em critérios estatísticos aplicados a dados públicos.
              Não constituem acusação ou julgamento sobre os parlamentares listados.{" "}
              <Link href="/sobre" className="underline hover:text-slate-700">Saiba mais sobre a metodologia.</Link>
            </p>
          </div>

          {/* Contadores */}
          <div className="flex gap-4 mt-6">
            <div className="bg-red-50 border border-red-100 rounded-xl px-5 py-3 flex items-center gap-3">
              <div className="size-2.5 rounded-full bg-red-500" />
              <span className="font-bold text-red-700 text-lg">{atencao.length}</span>
              <span className="text-sm text-red-600 font-medium">Padrão Incomum</span>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-xl px-5 py-3 flex items-center gap-3">
              <div className="size-2.5 rounded-full bg-amber-500" />
              <span className="font-bold text-amber-700 text-lg">{observacao.length}</span>
              <span className="text-sm text-amber-600 font-medium">Em Observação</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 flex items-center gap-3">
              <span className="material-symbols-outlined text-slate-400 text-base">groups</span>
              <span className="font-bold text-slate-700 text-lg">{deputados.length}</span>
              <span className="text-sm text-slate-500 font-medium">Analisados</span>
            </div>
          </div>
        </div>

        {/* ── Lista ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-10">
          {resultados.length === 0 ? (
            <div className="p-20 text-center text-slate-400">
              <span className="material-symbols-outlined text-5xl block mb-3">check_circle</span>
              <p>Nenhum padrão detectado nos dados disponíveis.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {resultados.map((item, i) => {
                const { dep, risco, total } = item;
                const cor = corPartido(dep.siglaPartido);
                const nivelColor =
                  risco.nivel === "atencao"
                    ? { bar: "#ef4444", scoreText: "text-red-700 bg-red-50" }
                    : { bar: "#f59e0b", scoreText: "text-amber-700 bg-amber-50" };

                return (
                  <Link
                    key={dep.id}
                    href={`/parlamentar/${dep.id}`}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/60 transition-colors group"
                  >
                    {/* Rank */}
                    <span className="text-slate-300 font-bold text-sm w-6 text-center flex-shrink-0">
                      {i + 1}
                    </span>

                    {/* Score bar lateral */}
                    <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: nivelColor.bar }} />

                    {/* Foto */}
                    {dep.urlFoto ? (
                      <div className="size-10 rounded-full overflow-hidden flex-shrink-0">
                        <Image src={dep.urlFoto} alt={dep.nome} width={40} height={40} className="object-cover" unoptimized />
                      </div>
                    ) : (
                      <div className="size-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: cor }}>
                        {getInitials(dep.nome)}
                      </div>
                    )}

                    {/* Nome + partido */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 group-hover:text-[#137fec] transition-colors truncate text-sm">
                        {dep.nome}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {dep.siglaPartido} · {dep.siglaUf}
                      </p>
                    </div>

                    {/* Alertas */}
                    <div className="hidden md:flex gap-2 flex-wrap max-w-xs">
                      {risco.alertas.map((alerta) => (
                        <span
                          key={alerta.id}
                          className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${
                            alerta.nivel === "atencao"
                              ? "bg-red-50 text-red-600 border border-red-100"
                              : "bg-amber-50 text-amber-600 border border-amber-100"
                          }`}
                        >
                          {alerta.titulo}
                        </span>
                      ))}
                    </div>

                    {/* Total CEAP */}
                    <div className="text-right flex-shrink-0 hidden sm:block">
                      <p className="font-bold text-sm text-slate-800">{formatBRL(total)}</p>
                      <p className="text-xs text-slate-400">CEAP</p>
                    </div>

                    <span className="material-symbols-outlined text-slate-200 group-hover:text-[#137fec] transition-colors flex-shrink-0 text-lg">
                      chevron_right
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Metodologia ── */}
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-900 text-lg mb-2">Como funciona a detecção</h3>
          <p className="text-slate-500 text-sm mb-6">
            Cada deputado recebe um índice de 0 a 100 baseado em padrões identificados nos dados públicos da CEAP e da Receita Federal.
            Quanto maior o índice, mais padrões estatisticamente incomuns foram detectados.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "account_balance_wallet",
                titulo: "Concentração de Fornecedor",
                desc: "Quando +70% dos gastos vão para um único CNPJ — padrão estatisticamente incomum em relação ao conjunto de parlamentares.",
                pts: "+35 pts",
                cor: "text-red-500 bg-red-50",
              },
              {
                icon: "calendar_month",
                titulo: "Pico em Nov/Dez",
                desc: "Mais de 55% dos gastos do ano concentrados nos dois últimos meses. Indica uso concentrado da cota no encerramento do exercício.",
                pts: "+18 pts",
                cor: "text-amber-500 bg-amber-50",
              },
              {
                icon: "store",
                titulo: "Microempresa com Alto Valor",
                desc: "MEI ou ME recebendo mais de R$12.000 da cota. Valor acima da média para empresas deste porte.",
                pts: "+22 pts",
                cor: "text-red-500 bg-red-50",
              },
              {
                icon: "new_releases",
                titulo: "Empresa Recém-Aberta",
                desc: "CNPJ aberto há menos de 12 meses quando recebeu o primeiro pagamento da cota parlamentar.",
                pts: "+28 pts",
                cor: "text-red-500 bg-red-50",
              },
              {
                icon: "warning",
                titulo: "CNPJ com Cadastro Irregular",
                desc: "Fornecedor com situação 'Baixada', 'Inapta' ou similar na Receita Federal, segundo dados da BrasilAPI.",
                pts: "+30 pts",
                cor: "text-red-500 bg-red-50",
              },
              {
                icon: "blur_on",
                titulo: "Alta Diversidade de Fornecedores",
                desc: "Proporção elevada de fornecedores distintos em relação ao número de lançamentos registrados.",
                pts: "+10 pts",
                cor: "text-amber-500 bg-amber-50",
              },
            ].map((item) => (
              <div key={item.titulo} className="flex gap-4">
                <div className={`size-9 rounded-xl flex items-center justify-center flex-shrink-0 ${item.cor}`}>
                  <span className="material-symbols-outlined text-lg">{item.icon}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-sm text-slate-900">{item.titulo}</p>
                    <span className="text-xs text-slate-400 font-mono">{item.pts}</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-6 border-t border-slate-100 pt-4">
            * Os alertas são gerados automaticamente com base em padrões estatísticos. Não constituem acusação formal.
            Fontes: Câmara dos Deputados (dadosabertos.camara.leg.br) e Receita Federal via BrasilAPI.{" "}
            <Link href="/sobre" className="underline hover:text-slate-600">Saiba mais sobre a metodologia.</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
