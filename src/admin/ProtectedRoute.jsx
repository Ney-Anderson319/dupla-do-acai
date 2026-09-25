import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { firebaseEnabled } from "../firebase";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (!firebaseEnabled) {
    return <Navigate to="/admin" replace />;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-acai-100/30">
        <p className="font-body text-sm text-ink/60">Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
