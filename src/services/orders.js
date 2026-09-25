import { addDoc, collection, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db, firebaseEnabled } from "../firebase";

/**
 * Salva um pedido no Firestore (coleção `orders`).
 *
 * Se o Firebase não estiver configurado, apenas avisa no console e
 * retorna `null` — o fluxo de checkout pelo WhatsApp continua
 * funcionando normalmente mesmo sem o banco de dados conectado, como
 * já funcionava antes desta funcionalidade existir.
 */
export async function saveOrder({
  items,
  totalPrice,
  customer,
  city,
  contact,
  orderDate,
  orderTime,
  deliveryLocation,
}) {
  if (!firebaseEnabled) {
    console.warn(
      "[Dupla Do Açaí] Firebase não configurado: o pedido não foi salvo no banco de dados, apenas enviado pelo WhatsApp."
    );
    return null;
  }

  const payload = {
    createdAt: serverTimestamp(),
    orderDate,
    orderTime,
    items: items.map(({ product, quantity }) => ({
      id: product.id,
      name: product.name,
      size: product.size,
      price: product.price,
      quantity,
      subtotal: product.price * quantity,
    })),
    total:
      typeof city?.deliveryFee === "number" ? totalPrice + city.deliveryFee : totalPrice,
    deliveryFee: typeof city?.deliveryFee === "number" ? city.deliveryFee : null,
    customer: {
      name: customer?.name || "",
      phone: customer?.phone || "",
      address: customer?.address || "",
      number: customer?.number || "",
      neighborhood: customer?.neighborhood || "",
      complement: customer?.complement || "",
      reference: customer?.reference || "",
      note: customer?.note || "",
    },
    city: city ? { id: city.id, name: city.name, state: city.state } : null,
    // Só grava o campo se a localização foi de fato obtida — não
    // armazenamos histórico de localização fora do contexto de um pedido.
    deliveryLocation:
      deliveryLocation?.latitude != null && deliveryLocation?.longitude != null
        ? { latitude: deliveryLocation.latitude, longitude: deliveryLocation.longitude }
        : null,
    contact,
    status: "recebido",
  };

  try {
    const ref = await addDoc(collection(db, "orders"), payload);
    return ref.id;
  } catch (err) {
    console.error("Erro ao salvar pedido no Firebase:", err);
    return null;
  }
}

export async function deleteOrder(orderId) {
  if (!firebaseEnabled) {
    console.warn(
      "[Dupla Do Açaí] Firebase não configurado: o pedido não pode ser removido do banco de dados."
    );
    return false;
  }

  if (!orderId) return false;

  try {
    await deleteDoc(doc(db, "orders", orderId));
    return true;
  } catch (err) {
    console.error("Erro ao excluir pedido no Firebase:", err);
    return false;
  }
}
