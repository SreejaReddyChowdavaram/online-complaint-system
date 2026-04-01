import { Outlet, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
  Home, 
  PlusSquare, 
  ClipboardList, 
  Users, 
  BarChart3, 
  UserCircle, 
  HelpCircle 
} from "lucide-react";
import "./DashboardLayout.css";

const DashboardLayout = ({ role }) => {
  const { t } = useTranslation();
  
  return (
    <div className="dashboard-layout bg-light-bg dark:bg-dark-bg transition-all duration-300">
      {/* SIDEBAR */}
      <aside className="dashboard-sidebar bg-white dark:bg-dark-bg border-r border-light-border dark:border-dark-border transition-all duration-300 shadow-sm dark:shadow-none">
        <h3 className="dashboard-sidebar-title text-gray-800 dark:text-dark-text">{t(`roles.${role.toLowerCase()}`)} {t("sidebar.panel")}</h3>

        <NavLink
          to={`/${role.toLowerCase()}/dashboard`}
          className={({ isActive }) =>
            isActive
              ? "dashboard-sidebar-link active"
              : "dashboard-sidebar-link"
          }
        >
          <Home size={18} /> {t("sidebar.dashboard")}
        </NavLink>

        {role === "Citizen" && (
          <>
            <NavLink
              to="/complaints/new"
              className={({ isActive }) =>
                isActive
                  ? "dashboard-sidebar-link active"
                  : "dashboard-sidebar-link"
              }
            >
              <PlusSquare size={18} /> {t("sidebar.register_complaint")}
            </NavLink>

            <NavLink
              to="/complaints/my"
              className={({ isActive }) =>
                isActive
                  ? "dashboard-sidebar-link active"
                  : "dashboard-sidebar-link"
              }
            >
              <ClipboardList size={18} /> {t("sidebar.my_complaints")}
            </NavLink>
          </>
        )}

        {role === "Officer" && (
          <NavLink
            to="/officer/complaints"
            className={({ isActive }) =>
              isActive
                ? "dashboard-sidebar-link active"
                : "dashboard-sidebar-link"
            }
          >
            <ClipboardList size={18} /> {t("sidebar.assigned_complaints")}
          </NavLink>
        )}

        {role === "Admin" && (
          <>
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                isActive
                  ? "dashboard-sidebar-link active"
                  : "dashboard-sidebar-link"
              }
            >
              <Users size={18} /> {t("sidebar.manage_users")}
            </NavLink>

            <NavLink
              to="/admin/complaints"
              className={({ isActive }) =>
                isActive
                  ? "dashboard-sidebar-link active"
                  : "dashboard-sidebar-link"
              }
            >
              <BarChart3 size={18} /> {t("sidebar.all_complaints")}
            </NavLink>
          </>
        )}

        <NavLink
          to={`/${role.toLowerCase()}/profile`}
          className={({ isActive }) =>
            isActive
              ? "dashboard-sidebar-link active"
              : "dashboard-sidebar-link"
          }
        >
          <UserCircle size={18} /> {t("sidebar.profile")}
        </NavLink>

        <NavLink
          to="/help"
          className={({ isActive }) =>
            isActive
              ? "dashboard-sidebar-link active"
              : "dashboard-sidebar-link"
          }
        >
          <HelpCircle size={18} /> {t("sidebar.help")}
        </NavLink>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-content bg-light-bg dark:bg-dark-bg transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
