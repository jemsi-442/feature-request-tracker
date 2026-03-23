import { Link, useLocation } from "react-router-dom";
import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import { useLanguage } from "../hooks/useLanguage";

export default function Footer({ className = "" }) {
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useLanguage();
  const isHomePage = location.pathname === "/";

  if (!isHomePage) {
    return (
      <footer
        className={`mt-16 border-t border-teal-950/10 bg-[linear-gradient(135deg,#0f766e_0%,#134e4a_25%,#0f172a_72%,#111827_100%)] text-white shadow-[0_-18px_40px_-30px_rgba(15,23,42,0.9)] ${className}`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-4 text-center text-sm font-medium text-teal-50 md:px-6">
          &copy; 2026 Feature Request Tracker. All rights reserved.
        </div>
      </footer>
    );
  }

  return (
    <footer className={`mt-16 border-t border-slate-800 bg-[linear-gradient(160deg,#041613_0%,#0f2d2a_50%,#111827_100%)] text-slate-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-6">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-4 md:px-6 md:py-5 backdrop-blur">
          <div className="grid gap-3 md:grid-cols-[1.15fr_0.85fr] md:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-amber-300">Feature Request Tracker</p>
              <h3 className="mt-1.5 text-xl md:text-2xl font-black text-white">Feature Request Workspace</h3>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">
                {t("footer.description")}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-slate-950/30 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{t("footer.contact")}</p>
                <p className="mt-1.5 text-white font-semibold">jemsifredrick4@gmail.com</p>
                <p className="mt-1 text-slate-300">+255683186987</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-950/30 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{t("footer.quickLinks")}</p>
                <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-2 text-sm text-slate-200">
                  <Link to="/" className="hover:text-white transition">{t("nav.home")}</Link>
                  <Link to={user ? "/features" : "/login"} className="hover:text-white transition">
                    {user ? t("nav.features") : t("nav.login")}
                  </Link>
                  {user?.role === "admin" ? (
                    <Link to="/admin" className="hover:text-white transition">{t("nav.admin")}</Link>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 grid md:grid-cols-3 gap-6 md:gap-8">
        <div>
          <h3 className="text-xl font-black tracking-tight text-white">
            Feature<span className="text-amber-400">Request Tracker</span>
          </h3>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            {t("footer.description")}
          </p>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-amber-300 mb-3">{t("footer.quickLinks")}</h4>
          <ul className="space-y-1.5 text-sm text-slate-300">
            <li><Link to="/" className="hover:text-white transition">{t("nav.home")}</Link></li>
            {user ? (
              <>
                <li><Link to="/features" className="hover:text-white transition">{t("nav.features")}</Link></li>
                {user?.role === "admin" ? <li><Link to="/admin" className="hover:text-white transition">{t("nav.admin")}</Link></li> : null}
              </>
            ) : (
              <>
                <li><Link to="/register" className="hover:text-white transition">{t("nav.registerShort")}</Link></li>
                <li><Link to="/login" className="hover:text-white transition">{t("nav.login")}</Link></li>
              </>
            )}
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] text-amber-300 mb-3">{t("footer.contact")}</h4>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex items-center gap-2"><FiMail className="text-amber-300" /> jemsifredrick4@gmail.com</li>
            <li className="flex items-center gap-2"><FiPhone className="text-amber-300" /> +255683186987</li>
            <li className="flex items-center gap-2"><FiMapPin className="text-amber-300" /> Dar es Salaam, Tanzania</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-sm text-slate-400">
        &copy; 2026 Feature Request Tracker. All rights reserved.
      </div>
    </footer>
  );
}
