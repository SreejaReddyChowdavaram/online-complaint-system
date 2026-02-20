import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "./MyProfile.css";

const MyProfile = () => {
  const { user, updateUser, token } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
  });

  /* 🔄 LOAD USER DATA INTO FORM */
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        mobile: user.mobile || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  /* ✅ SAVE PROFILE (BACKEND + CONTEXT) */
  const handleSave = async () => {
    try {
      setLoading(true);

      const res = await axios.put(
        "http://localhost:3000/api/users/update-profile",
        {
          name: profile.name,
          mobile: profile.mobile,
          address: profile.address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ Update AuthContext + localStorage with DB data
      updateUser(res.data.user);

      setIsEditing(false);
      alert("✅ Profile updated successfully");
    } catch (err) {
      console.error("Profile update error:", err);
      alert("❌ Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setProfile({
      name: user.name || "",
      email: user.email || "",
      mobile: user.mobile || "",
      address: user.address || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <h2 className="page-title">👤 My Profile</h2>

      <div className="gov-card">
        <h3 className="card-title">Personal Details</h3>

        <div className="profile-grid">
          <div className="field">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              disabled={!isEditing}
              onChange={handleChange}
            />
          </div>

          <div className="field">
            <label>Email</label>
            <input type="email" value={profile.email} disabled />
          </div>

          <div className="field">
            <label>Mobile</label>
            <input
              type="text"
              name="mobile"
              value={profile.mobile}
              disabled={!isEditing}
              onChange={handleChange}
            />
          </div>

          <div className="field full">
            <label>Address</label>
            <textarea
              name="address"
              value={profile.address}
              disabled={!isEditing}
              onChange={handleChange}
            />
          </div>
        </div>

        {!isEditing ? (
          <button
            className="primary-btn"
            onClick={() => setIsEditing(true)}
          >
            ✏️ Edit Profile
          </button>
        ) : (
          <div className="btn-row">
            <button
              className="primary-btn"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Saving..." : "💾 Save Changes"}
            </button>
            <button className="secondary-btn" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
