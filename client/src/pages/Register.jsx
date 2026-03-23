import { useState } from "react";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff } from "react-icons/fi";
import api from "../utils/axios";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError(t("auth.passwordMin"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("auth.passwordsNoMatch"));
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/register", { name, email, password });
      const { _id, name: n, email: em, role, token } = res.data;

      login({
        user: { _id, name: n, email: em, role },
        token,
      });

      switch (role) {
        case "admin":
          navigate("/admin", { replace: true });
          break;
        default:
          navigate("/features", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || t("auth.registerFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(165deg,#0f172a_0%,#153b37_40%,#2b3444_100%)] px-4 py-12">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 rounded-3xl overflow-hidden border border-white/15 shadow-2xl shadow-black/30">
        <aside className="hidden lg:flex flex-col justify-between bg-[radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.26),transparent_40%),#111827] p-10 text-white">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-amber-100">{t("auth.registerBadge")}</p>
            <h1 className="mt-4 text-4xl font-black leading-tight">{t("auth.registerBrandTitle")}</h1>
            <p className="mt-4 text-slate-300">{t("auth.registerBrandDesc")}</p>
          </div>
          <p className="text-sm text-slate-400">{t("auth.registerBrandFoot")}</p>
        </aside>

        <motion.div
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-white p-6 md:p-10"
        >
          <h2 className="text-3xl font-black text-slate-900">{t("auth.registerTitle")}</h2>
          <p className="mt-1 text-slate-500">{t("auth.registerIntro")}</p>

          {error && (
            <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-slate-700">{t("auth.fullName")}</label>
              <input
                type="text"
                placeholder={t("auth.fullNamePlaceholder")}
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-slate-700">{t("auth.email")}</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-slate-700">{t("auth.password")}</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={t("auth.newPasswordPlaceholder")}
                  className="input pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-3 text-slate-500"
                  aria-label={showPassword ? t("auth.hidePassword") : t("auth.showPassword")}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-slate-700">{t("auth.confirmPassword")}</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t("auth.confirmPasswordPlaceholder")}
                  className="input pr-12"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute inset-y-0 right-3 text-slate-500"
                  aria-label={showConfirmPassword ? t("auth.hidePassword") : t("auth.showPassword")}
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full btn-primary rounded-xl py-3 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? t("auth.creatingAccount") : t("auth.createAccount")}
            </button>
          </form>

          <p className="text-center mt-5 text-sm text-slate-600">
            {t("auth.alreadyHaveAccount")}{" "}
            <Link to="/login" className="font-semibold text-teal-700 hover:text-teal-800">
              {t("nav.login")}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
