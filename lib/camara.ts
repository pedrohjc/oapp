const BASE = "https://dadosabertos.camara.leg.br/api/v2";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Deputado {
  id: number;
  nome: string;
  siglaPartido: string;
  siglaUf: string;
  idLegislatura: number;
  urlFoto: string;
  email: string;
}

export interface DeputadoDetalhe extends Deputado {
  cpf: string;
  dataNascimento: string;
  escolaridade: string;
  municipioNascimento: string;
  nomeCivil: string;
  redeSocial: string[];
  website: string;
  ultimoStatus: {
    situacao: string;
    descricaoStatus: string;
    condicaoEleitoral: string;
    nomeEleitoral: string;
    gabinete: { nome: string; predio: string; sala: string; andar: string; telefone: string; email: string };
    id: number;
    nome: string;
    siglaPartido: string;
    uriPartido: string;
    siglaUf: string;
    idLegislatura: number;
    urlFoto: string;
    data: string;
  };
}

export interface Despesa {
  ano: number;
  mes: number;
  tipoDespesa: string;
  codDocumento: string;
  tipoDocumento: string;
  codTipoDocumento: number;
  dataDocumento: string;
  numDocumento: string;
  valorDocumento: number;
  urlDocumento: string;
  nomeFornecedor: string;
  cnpjCpfFornecedor: string;
  valorLiquido: number;
  valorGlosa: number;
  numRessarcimento: string;
  codLote: number;
  parcela: number;
}

export interface Discurso {
  dataHoraInicio: string;
  dataHoraFim: string | null;
  tipoDiscurso: string;
  urlTexto: string | null;
  urlAudio: string | null;
  urlVideo: string | null;
  keywords: string | null;
  sumario: string | null;
  transcricao: string | null;
}

export interface Orgao {
  idOrgao: number;
  uriOrgao: string;
  siglaOrgao: string;
  nomeOrgao: string;
  nomePublicacao: string;
  titulo: string;
  codTitulo: string;
  dataInicio: string;
  dataFim: string | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function get<T>(path: string, params: Record<string, string | number> = {}): Promise<T> {
  const url = new URL(`${BASE}${path}`);

  // Só aplica itens como padrão — ordenarPor e ordem variam por endpoint
  const defaults: Record<string, string | number> = { itens: 20 };
  const merged = { ...defaults, ...params };
  Object.entries(merged).forEach(([k, v]) => url.searchParams.set(k, String(v)));

  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 },
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(8000),
  });

  if (!res.ok) throw new Error(`Câmara API error: ${res.status} ${path}`);
  const json = await res.json();
  return json.dados as T;
}

// ─── Deputados ────────────────────────────────────────────────────────────────

export async function getDeputados(params?: {
  siglaUf?: string;
  siglaPartido?: string;
  nome?: string;
  itens?: number;
}): Promise<Deputado[]> {
  return get<Deputado[]>("/deputados", {
    itens: params?.itens ?? 20,
    ...(params?.siglaUf && { siglaUf: params.siglaUf }),
    ...(params?.siglaPartido && { siglaPartido: params.siglaPartido }),
    ...(params?.nome && { nome: params.nome }),
    ordenarPor: "nome",
    ordem: "ASC",
  });
}

export async function buscarDeputados(query: string): Promise<Deputado[]> {
  const q = query.trim();
  if (!q) return [];

  // Busca paralela por nome, partido e UF — a API aceita cada um separadamente
  const [porNome, porPartido, porUf] = await Promise.all([
    get<Deputado[]>("/deputados", { nome: q, itens: 20, ordenarPor: "nome", ordem: "ASC" }).catch(() => []),
    get<Deputado[]>("/deputados", { siglaPartido: q.toUpperCase(), itens: 50, ordenarPor: "nome", ordem: "ASC" }).catch(() => []),
    get<Deputado[]>("/deputados", { siglaUf: q.toUpperCase(), itens: 50, ordenarPor: "nome", ordem: "ASC" }).catch(() => []),
  ]);

  // Merge sem duplicatas, por ID
  const vistos = new Set<number>();
  const resultado: Deputado[] = [];
  for (const dep of [...porNome, ...porPartido, ...porUf]) {
    if (!vistos.has(dep.id)) {
      vistos.add(dep.id);
      resultado.push(dep);
    }
  }
  return resultado.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
}

export async function getDeputadoDetalhe(id: number): Promise<DeputadoDetalhe> {
  const res = await fetch(`${BASE}/deputados/${id}`, {
    next: { revalidate: 3600 },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Deputado ${id} não encontrado`);
  const json = await res.json();
  return json.dados as DeputadoDetalhe;
}

export async function getDespesasDeputado(id: number, ano?: number): Promise<Despesa[]> {
  return get<Despesa[]>(`/deputados/${id}/despesas`, {
    itens: 20,
    ordem: "DESC",
    ordenarPor: "dataDocumento",
    ...(ano && { ano }),
  });
}

// Tenta o ano atual; se vazio, cai para o ano anterior
export async function getDespesasRecentes(
  id: number
): Promise<{ despesas: Despesa[]; ano: number }> {
  const anoCorrente = new Date().getFullYear();
  for (const ano of [anoCorrente, anoCorrente - 1]) {
    try {
      const despesas = await getDespesasDeputado(id, ano);
      if (despesas.length > 0) return { despesas, ano };
    } catch {
      // continua para o próximo ano
    }
  }
  return { despesas: [], ano: anoCorrente };
}

export async function getDiscursosDeputado(id: number): Promise<Discurso[]> {
  return get<Discurso[]>(`/deputados/${id}/discursos`, {
    itens: 8,
    ordenarPor: "dataHoraInicio",
    ordem: "DESC",
  });
}

export async function getOrgaosDeputado(id: number): Promise<Orgao[]> {
  return get<Orgao[]>(`/deputados/${id}/orgaos`, { itens: 10 });
}

export async function getDeputadosComTotalGastos(ano: number, itens = 50): Promise<
  Array<Deputado & { totalGastos: number }>
> {
  const deputados = await getDeputados({ itens });
  const totais = await Promise.all(
    deputados.map(async (dep) => {
      try {
        const despesas = await getDespesasDeputado(dep.id, ano);
        const total = despesas.reduce((acc, d) => acc + (d.valorLiquido ?? 0), 0);
        return { ...dep, totalGastos: total };
      } catch {
        return { ...dep, totalGastos: 0 };
      }
    })
  );
  return totais.sort((a, b) => b.totalGastos - a.totalGastos);
}
