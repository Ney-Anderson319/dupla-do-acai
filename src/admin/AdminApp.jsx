import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import AdminLogin from "./AdminLogin";
import AdminLayout from "./AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "./Dashboard";
import ProductsManager from "./ProductsManager";
import OrdersList from "./OrdersList";
import MonthlyReport from "./MonthlyReport";
import StoreHours from "./StoreHours";
import { firebaseEnabled } from "../firebase";

function LoginOrRedirect() {
  const { user } = useAuth();
  if (firebaseEnabled && user) return <Navigate to="/admin/dashboard" replace />;
  return <AdminLogin />;
}

export default function AdminApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LoginOrRedirect />} />
        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="produtos" element={<ProductsManager />} />
          <Route path="pedidos" element={<OrdersList />} />
          <Route path="relatorios" element={<MonthlyReport />} />
          <Route path="horarios" element={<StoreHours />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
