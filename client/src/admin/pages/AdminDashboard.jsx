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
      <h1 className="text-xl md:text-2xl font-bold">{t("admin.dashboardTitle")}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
        <KPI
          label={t("admin.totalRequests")}
          value={stats.kpis?.totalRequests || 0}
          icon={FiActivity}
          color="bg-slate-900"
        />
        <KPI
          label={t("meta.status.open")}
          value={stats.kpis?.openRequests || 0}
          icon={FiClock}
          color="bg-amber-500"
        />
        <KPI
          label={t("meta.status.in_progress")}
          value={stats.kpis?.inProgressRequests || 0}
          icon={FiFlag}
          color="bg-sky-600"
        />
        <KPI
          label={t("meta.status.completed")}
          value={stats.kpis?.completedRequests || 0}
          icon={FiCheckCircle}
          color="bg-emerald-600"
        />
      </div>

      <section className="grid lg:grid-cols-[0.9fr_1.1fr] gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
          <h2 className="text-lg font-black text-slate-900">{t("admin.priorityMix")}</h2>
          <div className="mt-4 space-y-3">
            {(stats.priorityStats || []).map((item) => (
              <div key={item.name} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <span className="font-medium capitalize text-slate-700">{translatePriority(item.name)}</span>
                <span className="text-lg font-black text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
          <h2 className="text-lg font-black text-slate-900">{t("admin.recentRequests")}</h2>
          <div className="mt-4 space-y-3">
            {recentRequests.length === 0 ? (
              <p className="text-sm text-slate-500">{t("admin.noRequestsYet")}</p>
            ) : (
              recentRequests.map((item) => (
                <article key={item._id} className="rounded-xl border border-slate-200 p-4">
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
  <div className={`rounded-xl p-4 text-white ${color}`}>
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm opacity-90">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
      <Icon size={26} />
    </div>
  </div>
);
