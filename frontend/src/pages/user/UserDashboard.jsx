import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import ChatBot from "../../components/ChatBot";
import "./UserDashboard.css";

const UserDashboard = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="user-dashboard">

      {/* SIDEBAR */}
      <aside className={`user-sidebar ${isOpen ? "open" : "closed"}`}>

        {/* Toggle Button (ALWAYS visible) */}
        <div className="sidebar-top">
          <button
            className="sidebar-toggle"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "⮜" : "⮞"}
          </button>
        </div>

        {/* Hide content only when collapsed */}
        <div className={`sidebar-content ${isOpen ? "" : "hidden"}`}>
          <h3 className="user-sidebar-title">User Dashboard</h3>

          <nav className="user-sidebar-menu">
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
        </div>

      </aside>

      {/* CONTENT */}
      <main className="dashboard-content">
        <Outlet />
      </main>
              <ChatBot />
    </div>
  );
};

export default UserDashboard;