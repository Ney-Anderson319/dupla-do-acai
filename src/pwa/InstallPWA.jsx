import { useEffect, useState } from "react";

const IOS_HINT_DISMISSED_KEY = "duplaAcaiIosInstallHintDismissed";

function isIos() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent) && !window.MSStream;
}

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

/**
 * Botão de instalação do PWA.
 *
 * - Android/desktop (Chrome/Edge): escuta `beforeinstallprompt` e mostra
 *   um botão "Instalar" só quando o navegador realmente oferece suporte.
 * - iOS (Safari não dispara `beforeinstallprompt`): mostra uma instrução
 *   curta de "Adicionar à Tela de Início", uma única vez (o cliente pode
 *   fechar e ela não volta a aparecer).
 * - Se o app já estiver instalado (rodando em modo standalone), não
 *   mostra nada.
 */
export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(isStandalone());
  const [showIosHint, setShowIosHint] = useState(false);

  useEffect(() => {
    if (installed) return;

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    const handleInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleInstalled);

    if (isIos() && !localStorage.getItem(IOS_HINT_DISMISSED_KEY)) {
      setShowIosHint(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, [installed]);

  if (installed) return null;

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    // O navegador só permite usar o prompt uma vez; depois disso, some
    // até o próximo `beforeinstallprompt` (ou some de vez, se instalado).
    setDeferredPrompt(null);
  };

  const dismissIosHint = () => {
    localStorage.setItem(IOS_HINT_DISMISSED_KEY, "1");
    setShowIosHint(false);
  };

  if (deferredPrompt) {
    return (
      <div className="fixed bottom-5 left-5 z-40 flex items-center gap-3 rounded-full bg-acai-950 py-2.5 pl-5 pr-2.5 text-white shadow-card animate-popIn">
        <span className="font-body text-sm font-700">Instalar aplicativo</span>
        <button
          type="button"
          onClick={handleInstallClick}
          className="rounded-full bg-sun-500 px-4 py-2 font-display text-sm font-700 text-acai-950 transition-transform active:scale-95"
        >
          Instalar
        </button>
      </div>
    );
  }

  if (showIosHint) {
    return (
      <div className="fixed bottom-5 left-5 right-5 z-40 flex items-start gap-3 rounded-2xl bg-acai-950 p-4 text-white shadow-card sm:right-auto sm:max-w-sm animate-popIn">
        <p className="flex-1 font-body text-sm leading-snug">
          <strong className="font-display font-700">Instale a Dupla Do Açaí:</strong>
          <br />
          Toque em <strong>Compartilhar</strong> → <strong>Adicionar à Tela de Início</strong>.
        </p>
        <button
          type="button"
          onClick={dismissIosHint}
          aria-label="Fechar aviso de instalação"
          className="font-body text-white/70"
        >
          ✕
        </button>
      </div>
    );
  }

  return null;
}
