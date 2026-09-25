/**
 * Indicador de "Pedidos abertos" / "Pedidos fechados".
 *
 * Enquanto o horário de funcionamento não estiver configurado (Firebase
 * ainda não conectado, ou nenhum horário salvo), este componente não
 * exibe nada — não faz sentido mostrar um status calculado a partir de
 * um horário que ainda não existe.
 */
export default function StoreStatusBadge({ enforced, status, className = "" }) {
  if (!enforced) return null;

  return (
    <div
      className={`inline-flex flex-wrap items-center gap-2 rounded-full px-4 py-2 font-body text-sm font-700 ${
        status.isOpen
          ? "bg-leaf-500/15 text-leaf-300"
          : "bg-red-500/15 text-red-300"
      } ${className}`}
      role="status"
    >
      <span
        className={`h-2.5 w-2.5 rounded-full ${
          status.isOpen ? "bg-leaf-500" : "bg-red-500"
        }`}
        aria-hidden="true"
      />
      <span className="font-body font-400 text-white/70">{status.message}</span>
    </div>
  );
}
