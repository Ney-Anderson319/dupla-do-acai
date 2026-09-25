import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db, firebaseEnabled } from "../firebase";
import { products as staticProducts } from "../data/products";

/**
 * Fonte de produtos do cardápio público.
 *
 * - Sem Firebase configurado: usa `src/data/products.js` (comportamento
 *   atual do site, preservado).
 * - Com Firebase configurado: passa a ouvir a coleção `products` em
 *   tempo real, mostrando apenas os produtos com `active: true`. Isso é
 *   a MESMA fonte usada pelo painel administrativo — um produto criado
 *   em /admin/produtos aparece aqui automaticamente, sem precisar mexer
 *   em nenhum componente.
 */
export function useProducts() {
  const [products, setProducts] = useState(staticProducts);
  const [source, setSource] = useState(firebaseEnabled ? "loading" : "static");

  useEffect(() => {
    if (!firebaseEnabled) return;

    const q = query(collection(db, "products"), where("active", "==", true));
    const unsub = onSnapshot(
      q,
      (snap) => {
        if (snap.empty) {
          // Nenhum produto cadastrado no Firestore ainda: mantém o
          // cardápio estático visível em vez de mostrar uma loja vazia.
          setProducts(staticProducts);
          setSource("static-fallback");
          return;
        }
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setProducts(list);
        setSource("firestore");
      },
      (err) => {
        console.error("Erro ao carregar produtos do Firebase:", err);
        setProducts(staticProducts);
        setSource("static-fallback");
      }
    );
    return unsub;
  }, []);

  return { products, source };
}
