import { Link } from "react-router-dom";
import { UserCircle, ClipboardList, LogOut } from "lucide-react";

const OfficerDashboard = () => {
  return (
    <div className="dashboard-container">
      <h2 style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <UserCircle size={24} className="icon-blue" />
        Officer Dashboard
      </h2>

      <div className="card-grid">
        <Link to="/officer/complaints" className="dash-card">
          <ClipboardList size={20} /> Assigned Complaints
        </Link>
        <Link to="/officer/profile" className="dash-card">
          <UserCircle size={20} /> My Profile
        </Link>
        <Link to="/" className="dash-card logout">
          <LogOut size={20} />
        </Link>
      </div>
    </div>
  );
};

export default OfficerDashboard;
