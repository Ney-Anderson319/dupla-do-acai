import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db, firebaseEnabled } from "../firebase";
import { defaultBusinessHours } from "../data/businessHours";
import { getStoreStatus } from "../utils/timezone";

/**
 * Horário de funcionamento + status da loja (aberta/fechada agora).
 *
 * Comportamento:
 * - Se o Firebase NÃO estiver configurado (`firebaseEnabled === false`),
 *   o recurso de horário fica desativado e o site se comporta como antes:
 *   os pedidos continuam sempre liberados. Isso preserva o funcionamento
 *   atual do site enquanto o Firebase não é configurado.
 * - Se o Firebase estiver configurado, o horário é lido em tempo real do
 *   documento `settings/businessHours`. Se o admin ainda não tiver salvo
 *   nada, usa a estrutura padrão (todos os dias fechados) até que ele
 *   configure em /admin/horarios — isso evita liberar pedidos com um
 *   horário inventado.
 */
export function useBusinessHours() {
  const [hours, setHours] = useState(defaultBusinessHours);
  const [loading, setLoading] = useState(firebaseEnabled);

  useEffect(() => {
    if (!firebaseEnabled) return;

    const ref = doc(db, "settings", "businessHours");
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          setHours({ ...defaultBusinessHours, ...snap.data() });
        } else {
          setHours(defaultBusinessHours);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Erro ao carregar horário de funcionamento:", err);
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  const enforced = firebaseEnabled;
  const status = enforced
    ? getStoreStatus(hours)
    : { isOpen: true, message: "", now: null };

  return { hours, loading, enforced, status };
}
