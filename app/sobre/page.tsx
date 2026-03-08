import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SobrePage() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-11 rounded-2xl bg-[#137fec]/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#137fec] text-2xl">account_balance</span>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">Sobre o OAPP</h1>
              <p className="text-slate-400 text-sm">Plataforma independente de fiscalização pública</p>
            </div>
          </div>
        </div>

        {/* Seções */}
        <div className="space-y-10">

          {/* O que é */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#137fec] text-lg">info</span>
              O que é o OAPP
            </h2>
            <div className="text-slate-600 text-sm leading-relaxed space-y-3">
              <p>
                O OAPP é uma plataforma independente e sem fins lucrativos que reúne dados públicos sobre parlamentares brasileiros,
                com foco na Cota para o Exercício da Atividade Parlamentar (CEAP) — verba paga com dinheiro público para custear
                despesas dos deputados federais no exercício de seu mandato.
              </p>
              <p>
                O objetivo é facilitar o acesso da população a informações já disponíveis em fontes oficiais, tornando-as
                mais acessíveis e fáceis de compreender.
              </p>
            </div>
          </section>

          {/* Fontes de dados */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#137fec] text-lg">database</span>
              Fontes de Dados
            </h2>
            <div className="text-slate-600 text-sm leading-relaxed space-y-3">
              <p>Todos os dados exibidos nesta plataforma são obtidos exclusivamente de fontes oficiais e públicas:</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-emerald-500 text-base flex-shrink-0 mt-0.5">check_circle</span>
                  <span>
                    <strong>Câmara dos Deputados</strong> — dados de parlamentares, despesas CEAP, discursos e comissões,
                    obtidos via API pública em{" "}
                    <a href="https://dadosabertos.camara.leg.br" target="_blank" rel="noopener noreferrer" className="text-[#137fec] underline">
                      dadosabertos.camara.leg.br
                    </a>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-emerald-500 text-base flex-shrink-0 mt-0.5">check_circle</span>
                  <span>
                    <strong>Receita Federal (via BrasilAPI)</strong> — informações cadastrais de fornecedores (CNPJ), como
                    situação cadastral, porte e data de abertura, obtidas via{" "}
                    <a href="https://brasilapi.com.br" target="_blank" rel="noopener noreferrer" className="text-[#137fec] underline">
                      brasilapi.com.br
                    </a>
                  </span>
                </li>
              </ul>
              <p>
                O OAPP não coleta, armazena nem modifica dados pessoais de parlamentares ou fornecedores.
                Todos os dados são consumidos diretamente das APIs originais e podem ser verificados nas fontes listadas acima.
              </p>
            </div>
          </section>

          {/* Alertas de Transparência */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#137fec] text-lg">manage_search</span>
              Alertas de Transparência — Metodologia
            </h2>
            <div className="text-slate-600 text-sm leading-relaxed space-y-3">
              <p>
                A seção de Alertas de Transparência aplica critérios estatísticos automatizados sobre os dados públicos
                da CEAP para identificar padrões que se desviam do comportamento médio observado no conjunto de parlamentares.
              </p>
              <p>
                <strong>Importante:</strong> a detecção de um padrão não implica ilegalidade, irregularidade ou intenção fraudulenta.
                O sistema é uma ferramenta de apoio à fiscalização cidadã, não um mecanismo de acusação.
                Os alertas devem ser interpretados apenas como pontos de partida para investigação adicional pelo usuário ou por órgãos competentes.
              </p>

              <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden mt-4">
                <div className="px-4 py-3 border-b border-slate-200 bg-slate-100">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">Critérios utilizados</p>
                </div>
                <div className="divide-y divide-slate-100">
                  {[
                    {
                      titulo: "Concentração em Fornecedor Único",
                      desc: "70%+ dos gastos direcionados a um único CNPJ.",
                      pts: "+35 pts",
                    },
                    {
                      titulo: "Concentração em Fornecedor (moderada)",
                      desc: "50–69% dos gastos para um único CNPJ.",
                      pts: "+18 pts",
                    },
                    {
                      titulo: "Gastos Concentrados no Final do Ano",
                      desc: "Mais de 55% dos gastos anuais nos meses de novembro e dezembro.",
                      pts: "+18 pts",
                    },
                    {
                      titulo: "Alta Diversidade de Fornecedores",
                      desc: "Proporção de fornecedores distintos muito próxima ao número de lançamentos (>15 fornecedores).",
                      pts: "+10 pts",
                    },
                    {
                      titulo: "Fornecedor com Cadastro Irregular na Receita Federal",
                      desc: "CNPJ com situação diferente de 'Ativa' segundo a Receita Federal.",
                      pts: "+30 pts",
                    },
                    {
                      titulo: "Microempresa com Valor Elevado Recebido",
                      desc: "MEI ou ME recebendo mais de R$12.000 da cota parlamentar.",
                      pts: "+22 pts",
                    },
                    {
                      titulo: "Fornecedor com Pouco Tempo de Atividade",
                      desc: "CNPJ aberto há menos de 12 meses quando recebeu o primeiro pagamento.",
                      pts: "+28 pts",
                    },
                  ].map((c) => (
                    <div key={c.titulo} className="px-4 py-3 flex items-start gap-3">
                      <span className="text-xs font-mono text-slate-400 flex-shrink-0 mt-0.5 w-16 text-right">{c.pts}</span>
                      <div>
                        <p className="text-xs font-semibold text-slate-700">{c.titulo}</p>
                        <p className="text-xs text-slate-500">{c.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-500">
                O índice total é limitado a 100 pontos. Parlamentares com índice ≥ 55 são classificados como "Padrão Incomum";
                entre 20 e 54, como "Em Observação"; abaixo de 20, sem alerta.
              </p>
            </div>
          </section>

          {/* Limitações */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#137fec] text-lg">warning</span>
              Limitações e Avisos Legais
            </h2>
            <div className="text-slate-600 text-sm leading-relaxed space-y-3">
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 flex-shrink-0">•</span>
                  Os dados dependem da disponibilidade e atualidade das APIs oficiais. Pode haver atrasos ou inconsistências.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 flex-shrink-0">•</span>
                  Os alertas são gerados por algoritmos e não passam por revisão humana individual.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 flex-shrink-0">•</span>
                  Nenhuma informação nesta plataforma constitui acusação, denúncia formal ou parecer jurídico.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 flex-shrink-0">•</span>
                  O OAPP não tem vinculação com partidos políticos, grupos de interesse ou órgãos governamentais.
                </li>
              </ul>
            </div>
          </section>

          {/* Reportar erro */}
          <section className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-500 text-lg">flag</span>
              Encontrou um erro?
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              Se você identificou dados incorretos, alertas equivocados ou qualquer outro problema,
              registre uma issue no repositório público do projeto no GitHub. Sua contribuição é importante.
            </p>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors"
            >
              <span className="material-symbols-outlined text-base">open_in_new</span>
              Reportar no GitHub
            </a>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
