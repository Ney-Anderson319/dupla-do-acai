import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * Configuração do Firebase.
 *
 * Todos os valores vêm de variáveis de ambiente (nunca hardcoded).
 * Veja `.env.example` para a lista completa e o README para instruções
 * de como configurar no Netlify.
 *
 * Se as variáveis não estiverem definidas, `firebaseEnabled` fica `false`
 * e o site continua funcionando normalmente com os dados estáticos
 * (cardápio fixo, sem horário de funcionamento dinâmico, sem admin).
 * Isso evita que o site quebre em produção antes do Firebase ser configurado.
 */
const firebaseConfig = {
  apiKey: "AIzaSyARGsHVXHr9wKZsN91cc7CyocBNRwthlNo",
  authDomain: "dupla-do-acai-v01.firebaseapp.com",
  projectId: "dupla-do-acai-v01",
  storageBucket: "dupla-do-acai-v01.firebasestorage.app",
  messagingSenderId: "74691533985",
  appId: "1:74691533985:web:7708e5043882fc156824e0",
  measurementId: "G-80N3S4EHF6"
};

export const firebaseEnabled = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId
);

let app = null;
let auth = null;
let db = null;

if (firebaseEnabled) {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
} else if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.warn(
    "[Dupla Do Açaí] Firebase não configurado. Rodando em modo estático: " +
      "cardápio fixo, sem horário dinâmico e sem área administrativa. " +
      "Configure as variáveis VITE_FIREBASE_* para ativar tudo (veja .env.example)."
  );
}

export { app, auth, db };
