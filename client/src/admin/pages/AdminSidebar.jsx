import { NavLink, useNavigate } from "react-router-dom";
import { FiHome, FiClipboard, FiUsers, FiLogOut, FiX } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import { useLanguage } from "../../hooks/useLanguage";

export default function AdminSidebar({ className = "", mobile = false, onClose }) {
  const { logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const navItems = [
    { name: t("admin.dashboard"), path: "/admin", icon: FiHome },
    { name: t("admin.requests"), path: "/admin/features", icon: FiClipboard },
    { name: t("admin.users"), path: "/admin/users", icon: FiUsers },
  ];

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className={`w-72 min-h-screen flex flex-col border-r border-slate-200 bg-[linear-gradient(180deg,#0f172a_0%,#111827_100%)] text-slate-200 ${className}`}>
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-black text-white">Feature<span className="text-amber-400">Request Tracker Admin</span></h1>
            <p className="text-xs text-slate-400 mt-1 tracking-wide">{t("admin.controlCenter")}</p>
          </div>
          {mobile ? (
            <button
              type="button"
              onClick={onClose}
              className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-200 lg:hidden"
              aria-label="Close admin menu"
            >
              <FiX size={18} />
            </button>
          ) : null}
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/admin"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                  isActive ? "bg-teal-500/20 text-teal-200 border border-teal-400/20" : "text-slate-300 hover:bg-white/5"
                }`
              }
            >
              <Icon size={18} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/5 transition">
          <FiLogOut size={18} /> {t("nav.logout")}
        </button>
      </div>
    </aside>
  );
}
