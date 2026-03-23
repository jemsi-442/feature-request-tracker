export default function PageState({
  title,
  description,
  tone = "neutral",
}) {
  const toneStyles = {
    neutral:
      "border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_100%)] text-slate-700 shadow-sm",
    error:
      "border-red-200 bg-[linear-gradient(135deg,#fff1f2_0%,#ffe4e6_100%)] text-red-700 shadow-sm",
    warning:
      "border-amber-200 bg-[linear-gradient(135deg,#fffbeb_0%,#fef3c7_100%)] text-amber-700 shadow-sm",
  };

  return (
    <div className={`rounded-2xl border p-4 md:p-5 ${toneStyles[tone] || toneStyles.neutral}`}>
      <p className="font-semibold">{title}</p>
      {description ? <p className="mt-1 text-sm opacity-90">{description}</p> : null}
    </div>
  );
}
