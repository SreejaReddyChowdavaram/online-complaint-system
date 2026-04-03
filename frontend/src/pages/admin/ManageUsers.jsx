import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { 
  Trash2, 
  UserCog, 
  Search, 
  ShieldCheck, 
  Users, 
  UserCheck, 
  User,
  MoreVertical,
  Check,
  X,
  AlertCircle
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import WelcomeHeader from "../../components/WelcomeHeader";
import "./ManageUsers.css";

const ROLES = ["Citizen", "Officer", "Admin"];
const ROLE_PRIORITY = { Admin: 0, Officer: 1, Citizen: 2 };

function ManageUsers() {
  const { t } = useTranslation();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [changingRole, setChangingRole] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/admin/users");
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("fetchUsers Error:", err);
      setError(err?.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleSelect = (userId, role) => {
    setChangingRole((prev) => ({ ...prev, [userId]: role }));
  };

  const handleRoleSave = async (userId) => {
    const newRole = changingRole[userId];
    if (!newRole) return;
    setSavingId(userId);
    try {
      await api.put(`/admin/user/${userId}`, { role: newRole });
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
    const confirmed = window.confirm(`Are you sure you want to delete "${userName || "this user"}"? This action cannot be undone.`);
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

  const filtered = users
    .filter((u) => {
      if (!u) return false;
      const matchRole = filterRole === "All" || u.role === filterRole;
      const matchSearch = (u.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
                          (u.email?.toLowerCase() || "").includes(searchTerm.toLowerCase());
      return matchRole && matchSearch;
    })
    .sort((a, b) => {
      const pA = ROLE_PRIORITY[a.role] ?? 99;
      const pB = ROLE_PRIORITY[b.role] ?? 99;
      if (pA !== pB) return pA - pB;
      return (a.name || "").localeCompare(b.name || "");
    });

  const counts = {
    total: users.length,
    citizens: users.filter((u) => u?.role === "Citizen").length,
    officers: users.filter((u) => u?.role === "Officer").length,
    admins: users.filter((u) => u?.role === "Admin").length,
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 gap-4">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="font-bold tracking-widest uppercase text-[10px]">{t("manage_users.loading_users")}</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-24 right-8 z-[2000] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm ${
              toast.type === "error" ? "bg-red-500 text-white" : "bg-emerald-500 text-white"
            }`}
          >
            {toast.type === "error" ? <AlertCircle size={18} /> : <Check size={18} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <WelcomeHeader userName={currentUser?.name || "Admin"} role="Admin" />
      
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-8 mb-10">
        {[
          { label: "Total Users", icon: <Users size={18} />, value: counts.total, color: "blue" },
          { label: "Citizens", icon: <UserCheck size={18} />, value: counts.citizens, color: "indigo" },
          { label: "Officers", icon: <ShieldCheck size={18} />, value: counts.officers, color: "cyan" },
          { label: "Admins", icon: <UserCog size={18} />, value: counts.admins, color: "rose" }
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
            <div className={`p-3 rounded-2xl mb-3 bg-${stat.color}-50 text-${stat.color}-600 dark:bg-${stat.color}-900/20`}>
              {stat.icon}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</span>
            <span className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder={t("manage_users.search_placeholder")}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 lg:pb-0">
          {["All", ...ROLES].map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                filterRole === role
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800 hover:border-blue-500"
              }`}
            >
              {role === "All" ? "All Users" : role}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white dark:bg-slate-900 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
              <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 italic">User</th>
              <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Email</th>
              <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 italic text-center">Current Role</th>
              <th className="px-8 py-5 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Role Management</th>
              <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
            {filtered.map((u) => {
              const pendingRole = changingRole[u._id];
              const isSelf = currentUser?._id === u._id;
              const isAdmin = u.role === 'Admin';
              
              return (
                <tr key={u._id} className="group hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-all">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
                        {u.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                          {u.name}
                          {isSelf && <span className="bg-blue-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">You</span>}
                        </p>
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{u.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500 dark:text-slate-400 font-medium">{u.email}</td>
                  <td className="px-8 py-5 text-center">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                      u.role === 'Admin' ? 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/20 dark:border-rose-800/50' :
                      u.role === 'Officer' ? 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800/50' :
                      'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800/50'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center gap-2">
                      <select
                        className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        value={pendingRole || u.role}
                        onChange={(e) => handleRoleSelect(u._id, e.target.value)}
                        disabled={isSelf || isAdmin}
                      >
                        {ROLES.filter(r => r !== 'Admin').map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                        {isAdmin && <option value="Admin">Admin</option>}
                      </select>
                      {pendingRole && pendingRole !== u.role && (
                        <button
                          onClick={() => handleRoleSave(u._id)}
                          disabled={savingId === u._id}
                          className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                        >
                          <Check size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button
                      onClick={() => handleDelete(u._id, u.name)}
                      disabled={isSelf || deletingId === u._id}
                      className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title={isSelf ? "Cannot delete self" : "Delete User"}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout (Strict 2 columns) */}
      <div className="lg:hidden grid grid-cols-2 gap-4">
        {filtered.map((u) => {
          const pendingRole = changingRole[u._id];
          const isSelf = currentUser?._id === u._id;
          const isAdmin = u.role === 'Admin';

          return (
            <div key={u._id} className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-lg shrink-0">
                  {u.name?.charAt(0)}
                </div>
                <button
                  onClick={() => handleDelete(u._id, u.name)}
                  disabled={isSelf}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg disabled:opacity-30"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="flex-1 min-w-0 mb-4">
                <p className="text-sm font-bold text-slate-800 dark:text-white truncate flex items-center gap-1.5">
                  {u.name}
                  {isSelf && <span className="bg-blue-600 text-white text-[7px] font-black px-1 py-0.5 rounded uppercase">You</span>}
                </p>
                <p className="text-[10px] text-slate-400 truncate mb-2">{u.email}</p>
                <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border ${
                  u.role === 'Admin' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                  u.role === 'Officer' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                  'bg-emerald-50 text-emerald-600 border-emerald-100'
                }`}>
                  {u.role}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-50 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <select
                    className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg px-2 py-1.5 text-[10px] font-bold text-slate-600 dark:text-slate-300 outline-none disabled:opacity-50"
                    value={pendingRole || u.role}
                    onChange={(e) => handleRoleSelect(u._id, e.target.value)}
                    disabled={isSelf || isAdmin}
                  >
                    {ROLES.filter(r => r !== 'Admin').map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                    {isAdmin && <option value="Admin">Admin</option>}
                  </select>
                  {pendingRole && pendingRole !== u.role && (
                    <button
                      onClick={() => handleRoleSave(u._id)}
                      className="p-1.5 bg-blue-600 text-white rounded-lg shadow-md"
                    >
                      <Check size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ManageUsers;
