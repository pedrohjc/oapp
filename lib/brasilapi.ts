const BASE = "https://brasilapi.com.br/api/cnpj/v1";

export interface EmpresaCNPJ {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  data_inicio_atividade: string; // "YYYY-MM-DD"
  porte: string; // "MEI", "ME", "EPP", "DEMAIS", ""
  situacao_cadastral: number; // 2=Ativa, 4=Inativa, etc.
  descricao_situacao_cadastral: string; // "ATIVA", "BAIXADA", "INAPTA"
  uf: string;
  municipio: string;
  natureza_juridica: string;
  descricao_natureza_juridica: string;
  qsa?: Array<{ nome_socio: string; qualificacao_socio: string }>;
}

export async function getCNPJ(cnpj: string): Promise<EmpresaCNPJ | null> {
  const clean = cnpj.replace(/\D/g, "");
  if (clean.length !== 14) return null;
  try {
    const res = await fetch(`${BASE}/${clean}`, {
      next: { revalidate: 86400 }, // 24h — dados de CNPJ não mudam frequentemente
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
