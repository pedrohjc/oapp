const links = {
  Explorar: ["Gastos por Partido", "Quadro de Horários", "Mapa de Despesas"],
  Dados: ["Portal da Transparência", "API Pública", "Metodologia"],
  Institucional: ["Quem Somos", "Contato", "Privacidade"],
};

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-7 w-7 rounded-full bg-[#137fec] flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-sm">account_balance</span>
              </div>
              <span className="text-xl font-black tracking-tighter text-slate-900">OAPP</span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Plataforma independente de fiscalização pública. Unindo tecnologia e cidadania por um Brasil mais limpo.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h4 className="font-bold mb-4 text-slate-900 text-sm">{section}</h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-slate-500 hover:text-[#137fec] transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 text-center text-sm text-slate-400">
          © 2026 OAPP. Dados extraídos de fontes oficiais.
        </div>
      </div>
    </footer>
  );
}
