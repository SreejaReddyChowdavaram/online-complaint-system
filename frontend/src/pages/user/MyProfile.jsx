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

  /* 🔄 Load logged-in user data */
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

  /* ✅ Handle Input Change */
  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  /* ✅ Save Updated Profile */
  const handleSave = async () => {
    try {
      setLoading(true);

      const res = await axios.put(
        `http://localhost:5000/api/user/update/${user._id}`,
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

      // Update AuthContext + localStorage
      updateUser(res.data.user);

      setIsEditing(false);
      alert("✅ Profile updated successfully");
    } catch (error) {
      console.error("Profile update error:", error);
      alert("❌ Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  /* ❌ Cancel Editing */
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
          {/* Name */}
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

          {/* Email */}
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={profile.email}
              disabled
            />
          </div>

          {/* Mobile */}
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

          {/* Address */}
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

            <button
              className="secondary-btn"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;