/**
 * Informações da empresa.
 * Edite este arquivo para atualizar contatos, cidades atendidas,
 * link do Instagram e taxas de entrega.
 */

export const business = {
  name: "Dupla Do Açaí",
  slogan: "Sabor, energia e praticidade para o seu dia!",
  instagram: {
    handle: "@dupladoacai.12",
    // Link completo do Instagram. Já configurado com o @ informado.
    url: "https://www.instagram.com/dupladoacai.12/",
  },
  whatsapp: {
    edna: {
      name: "Edna",
      // Apenas números, com DDI 55 + DDD, usado para montar o link wa.me
      phone: "5585991745812",
      displayPhone: "(85) 99174-5812",
    },
    patricia: {
      name: "Patrícia",
      phone: "5585989753320",
      displayPhone: "(85) 98975-3320",
    },
  },
  cities: [
    {
      id: "redencao",
      name: "Redenção",
      state: "CE",
      // Entrega totalmente gratuita.
      deliveryFee: 0,
    },
    {
      id: "acarape",
      name: "Acarape",
      state: "CE",
      deliveryFee: 0,
    },
  ],
};
