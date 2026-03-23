import { useState, useCallback, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Connection,
} from "reactflow";

/*Importação de componentes responsáveis pelo input de valores das etapas, 
  desenho visual dos nós do funil, análise final dos valores inseridos nos funis 
  e importação das funções auxiliares que controlam a lógica do funil*/

import EntradaValor from "./entradaValor";
import "reactflow/dist/style.css";

import {
  FunnelStepType,
  funnelStepLabels,
} from "./etapasFunil";
import NodesFunil from "./formasFunil";
import Resultados from "./resultados";

import {
  handleEdit,
  atualizarTaxas,
  onConnectFunc,
  excluirEtapa,
  editarEtapa,
  confirmarEtapa
} from "./funcoesFunil";

const nodeTypes = {
  funnelNode: NodesFunil
};

/* Controle incremental de IDs dos nós */
let id = 2;
const getId = () => `${id++}`;

export default function TelaFunil() {

  /* Estado que armazena o nó atualmente em edição, estados do modal de entrada de valores
     estado que define qual etapa será adicionada, estados principais do React Flow (nós e conexões) */
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [currentStepType, setCurrentStepType] = useState<FunnelStepType | null>(null);

  const [selectedStep, setSelectedStep] = useState<FunnelStepType>("ad");

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [mostrarResultados, setMostrarResultados] = useState(false);

  /* Funções locais para: iniciar a edição de um nó, recalcular as taxas de conversão,
     conectar dois nós no fluxo, para excluir uma etapa do funil, para editar os valores 
     de uma etapa, função executada ao confirmar a entrada de dados no modal e 
     função para iniciar a adição de uma nova etapa */

  const handleEditLocal = (nodeId: string) => {
    handleEdit(
      nodeId,
      nodes,
      setCurrentStepType,
      setInputValue,
      setEditingNodeId,
      setIsModalOpen
    );
  };

  const atualizarTaxasLocal = (nodeId: string, nodesAtual: any[], edgesAtual: any[]) => {
    atualizarTaxas(nodeId, nodesAtual, edgesAtual, setNodes);
  };

  useEffect(() => {
    const handler = (e: any) => {
      const nodeId = e.detail;

      console.log("EVENTO GLOBAL", nodeId);

      const node = nodes.find((n) => n.id === nodeId);
      if (!node) return;

      setCurrentStepType(node.data.stepType);
      setInputValue(node.data.value || "");
      setEditingNodeId(nodeId);
      setIsModalOpen(true);
    };

    window.addEventListener("editNode", handler);

    return () => {
      window.removeEventListener("editNode", handler);
    };
  }, [nodes]);
  
  const onConnect = useCallback(
    (params: Connection) => {
      onConnectFunc(
        params,
        edges,
        nodes,
        setEdges,
        (source: string, n: any[], e: any[]) =>
          atualizarTaxas(source, n, e, setNodes)
      );
    },
    [edges, nodes]
  );

  const excluirEtapaLocal = (nodeId: string) => {
    excluirEtapa(nodeId, setNodes, setEdges);
  };

  const editarEtapaLocal = (nodeId: string, novoValor: string) => {
    editarEtapa(
      nodeId,
      novoValor,
      setNodes,
      edges,
      atualizarTaxasLocal,
      handleEditLocal,
      excluirEtapaLocal
    );
  };

  const confirmarEtapaLocal = () => {
    confirmarEtapa(
      currentStepType,
      editingNodeId,
      inputValue,
      setNodes,
      setIsModalOpen,
      setEditingNodeId,
      handleEditLocal,
      excluirEtapaLocal,
      editarEtapaLocal,
      funnelStepLabels,
      getId
    );
  };

  const addEtapa = (stepType: FunnelStepType) => {
    setCurrentStepType(stepType);
    setInputValue("");
    setEditingNodeId(null);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full h-full">

      {/* Estilização da Barra superior de controle para adicionar etapas ao funil e botões */}

      <div className="p-[13px] bg-gray-900 rounded-xl shadow-[0_4px_12px_rgba(99,99,99,0.34)] flex items-center w-600 gap-[27px] border border-gray-00 text-white">

        <span className="font-semibold ml-[18px] text-[20px]">
          Defina a etapa que você quer adicionar:
        </span>

        <select
          value={selectedStep}
          onChange={(e) =>
            setSelectedStep(e.target.value as FunnelStepType)
          }
          className="px-3 py-2 rounded-lg border border-gray-300 text-sm cursor-pointer bg-white text-gray-900"
        >
          {Object.entries(funnelStepLabels).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>

        <button
          onClick={() => addEtapa(selectedStep)}
          className="bg-white text-black px-4 py-2 rounded-lg font-medium cursor-pointer transition duration-200 hover:bg-gray-600 "
        >
          + Adicionar
        </button>

        <button
          onClick={() => setMostrarResultados(true)}
          className="ml-auto bg-white text-black px-4 py-2 rounded-lg font-medium cursor-pointer transition duration-200 hover:bg-gray-600"
        >
          Salvar
        </button>
      </div>

      {/* Modal de entrada de valores */}
      <EntradaValor
        isOpen={isModalOpen}
        stepType={currentStepType}
        value={inputValue}
        onChange={setInputValue}
        onConfirm={confirmarEtapaLocal}
        onCancel={() => setIsModalOpen(false)}
      />

      {/* Área principal onde o funil é construído visualmente */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        {/* Componentes auxiliares de navegação e visualização */}
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>

      {/* Exibição dos resultados finais do funil */}
      {mostrarResultados && <Resultados nodes={nodes} />}
    </div>
  );
}