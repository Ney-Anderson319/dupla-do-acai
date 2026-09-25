import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import Site from "./Site";
import InstallPWA from "./pwa/InstallPWA";
import PwaUpdateToast from "./pwa/PwaUpdateToast";
import OfflineBanner from "./pwa/OfflineBanner";

// Carregado sob demanda: a maior parte dos visitantes nunca acessa
// /admin, então não faz sentido incluir Firebase/gráficos no pacote
// principal do site público.
const AdminApp = lazy(() => import("./admin/AdminApp"));

export default function App() {
  return (
    <>
      <OfflineBanner />
      <PwaUpdateToast />
      <InstallPWA />

      <Routes>
        <Route path="/" element={<Site />} />
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<AdminLoading />}>
              <AdminApp />
            </Suspense>
          }
        />
      </Routes>
    </>
  );
}

function AdminLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-acai-950 text-white">
      <p className="font-body text-sm">Carregando painel administrativo...</p>
    </div>
  );
}
