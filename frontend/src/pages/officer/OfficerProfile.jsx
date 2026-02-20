import { useState } from "react";
import "../../assets/officerProfile.css";

const OfficerProfile = () => {
  const [edit, setEdit] = useState(false);

  const [form, setForm] = useState({
    name: "Officer 1",
    department: "Municipal",
    email: "officer1@jansuvidha.in",
    phone: "9876543210",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="gov-profile-page">
      <div className="gov-profile-card">
        <div className="gov-profile-header">
          <h2>Officer Profile</h2>
          {!edit && (
            <button className="gov-edit-btn" onClick={() => setEdit(true)}>
              Edit Profile
            </button>
          )}
        </div>

        <div className="gov-row">
          <label>Officer Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            disabled={!edit}
          />
        </div>

        <div className="gov-row">
          <label>Department</label>
          <input
            name="department"
            value={form.department}
            onChange={handleChange}
            disabled={!edit}
          />
        </div>

        <div className="gov-row">
          <label>Email ID</label>
          <input value={form.email} disabled />
        </div>

        <div className="gov-row">
          <label>Mobile Number</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            disabled={!edit}
          />
        </div>

        {edit && (
          <div className="gov-actions">
            <button className="gov-save">Save</button>
            <button className="gov-cancel" onClick={() => setEdit(false)}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfficerProfile;
