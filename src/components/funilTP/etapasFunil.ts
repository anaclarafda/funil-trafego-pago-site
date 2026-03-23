/* Tipos possíveis de etapas do funil */
export type FunnelStepType =
  | "ad"
  | "landing"
  | "form"
  | "checkout";

/* Interface que define os dados básicos de uma etapa */
export interface FunnelStepData {
  label: string;
  stepType: FunnelStepType;
}

/* Mapeamento dos rótulos exibidos para cada etapa */
export const funnelStepLabels: Record<FunnelStepType, string> = {
  ad: "Anúncio",
  landing: "Landing Page",
  form: "Formulário",
  checkout: "Checkout",
};

import { Edge, Node } from "reactflow";

/* Função responsável por calcular a taxa de conversão entre etapas conectadas */
export const calcularTaxaConversao = (
  nodeId: string,
  nodes: Node[],
  edges: Edge[]
) => {

  /* Filtra todas as conexões que saem do nó atual */
  const conexoes = edges.filter(
    (edge) => edge.source === nodeId
  );

  return conexoes
    .map((edge) => {

      /* Obtém os nós de origem e destino */
      const sourceNode = nodes.find((n) => n.id === edge.source);
      const targetNode = nodes.find((n) => n.id === edge.target);

      if (!sourceNode || !targetNode) return null;

      /* Converte os valores para número */
      const valueSource = Number(sourceNode.data.value);
      const valueTarget = Number(targetNode.data.value);

      /* Evita divisão por zero */
      if (!valueSource) return null;

      /* Calcula a taxa de conversão (%) */
      const taxa = (valueTarget / valueSource) * 100;

      return {
        sourceId: sourceNode.id,
        targetId: targetNode.id,
        taxa: taxa.toFixed(1) 
      };
    })

    /* Remove valores nulos do resultado */
    .filter(Boolean);
};