import { useRegisterSW } from "virtual:pwa-register/react";

/**
 * Aviso de nova versão disponível / app pronto para uso offline.
 *
 * Estratégia "prompt": o Service Worker novo fica esperando até o
 * cliente confirmar a atualização — assim ninguém tem uma aba recarregada
 * sem aviso no meio de um pedido, mas também ninguém fica preso numa
 * versão antiga do site.
 */
export default function PwaUpdateToast() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisterError(error) {
      console.error("Erro ao registrar o Service Worker:", error);
    },
  });

  if (!needRefresh && !offlineReady) return null;

  const close = () => {
    setNeedRefresh(false);
    setOfflineReady(false);
  };

  return (
    <div className="fixed top-4 left-1/2 z-50 w-[min(92vw,380px)] -translate-x-1/2 rounded-2xl bg-acai-950 p-4 text-white shadow-card animate-popIn">
      {needRefresh ? (
        <>
          <p className="font-body text-sm">
            <strong className="font-display font-700">Nova versão disponível.</strong>
            <br />
            Atualize para ver as últimas novidades.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => updateServiceWorker(true)}
              className="rounded-full bg-sun-500 px-4 py-2 font-display text-sm font-700 text-acai-950"
            >
              Atualizar agora
            </button>
            <button
              type="button"
              onClick={close}
              className="rounded-full bg-white/10 px-4 py-2 font-body text-sm text-white"
            >
              Depois
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-between gap-3">
          <p className="font-body text-sm">App pronto para uso offline.</p>
          <button type="button" onClick={close} aria-label="Fechar" className="font-body text-white/70">
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
