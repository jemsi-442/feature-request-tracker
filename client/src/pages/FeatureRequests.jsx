import { useEffect, useMemo, useState } from "react";
import { FiClipboard, FiEdit2, FiFilter, FiPlus, FiRefreshCw, FiTrash2, FiX } from "react-icons/fi";
import api from "../utils/axios";
import { extractList, extractOne } from "../utils/apiShape";
import { useToast } from "../hooks/useToast";
import { useAuth } from "../hooks/useAuth";
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
  const { user } = useAuth();
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
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "open",
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

  const resetForm = () => {
    setEditingId(null);
    setForm({ title: "", description: "", priority: "medium", status: "open" });
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      title: item.title || "",
      description: item.description || "",
      priority: item.priority || "medium",
      status: item.status || "open",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (item) => {
    if (!window.confirm(t("featuresPage.deleteConfirm", { title: item.title }))) {
      return;
    }

    try {
      await api.delete(`/feature-requests/${item._id}`);
      setFeatureRequests((prev) => prev.filter((entry) => entry._id !== item._id));
      if (editingId === item._id) {
        resetForm();
      }
      toast.success(t("featuresPage.requestDeleted"));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || t("featuresPage.requestDeleteFailed"));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);

      if (editingId) {
        const { data } = await api.patch(`/feature-requests/${editingId}`, form);
        const updated = extractOne(data);
        setFeatureRequests((prev) => prev.map((item) => (item._id === editingId ? updated : item)));
        toast.success(t("featuresPage.requestUpdated"));
        resetForm();
        return;
      }

      const { data } = await api.post("/feature-requests", form);
      const created = extractOne(data);
      setFeatureRequests((prev) => [created, ...prev]);
      resetForm();
      toast.success(t("featuresPage.requestCreated"));
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          (editingId ? t("featuresPage.requestUpdateFailed") : t("featuresPage.requestCreateFailed"))
      );
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
                <h2 className="text-xl font-black text-slate-900">{editingId ? t("featuresPage.editTitle") : t("featuresPage.createTitle")}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {editingId ? t("featuresPage.editDesc") : t("featuresPage.createDesc")}
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

              {editingId ? (
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">{t("featuresPage.formStatus")}</label>
                  <select
                    className="input"
                    value={form.status}
                    onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {translateStatus(status)}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FiClipboard />
                  {submitting
                    ? t("common.saving")
                    : editingId
                      ? t("featuresPage.update")
                      : t("featuresPage.submit")}
                </button>

                {editingId ? (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn-secondary inline-flex items-center gap-2"
                  >
                    <FiX />
                    {t("featuresPage.cancelEdit")}
                  </button>
                ) : null}
              </div>
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
              {featureRequests.map((item) => {
                const isOwner = String(item.creator?._id || item.creator?.id || item.createdBy) === String(user?._id);

                return (
                <article key={item._id} className="rounded-2xl border border-slate-200 p-4 md:p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 md:max-w-[46%] md:justify-end">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${badgeTone[item.priority]}`}>
                        {translatePriority(item.priority)}
                      </span>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${badgeTone[item.status]}`}>
                        {translateStatus(item.status)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-3 text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-col gap-1">
                      <span>{t("common.createdBy", { name: item.creator?.name || t("common.unknownUser") })}</span>
                      <span>{item.createdAt ? new Date(item.createdAt).toLocaleString(locale) : "-"}</span>
                    </div>

                    {isOwner ? (
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-teal-700"
                        >
                          <FiEdit2 />
                          {t("featuresPage.edit")}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
                        >
                          <FiTrash2 />
                          {t("admin.delete")}
                        </button>
                      </div>
                    ) : null}
                  </div>
                </article>
                );
              })}
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
