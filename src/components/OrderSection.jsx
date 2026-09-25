import { useState } from "react";
import { business } from "../data/business";
import { buildOrderMessage, buildWhatsAppLink } from "../utils/whatsapp";
import { WhatsAppIcon } from "./Icons";
import { useBusinessHours } from "../hooks/useBusinessHours";
import { getStoreStatus, getBrasiliaNow } from "../utils/timezone";
import { saveOrder } from "../services/orders";
import LocationAssist from "./LocationAssist";

const emptyCustomer = {
  name: "",
  phone: "",
  address: "",
  number: "",
  neighborhood: "",
  complement: "",
  reference: "",
  note: "",
};

export default function OrderSection({ items, totalPrice, onIncrement, onDecrement }) {
  const [cityId, setCityId] = useState("");
  const [customer, setCustomer] = useState(emptyCustomer);
  const [deliveryLocation, setDeliveryLocation] = useState(null); // { latitude, longitude }
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const { hours, enforced } = useBusinessHours();

  const city = business.cities.find((c) => c.id === cityId) || null;

  const handleChange = (field) => (e) =>
    setCustomer((prev) => ({ ...prev, [field]: e.target.value }));

  const handleLocationApply = (result) => {
    if (!result) return;
    setCustomer((prev) => ({
      ...prev,
      address: result.street || prev.address,
      neighborhood: result.neighborhood || prev.neighborhood,
    }));
    if (result.matchedCity) {
      setCityId(result.matchedCity.id);
    }
    if (typeof result.latitude === "number" && typeof result.longitude === "number") {
      setDeliveryLocation({ latitude: result.latitude, longitude: result.longitude });
    }
  };

  const validate = () => {
    if (items.length === 0) {
      return "Adicione pelo menos um sabor ao pedido antes de finalizar.";
    }
    if (!customer.name.trim()) return "Informe seu nome.";
    if (!customer.phone.trim()) return "Informe seu telefone.";
    if (!cityId) return "Selecione a cidade de entrega.";

    const allowedCityIds = business.cities.map((c) => c.id);
    if (!allowedCityIds.includes(cityId)) {
      return "Atendemos somente Redenção e Acarape.";
    }

    if (!customer.address.trim() || !customer.neighborhood.trim()) {
      return "Informe o endereço completo e o bairro para entrega manual.";
    }
    return "";
  };

  const handleSend = async (contactKey) => {
    if (sending) return; // evita pedido duplicado por clique repetido

    if (!navigator.onLine) {
      setError("Você está offline. Conecte-se à internet para finalizar seu pedido.");
      return;
    }

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    // Verifica o horário de funcionamento de novo, agora, no momento do
    // envio — não confia apenas na verificação feita quando a página
    // carregou (o cliente pode ter deixado a aba aberta por horas).
    if (enforced) {
      const freshStatus = getStoreStatus(hours);
      if (!freshStatus.isOpen) {
        setError(
          "Estamos fechados no momento. Confira nosso horário de funcionamento e volte para fazer seu pedido."
        );
        return;
      }
    }

    setError("");
    setSending(true);

    try {
      const now = getBrasiliaNow();
      const message = buildOrderMessage({
        items,
        totalPrice,
        customer,
        city,
        orderDate: now.dateStr,
        orderTime: now.timeStr,
        deliveryLocation,
      });

      // Salva o pedido no Firebase (se configurado). Se falhar, o
      // pedido ainda é enviado pelo WhatsApp normalmente — não bloqueia
      // o fluxo principal do cliente.
      await saveOrder({
        items,
        totalPrice,
        customer,
        city,
        contact: contactKey,
        orderDate: now.dateStr,
        orderTime: now.timeStr,
        deliveryLocation,
      });

      const contact = business.whatsapp[contactKey];
      const link = buildWhatsAppLink(contact.phone, message);
      window.open(link, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error("Erro ao finalizar pedido:", err);
      setError("Não foi possível finalizar o pedido agora. Tente novamente em instantes.");
    } finally {
      setSending(false);
    }
  };

  const storeClosed = enforced && !getStoreStatus(hours).isOpen;

  return (
    <section id="pedido" className="bg-white py-20 sm:py-28">
      <div className="container-page grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h2 className="section-heading">Finalize seu pedido</h2>
          <p className="mt-2 font-body text-ink/70">
            Confirme seus sabores, informe seus dados e envie direto pelo
            WhatsApp.
          </p>

          <div className="mt-6 rounded-3xl border border-acai-100 bg-acai-100/30 p-5">
            {items.length === 0 ? (
              <p className="font-body text-sm text-ink/60">
                Nenhum item adicionado ainda. Volte ao{" "}
                <a href="#cardapio" className="font-700 text-acai-700 underline">
                  cardápio
                </a>{" "}
                e escolha seus sabores.
              </p>
            ) : (
              <ul className="flex flex-col divide-y divide-acai-100">
                {items.map(({ product, quantity }) => (
                  <li key={product.id} className="flex items-center justify-between gap-3 py-3">
                    <div>
                      <p className="font-display text-sm font-700 text-acai-900">
                        {product.name}
                      </p>
                      <p className="font-body text-xs text-ink/60">
                        {product.size} · R$ {product.price.toFixed(2).replace(".", ",")} un.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onDecrement(product.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-acai-100 font-700 text-acai-700 hover:bg-acai-300"
                        aria-label={`Diminuir quantidade de ${product.name}`}
                      >
                        −
                      </button>
                      <span className="w-5 text-center font-body text-sm font-700">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onIncrement(product.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-acai-100 font-700 text-acai-700 hover:bg-acai-300"
                        aria-label={`Aumentar quantidade de ${product.name}`}
                      >
                        +
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {items.length > 0 && (
              <div className="mt-3 flex items-center justify-between border-t border-acai-100 pt-3">
                <span className="font-body text-sm text-ink/70">Subtotal dos produtos</span>
                <span className="font-display text-lg font-800 text-acai-900">
                  R$ {totalPrice.toFixed(2).replace(".", ",")}
                </span>
              </div>
            )}
          </div>

          <div className="mt-6">
            <span className="font-display text-sm font-700 text-acai-900">
              Cidade de entrega
            </span>
            <div className="mt-2 flex flex-wrap gap-3">
              {business.cities.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCityId(c.id)}
                  className={`rounded-full border-2 px-5 py-2.5 font-display text-sm font-700 transition-colors ${
                    cityId === c.id
                      ? "border-acai-600 bg-acai-600 text-white"
                      : "border-acai-200 text-acai-700 hover:border-acai-400"
                  }`}
                >
                  {c.name} - {c.state}
                </button>
              ))}
            </div>
            {city && (
              <p className="mt-2 font-body text-xs text-ink/60">
                {typeof city.deliveryFee === "number"
                  ? `Taxa de entrega: R$ ${city.deliveryFee.toFixed(2).replace(".", ",")}`
                  : "Consulte a taxa de entrega para sua região."}
              </p>
            )}
          </div>
        </div>

        <form
          className="rounded-3xl bg-acai-100/40 p-6"
          onSubmit={(e) => e.preventDefault()}
          noValidate
        >
          <h3 className="font-display text-lg font-700 text-acai-900">Seus dados</h3>

          <div className="mt-4">
            <LocationAssist onApply={handleLocationApply} />
            <p className="mt-2 font-body text-xs text-ink/60">
              Se a pessoa for receber em outra residência ou localidade, você pode preencher o endereço manualmente. Atendemos apenas Redenção e Acarape
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-4">
            <Field label="Nome" htmlFor="name">
              <input
                id="name"
                type="text"
                value={customer.name}
                onChange={handleChange("name")}
                className="input-field"
                autoComplete="name"
              />
            </Field>

            <Field label="Telefone" htmlFor="phone">
              <input
                id="phone"
                type="tel"
                value={customer.phone}
                onChange={handleChange("phone")}
                className="input-field"
                autoComplete="tel"
                placeholder="(85) 9 0000-0000"
              />
            </Field>

            <div className="grid grid-cols-[1fr_auto] gap-4">
              <Field label="Rua" htmlFor="address">
                <input
                  id="address"
                  type="text"
                  value={customer.address}
                  onChange={handleChange("address")}
                  className="input-field"
                  autoComplete="street-address"
                />
              </Field>
              <Field label="Número" htmlFor="number">
                <input
                  id="number"
                  type="text"
                  value={customer.number}
                  onChange={handleChange("number")}
                  className="input-field w-24"
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Bairro" htmlFor="neighborhood">
                <input
                  id="neighborhood"
                  type="text"
                  value={customer.neighborhood}
                  onChange={handleChange("neighborhood")}
                  className="input-field"
                />
              </Field>
              <Field label="Complemento" htmlFor="complement">
                <input
                  id="complement"
                  type="text"
                  value={customer.complement}
                  onChange={handleChange("complement")}
                  className="input-field"
                />
              </Field>
            </div>

            <Field label="Ponto de referência" htmlFor="reference">
              <input
                id="reference"
                type="text"
                value={customer.reference}
                onChange={handleChange("reference")}
                className="input-field"
                placeholder="Ex: perto da praça, portão azul..."
              />
            </Field>

          </div>

          {storeClosed && (
            <p
              role="status"
              className="mt-4 rounded-xl bg-acai-100 px-4 py-3 font-body text-sm text-acai-900"
            >
              Estamos fechados no momento. Confira nosso horário de
              funcionamento e volte para fazer seu pedido.
            </p>
          )}

          {error && (
            <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 font-body text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => handleSend("edna")}
              disabled={sending || storeClosed}
              className="btn-whatsapp disabled:cursor-not-allowed disabled:opacity-50"
            >
              <WhatsAppIcon className="h-5 w-5" />
              {sending ? "Enviando..." : storeClosed ? "Pedidos fechados" : "Pedir com Edna"}
            </button>
            <button
              type="button"
              onClick={() => handleSend("patricia")}
              disabled={sending || storeClosed}
              className="btn-whatsapp disabled:cursor-not-allowed disabled:opacity-50"
            >
              <WhatsAppIcon className="h-5 w-5" />
              {sending ? "Enviando..." : storeClosed ? "Pedidos fechados" : "Pedir com Patrícia"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({ label, htmlFor, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="font-body text-sm font-700 text-acai-900">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
