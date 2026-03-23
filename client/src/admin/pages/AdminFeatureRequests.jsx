import { useEffect, useMemo, useState } from "react";
import { FiRefreshCw, FiTrash2 } from "react-icons/fi";
import axios from "../../utils/axios";
import { extractList, extractOne } from "../../utils/apiShape";
import { useToast } from "../../hooks/useToast";
import { useLanguage } from "../../hooks/useLanguage";
import PageState from "../../components/PageState";
import { TableSkeleton } from "../../components/Skeleton";

const PRIORITIES = ["low", "medium", "high"];
const STATUSES = ["open", "in_progress", "completed"];

export default function AdminFeatureRequests() {
  const toast = useToast();
  const { t, locale, translatePriority, translateStatus } = useLanguage();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/feature-requests");
      setItems(extractList(data, ["featureRequests", "items"]));
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || t("admin.requestsLoadFailed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;

    return items.filter((item) =>
      [item.title, item.description, item.priority, item.status, item.creator?.name].some((value) =>
        String(value || "").toLowerCase().includes(term)
      )
    );
  }, [items, search]);

  const metrics = useMemo(
    () => ({
      total: items.length,
      open: items.filter((item) => item.status === "open").length,
      inProgress: items.filter((item) => item.status === "in_progress").length,
      completed: items.filter((item) => item.status === "completed").length,
    }),
    [items]
  );

  const handleUpdate = async (item, field, value) => {
    try {
      setBusyId(item._id);
      const { data } = await axios.patch(`/feature-requests/${item._id}`, { [field]: value });
      const updated = extractOne(data);
      setItems((prev) => prev.map((entry) => (entry._id === item._id ? updated : entry)));
      toast.success(t("admin.requestUpdated"));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || t("admin.requestUpdateFailed"));
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(t("admin.deleteConfirm", { title: item.title }))) {
      return;
    }

    try {
      setBusyId(item._id);
      await axios.delete(`/feature-requests/${item._id}`);
      setItems((prev) => prev.filter((entry) => entry._id !== item._id));
      toast.success(t("admin.requestDeleted"));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || t("admin.requestDeleteFailed"));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-5 md:space-y-6">
      <section className="rounded-[1.6rem] border border-teal-950/10 bg-[linear-gradient(135deg,#0f766e_0%,#115e59_22%,#0f172a_70%,#1e293b_100%)] px-6 py-6 text-white shadow-[0_22px_55px_-34px_rgba(15,23,42,0.92)] md:px-8 md:py-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-teal-100/75">{t("admin.requests")}</p>
            <h1 className="mt-3 text-2xl font-black tracking-tight md:text-4xl">{t("admin.manageRequestsTitle")}</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-200">{t("admin.manageRequestsDesc")}</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            <MetricPill label={t("featuresPage.total")} value={metrics.total} />
            <MetricPill label={t("featuresPage.open")} value={metrics.open} />
            <MetricPill label={t("featuresPage.inProgress")} value={metrics.inProgress} />
            <MetricPill label={t("featuresPage.completed")} value={metrics.completed} />
          </div>
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-white/70 bg-white/80 p-5 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.28)] backdrop-blur md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900">{t("common.filters")}</h2>
            <p className="mt-1 text-sm text-slate-500">{t("admin.searchRequests")}</p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <input
              className="input md:min-w-72"
              placeholder={t("admin.searchRequests")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button onClick={fetchItems} className="btn-secondary inline-flex items-center gap-2 rounded-2xl">
              <FiRefreshCw /> {t("common.refresh")}
            </button>
          </div>
        </div>
      </section>

      {error ? <PageState title={t("admin.requestsLoadFailedTitle")} description={error} tone="error" /> : null}
      {loading ? <TableSkeleton rows={7} /> : null}

      {!loading && !error && filteredItems.length === 0 ? (
        <PageState title={t("admin.noRequestsFoundTitle")} description={t("admin.noRequestsFoundDesc")} />
      ) : null}

      {!loading && !error && filteredItems.length > 0 ? (
        <section className="overflow-hidden rounded-[1.5rem] border border-white/70 bg-white/85 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.28)] backdrop-blur">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-sm">
              <thead className="bg-[linear-gradient(135deg,#f8fafc_0%,#e2e8f0_100%)] text-slate-600">
                <tr>
                  <th className="p-4 text-left">{t("featuresPage.formTitle")}</th>
                  <th className="p-4 text-left">{t("admin.createdByColumn")}</th>
                  <th className="p-4 text-left">{t("featuresPage.formPriority")}</th>
                  <th className="p-4 text-left">{t("admin.statusColumn")}</th>
                  <th className="p-4 text-left">{t("admin.createdDate")}</th>
                  <th className="p-4 text-left">{t("admin.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item._id} className="border-t border-slate-100 align-top transition hover:bg-slate-50/70">
                    <td className="p-4">
                      <div className="font-semibold text-slate-900">{item.title}</div>
                      <div className="mt-1 max-w-xl text-xs leading-5 text-slate-500">{item.description}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-slate-900">{item.creator?.name || t("common.unknown")}</div>
                      <div className="text-xs text-slate-500">{item.creator?.email || "-"}</div>
                    </td>
                    <td className="p-4">
                      <select
                        disabled={busyId === item._id}
                        className="rounded-2xl border border-slate-300 bg-white px-3 py-2 outline-none focus:border-teal-400"
                        value={item.priority}
                        onChange={(e) => handleUpdate(item, "priority", e.target.value)}
                      >
                        {PRIORITIES.map((priority) => (
                          <option key={priority} value={priority}>
                            {translatePriority(priority)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4">
                      <select
                        disabled={busyId === item._id}
                        className="rounded-2xl border border-slate-300 bg-white px-3 py-2 outline-none focus:border-teal-400"
                        value={item.status}
                        onChange={(e) => handleUpdate(item, "status", e.target.value)}
                      >
                        {STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {translateStatus(status)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 text-slate-500">{item.createdAt ? new Date(item.createdAt).toLocaleString(locale) : "-"}</td>
                    <td className="p-4">
                      <button
                        disabled={busyId === item._id}
                        onClick={() => handleDelete(item)}
                        className="inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#ef4444_0%,#dc2626_100%)] px-3.5 py-2 font-semibold text-white shadow-sm disabled:opacity-60"
                      >
                        <FiTrash2 />
                        {t("admin.delete")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </div>
  );
}

const MetricPill = ({ label, value }) => (
  <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
    <p className="text-[11px] uppercase tracking-[0.18em] text-teal-100/80">{label}</p>
    <p className="mt-1 text-2xl font-black text-white">{value}</p>
  </div>
);
