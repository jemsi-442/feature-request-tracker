import { useEffect, useMemo, useState } from "react";
import { FiKey, FiShield, FiUserCheck, FiUserX } from "react-icons/fi";
import axios from "../../utils/axios";
import { extractList, extractOne } from "../../utils/apiShape";
import PageState from "../../components/PageState";
import { useToast } from "../../hooks/useToast";
import { useLanguage } from "../../hooks/useLanguage";

export default function AdminUsers() {
  const toast = useToast();
  const { t, locale, translateRole } = useLanguage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/users");
      setUsers(extractList(data, ["users", "items"]));
      setError("");
    } catch (err) {
      console.error(err);
      setError(t("admin.usersLoadFailed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleRole = async (userId, currentRole) => {
    try {
      setUpdatingId(userId);
      const newRole = currentRole === "admin" ? "user" : "admin";
      const { data } = await axios.patch(`/users/${userId}/role`, { role: newRole });
      const updated = extractOne(data);
      setUsers((prev) => prev.map((user) => (user._id === userId ? { ...user, role: updated.role } : user)));
      toast.success(t("admin.roleUpdated"));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || t("admin.roleUpdateFailed"));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleResetPassword = async (user) => {
    const password = window.prompt(t("admin.resetPasswordPrompt", { email: user.email }));
    if (!password) return;

    try {
      setUpdatingId(user._id);
      await axios.patch(`/users/${user._id}/password`, { password });
      toast.success(t("admin.passwordResetSuccess"));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || t("admin.passwordResetFailed"));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      setUpdatingId(user._id);
      const { data } = await axios.patch(`/users/${user._id}/status`, { active: !user.active });
      const updated = extractOne(data);
      setUsers((prev) => prev.map((entry) => (entry._id === user._id ? { ...entry, active: updated.active } : entry)));
      toast.success(t("admin.statusUpdated"));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || t("admin.statusUpdateFailed"));
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;

    return users.filter((user) =>
      [user.name, user.email, user.role].some((value) => String(value || "").toLowerCase().includes(term))
    );
  }, [users, search]);

  const metrics = useMemo(
    () => ({
      total: users.length,
      admins: users.filter((user) => user.role === "admin").length,
      active: users.filter((user) => user.active).length,
      suspended: users.filter((user) => !user.active).length,
    }),
    [users]
  );

  return (
    <div className="max-w-7xl mx-auto space-y-5 md:space-y-6">
      <section className="rounded-[1.6rem] border border-teal-950/10 bg-[linear-gradient(135deg,#0f766e_0%,#115e59_22%,#0f172a_70%,#1e293b_100%)] px-6 py-6 text-white shadow-[0_22px_55px_-34px_rgba(15,23,42,0.92)] md:px-8 md:py-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-teal-100/75">{t("admin.users")}</p>
            <h1 className="mt-3 text-2xl font-black tracking-tight md:text-4xl">{t("admin.manageUsers")}</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-200">{t("admin.teamAccountsDesc")}</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            <MetricPill label={t("featuresPage.total")} value={metrics.total} />
            <MetricPill label={t("meta.role.admin")} value={metrics.admins} />
            <MetricPill label={t("admin.active")} value={metrics.active} />
            <MetricPill label={t("admin.suspended")} value={metrics.suspended} />
          </div>
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-white/70 bg-white/80 p-5 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.28)] backdrop-blur md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900">{t("admin.teamAccounts")}</h2>
            <p className="mt-1 text-sm text-slate-500">{t("admin.searchUsers")}</p>
          </div>
          <input
            className="input md:max-w-xs"
            placeholder={t("admin.searchUsers")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      {error ? <PageState title={t("admin.usersLoadFailedTitle")} description={error} tone="error" /> : null}

      {loading ? (
        <section className="rounded-[1.5rem] border border-white/70 bg-white/80 p-5 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.28)] backdrop-blur">
          <p className="text-slate-500">{t("admin.loadingUsers")}</p>
        </section>
      ) : (
        <section className="overflow-hidden rounded-[1.5rem] border border-white/70 bg-white/85 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.28)] backdrop-blur">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-[linear-gradient(135deg,#f8fafc_0%,#e2e8f0_100%)] text-slate-600">
                <tr>
                  <th className="p-4 text-left">{t("admin.userColumn")}</th>
                  <th className="p-4 text-left">{t("admin.roleColumn")}</th>
                  <th className="p-4 text-left">{t("admin.statusColumn")}</th>
                  <th className="p-4 text-left">{t("admin.createdColumn")}</th>
                  <th className="p-4 text-left">{t("admin.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-t border-slate-100 transition hover:bg-slate-50/70">
                    <td className="p-4">
                      <div className="font-semibold text-slate-900">{user.name}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        user.role === "admin" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700"
                      }`}>
                        {translateRole(user.role)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        user.active ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                      }`}>
                        {user.active ? t("admin.active") : t("admin.suspended")}
                      </span>
                    </td>
                    <td className="p-4 text-slate-500">
                      {user.createdAt || user.created_at ? new Date(user.createdAt || user.created_at).toLocaleDateString(locale) : "-"}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          disabled={updatingId === user._id}
                          onClick={() => handleResetPassword(user)}
                          className="inline-flex items-center gap-1 rounded-2xl bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_100%)] px-3.5 py-2 text-white shadow-sm disabled:opacity-60"
                        >
                          <FiKey />
                          {t("admin.resetPassword")}
                        </button>
                        <button
                          disabled={updatingId === user._id}
                          onClick={() => toggleRole(user._id, user.role)}
                          className="inline-flex items-center gap-1 rounded-2xl bg-[linear-gradient(135deg,#0f766e_0%,#115e59_100%)] px-3.5 py-2 text-white shadow-sm disabled:opacity-60"
                        >
                          <FiShield />
                          {user.role === "admin" ? t("admin.makeUser") : t("admin.makeAdmin")}
                        </button>
                        <button
                          disabled={updatingId === user._id}
                          onClick={() => handleToggleStatus(user)}
                          className={`inline-flex items-center gap-1 rounded-2xl px-3.5 py-2 text-white shadow-sm disabled:opacity-60 ${
                            user.active
                              ? "bg-[linear-gradient(135deg,#f59e0b_0%,#fbbf24_100%)]"
                              : "bg-[linear-gradient(135deg,#10b981_0%,#059669_100%)]"
                          }`}
                        >
                          {user.active ? <FiUserX /> : <FiUserCheck />}
                          {user.active ? t("admin.suspend") : t("admin.activate")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

const MetricPill = ({ label, value }) => (
  <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
    <p className="text-[11px] uppercase tracking-[0.18em] text-teal-100/80">{label}</p>
    <p className="mt-1 text-2xl font-black text-white">{value}</p>
  </div>
);
