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
    <header className="sticky top-0 z-30 border-b border-teal-950/10 bg-[linear-gradient(135deg,#0f766e_0%,#134e4a_20%,#0f172a_58%,#111827_100%)] text-white shadow-[0_18px_45px_-24px_rgba(15,23,42,0.9)]">
      <div className="flex h-20 items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex items-center gap-3 md:gap-4 min-w-0">
          <button
            type="button"
            onClick={onMenuToggle}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-[linear-gradient(135deg,#f59e0b_0%,#fbbf24_100%)] text-slate-950 shadow-lg shadow-amber-500/25 transition hover:scale-[1.02] hover:brightness-105 lg:hidden"
            aria-label="Open admin menu"
          >
            <FiMenu size={19} />
          </button>

          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.28em] text-teal-100/75">{t("admin.topbarLabel")}</p>
            <div className="flex items-center gap-2 md:gap-3 min-w-0">
              <p className="truncate text-base font-black text-white md:text-xl">{t("admin.topbarTitle")}</p>
              <span className="hidden rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-200 md:inline-flex">
                Feature Request Tracker
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <LanguageSwitcher dark className="hidden md:inline-flex" />

          <button
            className="relative hidden h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-teal-50 transition hover:bg-white/15 sm:inline-flex"
            aria-label="Notifications"
          >
            <FiBell size={19} />
            <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full border border-slate-950/10 bg-amber-400" />
          </button>

          <div className="hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-teal-50 sm:flex">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-400/90 text-slate-950">
              <FiUser size={16} />
            </span>
            <div className="min-w-0">
              <p className="max-w-[180px] truncate text-sm font-semibold text-white">{user?.name || "Admin"}</p>
              <p className="text-xs text-teal-100/70">Administrator</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-3.5 text-sm font-medium text-white transition hover:bg-white/15 hover:text-amber-100"
          >
            <FiLogOut size={17} />
            <span className="hidden sm:inline">{t("nav.logout")}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
