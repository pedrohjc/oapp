// Mapeamento de sigla → cor representativa do partido
const cores: Record<string, string> = {
  PT:          "#CC0000",
  PL:          "#1A3A8F",
  UNIÃO:       "#E8751A",
  PP:          "#005BAC",
  REPUBLICANOS:"#1B5E9B",
  MDB:         "#009933",
  PSD:         "#005BAC",
  PSDB:        "#0066CC",
  PDT:         "#CC0000",
  PSB:         "#FF6600",
  SOLIDARIEDADE:"#FF8C00",
  "PCdoB":     "#CC0000",
  PSOL:        "#FF1F40",
  PODE:        "#00AEEF",
  AVANTE:      "#F7941D",
  CIDADANIA:   "#E8751A",
  PROS:        "#0072BC",
  DC:          "#005BAC",
  PRD:         "#003580",
  AGIR:        "#009933",
};

export function corPartido(sigla: string): string {
  return cores[sigla] ?? "#64748b";
}

export function inicialPartido(sigla: string): string {
  return sigla.slice(0, 2).toUpperCase();
}
