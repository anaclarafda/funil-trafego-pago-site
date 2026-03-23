import { useEffect, useRef } from "react";
import { FunnelStepType } from "./etapasFunil";

/* Interface que define as propriedades do componente */
interface EntradaValorProps {
  isOpen: boolean;
  stepType: FunnelStepType | null;
  value: string;
  onChange: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

/* Mensagens exibidas de acordo com o tipo de etapa */
const mensagensInput: Record<FunnelStepType, string> = {
  ad: "Digite o número de impressões:",
  landing: "Digite o número de cliques:",
  form: "Digite o número de leads:",
  checkout: "Digite o número de vendas:",
};

/* Componente responsável pelo modal de entrada de valores */
export default function EntradaValor({
  isOpen,
  stepType,
  value,
  onChange,
  onConfirm,
  onCancel,
}: EntradaValorProps) {

  /* Referência para o input */
  const inputRef = useRef<HTMLInputElement>(null);

  /* Foca automaticamente no input ao abrir o modal */
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  /* Permite fechar o modal ao pressionar a tecla ESC */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onCancel]);

  /* Não renderiza o modal se estiver fechado */
  if (!isOpen || !stepType) return null;

  /* Validação do valor inserido */
  const isInvalid = value.trim() === "" || Number(value) < 0;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000]">
      
      {/* Caixa do modal */}
      <div className="bg-white p-7 rounded-2xl w-[360px] shadow-xl">
        
        {/* Título do modal */}
        <h3 className="mb-4 text-lg font-semibold">
          {mensagensInput[stepType]}
        </h3>

        {/* Formulário de entrada */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!isInvalid) {
              onConfirm();
            }
          }}
          className="flex flex-col gap-4"
        >
          {/* Campo de entrada numérica */}
          <input
            ref={inputRef}
            type="number"
            min="0"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Digite o valor"
            className="px-3 py-2 rounded-xl border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Botões de ação */}
          <div className="flex justify-end gap-3">

            {/* Botão de cancelamento */}
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 hover:bg-gray-200 transition"
            >
              Cancelar
            </button>

            {/* Botão de confirmação */}
            <button
              type="submit"
              disabled={isInvalid}
              className={`px-4 py-2 rounded-lg text-white transition ${
                isInvalid
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Confirmar
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}