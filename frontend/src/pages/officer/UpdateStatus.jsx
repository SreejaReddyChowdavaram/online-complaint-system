const UpdateStatus = () => {
  return (
    <div className="card">
      <h2>🔄 Update Complaint Status</h2>

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
