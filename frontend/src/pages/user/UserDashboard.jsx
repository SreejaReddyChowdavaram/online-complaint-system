import { Outlet, NavLink } from "react-router-dom";
import "./UserDashboard.css";

const UserDashboard = () => {
  return (
    <div className="user-dashboard">
      {/* SIDEBAR */}
      <aside className="user-sidebar">
        <h3 className="user-sidebar-title">User Dashboard</h3>

        <nav className="user-sidebar-menu">
          {/* EXACT MATCH */}
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              isActive ? "user-sidebar-link active" : "user-sidebar-link"
            }
          >
            📄 View Complaints
          </NavLink>

          <NavLink
            to="/dashboard/post-complaint"
            className={({ isActive }) =>
              isActive ? "user-sidebar-link active" : "user-sidebar-link"
            }
          >
            📝 Post Complaint
          </NavLink>

          <NavLink
            to="/dashboard/profile"
            className={({ isActive }) =>
              isActive ? "user-sidebar-link active" : "user-sidebar-link"
            }
          >
            👤 Profile
          </NavLink>
        </nav>
      </aside>

      {/* CONTENT */}
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
};

export default UserDashboard;
