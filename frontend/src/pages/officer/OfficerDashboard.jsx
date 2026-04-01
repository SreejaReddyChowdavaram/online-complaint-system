import { Outlet, Link } from "react-router-dom";
import { ClipboardList, UserCircle } from "lucide-react";
import "./OfficerLayout.css";

const OfficerLayout = () => {
  return (
    <div className="officer-dashboard">
      {/* SIDEBAR */}
      <aside className="officer-sidebar">
        <h3>Officer Dashboard</h3>

        <Link to="/officer/complaints">
          <ClipboardList size={20} /> Assigned Complaints
        </Link>
        <Link to="/officer/profile">
          <UserCircle size={20} /> Profile
        </Link>
      </aside>

      {/* CONTENT */}
      <main className="officer-content">
        <Outlet />
      </main>
    </div>
  );
};

export default OfficerLayout;
