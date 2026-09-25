import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db, firebaseEnabled } from "../firebase";
import { useAllOrders, parseOrderDate } from "./useAllOrders";
import { getBrasiliaNow } from "../utils/timezone";

const currency = (v) =>
  (v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const monthNames = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export default function MonthlyReport() {
  const { orders, loading, error } = useAllOrders();
  const now = getBrasiliaNow();
  const [, todayMonth, todayYear] = now.dateStr.split("/").map(Number);

  const [month, setMonth] = useState(todayMonth);
  const [year, setYear] = useState(todayYear);

  const [productCosts, setProductCosts] = useState({});

  useEffect(() => {
    if (!firebaseEnabled) return;
    const unsub = onSnapshot(collection(db, "products"), (snap) => {
      const map = {};
      snap.docs.forEach((d) => {
        map[d.id] = d.data().cost ?? null;
      });
      setProductCosts(map);
    });
    return unsub;
  }, []);

  const report = useMemo(() => {
    const monthOrders = orders.filter((o) => {
      const d = parseOrderDate(o.orderDate);
      return d && d.month === month && d.year === year && o.status !== "cancelado";
    });

    const revenue = monthOrders.reduce((s, o) => s + (o.total || 0), 0);
    const avgTicket = monthOrders.length ? revenue / monthOrders.length : 0;

    const productMap = {};
    monthOrders.forEach((o) => {
      o.items?.forEach((it) => {
        if (!productMap[it.id]) {
          productMap[it.id] = { name: it.name, qty: 0, revenue: 0, cost: productCosts[it.id] };
        }
        productMap[it.id].qty += it.quantity;
        productMap[it.id].revenue += it.subtotal;
      });
    });

    const productList = Object.values(productMap).sort((a, b) => b.qty - a.qty);
    const itemsSold = productList.reduce((s, p) => s + p.qty, 0);
    const bestSeller = productList[0]?.name || "—";

    let estimatedCost = 0;
    let hasUnknownCost = false;
    productList.forEach((p) => {
      if (typeof p.cost === "number") {
        estimatedCost += p.cost * p.qty;
      } else {
        hasUnknownCost = true;
      }
    });

    return {
      orderCount: monthOrders.length,
      revenue,
      avgTicket,
      itemsSold,
      bestSeller,
      productList,
      estimatedCost,
      grossProfit: revenue - estimatedCost,
      hasUnknownCost,
    };
  }, [orders, month, year, productCosts]);

  if (!firebaseEnabled) {
    return <Notice>Configure o Firebase para gerar relatórios mensais.</Notice>;
  }
  if (loading) return <Notice>Carregando pedidos...</Notice>;
  if (error) return <Notice tone="error">{error}</Notice>;

  return (
    <div>
      <h1 className="font-display text-2xl font-700 text-acai-900">Relatório mensal</h1>

      <div className="mt-4 flex flex-wrap gap-3">
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="input-field w-auto"
        >
          {monthNames.map((m, idx) => (
            <option key={m} value={idx + 1}>
              {m}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="input-field w-24"
        />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <Card label="Pedidos no mês" value={report.orderCount} />
        <Card label="Faturamento" value={currency(report.revenue)} />
        <Card label="Ticket médio" value={currency(report.avgTicket)} />
        <Card label="Itens vendidos" value={report.itemsSold} />
        <Card label="Produto mais vendido" value={report.bestSeller} />
        <Card
          label="Lucro bruto estimado"
          value={report.hasUnknownCost ? "Custo não informado" : currency(report.grossProfit)}
        />
      </div>

      {report.hasUnknownCost && (
        <p className="mt-3 font-body text-xs text-ink/60">
          Um ou mais produtos vendidos não têm custo cadastrado, então o
          lucro bruto estimado deste período não pôde ser calculado com
          precisão. Cadastre o custo em Produtos para ver a estimativa
          completa. Este valor é sempre uma estimativa de lucro bruto, não
          o lucro líquido real da empresa.
        </p>
      )}

      <div className="mt-8 overflow-x-auto rounded-2xl bg-white shadow-card">
        <table className="w-full text-left font-body text-sm">
          <thead>
            <tr className="border-b border-acai-100 text-xs uppercase text-ink/50">
              <th className="px-4 py-3">Produto</th>
              <th className="px-4 py-3">Quantidade</th>
              <th className="px-4 py-3">Faturamento</th>
            </tr>
          </thead>
          <tbody>
            {report.productList.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-4 text-ink/50">
                  Nenhum pedido neste período.
                </td>
              </tr>
            ) : (
              report.productList.map((p) => (
                <tr key={p.name} className="border-b border-acai-100/60 last:border-0">
                  <td className="px-4 py-3">{p.name}</td>
                  <td className="px-4 py-3">{p.qty}</td>
                  <td className="px-4 py-3">{currency(p.revenue)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Card({ label, value }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-card">
      <p className="font-body text-xs font-700 uppercase tracking-wide text-ink/50">{label}</p>
      <p className="mt-1 font-display text-xl font-800 text-acai-900">{value}</p>
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
