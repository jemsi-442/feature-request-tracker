import { useEffect, useMemo, useState } from "react";
import { FiClipboard, FiFilter, FiPlus, FiRefreshCw } from "react-icons/fi";
import api from "../utils/axios";
import { extractList, extractOne } from "../utils/apiShape";
import { useToast } from "../hooks/useToast";
import { useLanguage } from "../hooks/useLanguage";
import PageState from "../components/PageState";
import { TableSkeleton } from "../components/Skeleton";

const PRIORITIES = ["low", "medium", "high"];
const STATUSES = ["open", "in_progress", "completed"];

const badgeTone = {
  low: "bg-slate-100 text-slate-700",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-red-100 text-red-700",
  open: "bg-sky-100 text-sky-700",
  in_progress: "bg-teal-100 text-teal-700",
  completed: "bg-emerald-100 text-emerald-700",
};

export default function FeatureRequests() {
  const toast = useToast();
  const { t, locale, translatePriority, translateStatus } = useLanguage();
  const [featureRequests, setFeatureRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    priority: "",
    status: "",
  });
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
  });

  const fetchFeatureRequests = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/feature-requests", {
        params: {
          search: filters.search || undefined,
          priority: filters.priority || undefined,
          status: filters.status || undefined,
        },
      });
      setFeatureRequests(extractList(data, ["featureRequests", "items"]));
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || t("featuresPage.loadFailed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatureRequests();
  }, [filters.search, filters.priority, filters.status]);

  const stats = useMemo(() => ({
    total: featureRequests.length,
    open: featureRequests.filter((item) => item.status === "open").length,
    inProgress: featureRequests.filter((item) => item.status === "in_progress").length,
    completed: featureRequests.filter((item) => item.status === "completed").length,
  }), [featureRequests]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      const { data } = await api.post("/feature-requests", form);
      const created = extractOne(data);
      setFeatureRequests((prev) => [created, ...prev]);
      setForm({ title: "", description: "", priority: "medium" });
      toast.success(t("featuresPage.requestCreated"));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || t("featuresPage.requestCreateFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 md:px-6 py-8 md:py-10">
      <div className="max-w-7xl mx-auto space-y-6">
        <section className="rounded-3xl bg-[linear-gradient(135deg,#0f172a_0%,#123b38_50%,#d97706_100%)] px-6 py-8 md:px-8 md:py-10 text-white shadow-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.24em] text-teal-100">{t("featuresPage.badge")}</p>
              <h1 className="mt-3 text-3xl md:text-5xl font-black tracking-tight">{t("featuresPage.title")}</h1>
              <p className="mt-4 text-slate-200">
                {t("featuresPage.intro")}
              </p>
            </div>

            <button onClick={fetchFeatureRequests} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/20">
              <FiRefreshCw /> {t("common.refresh")}
            </button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label={t("featuresPage.total")} value={stats.total} />
          <StatCard label={t("featuresPage.open")} value={stats.open} />
          <StatCard label={t("featuresPage.inProgress")} value={stats.inProgress} />
          <StatCard label={t("featuresPage.completed")} value={stats.completed} />
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-100 text-amber-700">
                <FiPlus />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">{t("featuresPage.createTitle")}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {t("featuresPage.createDesc")}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">{t("featuresPage.formTitle")}</label>
                <input
                  className="input"
                  placeholder={t("featuresPage.formTitlePlaceholder")}
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">{t("featuresPage.formDescription")}</label>
                <textarea
                  className="input min-h-36"
                  placeholder={t("featuresPage.formDescriptionPlaceholder")}
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">{t("featuresPage.formPriority")}</label>
                <select
                  className="input"
                  value={form.priority}
                  onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value }))}
                >
                  {PRIORITIES.map((priority) => (
                    <option key={priority} value={priority}>
                      {translatePriority(priority)}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FiClipboard />
                {submitting ? t("common.saving") : t("featuresPage.submit")}
              </button>
            </div>
          </form>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">{t("featuresPage.listTitle")}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {t("featuresPage.listDesc")}
                </p>
              </div>
              <div className="inline-flex items-center gap-2 text-sm text-slate-500">
                <FiFilter />
                {t("common.filters")}
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <input
                className="input"
                placeholder={t("featuresPage.searchPlaceholder")}
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              />
              <select
                className="input"
                value={filters.priority}
                onChange={(e) => setFilters((prev) => ({ ...prev, priority: e.target.value }))}
              >
                <option value="">{t("featuresPage.allPriorities")}</option>
                {PRIORITIES.map((priority) => (
                  <option key={priority} value={priority}>
                    {translatePriority(priority)}
                  </option>
                ))}
              </select>
              <select
                className="input"
                value={filters.status}
                onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
              >
                <option value="">{t("featuresPage.allStatuses")}</option>
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {translateStatus(status)}
                  </option>
                ))}
              </select>
            </div>

            {error ? <div className="mt-5"><PageState title={t("featuresPage.loadFailedTitle")} description={error} tone="error" /></div> : null}
            {loading ? <div className="mt-5"><TableSkeleton rows={6} /></div> : null}

            {!loading && !error && featureRequests.length === 0 ? (
              <div className="mt-6">
                <PageState
                  title={t("featuresPage.emptyTitle")}
                  description={t("featuresPage.emptyDesc")}
                />
              </div>
            ) : null}

            <div className="mt-5 space-y-4">
              {featureRequests.map((item) => (
                <article key={item._id} className="rounded-2xl border border-slate-200 p-4 md:p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${badgeTone[item.priority]}`}>
                        {translatePriority(item.priority)}
                      </span>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${badgeTone[item.status]}`}>
                        {translateStatus(item.status)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-1 text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
                    <span>{t("common.createdBy", { name: item.creator?.name || t("common.unknownUser") })}</span>
                    <span>{item.createdAt ? new Date(item.createdAt).toLocaleString(locale) : "-"}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black text-slate-900">{value}</p>
    </div>
  );
}
