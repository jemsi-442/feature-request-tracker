import { useLanguage } from "../hooks/useLanguage";

export default function LanguageSwitcher({ className = "", dark = false }) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <label className={`inline-flex items-center gap-2 text-sm ${dark ? "text-slate-200" : "text-slate-600"} ${className}`}>
      <span className="hidden sm:inline">{t("common.language")}</span>
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value)}
        className={`rounded-full border px-3 py-2 text-sm font-medium outline-none transition ${
          dark
            ? "border-white/15 bg-white/10 text-white"
            : "border-slate-300 bg-white text-slate-700"
        }`}
        aria-label={t("common.language")}
      >
        <option value="en">{t("common.english")}</option>
        <option value="sw">{t("common.swahili")}</option>
      </select>
    </label>
  );
}
