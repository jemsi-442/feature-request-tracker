import { Outlet, Navigate } from "react-router-dom";
import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import SystemAssistant from "../../components/SystemAssistant";
import Footer from "../../components/Footer";
import { useAuth } from "../../hooks/useAuth";

export default function AdminLayout() {
  const { user } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen bg-slate-100 overflow-hidden">
      <AdminSidebar className="hidden lg:flex" />

      {mobileSidebarOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/50"
            aria-label="Close admin menu overlay"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <AdminSidebar
            mobile
            onClose={() => setMobileSidebarOpen(false)}
            className="relative z-10 max-w-[85vw] shadow-2xl"
          />
        </div>
      ) : null}

      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar onMenuToggle={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[linear-gradient(160deg,#f8fafc_0%,#f1f5f9_100%)]">
          <Outlet />
        </main>
        <Footer className="mt-0" />
      </div>

      <SystemAssistant />
    </div>
  );
}
