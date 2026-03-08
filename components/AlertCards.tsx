import Link from "next/link";

const cards = [
  {
    icon: "payments",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    title: "Maiores Gastadores",
    description: "Ranking atualizado dos deputados com maiores despesas da cota parlamentar (CEAP).",
    cta: "Ver ranking",
    href: "/ranking",
  },
  {
    icon: "manage_search",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    title: "Alertas de Transparência",
    description: "Padrões estatísticos detectados automaticamente nos dados públicos da CEAP e da Receita Federal.",
    cta: "Ver alertas",
    href: "/radar",
  },
  {
    icon: "person_search",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    title: "Buscar Parlamentar",
    description: "Pesquise qualquer deputado ou senador por nome, partido ou estado e acesse o perfil completo.",
    cta: "Buscar parlamentar",
    href: "/buscar",
  },
];

export default function AlertCards() {
  return (
    <section className="max-w-7xl mx-auto px-4 pb-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-[#137fec]/20 transition-all group cursor-pointer"
          >
            <div className={`w-12 h-12 ${card.iconBg} rounded-lg flex items-center justify-center mb-4`}>
              <span className={`material-symbols-outlined ${card.iconColor}`}>{card.icon}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{card.title}</h3>
            <p className="text-slate-500 text-sm mb-4 leading-relaxed">{card.description}</p>
            <span className="text-[#137fec] font-semibold text-sm flex items-center gap-1 group-hover:underline">
              {card.cta}
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
