export default function PageState({
  title,
  description,
  tone = "neutral",
}) {
  const toneStyles = {
    neutral: "bg-gray-50 text-gray-700 border-gray-200",
    error: "bg-red-50 text-red-700 border-red-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
  };

  return (
    <div className={`border rounded-xl p-4 md:p-5 ${toneStyles[tone] || toneStyles.neutral}`}>
      <p className="font-semibold">{title}</p>
      {description ? <p className="text-sm opacity-90 mt-1">{description}</p> : null}
    </div>
  );
}
