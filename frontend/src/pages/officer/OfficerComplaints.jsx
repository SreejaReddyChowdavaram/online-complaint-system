import { Link } from "react-router-dom";

const OfficerDashboard = () => {
  return (
    <div className="dashboard-container">
      <h2>🧑‍💼 Officer Dashboard</h2>

      <div className="card-grid">
        <Link to="/officer/complaints" className="dash-card">
          📄 Assigned Complaints
        </Link>

        <Link to="/officer/profile" className="dash-card">
          👤 My Profile
        </Link>

        <Link to="/" className="dash-card logout">
          🚪 Logout
        </Link>
      </div>
    </div>
  );
};

export default OfficerDashboard;
