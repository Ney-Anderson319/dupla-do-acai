import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db, firebaseEnabled } from "../firebase";

export function useAllOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(firebaseEnabled);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!firebaseEnabled) {
      setLoading(false);
      return;
    }
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        console.error("Erro ao carregar pedidos:", err);
        setError(
          "Não foi possível carregar os pedidos agora. Verifique sua conexão ou as regras do Firestore."
        );
        setLoading(false);
      }
    );
    return unsub;
  }, []);

  return { orders, loading, error };
}

/** Extrai { day, month, year } de uma string "dd/mm/yyyy". */
export function parseOrderDate(orderDate) {
  if (!orderDate) return null;
  const [day, month, year] = orderDate.split("/").map(Number);
  return { day, month, year };
}
