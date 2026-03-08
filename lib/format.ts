// ─── Formatadores utilitários ─────────────────────────────────────────────────

export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export function getInitials(name?: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function getRiscoLabel(valor: number): { label: string; color: string } {
  if (valor > 30000) return { label: "Alto Risco", color: "bg-red-100 text-red-700" };
  if (valor > 10000) return { label: "Médio", color: "bg-amber-100 text-amber-700" };
  return { label: "Normal", color: "bg-green-100 text-green-700" };
}

export function anoAtual(): number {
  return new Date().getFullYear();
}
