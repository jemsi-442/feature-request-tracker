import { FiBell, FiLogOut, FiMenu, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../hooks/useLanguage";
import LanguageSwitcher from "../../components/LanguageSwitcher";

export default function AdminTopbar({ onMenuToggle }) {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white/90 backdrop-blur border-b border-slate-200 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-700 lg:hidden"
          aria-label="Open admin menu"
        >
          <FiMenu size={18} />
        </button>

        <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{t("admin.topbarLabel")}</p>
        <p className="text-base md:text-lg font-bold text-slate-900">{t("admin.topbarTitle")}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <LanguageSwitcher className="hidden sm:inline-flex" />

        <button className="relative hidden sm:inline-flex text-slate-600 hover:text-slate-900 transition" aria-label="Notifications">
          <FiBell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-slate-700">
          <FiUser />
          <span className="text-sm font-medium">{user?.name || "Admin"}</span>
        </div>

        <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-slate-600 hover:text-teal-700 transition">
          <FiLogOut />
          <span className="hidden sm:inline">{t("nav.logout")}</span>
        </button>
      </div>
    </header>
  );
}
