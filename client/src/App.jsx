import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

import UserLayout from "./components/UserLayout";
import AdminLayout from "./admin/pages/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { useLanguage } from "./hooks/useLanguage";

const Home = lazy(() => import("./pages/Home"));
const FeatureRequests = lazy(() => import("./pages/FeatureRequests"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

const AdminDashboard = lazy(() => import("./admin/pages/AdminDashboard"));
const AdminFeatureRequests = lazy(() => import("./admin/pages/AdminFeatureRequests"));
const AdminUsers = lazy(() => import("./admin/pages/AdminUsers"));

const NotFound = lazy(() => import("./pages/NotFound"));

export default function App() {
  const { t } = useLanguage();

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-slate-500">
          {t("common.loading")}
        </div>
      }
    >
      <Routes>
        <Route element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route
            path="features"
            element={
              <ProtectedRoute>
                <FeatureRequests />
              </ProtectedRoute>
            }
          />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>

        <Route
          path="admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="features" element={<AdminFeatureRequests />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
