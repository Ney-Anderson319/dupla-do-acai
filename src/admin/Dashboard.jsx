import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAllOrders, parseOrderDate } from "./useAllOrders";
import { getBrasiliaNow } from "../utils/timezone";
import { firebaseEnabled } from "../firebase";

const currency = (v) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function Dashboard() {
  const { orders, loading, error } = useAllOrders();
  const today = getBrasiliaNow();

  const metrics = useMemo(() => {
    const validOrders = orders.filter((o) => o.status !== "cancelado");

    const todayOrders = validOrders.filter((o) => o.orderDate === today.dateStr);

    // Comparação de mês/ano usando a própria data de Brasília já
    // registrada no pedido (dd/mm/yyyy), evitando depender do fuso do
    // dispositivo do administrador.
    const [, todayMonth, todayYear] = today.dateStr.split("/").map(Number);
    const ordersThisMonth = validOrders.filter((o) => {
      const d = parseOrderDate(o.orderDate);
      return d && d.month === todayMonth && d.year === todayYear;
    });

    const revenueToday = todayOrders.reduce((s, o) => s + (o.total || 0), 0);
    const revenueMonth = ordersThisMonth.reduce((s, o) => s + (o.total || 0), 0);
    const avgTicket = ordersThisMonth.length ? revenueMonth / ordersThisMonth.length : 0;

    // Faturamento por dia (últimos 14 dias com pedido) para o gráfico
    const byDay = {};
    ordersThisMonth.forEach((o) => {
      byDay[o.orderDate] = (byDay[o.orderDate] || 0) + (o.total || 0);
    });
    const chartData = Object.entries(byDay)
      .map(([date, total]) => ({ date: date.slice(0, 5), total: Math.round(total * 100) / 100 }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      todayCount: todayOrders.length,
      monthCount: ordersThisMonth.length,
      revenueToday,
      revenueMonth,
      avgTicket,
      totalCount: validOrders.length,
      chartData,
    };
  }, [orders, today]);

  if (!firebaseEnabled) {
    return (
      <Notice>
        Configure o Firebase para começar a registrar pedidos e ver as
        métricas aqui.
      </Notice>
    );
  }

  if (loading) return <Notice>Carregando dados...</Notice>;
  if (error) return <Notice tone="error">{error}</Notice>;

  return (
    <div>
      <h1 className="font-display text-2xl font-700 text-acai-900">Dashboard</h1>
      <p className="mt-1 font-body text-sm text-ink/60">
        Horário de referência: Brasília — {today.dateStr} {today.timeStr}
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <Card label="Pedidos hoje" value={metrics.todayCount} />
        <Card label="Pedidos este mês" value={metrics.monthCount} />
        <Card label="Total de pedidos" value={metrics.totalCount} />
        <Card label="Faturamento hoje" value={currency(metrics.revenueToday)} />
        <Card label="Faturamento do mês" value={currency(metrics.revenueMonth)} />
        <Card label="Ticket médio (mês)" value={currency(metrics.avgTicket)} />
      </div>

      {metrics.chartData.length > 0 && (
        <div className="mt-8 rounded-2xl bg-white p-4 shadow-card sm:p-6">
          <h2 className="font-display text-base font-700 text-acai-900">
            Faturamento por dia (este mês)
          </h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3E6FA" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => currency(v)} />
                <Bar dataKey="total" fill="#7A2BA3" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

function Card({ label, value }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-card">
      <p className="font-body text-xs font-700 uppercase tracking-wide text-ink/50">
        {label}
      </p>
      <p className="mt-1 font-display text-2xl font-800 text-acai-900">{value}</p>
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
