import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import api from "../utils/axios";
import { useLanguage } from "../hooks/useLanguage";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [resetUrl, setResetUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setResetUrl("");
    setLoading(true);

    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      setMessage(data.message || t("auth.resetPrepared"));
      setResetUrl(data.resetUrl || "");
    } catch (err) {
      setError(err.response?.data?.message || t("auth.resetPrepareFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(165deg,#0f172a_0%,#153b37_45%,#2b3444_100%)] px-4 py-12">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 rounded-3xl overflow-hidden border border-white/15 shadow-2xl shadow-black/30">
        <aside className="hidden lg:flex flex-col justify-between bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.28),transparent_42%),#0f172a] p-10 text-white">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-teal-100">{t("auth.forgotBadge")}</p>
            <h1 className="mt-4 text-4xl font-black leading-tight">{t("auth.forgotBrandTitle")}</h1>
            <p className="mt-4 text-slate-300">{t("auth.forgotBrandDesc")}</p>
          </div>
          <p className="text-sm text-slate-400">{t("auth.forgotBrandFoot")}</p>
        </aside>

        <motion.div
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-white p-6 md:p-10"
        >
          <h2 className="text-3xl font-black text-slate-900">{t("auth.forgotTitle")}</h2>
          <p className="mt-1 text-slate-500">{t("auth.forgotIntro")}</p>

          {error && (
            <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
          )}

          {message && (
            <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 space-y-2">
              <p>{message}</p>
              {resetUrl ? (
                <a href={resetUrl} className="font-semibold text-emerald-800 underline break-all">
                  {t("auth.openResetLink")}
                </a>
              ) : null}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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

            <button
              disabled={loading}
              className="w-full btn-primary rounded-xl py-3 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? t("auth.preparing") : t("auth.prepareReset")}
            </button>
          </form>

          <p className="text-center mt-5 text-sm text-slate-600">
            {t("auth.rememberPassword")}{" "}
            <Link to="/login" className="font-semibold text-teal-700 hover:text-teal-800">
              {t("auth.backToLogin")}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
