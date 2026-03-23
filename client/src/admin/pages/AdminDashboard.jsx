import { useEffect, useState } from "react";
import { FiActivity, FiCheckCircle, FiClock, FiFlag } from "react-icons/fi";
import axios from "../../utils/axios";
import { extractList, extractOne } from "../../utils/apiShape";
import { useToast } from "../../hooks/useToast";
import { useLanguage } from "../../hooks/useLanguage";
import { TableSkeleton } from "../../components/Skeleton";

export default function AdminDashboard() {
  const toast = useToast();
  const { t, locale, translatePriority, translateStatus } = useLanguage();
  const [stats, setStats] = useState(null);

  const fetchDashboard = async () => {
    try {
      const { data } = await axios.get("/admin/dashboard");
      setStats(extractOne(data));
    } catch (err) {
      console.error(err);
      toast.error(t("admin.loadDashboardFailed"));
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (!stats) {
    return <TableSkeleton rows={5} />;
  }

  const recentRequests = extractList(stats, ["recentRequests"]);

  return (
    <div className="space-y-6 md:space-y-8">
      <section className="rounded-[1.75rem] border border-teal-950/10 bg-[linear-gradient(135deg,#0f766e_0%,#134e4a_18%,#0f172a_60%,#111827_100%)] px-6 py-7 text-white shadow-[0_24px_60px_-32px_rgba(15,23,42,0.95)] md:px-8 md:py-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.26em] text-teal-100/80">{t("admin.controlCenter")}</p>
            <h1 className="mt-3 text-2xl font-black tracking-tight md:text-4xl">{t("admin.dashboardTitle")}</h1>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-teal-50/90">
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5">{t("admin.totalRequests")}: {stats.kpis?.totalRequests || 0}</span>
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5">{t("featuresPage.inProgress")}: {stats.kpis?.inProgressRequests || 0}</span>
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5">{t("featuresPage.completed")}: {stats.kpis?.completedRequests || 0}</span>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <MiniStat label={t("featuresPage.total")} value={stats.kpis?.totalRequests || 0} />
            <MiniStat label={t("meta.status.open")} value={stats.kpis?.openRequests || 0} />
            <MiniStat label={t("meta.status.completed")} value={stats.kpis?.completedRequests || 0} />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 md:gap-4">
        <KPI label={t("admin.totalRequests")} value={stats.kpis?.totalRequests || 0} icon={FiActivity} color="bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_100%)]" />
        <KPI label={t("meta.status.open")} value={stats.kpis?.openRequests || 0} icon={FiClock} color="bg-[linear-gradient(135deg,#f59e0b_0%,#fbbf24_100%)]" />
        <KPI label={t("meta.status.in_progress")} value={stats.kpis?.inProgressRequests || 0} icon={FiFlag} color="bg-[linear-gradient(135deg,#0ea5e9_0%,#2563eb_100%)]" />
        <KPI label={t("meta.status.completed")} value={stats.kpis?.completedRequests || 0} icon={FiCheckCircle} color="bg-[linear-gradient(135deg,#10b981_0%,#059669_100%)]" />
      </div>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[1.5rem] border border-white/70 bg-white/80 p-5 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.28)] backdrop-blur md:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-black text-slate-900">{t("admin.priorityMix")}</h2>
            <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
              {t("common.filters")}
            </span>
          </div>
          <div className="mt-5 space-y-3">
            {(stats.priorityStats || []).map((item, index) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_100%)] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className={`h-3 w-3 rounded-full ${index === 0 ? "bg-slate-400" : index === 1 ? "bg-amber-400" : "bg-rose-500"}`} />
                  <span className="font-medium text-slate-700">{translatePriority(item.name)}</span>
                </div>
                <span className="text-lg font-black text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-white/70 bg-white/80 p-5 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.28)] backdrop-blur md:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-black text-slate-900">{t("admin.recentRequests")}</h2>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">
              {recentRequests.length}
            </span>
          </div>
          <div className="mt-5 space-y-3">
            {recentRequests.length === 0 ? (
              <p className="text-sm text-slate-500">{t("admin.noRequestsYet")}</p>
            ) : (
              recentRequests.map((item) => (
                <article
                  key={item._id}
                  className="rounded-2xl border border-slate-200/80 bg-[linear-gradient(135deg,#ffffff_0%,#f8fafc_100%)] p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-slate-900">{item.title}</h3>
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold uppercase text-amber-700">
                      {translatePriority(item.priority)}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold uppercase text-slate-700">
                      {translateStatus(item.status)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 line-clamp-2">{item.description}</p>
                  <p className="mt-2 text-xs text-slate-400">
                    {t("admin.createdOn", {
                      name: item.creator?.name || t("common.unknown"),
                      date: item.createdAt ? new Date(item.createdAt).toLocaleDateString(locale) : "-",
                    })}
                  </p>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

const KPI = ({ label, value, icon: Icon, color }) => (
  <div className={`rounded-[1.4rem] p-5 text-white shadow-[0_18px_40px_-28px_rgba(15,23,42,0.55)] ${color}`}>
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm text-white/80">{label}</p>
        <p className="mt-2 text-3xl font-black tracking-tight">{value}</p>
      </div>
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 text-white backdrop-blur">
        <Icon size={24} />
      </span>
    </div>
  </div>
);

const MiniStat = ({ label, value }) => (
  <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
    <p className="text-[11px] uppercase tracking-[0.18em] text-teal-100/80">{label}</p>
    <p className="mt-1 text-2xl font-black text-white">{value}</p>
  </div>
);
