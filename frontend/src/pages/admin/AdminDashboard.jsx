import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

const API_URL = "http://localhost:5000/api";

function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_URL}/admin/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStats(res.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

 useEffect(() => {
  fetchStats();
}, []);

  return (
    <div className="admin-dashboard">
      <h1 className="dashboard-title">Admin Dashboard</h1>

      <div className="cards-container">
        <div className="card total">
          <h3>Total Complaints</h3>
          <p>{stats.total}</p>
        </div>

        <div className="card pending">
          <h3>Pending</h3>
          <p>{stats.pending}</p>
        </div>

        <div className="card progress">
          <h3>In Progress</h3>
          <p>{stats.inProgress}</p>
        </div>

        <div className="card resolved">
          <h3>Resolved</h3>
          <p>{stats.resolved}</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
