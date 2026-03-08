const BASE = "https://legis.senado.leg.br/dadosabertos";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Senador {
  IdentificacaoParlamentar: {
    CodigoParlamentar: string;
    NomeParlamentar: string;
    NomeCompletoParlamentar: string;
    SexoParlamentar: string;
    FormaTratamento: string;
    UrlFotoParlamentar: string;
    UrlPaginaParlamentar: string;
    EmailParlamentar: string;
    SiglaPartidoParlamentar: string;
    UfParlamentar: string;
  };
  MandatoAtual?: {
    CodigoMandato: string;
    DataInicio: string;
    DataFim: string;
    DescricaoParticipacao: string;
  };
}

export interface SenadorDetalhe {
  DadosBasicosParlamentar: {
    CodigoParlamentar: string;
    NomeParlamentar: string;
    NomeCompletoParlamentar: string;
    DataNascimento: string;
    Naturalidade: string;
    UfNaturalidade: string;
    EnderecoParlamentar: string;
    SitioWeb: string;
  };
  IdentificacaoParlamentar: Senador["IdentificacaoParlamentar"];
  MembroAtualComissoes?: {
    Orgao: Array<{
      CodigoOrgao: string;
      NomeOrgao: string;
      SiglaOrgao: string;
      DescricaoParticipacao: string;
    }>;
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function getXML<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    next: { revalidate: 3600 },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Senado API error: ${res.status} ${path}`);
  return res.json() as Promise<T>;
}

// ─── Senadores ────────────────────────────────────────────────────────────────

export async function getSenadores(): Promise<Senador[]> {
  try {
    const data = await getXML<{
      ListaParlamentarEmExercicio: {
        Parlamentares: { Parlamentar: Senador[] };
      };
    }>("/senador/lista/atual.json");
    return data.ListaParlamentarEmExercicio.Parlamentares.Parlamentar ?? [];
  } catch {
    return [];
  }
}

export async function getSenadorDetalhe(id: string): Promise<SenadorDetalhe | null> {
  try {
    const data = await getXML<{
      DetalheParlamentar: { Parlamentar: SenadorDetalhe };
    }>(`/senador/${id}.json`);
    return data.DetalheParlamentar.Parlamentar;
  } catch {
    return null;
  }
}
