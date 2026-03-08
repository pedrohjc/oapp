import { buscarDeputados } from "@/lib/camara";
import { getSenadores } from "@/lib/senado";
import { getInitials } from "@/lib/format";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function BuscarPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const [deputados, todosSenadores] = await Promise.all([
    query ? buscarDeputados(query) : Promise.resolve([]),
    query ? getSenadores() : Promise.resolve([]),
  ]);

  // Filtra senadores por nome, partido ou UF
  const ql = query.toLowerCase();
  const senadores = todosSenadores.filter((s) => {
    const id = s.IdentificacaoParlamentar;
    return (
      id.NomeParlamentar.toLowerCase().includes(ql) ||
      id.SiglaPartidoParlamentar?.toLowerCase() === ql ||
      id.UfParlamentar?.toLowerCase() === ql
    );
  });

  const totalResultados = deputados.length + senadores.length;

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Barra de busca */}
        <form action="/buscar" method="GET" className="mb-10">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-400">search</span>
            </div>
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Pesquise por parlamentar, partido ou estado..."
              autoFocus
              className="block w-full pl-12 pr-32 py-4 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[#137fec] focus:border-transparent outline-none transition-all text-base"
            />
            <div className="absolute inset-y-2 right-2">
              <button
                type="submit"
                className="h-full px-6 bg-[#137fec] text-white font-bold rounded-lg hover:bg-[#137fec]/90 transition-colors"
              >
                Buscar
              </button>
            </div>
          </div>
        </form>

        {/* Sem query */}
        {!query && (
          <div className="text-center py-20 text-slate-400">
            <span className="material-symbols-outlined text-6xl block mb-4">manage_search</span>
            <p className="text-lg font-medium">Digite o nome de um parlamentar para começar</p>
            <p className="text-sm mt-2">Ex: "Lula", "Bolsonaro", "PT", "SP"</p>
          </div>
        )}

        {/* Com query, sem resultados */}
        {query && totalResultados === 0 && (
          <div className="text-center py-20 text-slate-400">
            <span className="material-symbols-outlined text-6xl block mb-4">search_off</span>
            <p className="text-lg font-medium">Nenhum parlamentar encontrado para "{query}"</p>
            <p className="text-sm mt-2">Tente outro nome ou verifique a ortografia</p>
          </div>
        )}

        {/* Resultados */}
        {query && totalResultados > 0 && (
          <div>
            <p className="text-sm text-slate-500 mb-6">
              <span className="font-bold text-slate-900">{totalResultados}</span> resultado{totalResultados !== 1 ? "s" : ""} para "{query}"
            </p>

            {/* Deputados */}
            {deputados.length > 0 && (
              <section className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-lg font-bold text-slate-900">Deputados Federais</h2>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs font-bold rounded-full">
                    {deputados.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {deputados.map((dep) => (
                    <a
                      key={dep.id}
                      href={`/parlamentar/${dep.id}`}
                      className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-[#137fec]/30 hover:shadow-md transition-all group"
                    >
                      {dep.urlFoto ? (
                        <img
                          src={dep.urlFoto}
                          alt={dep.nome}
                          className="w-12 h-12 rounded-full object-cover bg-slate-100 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[#137fec]/10 text-[#137fec] flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {getInitials(dep.nome)}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 group-hover:text-[#137fec] transition-colors">
                          {dep.nome}
                        </p>
                        <p className="text-sm text-slate-400">
                          Deputado Federal · {dep.siglaPartido} · {dep.siglaUf}
                        </p>
                      </div>
                      <span className="material-symbols-outlined text-slate-300 group-hover:text-[#137fec] transition-colors">
                        chevron_right
                      </span>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* Senadores */}
            {senadores.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-lg font-bold text-slate-900">Senadores</h2>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs font-bold rounded-full">
                    {senadores.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {senadores.map((sen) => {
                    const id = sen.IdentificacaoParlamentar;
                    return (
                      <a
                        key={id.CodigoParlamentar}
                        href={`/parlamentar/senador-${id.CodigoParlamentar}`}
                        className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-[#137fec]/30 hover:shadow-md transition-all group"
                      >
                        {id.UrlFotoParlamentar ? (
                          <img
                            src={id.UrlFotoParlamentar}
                            alt={id.NomeParlamentar}
                            className="w-12 h-12 rounded-full object-cover bg-slate-100 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-[#137fec]/10 text-[#137fec] flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {getInitials(id.NomeParlamentar)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 group-hover:text-[#137fec] transition-colors">
                            {id.NomeParlamentar}
                          </p>
                          <p className="text-sm text-slate-400">
                            Senador · {id.SiglaPartidoParlamentar} · {id.UfParlamentar}
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-slate-300 group-hover:text-[#137fec] transition-colors">
                          chevron_right
                        </span>
                      </a>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
