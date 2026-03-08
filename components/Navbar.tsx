"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const navLinks = [
  { label: "Início", href: "/" },
  { label: "Alertas", href: "/radar" },
  { label: "Ranking", href: "/ranking" },
  { label: "Parlamentares", href: "/buscar" },
  { label: "Sobre", href: "/sobre" },
];

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-8 w-8 rounded-full bg-[#137fec] flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-white text-base">account_balance</span>
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900">OAPP</span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.href)
                    ? "bg-[#137fec]/10 text-[#137fec] font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mini busca + actions */}
          <div className="flex items-center gap-2">
            <form action="/buscar" method="GET" className="hidden lg:flex items-center relative">
              <span className="material-symbols-outlined absolute left-3 text-slate-400 text-lg pointer-events-none">search</span>
              <input
                type="text"
                name="q"
                placeholder="Buscar parlamentar..."
                className="pl-9 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#137fec]/50 focus:bg-white outline-none w-52 transition-all"
              />
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}
