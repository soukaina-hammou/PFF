import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { ProtectedRoute, AdminRoute } from "./components/ProtectedRoute";
import AuthPage from "./pages/auth/AuthPage";
import HomePage from "./pages/home/HomePage";
import AboutPage from "./pages/about/AboutPage";
import DashboardPage from "./pages/admin/DashboardPage";
import UsersPage from "./pages/admin/UsersPage";
import ProductsPage from "./pages/admin/ProductsPage";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <HomePage /> : <Navigate to="/auth" replace />}
      />
      <Route
        path="/auth"
        element={user ? <Navigate to="/" replace /> : <AuthPage />}
      />
      <Route
        path="/about"
        element={<ProtectedRoute><AboutPage /></ProtectedRoute>}
      />
      <Route
        path="/admin"
        element={<AdminRoute><DashboardPage /></AdminRoute>}
      />
      <Route
        path="/admin/users"
        element={<AdminRoute><UsersPage /></AdminRoute>}
      />
      <Route
        path="/admin/products"
        element={<AdminRoute><ProductsPage /></AdminRoute>}
      />
      <Route path="*" element={<Navigate to={user ? "/" : "/auth"} replace />} />
    </Routes>
  );
}
