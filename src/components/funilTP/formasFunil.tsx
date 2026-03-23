import { Handle, Position } from "reactflow";

/* Componente responsável por renderizar visualmente cada etapa do funil */
export default function FormasFunil({ id, data }: any) {

  /* Desestruturação dos dados do nó */
  const { stepType, label, value, onEdit, onDelete, conversionRate } = data;

  /* Define a taxa final (anúncio sempre começa com 100%) */
  const finalConversionRate =
    stepType === "ad" ? 100 : conversionRate;

  /* Define o estilo da forma com base no tipo da etapa */
  const getShapeStyle = () => {
    switch (stepType) {

      /* Forma do topo do funil (anúncio) */
      case "ad":
        return {
          background: "#670270",
          clipPath: "polygon(0% 0%, 100% 0%, 94% 100%, 6% 100%)"
        };

      /* Landing page */
      case "landing":
        return {
          background: "#9e04ac",
          clipPath: "polygon(6% 0%, 94% 0%, 88% 100%, 12% 100%)"
        };

      /* Formulário */
      case "form":
        return {
          background: "#c108c7",
          clipPath: "polygon(12% 0%, 88% 0%, 82% 100%, 18% 100%)"
        };

      /* Checkout (final do funil) */
      case "checkout":
        return {
          background: "#f101f1",
          clipPath: "polygon(18% 0%, 82% 0%, 50% 100%)"
        };

      default:
        return {};
    }
  };

  return (
    <div className="relative w-[180px] h-[55px] flex items-center justify-center">

      {/* Ponto de entrada da conexão */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-white border-2 border-gray-700"
      />

      {/* Forma visual do nó */}
      <div
        style={getShapeStyle()}
        className="w-full h-full flex flex-col items-center justify-center text-white text-center px-2"
      >
        {/* Nome da etapa */}
        <div className="font-semibold text-[10px]">
          {label}
        </div>

        {/* Valor inserido pelo usuário */}
        {value && (
          <div className="text-[9px] opacity-90">
            {data.value}
          </div>
        )}

        {/* Taxa de conversão da etapa */}
        {finalConversionRate !== undefined && (
          <div className="text-[9px] font-semibold text-black">
            {finalConversionRate}%
          </div>
        )}
      </div>

      {/* Botões de ação (editar e excluir) */}
      <div className="absolute -top-2 -right-2 flex gap-1 text-[7px]">
        <button onClick={() => {
          console.log("clicou editar", id);
          window.dispatchEvent(new CustomEvent("editNode", { detail: id }));
        }}>editar</button>

        <button
          onClick={() => onDelete(id)}
          className="bg-red-500 text-white px-1 rounded shadow hover:bg-red-600"
        >
          ✕
        </button>
      </div>

      {/* Ponto de saída da conexão */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-white border-2 border-gray-700"
      />
    </div>
  );
}