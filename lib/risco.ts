import type { Despesa } from "./camara";
import type { EmpresaCNPJ } from "./brasilapi";

export type NivelAlerta = "atencao" | "observacao" | "normal";

export interface AlertaTransparencia {
  id: string;
  nivel: NivelAlerta;
  titulo: string;
  descricao: string;
  pontos: number;
}

export interface AnaliseResult {
  indice: number; // 0–100
  nivel: NivelAlerta;
  alertas: AlertaTransparencia[];
}

function brl(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);
}

export function calcularRisco(
  despesas: Despesa[],
  empresas?: Record<string, EmpresaCNPJ | null>
): AnaliseResult {
  const alertas: AlertaTransparencia[] = [];
  let score = 0;

  if (despesas.length === 0) return { indice: 0, nivel: "normal", alertas: [] };

  const total = despesas.reduce((acc, d) => acc + (d.valorLiquido ?? 0), 0);

  // ── 1. Concentração em único fornecedor ──────────────────────────────────
  const porFornecedor = despesas.reduce<Record<string, { valor: number; nome: string }>>((acc, d) => {
    const key = d.cnpjCpfFornecedor || d.nomeFornecedor || "desconhecido";
    if (!acc[key]) acc[key] = { valor: 0, nome: d.nomeFornecedor || key };
    acc[key].valor += d.valorLiquido ?? 0;
    return acc;
  }, {});

  const topFornecedor = Object.entries(porFornecedor).sort((a, b) => b[1].valor - a[1].valor)[0];

  if (topFornecedor && total > 0) {
    const pct = (topFornecedor[1].valor / total) * 100;
    if (pct >= 70) {
      const pts = 35;
      score += pts;
      alertas.push({
        id: "concentracao_extrema",
        nivel: "atencao",
        titulo: "Concentração em Fornecedor Único",
        descricao: `${pct.toFixed(0)}% da cota foi destinada a um único fornecedor: ${topFornecedor[1].nome}. Este índice está acima do padrão observado entre parlamentares de perfil similar.`,
        pontos: pts,
      });
    } else if (pct >= 50) {
      const pts = 18;
      score += pts;
      alertas.push({
        id: "concentracao_alta",
        nivel: "observacao",
        titulo: "Concentração Elevada em Fornecedor",
        descricao: `${pct.toFixed(0)}% dos gastos foram para ${topFornecedor[1].nome}. A distribuição entre fornecedores está abaixo da média de parlamentares com perfil similar.`,
        pontos: pts,
      });
    }
  }

  // ── 2. Concentração de gastos em novembro/dezembro ────────────────────────
  const gastoNovDez = despesas
    .filter((d) => d.mes >= 11)
    .reduce((acc, d) => acc + (d.valorLiquido ?? 0), 0);
  const pctNovDez = total > 0 ? (gastoNovDez / total) * 100 : 0;

  if (pctNovDez >= 55 && total > 8000) {
    const pts = 18;
    score += pts;
    alertas.push({
      id: "pico_fim_ano",
      nivel: "observacao",
      titulo: "Gastos Concentrados no Final do Ano",
      descricao: `${pctNovDez.toFixed(0)}% dos gastos do período estão nos 2 últimos meses do ano. Este padrão pode indicar concentração de uso da cota no encerramento do exercício.`,
      pontos: pts,
    });
  }

  // ── 3. Alta diversidade de fornecedores por lançamento ─────────────────
  const totalFornecedores = Object.keys(porFornecedor).length;
  if (totalFornecedores > 15 && despesas.length < totalFornecedores + 3) {
    const pts = 10;
    score += pts;
    alertas.push({
      id: "alta_diversidade",
      nivel: "observacao",
      titulo: "Alta Diversidade de Fornecedores",
      descricao: `${totalFornecedores} fornecedores distintos registrados — proporção elevada em relação ao número de lançamentos. Recomenda-se verificação da regularidade de cada contratação.`,
      pontos: pts,
    });
  }

  // ── 4. Verificação de CNPJ via Receita Federal ────────────────────────────
  if (empresas) {
    for (const [cnpj, empresa] of Object.entries(empresas)) {
      if (!empresa) continue;

      const valorPago = porFornecedor[cnpj]?.valor ?? 0;

      // 4a. Empresa com situação diferente de Ativa
      const situacaoNormal = empresa.descricao_situacao_cadastral?.toUpperCase() === "ATIVA";
      if (!situacaoNormal && empresa.descricao_situacao_cadastral) {
        const pts = 30;
        score += pts;
        alertas.push({
          id: `cnpj_irregular_${cnpj}`,
          nivel: "atencao",
          titulo: "Fornecedor com Cadastro Irregular na Receita Federal",
          descricao: `${empresa.razao_social} consta como "${empresa.descricao_situacao_cadastral}" no cadastro da Receita Federal e recebeu ${brl(valorPago)} da cota parlamentar. Dados obtidos via BrasilAPI.`,
          pontos: pts,
        });
      }

      // 4b. MEI/ME com valor elevado
      const porte = empresa.porte?.toUpperCase() ?? "";
      const isMicro = porte === "MEI" || porte === "ME";
      if (isMicro && valorPago > 12000) {
        const pts = 22;
        score += pts;
        alertas.push({
          id: `mei_alto_valor_${cnpj}`,
          nivel: "atencao",
          titulo: "Microempresa com Valor Elevado Recebido",
          descricao: `${empresa.razao_social} está registrada como ${empresa.porte} e recebeu ${brl(valorPago)} da cota. O valor recebido está acima da média para empresas deste porte.`,
          pontos: pts,
        });
      }

      // 4c. Empresa com pouco tempo de atividade no primeiro pagamento
      if (empresa.data_inicio_atividade) {
        const abertura = new Date(empresa.data_inicio_atividade);
        const primeiraDespesa = despesas
          .filter((d) => (d.cnpjCpfFornecedor || "") === cnpj)
          .sort((a, b) => new Date(a.dataDocumento).getTime() - new Date(b.dataDocumento).getTime())[0];

        if (primeiraDespesa?.dataDocumento) {
          const dataDespesa = new Date(primeiraDespesa.dataDocumento);
          const meses = Math.round(
            (dataDespesa.getTime() - abertura.getTime()) / (1000 * 60 * 60 * 24 * 30)
          );
          if (meses >= 0 && meses < 12) {
            const pts = 28;
            score += pts;
            alertas.push({
              id: `empresa_jovem_${cnpj}`,
              nivel: "atencao",
              titulo: "Fornecedor com Pouco Tempo de Atividade",
              descricao: `${empresa.razao_social} tinha ${meses} ${meses === 1 ? "mês" : "meses"} de existência quando recebeu o primeiro pagamento desta cota (${brl(valorPago)}). Dado obtido via Receita Federal/BrasilAPI.`,
              pontos: pts,
            });
          }
        }
      }
    }
  }

  score = Math.min(score, 100);

  // Nível derivado do alerta mais grave (evita inconsistência entre painel e badges individuais)
  const nivel: NivelAlerta = alertas.some((a) => a.nivel === "atencao")
    ? "atencao"
    : alertas.some((a) => a.nivel === "observacao")
    ? "observacao"
    : "normal";

  return { indice: score, nivel, alertas };
}
