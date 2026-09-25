import { useState } from "react";
import { business } from "../data/business";
import { CloseIcon, WhatsAppIcon } from "./Icons";
import { useBusinessHours } from "../hooks/useBusinessHours";

export default function WhatsAppFloat() {
  const [open, setOpen] = useState(false);
  const { enforced, status } = useBusinessHours();
  const storeClosed = enforced && !status.isOpen;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      <div
        className={`flex flex-col gap-2 transition-all duration-200 ${
          open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        {storeClosed ? (
          // Loja fechada: nenhum link é renderizado, só um aviso — não tem
          // como "mandar mensagem sem querer" se não existe link nenhum aqui.
          <div className="max-w-[220px] rounded-2xl bg-white px-4 py-3 text-right font-body text-xs text-acai-900 shadow-card">
            <p className="font-display text-sm font-700">Estamos fechados agora</p>
            <p className="mt-1 text-ink/70">
              Confira nosso horário de funcionamento e volte para fazer seu pedido.
            </p>
          </div>
        ) : (
          <>
            <a
              href={`https://wa.me/${business.whatsapp.edna.phone}?text=${encodeURIComponent(
                "Olá Edna! Gostaria de falar sobre um pedido na Dupla Do Açaí."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 font-body text-sm font-700 text-acai-900 shadow-card hover:bg-acai-100"
            >
              Falar com Edna
            </a>
            <a
              href={`https://wa.me/${business.whatsapp.patricia.phone}?text=${encodeURIComponent(
                "Olá Patrícia! Gostaria de falar sobre um pedido na Dupla Do Açaí."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 font-body text-sm font-700 text-acai-900 shadow-card hover:bg-acai-100"
            >
              Falar com Patrícia
            </a>
          </>
        )}
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex h-14 w-14 items-center justify-center rounded-full text-white shadow-card transition-transform active:scale-95 ${
          storeClosed ? "bg-acai-400" : "bg-leaf-500 hover:bg-leaf-700"
        }`}
        aria-label={open ? "Fechar opções do WhatsApp" : "Falar no WhatsApp"}
        aria-expanded={open}
      >
        {open ? <CloseIcon className="h-6 w-6" /> : <WhatsAppIcon className="h-7 w-7" />}
      </button>
    </div>
  );
}