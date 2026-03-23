import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiClipboard, FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import { useLanguage } from "../hooks/useLanguage";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    closeMenu();
    logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
          Feature<span className="text-amber-500">Request Tracker</span>
        </Link>

        <button
          className="md:hidden text-slate-700"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={t("nav.toggleMenu")}
        >
          {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>

        <div className="hidden md:flex items-center gap-6">
          <LanguageSwitcher />

          <Link to="/" className="text-slate-700 hover:text-teal-700 transition">
            {t("nav.home")}
          </Link>

          {user && (
            <Link to="/features" className="text-slate-700 hover:text-teal-700 transition flex items-center gap-1">
              <FiClipboard /> {t("nav.features")}
            </Link>
          )}

          {user?.role === "admin" && (
            <Link to="/admin" className="text-teal-700 font-semibold">
              {t("nav.admin")}
            </Link>
          )}

          {!user ? (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-secondary px-4 py-2 rounded-full text-sm">
                {t("nav.login")}
              </Link>
              <Link to="/register" className="btn-primary px-4 py-2 rounded-full text-sm">
                {t("nav.register")}
              </Link>
            </div>
          ) : (
            <button onClick={handleLogout} className="btn-secondary px-4 py-2 rounded-full text-sm">
              {t("nav.logout")}
            </button>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-3">
          <LanguageSwitcher className="w-full justify-between" />

          <Link onClick={closeMenu} to="/" className="block text-slate-700">
            {t("nav.home")}
          </Link>

          {user && (
            <Link onClick={closeMenu} to="/features" className="flex items-center gap-2 text-slate-700">
              <FiClipboard />
              {t("nav.features")}
            </Link>
          )}

          {user?.role === "admin" && (
            <Link onClick={closeMenu} to="/admin" className="block text-teal-700 font-medium">
              {t("nav.admin")}
            </Link>
          )}

          {!user ? (
            <div className="flex gap-2">
              <Link onClick={closeMenu} to="/login" className="flex-1 btn-secondary text-center">
                {t("nav.login")}
              </Link>
              <Link onClick={closeMenu} to="/register" className="flex-1 btn-primary text-center">
                {t("nav.registerShort")}
              </Link>
            </div>
          ) : (
            <button onClick={handleLogout} className="w-full btn-secondary">
              {t("nav.logout")}
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
