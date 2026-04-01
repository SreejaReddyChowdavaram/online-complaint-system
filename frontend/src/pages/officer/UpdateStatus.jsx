import { RefreshCw } from "lucide-react";

const UpdateStatus = () => {
  return (
    <div className="card">
      <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <RefreshCw size={22} className="icon-blue" /> 
        Update Complaint Status
      </h2>

      <select>
        <option>Pending</option>
        <option>In Progress</option>
        <option>Resolved</option>
      </select>

      <br /><br />
      <button>Update</button>
    </div>
  );
};

export default UpdateStatus;
