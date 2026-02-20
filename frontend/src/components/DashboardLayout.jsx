import { Outlet, NavLink } from "react-router-dom";
import "./DashboardLayout.css";

const DashboardLayout = ({ role }) => {
  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">
        <h3 className="dashboard-sidebar-title">{role} Panel</h3>

        <NavLink
          to={`/${role.toLowerCase()}/dashboard`}
          className={({ isActive }) =>
            isActive
              ? "dashboard-sidebar-link active"
              : "dashboard-sidebar-link"
          }
        >
          🏠 Dashboard
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
              📝 Register Complaint
            </NavLink>

            <NavLink
              to="/complaints/my"
              className={({ isActive }) =>
                isActive
                  ? "dashboard-sidebar-link active"
                  : "dashboard-sidebar-link"
              }
            >
              📂 My Complaints
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
            📂 Assigned Complaints
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
              👥 Manage Users
            </NavLink>

            <NavLink
              to="/admin/complaints"
              className={({ isActive }) =>
                isActive
                  ? "dashboard-sidebar-link active"
                  : "dashboard-sidebar-link"
              }
            >
              📊 All Complaints
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
          👤 Profile
        </NavLink>

        <NavLink
          to="/help"
          className={({ isActive }) =>
            isActive
              ? "dashboard-sidebar-link active"
              : "dashboard-sidebar-link"
          }
        >
          ❓ Help
        </NavLink>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
