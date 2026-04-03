import React, { useState, useEffect, useRef } from "react";
import api, { BASE_URL } from "../../services/api";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { 
  Camera,
  Check,
  X,
  User as UserIcon,
  Mail,
  Phone,
  Shield
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import WelcomeHeader from "../../components/WelcomeHeader";
import ImageWithFallback from "../../components/ImageWithFallback";

const AdminProfile = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    mobile: "",
  });
  
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        mobile: user.mobile || "",
      });
      if (user.avatar) {
        setPreviewUrl(user.avatar);
      } else {
        setPreviewUrl(null);
      }
    }
  }, [user]);

  const handleToggleEdit = () => {
    if (isEditing) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        mobile: user.mobile || "",
      });
      setAvatarFile(null);
      setPreviewUrl(user.avatar || null);
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
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const res = await api.put("/admin/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      updateUser(res.data);
      setIsEditing(false);
      setAvatarFile(null);
      alert("✅ Profile updated successfully");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-500">
      <WelcomeHeader userName={user?.name || "Admin"} role="Admin" />

      <div className="mt-8 bg-white dark:bg-slate-900 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        {/* Header Section */}
        <div className="p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-50 dark:border-slate-800/50">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div 
              className={`relative group w-24 h-24 sm:w-32 sm:h-32 rounded-[24px] overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 transition-all duration-500 ${isEditing ? 'cursor-pointer hover:ring-4 ring-blue-500/10' : ''}`}
              onClick={() => isEditing && fileInputRef.current.click()}
            >
              <ImageWithFallback 
                src={previewUrl} 
                alt="Avatar" 
                className="w-full h-full"
                fallbackText={user?.name?.[0]?.toUpperCase() || "A"}
              />
              
              {isEditing && (
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex flex-col items-center justify-center transition-all duration-300">
                  <Camera className="w-6 h-6 text-white mb-1" />
                  <span className="text-[10px] text-white font-black uppercase tracking-widest">Change</span>
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

            <div className="text-center md:text-left space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                {profile.name}
              </h2>
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <span className="px-3 py-1 bg-blue-600/10 text-blue-600 dark:bg-blue-600/20 text-[10px] font-black uppercase tracking-widest rounded-lg border border-blue-600/20">
                  {t("sidebar.admin_portal")}
                </span>
                <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                <p className="text-sm font-bold text-slate-400 dark:text-slate-500 italic">{profile.email}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <button 
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-600 transition-all dark:hover:text-white" 
                  onClick={handleToggleEdit} 
                  disabled={loading}
                >
                  {t("complaints.profile.cancel")}
                </button>
                <button 
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl shadow-xl shadow-blue-500/20 transition-all active:scale-95" 
                  onClick={handleSave} 
                  disabled={loading}
                >
                  {loading ? "..." : t("complaints.profile.save").toUpperCase()}
                </button>
              </>
            ) : (
              <button 
                className="px-8 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-white text-xs font-black rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95" 
                onClick={handleToggleEdit}
              >
                {t("complaints.profile.edit").toUpperCase()}
              </button>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 sm:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                <UserIcon size={12} /> {t("complaints.profile.full_name")}
              </label>
              <input
                type="text"
                name="name"
                className={`w-full px-5 py-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-600 outline-none transition-all ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                value={profile.name}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                <Mail size={12} /> {t("complaints.profile.email")}
              </label>
              <input
                type="email"
                className="w-full px-5 py-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 text-sm font-bold text-slate-400 dark:text-slate-500 transition-all outline-none opacity-60 cursor-not-allowed"
                value={profile.email}
                disabled
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                <Phone size={12} /> {t("complaints.profile.mobile")}
              </label>
              <input
                type="text"
                name="mobile"
                className={`w-full px-5 py-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800 text-sm font-bold text-slate-700 dark:text-slate-200 outline-none transition-all focus:ring-2 focus:ring-blue-600 ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                value={profile.mobile}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder={t("complaints.profile.mobile_placeholder")}
              />
            </div>
          </div>

          <div className="mt-12 p-6 bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 flex items-center gap-4">
            <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm">
              <Shield size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security Access</p>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">You have full Administrative privileges on this portal.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
