import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useLanguage } from "../hooks/useLanguage";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  if (user === undefined) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="text-slate-500">Loading...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
          message: t("route.loginRequired"),
        }}
      />
    );
  }

  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
