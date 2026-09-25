import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

export async function createProduct(data) {
  return addDoc(collection(db, "products"), {
    name: data.name,
    description: data.description || "",
    price: Number(data.price),
    size: data.size || "500 ml",
    image: data.image || "",
    cost: data.cost === "" || data.cost === undefined ? null : Number(data.cost),
    active: data.active !== false,
    createdAt: serverTimestamp(),
  });
}

export async function updateProduct(id, data) {
  return updateDoc(doc(db, "products", id), {
    name: data.name,
    description: data.description || "",
    price: Number(data.price),
    size: data.size || "500 ml",
    image: data.image || "",
    cost: data.cost === "" || data.cost === undefined || data.cost === null ? null : Number(data.cost),
    active: data.active !== false,
  });
}

export async function toggleProductActive(id, active) {
  return updateDoc(doc(db, "products", id), { active });
}

export async function deleteProduct(id) {
  return deleteDoc(doc(db, "products", id));
}
