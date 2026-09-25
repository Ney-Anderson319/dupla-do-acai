import { useEffect, useState } from "react";

/**
 * Aviso simples de "você está offline".
 *
 * Some sozinho assim que a conexão volta. Não bloqueia navegação nem
 * cardápio — só avisa. Quem realmente impede o pedido de ser enviado
 * sem conexão é a verificação em `OrderSection` na hora de finalizar.
 */
export default function OfflineBanner() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  if (online) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-0 top-0 z-50 bg-red-600 py-2 text-center font-body text-sm font-700 text-white"
    >
      Você está offline. Alguns recursos podem não funcionar até a conexão voltar.
    </div>
  );
}
