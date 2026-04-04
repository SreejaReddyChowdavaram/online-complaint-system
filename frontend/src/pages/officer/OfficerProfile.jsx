import React, { useState, useEffect, useRef } from "react";
import api, { BASE_URL } from "../../services/api";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import "../ProfileTheme.css"; // Shared styles

const OfficerProfile = () => {
  const { t } = useTranslation();

  if (!t) return null;
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    mobile: "",
    department: "",
  });
  
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/officer/profile");
      setProfile({
        name: res.data.name || "",
        email: res.data.email || "",
        mobile: res.data.mobile || "",
        department: res.data.department || "",
      });
      if (res.data.avatar) {
        setPreviewUrl(res.data.avatar.startsWith("http") ? res.data.avatar : `${BASE_URL}/uploads/${res.data.avatar}`);
      } else {
        setPreviewUrl(null);
      }
    } catch (err) {
      console.error("Fetch profile error:", err);
    }
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      fetchProfile();
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
      formData.append("mobile", profile.mobile);
      formData.append("department", profile.department);
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
      setIsEditing(false);
      setAvatarFile(null);
      alert("✅ " + t("complaints.profile.update_success"));
    } catch (error) {
      console.error("Profile update error:", error);
      alert("❌ " + t("complaints.profile.update_failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b1120] p-6 lg:p-12 transition-all duration-500">
      <div className="max-w-4xl mx-auto">
        
        {/* Minimal Profile Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-all duration-300">
          
          {/* 1. Essential Header Section */}
          <div className="p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-50 dark:border-slate-800/50">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Profile Image (Avatar) */}
              <div 
                className={`relative group w-28 h-28 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 transition-all duration-500 ${isEditing ? 'cursor-pointer hover:ring-4 ring-blue-500/10' : ''}`}
                onClick={() => isEditing && fileInputRef.current.click()}
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-3xl font-bold text-slate-400">
                    {profile.name?.[0]?.toUpperCase() || "O"}
                  </div>
                )}
                
                {isEditing && (
                  <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex flex-col items-center justify-center transition-all duration-300">
                     <svg className="w-6 h-6 text-white mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <circle cx="12" cy="13" r="3" />
                     </svg>
                    <span className="text-[10px] text-white font-bold uppercase tracking-widest">Change</span>
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

              {/* Identity Info */}
              <div className="text-center md:text-left space-y-1">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                  {profile.name}
                </h2>
                <div className="flex flex-col md:flex-row md:items-center gap-2">
                  <span className="px-2 py-0.5 bg-blue-500/10 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-blue-500/20">
                     Officer
                  </span>
                  <span className="hidden md:block w-1 h-1 rounded-full bg-slate-300"></span>
                  <p className="text-sm font-medium text-slate-400">{profile.email}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {isEditing ? (
                <>
                  <button 
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-600 transition-all dark:hover:text-white" 
                    onClick={handleToggleEdit} 
                    disabled={loading}
                  >
                    {t("complaints.profile.cancel")}
                  </button>
                  <button 
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all" 
                    onClick={handleSave} 
                    disabled={loading}
                  >
                    {loading ? t("complaints.profile.saving") : t("complaints.profile.save")}
                  </button>
                </>
              ) : (
                <button 
                  className="px-6 py-2.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-white text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all" 
                  onClick={handleToggleEdit}
                >
                  {t("complaints.profile.edit")}
                </button>
              )}
            </div>
          </div>

          {/* 2. Essential Form Section */}
          <div className="p-8 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 ml-1">
                  {t("complaints.profile.full_name")}
                </label>
                <input
                  type="text"
                  name="name"
                  className={`w-full px-4 py-3 bg-[#f8fafc] dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200 focus:ring-1 focus:ring-blue-500 outline-none transition-all ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                  value={profile.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 ml-1">
                  {t("complaints.profile.email")}
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-[#f8fafc] dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-sm font-medium text-slate-400 transition-all outline-none opacity-60 cursor-not-allowed"
                  value={profile.email}
                  disabled
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 ml-1">
                  {t("complaints.analytics.dept_col")}
                </label>
                <select
                  name="department"
                  className={`w-full px-4 py-3 bg-[#f8fafc] dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200 focus:ring-1 focus:ring-blue-500 outline-none transition-all ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                  value={profile.department}
                  onChange={handleChange}
                  disabled={!isEditing}
                >
                  <option value="">{t("complaints.analytics.select_dept")}</option>
                  <option value="electricity">{t("complaints.categories.electricity")}</option>
                  <option value="supply">{t("complaints.categories.supply")}</option>
                  <option value="road">{t("complaints.categories.road")}</option>
                  <option value="drainage">{t("complaints.categories.drainage")}</option>
                  <option value="garbage">{t("complaints.categories.garbage")}</option>
                  <option value="pollution">{t("complaints.categories.pollution")}</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 ml-1">
                  {t("complaints.profile.mobile")}
                </label>
                <input
                  type="text"
                  name="mobile"
                  className={`w-full px-4 py-3 bg-[#f8fafc] dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-sm font-medium text-slate-700 transition-all outline-none ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
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
    </div>
  );
};

export default OfficerProfile;