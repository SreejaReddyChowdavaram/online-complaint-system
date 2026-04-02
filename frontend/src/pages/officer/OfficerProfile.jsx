import React, { useState, useEffect, useRef } from "react";
import api, { BASE_URL } from "../../services/api";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import "../ProfileTheme.css"; // Shared styles

const OfficerProfile = () => {
  const { t } = useTranslation();

  if (!t) return null;
  const { user, updateUser, token } = useAuth();
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    department: "",
    mobile: ""
  });
  
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/officer/profile");
      setProfile({
        name: res.data.name || "",
        email: res.data.email || "",
        department: res.data.department || "",
        mobile: res.data.mobile || ""
      });
      if (res.data.avatar) {
        // Handle Google avatar (URL) vs local avatar (filename)
        setPreviewUrl(res.data.avatar.startsWith("http") ? res.data.avatar : `${BASE_URL}/uploads/${res.data.avatar}`);
      } else {
        setPreviewUrl(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      fetchProfile(); // Reset on cancel
      setAvatarFile(null);
    }
    setIsEditing(!isEditing);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", profile.name);
      formData.append("department", profile.department);
      formData.append("mobile", profile.mobile);
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const res = await api.put(
        "/officer/profile",
        formData,
        {
          headers: { 
            "Content-Type": "multipart/form-data" 
          },
        }
      );
      
      updateUser(res.data);
      setProfile(res.data);
      setIsEditing(false);
      setAvatarFile(null);
      alert("✅ " + t("complaints.profile.update_success"));
    } catch (err) {
      console.error(err);
      alert("❌ " + t("complaints.profile.update_failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const getInitials = (name) => {
    if (!name) return "O";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const inputClasses = "w-full bg-[#0f172a] border-[#1e293b] text-gray-200 rounded-lg p-3 transition-all focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed";
  const labelClasses = "block text-sm font-medium text-gray-400 mb-1.5 ml-1";

  return (
    <div className="flex justify-center items-start min-h-[calc(100vh-100px)] pt-6 pb-12">
      <div className="w-full max-w-4xl bg-white dark:bg-[#0f172a] rounded-xl shadow-lg border border-gray-100 dark:border-[#1e293b] overflow-hidden transition-all duration-300">
        
        {/* HEADER SECTION */}
        <div className="p-8 pb-4 border-b border-gray-50 dark:border-[#1e293b]">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar Circle */}
              <div 
                className={`relative group w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-xl transition-transform ${isEditing ? 'cursor-pointer hover:scale-105' : ''}`}
                style={{ background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)" }}
                onClick={() => isEditing && fileInputRef.current.click()}
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                ) : (
                  getInitials(profile.name)
                )}
                
                {isEditing && (
                  <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-1">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                      <circle cx="12" cy="13" r="4"></circle>
                    </svg>
                    <span className="text-[10px] uppercase font-bold tracking-tighter">Change</span>
                  </div>
                )}

                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              {/* User Info */}
              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                  {profile.name || "Officer Name"}
                </h1>
                <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
                  <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-[10px] uppercase font-bold border border-blue-200 dark:border-blue-800/50">
                    Officer
                  </span>
                  <span>•</span>
                  <span>{profile.department || "Garbage Management"}</span>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <button 
                    className="px-6 py-2 rounded-lg text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-[#1e293b] hover:bg-gray-200 dark:hover:bg-[#2e3b4e] transition-all" 
                    onClick={handleToggleEdit}
                    disabled={loading}
                  >
                    {t("complaints.profile.cancel")}
                  </button>
                  <button 
                    className="px-6 py-2 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all" 
                    onClick={handleSave}
                    disabled={loading}
                  >
                    {loading ? t("complaints.profile.saving") : t("complaints.profile.save")}
                  </button>
                </>
              ) : (
                <button 
                  className="px-6 py-2 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all" 
                  onClick={handleToggleEdit}
                >
                  {t("complaints.profile.edit")}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* FORM SECTION (GRID) */}
        <div className="p-8 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            {/* Full Name */}
            <div className="space-y-1">
              <label className={labelClasses}>{t("complaints.profile.full_name")}</label>
              <input
                type="text"
                name="name"
                className={inputClasses}
                value={profile.name}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder={t("complaints.profile.name_placeholder")}
              />
            </div>

            {/* Department */}
            <div className="space-y-1">
              <label className={labelClasses}>{t("complaints.analytics.dept_col")}</label>
              <select
                name="department"
                className={inputClasses}
                value={profile.department}
                onChange={handleChange}
                disabled={!isEditing}
              >
                <option value="">{t("complaints.analytics.select_dept")}</option>
                <option value="Electricity">{t("complaints.categories.Electricity")}</option>
                <option value="Water">{t("complaints.categories.Water")}</option>
                <option value="Roads">{t("complaints.categories.Roads")}</option>
                <option value="Drainage">{t("complaints.categories.Drainage")}</option>
                <option value="Garbage">{t("complaints.categories.Garbage")}</option>
                <option value="Noise">{t("complaints.categories.Noise")}</option>
              </select>
            </div>

            {/* Email (Read-only) */}
            <div className="space-y-1">
              <label className={labelClasses}>{t("complaints.profile.email")}</label>
              <input
                type="email"
                className={`${inputClasses} opacity-60`}
                value={profile.email}
                disabled
              />
            </div>

            {/* Mobile Number */}
            <div className="space-y-1">
              <label className={labelClasses}>{t("complaints.profile.mobile")}</label>
              <input
                type="text"
                name="mobile"
                className={inputClasses}
                value={profile.mobile}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder={t("complaints.profile.mobile_placeholder")}
              />
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default OfficerProfile;