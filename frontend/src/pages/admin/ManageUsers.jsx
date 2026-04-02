import React from "react";
import api from "../../services/api";
import { Trash2, UserCog, Search, ShieldCheck, Users, UserCheck, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import "./ManageUsers.css";

const ROLES = ["Citizen", "Officer", "Admin"];

const ROLE_PRIORITY = { Admin: 0, Officer: 1, Citizen: 2 };

const roleColors = {
  Citizen: "role-citizen",
  Officer: "role-officer",
  Admin: "role-admin",
};

export default function ManageUsers() {
  const { t } = useTranslation();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterRole, setFilterRole] = React.useState("All");
  const [changingRole, setChangingRole] = React.useState({}); // { [userId]: newRole }
  const [savingId, setSavingId] = React.useState(null);
  const [deletingId, setDeletingId] = React.useState(null);
  const [toast, setToast] = React.useState(null);

  const token = localStorage.getItem("token");
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/admin/users");
      // Extra safety: ensure data is an array
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("fetchUsers Error:", err);
      setError(err?.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRoleSelect = (userId, role) => {
    setChangingRole((prev) => ({ ...prev, [userId]: role }));
  };

  const handleRoleSave = async (userId) => {
    const newRole = changingRole[userId];
    if (!newRole) return;
    setSavingId(userId);
    try {
      await api.put(
        `/admin/user/${userId}`,
        { role: newRole }
      );
      showToast("Role updated successfully ✓");
      setChangingRole((prev) => { const c = { ...prev }; delete c[userId]; return c; });
      fetchUsers();
    } catch (err) {
      showToast(err?.response?.data?.message || "Role update failed", "error");
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (userId, userName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${userName || "this user"}"? This action cannot be undone.`
    );
    if (!confirmed) return;
    setDeletingId(userId);
    try {
      await api.delete(`/admin/user/${userId}`);
      showToast("User deleted successfully ✓");
      fetchUsers();
    } catch (err) {
      showToast(err?.response?.data?.message || "Delete failed", "error");
    } finally {
      setDeletingId(null);
    }
  };

  // Sort by role then name
  const sortedUsers = [...users].sort((a, b) => {
    const pA = ROLE_PRIORITY[a.role] ?? 99;
    const pB = ROLE_PRIORITY[b.role] ?? 99;
    if (pA !== pB) return pA - pB;
    return (a.name || "").localeCompare(b.name || "");
  });

  // Filter + search (Null-safe)
  const filtered = sortedUsers.filter((u) => {
    if (!u) return false;
    const matchRole = filterRole === "All" || u.role === filterRole;
    const nameStr = u.name?.toLowerCase() || "";
    const emailStr = u.email?.toLowerCase() || "";
    const searchStr = searchTerm.toLowerCase();
    const matchSearch = nameStr.includes(searchStr) || emailStr.includes(searchStr);
    return matchRole && matchSearch;
  });

  // Stats (Null-safe)
  const counts = {
    total: users.length,
    citizens: users.filter((u) => u?.role === "Citizen").length,
    officers: users.filter((u) => u?.role === "Officer").length,
    admins: users.filter((u) => u?.role === "Admin").length,
  };

  return (
    <div className="mu-page">
      {/* Toast */}
      {toast && (
        <div className={`mu-toast ${toast.type === "error" ? "mu-toast-error" : "mu-toast-success"}`}>
          {String(toast?.msg || "")}
        </div>
      )}

      {/* Header */}
      <div className="mu-header">
        <div>
          <h1 className="mu-title">
            <Users size={26} /> {t("manage_users.title")}
          </h1>
          <p className="mu-subtitle">{t("manage_users.subtitle")}</p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="mu-stats">
        <div className="mu-stat">
          <span className="mu-stat-number">{counts?.total || 0}</span>
          <span className="mu-stat-label">{t("manage_users.total_users")}</span>
        </div>
        <div className="mu-stat">
          <UserCheck size={16} />
          <span className="mu-stat-number">{counts?.citizens || 0}</span>
          <span className="mu-stat-label">{t("manage_users.citizens")}</span>
        </div>
        <div className="mu-stat">
          <ShieldCheck size={16} />
          <span className="mu-stat-number">{counts?.officers || 0}</span>
          <span className="mu-stat-label">{t("manage_users.officers")}</span>
        </div>
        <div className="mu-stat">
          <UserCog size={16} />
          <span className="mu-stat-number">{counts?.admins || 0}</span>
          <span className="mu-stat-label">{t("manage_users.admins")}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="mu-filters">
        <div className="mu-search-wrap">
          <Search size={16} className="mu-search-icon" />
          <input
            className="mu-search"
            type="text"
            placeholder={t("manage_users.search_placeholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="mu-role-filter">
          {["All", ...ROLES].map((r) => (
            <button
              key={r}
              className={`mu-filter-btn ${filterRole === r ? "active" : ""}`}
              onClick={() => setFilterRole(r)}
            >
              {r === "All" ? t("manage_users.filter_all") : t(`roles.${r.toLowerCase()}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="mu-state-center">
          <div className="mu-spinner" />
          <p>{t("manage_users.loading_users")}</p>
        </div>
      ) : error ? (
        <div className="mu-state-center mu-error">
          <p>{String(error)}</p>
          <button className="mu-btn mu-btn-primary" onClick={fetchUsers}>Retry</button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="mu-state-center">
          <p>{t("manage_users.no_users_found")}</p>
        </div>
      ) : (
        <div className="mu-table-wrap">
          <table className="mu-table">
            <thead>
              <tr>
                <th>{t("manage_users.table_header_num")}</th>
                <th>{t("manage_users.table_header_name")}</th>
                <th>{t("manage_users.table_header_email")}</th>
                <th>{t("manage_users.table_header_role")}</th>
                <th>{t("manage_users.table_header_change")}</th>
                <th>{t("manage_users.table_header_actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, idx) => {
                const isSelf = currentUser?._id === u?._id || currentUser?.id === u?._id || currentUser?._id === u?.id || currentUser?.id === u?.id;
                const pendingRole = changingRole[u?._id || u?.id];
                return (
                  <tr key={u?._id || u?.id} className={isSelf ? "mu-row-self" : ""}>
                    <td className="mu-td-num">{idx + 1}</td>
                    <td className="mu-td-name">
                      <span className="mu-user-name">{u?.name || "N/A"}</span>
                      {isSelf && <span className="mu-you-badge">{t("manage_users.you_badge")}</span>}
                    </td>
                    <td className="mu-td-email">{u?.email || "N/A"}</td>
                    <td>
                      <span className={`mu-role-badge ${roleColors[u?.role] || ""}`}>
                        {t(`roles.${(u?.role || "Citizen").toLowerCase()}`)}
                      </span>
                    </td>
                    <td>
                      <div className="mu-role-change">
                        <select
                          className="mu-select"
                          value={pendingRole || u?.role || "Citizen"}
                          onChange={(e) => handleRoleSelect(u?._id || u?.id, e.target.value)}
                          disabled={isSelf || u?.role === "Admin"}
                        >
                          {ROLES.filter(r => r !== "Admin").map((r) => (
                            <option key={r} value={r}>{t(`roles.${r.toLowerCase()}`)}</option>
                          ))}
                          {u?.role === "Admin" && <option value="Admin">{t("roles.admin")}</option>}
                        </select>
                        <button
                          className={`mu-btn mu-btn-save ${(pendingRole && pendingRole !== u?.role) ? 'mu-btn-active' : ''}`}
                          disabled={isSelf || !pendingRole || pendingRole === u?.role || savingId === (u?._id || u?.id)}
                          onClick={() => handleRoleSave(u?._id || u?.id)}
                        >
                          {savingId === (u?._id || u?.id) ? t("manage_users.btn_saving") : t("manage_users.btn_save")}
                        </button>
                      </div>
                    </td>
                    <td>
                      <button
                        className="mu-btn mu-btn-delete"
                        disabled={isSelf || deletingId === (u?._id || u?.id)}
                        onClick={() => handleDelete(u?._id || u?.id, u?.name)}
                        title={isSelf ? t("manage_users.delete_self_err") : t("manage_users.btn_delete")}
                      >
                        <Trash2 size={15} />
                        {deletingId === (u?._id || u?.id) ? t("manage_users.btn_deleting") : t("manage_users.btn_delete")}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      )}
    </div>
  );
}
