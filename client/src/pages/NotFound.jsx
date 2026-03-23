import { Link } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[linear-gradient(150deg,#03120f_0%,#10222a_55%,#2b3444_100%)] flex items-center justify-center px-4">
      <div className="max-w-xl w-full text-center rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl p-8 md:p-12 text-white shadow-2xl shadow-black/40">
        <p className="text-sm uppercase tracking-[0.22em] text-amber-200">{t("notFound.label")}</p>
        <h1 className="mt-2 text-6xl md:text-7xl font-black">404</h1>
        <p className="mt-3 text-slate-200">{t("notFound.description")}</p>
        <Link to="/" className="inline-block mt-7 btn-primary">
          {t("notFound.backHome")}
        </Link>
      </div>
    </div>
  );
}
