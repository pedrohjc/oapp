const cards = [
  {
    icon: "payments",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    title: "Maiores Gastadores",
    description: "Ranking atualizado das maiores despesas do mês entre parlamentares federais.",
    cta: "Ver ranking",
  },
  {
    icon: "trending_up",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    title: "Evolução Patrimonial",
    description: "Análise detalhada do crescimento de bens declarados por políticos eleitos.",
    cta: "Explorar dados",
  },
  {
    icon: "event_busy",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    title: "Menor Assiduidade",
    description: "Faltas não justificadas e presença em sessões plenárias e comissões.",
    cta: "Consultar faltas",
  },
];

export default function AlertCards() {
  return (
    <section className="max-w-7xl mx-auto px-4 pb-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className={`w-12 h-12 ${card.iconBg} rounded-lg flex items-center justify-center mb-4`}>
              <span className={`material-symbols-outlined ${card.iconColor}`}>{card.icon}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{card.title}</h3>
            <p className="text-slate-500 text-sm mb-4 leading-relaxed">{card.description}</p>
            <a href="#" className="text-[#137fec] font-semibold text-sm flex items-center gap-1 hover:underline">
              {card.cta}
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
