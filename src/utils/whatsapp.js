/**
 * Monta a mensagem de pedido e o link do WhatsApp.
 */

const currency = (value) =>
  value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function buildOrderMessage({
  items,
  totalPrice,
  customer,
  city,
  orderDate,
  orderTime,
  deliveryLocation,
}) {
  const lines = [];

  lines.push("Olá! Gostaria de fazer um pedido na Dupla Do Açaí.");
  lines.push("");

  // Data e horário são gerados pelo sistema (fuso de Brasília,
  // America/Sao_Paulo) e nunca editáveis pelo cliente.
  if (orderDate && orderTime) {
    lines.push(`Data do pedido: ${orderDate}`);
    lines.push(`Horário do pedido: ${orderTime}`);
    lines.push("");
  }

  lines.push("*Itens do pedido:*");

  items.forEach(({ product, quantity }) => {
    const subtotal = product.price * quantity;
    lines.push(
      `• ${product.name} (${product.size}) — Qtd: ${quantity} — R$ ${currency(
        product.price
      )} un. — Subtotal: R$ ${currency(subtotal)}`
    );
  });

  lines.push("");

  if (city) {
    lines.push(`*Cidade de entrega:* ${city.name} - ${city.state}`);
    if (typeof city.deliveryFee === "number") {
      lines.push(`*Taxa de entrega:* R$ ${currency(city.deliveryFee)}`);
    } else {
      lines.push("*Taxa de entrega:* consultar com a equipe");
    }
  }

  if (customer) {
    const { name, phone, address, number, neighborhood, complement, reference, note } = customer;
    if (name || phone || address || neighborhood || complement || reference || note) {
      lines.push("");
      lines.push("*Dados para entrega:*");
      if (name) lines.push(`Nome: ${name}`);
      if (phone) lines.push(`Telefone: ${phone}`);
      if (address) lines.push(`Endereço: ${address}${number ? `, nº ${number}` : ""}`);
      if (neighborhood) lines.push(`Bairro: ${neighborhood}`);
      if (city) lines.push(`Cidade: ${city.name} - ${city.state}`);
      if (complement) lines.push(`Complemento: ${complement}`);
      if (reference) lines.push(`Ponto de referência: ${reference}`);
      if (note) lines.push(`Observação do pedido: ${note}`);
    }
  }

  if (deliveryLocation?.latitude && deliveryLocation?.longitude) {
    lines.push(
      `Localização enviada pelo cliente: https://www.openstreetmap.org/?mlat=${deliveryLocation.latitude}&mlon=${deliveryLocation.longitude}#map=18/${deliveryLocation.latitude}/${deliveryLocation.longitude}`
    );
  }

  lines.push("");
  const grandTotal =
    typeof city?.deliveryFee === "number" ? totalPrice + city.deliveryFee : totalPrice;
  lines.push(`*Total: R$ ${currency(grandTotal)}*`);

  return lines.join("\n");
}

export function buildWhatsAppLink(phone, message) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
}
