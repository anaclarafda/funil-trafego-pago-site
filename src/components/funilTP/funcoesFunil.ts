import { addEdge, Connection } from "reactflow";
import { calcularTaxaConversao } from "./etapasFunil";

/* Função para iniciar a edição de um nó */
export const handleEdit = (
  nodeId: string,
  nodes: any[],
  setCurrentStepType: any,
  setInputValue: any,
  setEditingNodeId: any,
  setIsModalOpen: any
) => {
  console.log("handleEdit chamado", nodeId);

  const node = nodes.find((n) => n.id === nodeId);
  if (!node) return;

  setCurrentStepType(node.data.stepType);
  setInputValue(node.data.value || "");
  setEditingNodeId(nodeId);
  setIsModalOpen(true);
};

/* Atualiza as taxas de conversão entre os nós */
export const atualizarTaxas = (
  nodeId: string,
  nodesAtual: any[],
  edgesAtual: any[],
  setNodes: any
) => {
  /* Calcula as taxas com base nas conexões */
  const resultados = calcularTaxaConversao(nodeId, nodesAtual, edgesAtual);

  if (!resultados) return;

  /* Atualiza cada nó com sua respectiva taxa */
  setNodes((nds: any[]) =>
    nds.map((node) => {
      const resultado = resultados.find(r => r?.targetId === node.id);

      if (resultado) {
        return {
          ...node,
          data: {
            ...node.data,
            conversionRate: resultado.taxa
          }
        };
      }

      return node;
    })
  );
};

/* Função executada ao conectar dois nós */
export const onConnectFunc = (
  params: Connection,
  edges: any[],
  nodes: any[],
  setEdges: any,
  atualizarTaxasFn: any
) => {
  /* Adiciona a nova conexão */
  const novosEdges = addEdge(params, edges);
  setEdges(novosEdges);

  /* Recalcula as taxas a partir do nó de origem */
  if (params.source) {
    atualizarTaxasFn(params.source, nodes, novosEdges);
  }
};

/* Remove um nó e suas conexões */
export const excluirEtapa = (
  nodeId: string,
  setNodes: any,
  setEdges: any
) => {
  /* Remove o nó */
  setNodes((nds: any[]) => nds.filter((node) => node.id !== nodeId));

  /* Remove as conexões relacionadas */
  setEdges((eds: any[]) =>
    eds.filter(
      (edge) => edge.source !== nodeId && edge.target !== nodeId
    )
  );
};

/* Atualiza o valor de uma etapa */
export const editarEtapa = (
  nodeId: string,
  novoValor: string,
  setNodes: any,
  edges: any[],
  atualizarTaxasFn: any,
  handleEdit: any,
  excluirEtapaFn: any
) => {
  setNodes((nds: any[]) => {
    const novosNodes = nds.map((node) =>
      node.id === nodeId
        ? {
            ...node,
            data: {
              ...node.data,
              value: novoValor,
              onEdit: handleEdit,
              onDelete: excluirEtapaFn
            }
          }
        : node
    );

    atualizarTaxasFn(nodeId, novosNodes, edges);

    return novosNodes;
  });
};

/* Confirma a criação ou edição de uma etapa */
export const confirmarEtapa = (
  currentStepType: any,
  editingNodeId: string | null,
  inputValue: string,
  setNodes: any,
  setIsModalOpen: any,
  setEditingNodeId: any,
  handleEditLocal: any,
  excluirEtapaFn: any,
  editarEtapaFn: any,
  funnelStepLabels: any,
  getId: any
) => {
  if (!currentStepType) return;

  /* Se estiver editando, atualiza o nó existente */
  if (editingNodeId) {
    editarEtapaFn(editingNodeId, inputValue);
  } else {
    /* Cria um novo nó */
    const newNode = {
      id: getId(),
      position: {
        x: Math.random() * 100,
        y: Math.random() * 100
      },
      type: "funnelNode",
      data: {
        label: funnelStepLabels[currentStepType],
        stepType: currentStepType,
        value: inputValue,
        onEdit: handleEditLocal,
        onDelete: excluirEtapaFn
      }
    };

    setNodes((nds: any) => [...nds, newNode]);
  }

  /* Fecha o modal e limpa estado de edição */
  setIsModalOpen(false);
  setEditingNodeId(null);
};