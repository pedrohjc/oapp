export default function Hero() {
  return (
    <section className="py-20 px-4 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 text-slate-900 leading-tight">
          Seu dinheiro. Seu governo.{" "}
          <br />
          <span className="text-[#137fec]">Seus dados.</span>
        </h1>
        <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          Monitore gastos públicos, acompanhe o desempenho de parlamentares e
          fiscalize a gestão do seu país em tempo real.
        </p>

        {/* Search — form real que navega para /buscar */}
        <form action="/buscar" method="GET" className="relative max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-slate-400">search</span>
          </div>
          <input
            type="text"
            name="q"
            placeholder="Pesquise por parlamentar, partido ou estado..."
            className="block w-full pl-12 pr-36 py-4 bg-white border border-slate-200 rounded-xl shadow-lg shadow-[#137fec]/5 focus:ring-2 focus:ring-[#137fec] focus:border-transparent outline-none transition-all text-base"
          />
          <div className="absolute inset-y-2 right-2">
            <button type="submit" className="h-full px-6 bg-[#137fec] text-white font-bold rounded-lg hover:bg-[#137fec]/90 transition-colors">
              Buscar
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
