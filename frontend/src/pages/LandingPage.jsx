import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";
import "./LandingPage.css";

const LandingPage = () => {
  const { t } = useTranslation();

  if (!t) return null;
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === "Admin") navigate("/admin/dashboard");
      else if (user?.role === "Officer") navigate("/officer/dashboard");
      else navigate("/dashboard");
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 bg-[#020617] overflow-hidden">
      
      {/* Background Glows (Aurora Effect) */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      <motion.div
        className="relative z-10 w-full max-w-md bg-[#0f172a]/80 backdrop-blur-lg rounded-[2.5rem] p-8 md:p-10 border border-[#1e293b] shadow-2xl flex flex-col items-center transition-all duration-300"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >

        {/* Logo with Glow */}
        <motion.div 
          className="mb-8"
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          <img
            src={logo}
            alt="Logo"
            className="w-20 h-20 md:w-24 md:h-24 drop-shadow-[0_0_20px_rgba(59,130,246,0.3)] object-contain"
          />
        </motion.div>

        {/* Title & Subtitle */}
        <div className="text-center mb-10">
          <motion.h1 
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight mb-3 whitespace-nowrap px-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Online Complaint System
          </motion.h1>
          <motion.p 
            className="text-gray-400 text-sm md:text-base font-medium max-w-[280px] mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Select your portal to access centralized management & reporting.
          </motion.p>
        </div>

        {/* Premium Portal Buttons (Outlined Style) */}
        <div className="flex flex-col gap-4 w-full">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link to="/login/user" className="w-full flex items-center justify-center py-3.5 border border-blue-600 text-blue-500 hover:bg-blue-600 hover:text-white rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg shadow-blue-500/10 uppercase">
              {t("roles.citizen")} Portal
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link to="/login/officer" className="w-full flex items-center justify-center py-3.5 border border-green-600 text-green-500 hover:bg-green-600 hover:text-white rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg shadow-green-500/5 uppercase">
              {t("roles.officer")} Portal
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link to="/login/admin" className="w-full flex items-center justify-center py-3.5 border border-orange-600 text-orange-500 hover:bg-orange-600 hover:text-white rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg shadow-orange-500/5 uppercase">
              {t("roles.admin")} Portal
            </Link>
          </motion.div>
        </div>

        {/* Footer Link */}
        <div className="mt-10">
          <Link to="/register" className="text-gray-400 text-sm font-semibold hover:text-blue-400 transition-colors">
            {t("landing.new_user")}
          </Link>
        </div>

      </motion.div>
    </div>
  );
};

export default LandingPage;