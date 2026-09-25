import { useState } from "react";
import { useAuth } from "./AuthContext";
import { firebaseEnabled } from "../firebase";
import LogoMark from "../components/LogoMark";

export default function AdminLogin() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!firebaseEnabled) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-acai-950 px-6 text-center text-white">
        <div className="max-w-sm">
          <LogoMark className="mx-auto h-16 w-auto" />
          <h1 className="mt-6 font-display text-xl font-700">
            Área administrativa indisponível
          </h1>
          <p className="mt-2 font-body text-sm text-white/70">
            O Firebase ainda não foi configurado neste projeto. Configure as
            variáveis <code>VITE_FIREBASE_*</code> (veja o arquivo
            <code> .env.example</code> e o README) para ativar o login e o
            painel administrativo.
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Informe e-mail e senha.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      console.error(err);
      setError("E-mail ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-acai-950 px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-soft"
        noValidate
      >
        <LogoMark className="mx-auto h-14 w-auto" />
        <h1 className="mt-4 text-center font-display text-lg font-700 text-acai-900">
          Área administrativa
        </h1>

        <div className="mt-6 flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="font-body text-sm font-700 text-acai-900">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              className="input-field mt-1.5"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="password" className="font-body text-sm font-700 text-acai-900">
              Senha
            </label>
            <input
              id="password"
              type="password"
              className="input-field mt-1.5"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
        </div>

        {error && (
          <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 font-body text-sm text-red-600">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className="btn-primary mt-6 w-full">
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
