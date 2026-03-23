import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiClipboard, FiClock, FiLayers } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import { useLanguage } from "../hooks/useLanguage";

export default function Home() {
  const { user } = useAuth();
  const { t, translatePriority, translateStatus } = useLanguage();
  const features = [
    {
      icon: <FiClipboard />,
      title: t("home.feature1Title"),
      desc: t("home.feature1Desc"),
    },
    {
      icon: <FiClock />,
      title: t("home.feature2Title"),
      desc: t("home.feature2Desc"),
    },
    {
      icon: <FiLayers />,
      title: t("home.feature3Title"),
      desc: t("home.feature3Desc"),
    },
  ];

  return (
    <div className="w-full overflow-hidden bg-slate-950 text-slate-100">
      <section className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(20,184,166,0.24),transparent_35%),radial-gradient(circle_at_82%_12%,rgba(245,158,11,0.18),transparent_36%),linear-gradient(130deg,#03120f_10%,#10222a_58%,#1f2937_100%)]" />

        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="inline-flex items-center rounded-full border border-teal-300/35 bg-teal-200/10 px-4 py-1 text-xs uppercase tracking-[0.2em] text-teal-100">
              {t("home.badge")}
            </span>

            <h1 className="mt-5 text-4xl sm:text-5xl md:text-6xl font-black leading-[1.05] tracking-tight">
              {t("home.title")}
              <span className="block text-amber-300">{t("home.titleAccent")}</span>
            </h1>

            <p className="mt-6 max-w-xl text-slate-300 text-base md:text-lg">
              {t("home.description")}
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              {!user ? (
                <>
                  <Link to="/register" className="btn-primary inline-flex items-center justify-center gap-2">
                    {t("home.createAccount")} <FiArrowRight />
                  </Link>
                  <Link to="/login" className="btn-secondary inline-flex items-center justify-center gap-2 bg-white/10 text-white border border-white/20 hover:bg-white/20">
                    {t("nav.login")}
                  </Link>
                </>
              ) : (
                <Link to={user.role === "admin" ? "/admin" : "/features"} className="btn-primary inline-flex items-center justify-center gap-2">
                  {t("home.openWorkspace")} <FiArrowRight />
                </Link>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="relative"
          >
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl shadow-2xl shadow-black/40">
              <div className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(155deg,rgba(255,255,255,0.14),rgba(255,255,255,0.03))] p-5 space-y-4">
                {[
                  ["Add dark mode support", "high", "open"],
                  ["Export report as CSV", "medium", "in_progress"],
                  ["Email summary for admins", "low", "completed"],
                ].map(([title, priority, status]) => (
                  <div key={title} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">{title}</p>
                        <p className="mt-1 text-sm text-slate-300">
                          {t("home.requestCardDescription")}
                        </p>
                      </div>
                      <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-amber-200">
                        {translatePriority(priority)}
                      </span>
                    </div>
                    <div className="mt-3 inline-flex rounded-full border border-teal-400/20 bg-teal-400/10 px-3 py-1 text-xs font-semibold text-teal-100">
                      {translateStatus(status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-slate-50 text-slate-900 py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
            {features.map((item, index) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition"
              >
                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
                  {item.icon}
                </div>
                <h3 className="mt-4 text-xl font-bold">{item.title}</h3>
                <p className="mt-2 text-slate-600">{item.desc}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
