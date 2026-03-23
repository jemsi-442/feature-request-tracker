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
      [item.title, item.description, item.priority, item.status, item.creator?.name]
        .some((value) => String(value || "").toLowerCase().includes(term))
    );
  }, [items, search]);

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
    <div className="max-w-7xl mx-auto space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900">{t("admin.manageRequestsTitle")}</h1>
            <p className="mt-1 text-sm text-slate-500">
              {t("admin.manageRequestsDesc")}
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <input
              className="input md:min-w-72"
              placeholder={t("admin.searchRequests")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button onClick={fetchItems} className="btn-secondary inline-flex items-center gap-2">
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
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-sm">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="p-3 text-left">{t("featuresPage.formTitle")}</th>
                  <th className="p-3 text-left">{t("admin.createdByColumn")}</th>
                  <th className="p-3 text-left">{t("featuresPage.formPriority")}</th>
                  <th className="p-3 text-left">{t("admin.statusColumn")}</th>
                  <th className="p-3 text-left">{t("admin.createdDate")}</th>
                  <th className="p-3 text-left">{t("admin.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item._id} className="border-t border-slate-100 align-top">
                    <td className="p-3">
                      <div className="font-semibold text-slate-900">{item.title}</div>
                      <div className="mt-1 max-w-xl text-xs leading-5 text-slate-500">{item.description}</div>
                    </td>
                    <td className="p-3">
                      <div className="text-slate-900">{item.creator?.name || t("common.unknown")}</div>
                      <div className="text-xs text-slate-500">{item.creator?.email || "-"}</div>
                    </td>
                    <td className="p-3">
                      <select
                        disabled={busyId === item._id}
                        className="rounded-xl border border-slate-300 bg-white px-3 py-2"
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
                    <td className="p-3">
                      <select
                        disabled={busyId === item._id}
                        className="rounded-xl border border-slate-300 bg-white px-3 py-2"
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
                    <td className="p-3 text-slate-500">
                      {item.createdAt ? new Date(item.createdAt).toLocaleString(locale) : "-"}
                    </td>
                    <td className="p-3">
                      <button
                        disabled={busyId === item._id}
                        onClick={() => handleDelete(item)}
                        className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-3 py-2 font-semibold text-white disabled:opacity-60"
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
