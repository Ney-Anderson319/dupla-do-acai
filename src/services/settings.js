import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export async function saveBusinessHours(hours) {
  return setDoc(doc(db, "settings", "businessHours"), hours);
}
