import { NavLink } from "react-router-dom";

const OfficerSidebar = () => {
  return (
    <div className="sidebar">
      <h2>👮 Officer</h2>

      <NavLink to="/officer/complaints">📋 Assigned Complaints</NavLink>
      <NavLink to="/officer/profile">👤 My Profile</NavLink>

    </div>
  );
};

export default OfficerSidebar;
