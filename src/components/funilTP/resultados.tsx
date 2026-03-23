export default function Resultados({ nodes }: any) {

  /* Se não houver nós, não exibe nada */
  if (!nodes.length) return null;

  /* Filtra apenas nós que possuem taxa de conversão (exceto anúncios pois essa é sempre 100%) */
  const nodesComTaxa = nodes.filter(
    (n: any) =>
      n.data.conversionRate !== undefined &&
      n.data.stepType !== "ad"
  );
  if (!nodesComTaxa.length) return null;

  /* Identifica o nó com pior taxa de conversão */
  const piorNode = nodesComTaxa.reduce((pior: any, atual: any) =>
    atual.data.conversionRate < pior.data.conversionRate
      ? atual
      : pior
  );

  /* Retorna uma mensagem de recomendação baseada na etapa */
  const aviso = () => {
    switch (piorNode.data.stepType) {

      case "landing":
        return (
          <>
            Você precisa focar na sua Landing Page! <br />
            Que tal melhorar o design, tempo de carregamento e clareza da oferta?
          </>
        );

      case "form":
        return (
          <>
            Seu formulário pode estar causando desistência. <br />
            Tente reduzir campos e melhorar a usabilidade.
          </>
        );

      case "checkout":
        return (
          <>
            O problema está no checkout! <br />
            Revise formas de pagamento, confiança e possíveis erros na finalização.
          </>
        );

      case "ad":
        return (
          <>
            Seus anúncios não estão performando bem. <br />
            Revise público, criativo e segmentação.
          </>
        );

      /* Caso padrão */
      default:
        return "Revise essa etapa para melhorar sua conversão.";
    }
  };

  return (
    <div>
      {/* Estilização de Card fixo que exibe o resultado na tela, junto com uma Mensagem de recomendação   */}
      <div className="fixed top-[210px] right-[35px] text-white bg-gray-800 border border-white p-4 rounded-xl shadow-xl z-[9999] max-w-[380px]">
        
        <div className="text-[19px] mb-2 font-semibold ">
          Pior etapa
        </div>

        <strong className="text-[17px]">
          {piorNode.data.label} - {piorNode.data.conversionRate}% de conversão
        </strong>

        <div className="mt-2 mb-2 text-[14px] leading-relaxed">
          {aviso()}
        </div>

      </div>
    </div>
  );
}