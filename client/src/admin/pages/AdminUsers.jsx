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
      setUsers((prev) =>
        prev.map((user) => (user._id === userId ? { ...user, role: updated.role } : user))
      );
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
      setUsers((prev) =>
        prev.map((entry) => (entry._id === user._id ? { ...entry, active: updated.active } : entry))
      );
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
      [user.name, user.email, user.role].some((value) =>
        String(value || "").toLowerCase().includes(term)
      )
    );
  }, [users, search]);

  return (
    <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800">{t("admin.manageUsers")}</h2>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-slate-900">{t("admin.teamAccounts")}</h3>
            <p className="text-sm text-slate-500 mt-1">
              {t("admin.teamAccountsDesc")}
            </p>
          </div>
          <input
            className="input md:max-w-xs"
            placeholder={t("admin.searchUsers")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      {error ? (
        <PageState title={t("admin.usersLoadFailedTitle")} description={error} tone="error" />
      ) : null}

      {loading ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-slate-500">{t("admin.loadingUsers")}</p>
        </section>
      ) : (
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="p-3 text-left">{t("admin.userColumn")}</th>
                  <th className="p-3 text-left">{t("admin.roleColumn")}</th>
                  <th className="p-3 text-left">{t("admin.statusColumn")}</th>
                  <th className="p-3 text-left">{t("admin.createdColumn")}</th>
                  <th className="p-3 text-left">{t("admin.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-t border-slate-100">
                    <td className="p-3">
                      <div className="font-semibold text-slate-900">{user.name}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        user.role === "admin"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-slate-100 text-slate-700"
                      }`}>
                        {translateRole(user.role)}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        user.active ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                      }`}>
                        {user.active ? t("admin.active") : t("admin.suspended")}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500">
                      {user.createdAt || user.created_at
                        ? new Date(user.createdAt || user.created_at).toLocaleDateString(locale)
                        : "-"}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          disabled={updatingId === user._id}
                          onClick={() => handleResetPassword(user)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 text-white disabled:opacity-60"
                        >
                          <FiKey />
                          {t("admin.resetPassword")}
                        </button>
                        <button
                          disabled={updatingId === user._id}
                          onClick={() => toggleRole(user._id, user.role)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-700 text-white disabled:opacity-60"
                        >
                          <FiShield />
                          {user.role === "admin" ? t("admin.makeUser") : t("admin.makeAdmin")}
                        </button>
                        <button
                          disabled={updatingId === user._id}
                          onClick={() => handleToggleStatus(user)}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-white disabled:opacity-60 ${
                            user.active ? "bg-amber-500" : "bg-emerald-600"
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
