import { useMemo, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db, firebaseEnabled } from "../firebase";
import { deleteOrder } from "../services/orders";
import { useAllOrders, parseOrderDate } from "./useAllOrders";
import { getBrasiliaNow } from "../utils/timezone";
import { buildViewLocationUrl, buildRouteUrl } from "../utils/location";

const currency = (v) =>
  (v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const statusOptions = ["Em Espera", "Pronto", "Entregue", "Cancelado"];

const filterOptions = [
  { id: "hoje", label: "Hoje" },
  { id: "ontem", label: "Ontem" },
  { id: "semana", label: "Esta semana" },
  { id: "mes", label: "Este mês" },
  { id: "mes-anterior", label: "Mês anterior" },
  { id: "personalizado", label: "Período personalizado" },
];

function toComparable({ day, month, year }) {
  return year * 10000 + month * 100 + day;
}

export default function OrdersList() {
  const { orders, loading, error } = useAllOrders();
  const [filter, setFilter] = useState("hoje");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [selected, setSelected] = useState(null);

  const now = getBrasiliaNow();

  const filtered = useMemo(() => {
    if (!orders.length) return [];

    const [, todayMonth, todayYear] = now.dateStr.split("/").map(Number);
    const todayDay = Number(now.dateStr.split("/")[0]);
    const todayComparable = toComparable({ day: todayDay, month: todayMonth, year: todayYear });

    return orders.filter((o) => {
      const d = parseOrderDate(o.orderDate);
      if (!d) return false;
      const comparable = toComparable(d);

      if (filter === "hoje") return comparable === todayComparable;
      if (filter === "ontem") return comparable === todayComparable - 1;
      if (filter === "semana") return comparable > todayComparable - 7 && comparable <= todayComparable;
      if (filter === "mes") return d.month === todayMonth && d.year === todayYear;
      if (filter === "mes-anterior") {
        const prevMonth = todayMonth === 1 ? 12 : todayMonth - 1;
        const prevYear = todayMonth === 1 ? todayYear - 1 : todayYear;
        return d.month === prevMonth && d.year === prevYear;
      }
      if (filter === "personalizado") {
        if (!customStart || !customEnd) return true;
        const start = customStart.split("-").map(Number); // yyyy-mm-dd
        const end = customEnd.split("-").map(Number);
        const startComparable = start[0] * 10000 + start[1] * 100 + start[2];
        const endComparable = end[0] * 10000 + end[1] * 100 + end[2];
        return comparable >= startComparable && comparable <= endComparable;
      }
      return true;
    });
  }, [orders, filter, customStart, customEnd, now.dateStr]);

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status });
    } catch (err) {
      console.error(err);
      alert("Não foi possível atualizar o status do pedido.");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir este pedido? Ele será removido do histórico e do relatório mensal."
    );

    if (!confirmed) return;

    const success = await deleteOrder(orderId);
    if (!success) {
      alert("Não foi possível excluir o pedido.");
      return;
    }

    if (selected === orderId) {
      setSelected(null);
    }
  };

  if (!firebaseEnabled) {
    return <Notice>Configure o Firebase para ver os pedidos recebidos aqui.</Notice>;
  }
  if (loading) return <Notice>Carregando pedidos...</Notice>;
  if (error) return <Notice tone="error">{error}</Notice>;

  return (
    <div>
      <h1 className="font-display text-2xl font-700 text-acai-900">Pedidos</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        {filterOptions.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`rounded-full px-4 py-2 font-body text-xs font-700 ${
              filter === f.id ? "bg-acai-600 text-white" : "bg-white text-acai-700"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filter === "personalizado" && (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <input
            type="date"
            className="input-field w-auto"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
          />
          <span className="font-body text-sm text-ink/60">até</span>
          <input
            type="date"
            className="input-field w-auto"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
          />
        </div>
      )}

      <p className="mt-4 font-body text-sm text-ink/60">
        {filtered.length} pedido(s) encontrado(s)
      </p>

      <div className="mt-3 flex flex-col gap-3">
        {filtered.map((o) => (
          <div key={o.id} className="rounded-2xl bg-white p-4 shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-display text-sm font-700 text-acai-900">
                  {o.customer?.name || "Cliente"} · {currency(o.total)}
                </p>
                <p className="font-body text-xs text-ink/60">
                  {o.orderDate} às {o.orderTime} · #{o.id.slice(0, 6)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={o.status || "recebido"}
                  onChange={(e) => handleStatusChange(o.id, e.target.value)}
                  className="input-field w-auto"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => handleDeleteOrder(o.id)}
                  className="rounded-full border border-red-200 bg-red-50 px-3 py-2 font-body text-[10px] font-700 uppercase tracking-wide text-red-600 transition hover:bg-red-100"
                >
                  Excluir
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelected(selected === o.id ? null : o.id)}
              className="mt-2 font-body text-xs font-700 text-acai-700 underline"
            >
              {selected === o.id ? "Ocultar detalhes" : "Ver detalhes"}
            </button>

            {selected === o.id && (
              <div className="mt-3 rounded-xl bg-acai-100/40 p-3 font-body text-xs text-ink/70">
                <p className="font-700">Itens:</p>
                <ul className="mt-1 list-disc pl-4">
                  {o.items?.map((it, idx) => (
                    <li key={idx}>
                      {it.quantity}x {it.name} — {currency(it.subtotal)}
                    </li>
                  ))}
                </ul>

                <p className="mt-2 font-700">📍 Localização da entrega</p>
                <p className="mt-1">
                  Telefone: {o.customer?.phone}
                  <br />
                  Endereço: {o.customer?.address}
                  {o.customer?.number ? `, nº ${o.customer.number}` : ""}
                  <br />
                  Bairro: {o.customer?.neighborhood}{" "}
                  {o.city ? `· ${o.city.name}/${o.city.state}` : ""}
                  {o.customer?.complement && (
                    <>
                      <br />
                      Complemento: {o.customer.complement}
                    </>
                  )}
                  {o.customer?.reference && (
                    <>
                      <br />
                      Referência: {o.customer.reference}
                    </>
                  )}
                </p>

                {o.deliveryLocation ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    <a
                      href={buildViewLocationUrl(o.deliveryLocation.latitude, o.deliveryLocation.longitude)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-acai-600 px-3 py-1.5 font-700 text-white"
                    >
                      📍 Ver localização
                    </a>
                    <a
                      href={buildRouteUrl(o.deliveryLocation.latitude, o.deliveryLocation.longitude)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-leaf-500 px-3 py-1.5 font-700 text-white"
                    >
                      🚗 Abrir rota
                    </a>
                  </div>
                ) : (
                  <p className="mt-2 text-ink/50">
                    Cliente não compartilhou localização automática — use o endereço acima.
                  </p>
                )}

                {o.customer?.note && <p className="mt-2">Observação: {o.customer.note}</p>}
                <p className="mt-1">Atendente escolhido: {o.contact}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Notice({ children, tone = "info" }) {
  return (
    <div
      className={`rounded-2xl p-5 font-body text-sm ${
        tone === "error" ? "bg-red-50 text-red-600" : "bg-acai-100 text-acai-900"
      }`}
    >
      {children}
    </div>
  );
}
