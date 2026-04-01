import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { 
  Bell, 
  CheckCheck, 
  Info, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight,
  ExternalLink,
  MessageSquare,
  ClipboardList
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";

const NotificationDropdown = () => {
  const [notifications, setNotifications] = React.useState([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const dropdownRef = React.useRef(null);
  const socketRef = React.useRef(null);
  const { user } = useAuth();

  const unseenCount = notifications.filter(n => !n.isRead).length;

  const formatTime = (date) => {
    if (!date) return "";
    const now = new Date();
    const then = new Date(date);
    const diffInSeconds = Math.floor((now - then) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return then.toLocaleDateString();
  };

  React.useEffect(() => {
    fetchNotifications();

    // Note: Socket.io is disabled for Vercel serverless compatibility.
    // Real-time updates are handled via the 30s polling interval below.
    const interval = setInterval(fetchNotifications, 30000);
    
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      clearInterval(interval);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [user]);


  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/notifications");
      setNotifications(data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      try {
        await api.put(`/notifications/mark-as-read/${notification._id}`);
        setNotifications(prev => 
          prev.map(n => n._id === notification._id ? { ...n, isRead: true } : n)
        );
      } catch (err) {
        console.error("Error marking as read:", err);
      }
    }

    if (notification.targetId) {
      const role = user?.role?.toLowerCase();
      if (role === "citizen") {
        navigate(`/dashboard/complaint/${notification.targetId}`);
      } else if (role === "officer") {
        navigate(`/officer/complaints/${notification.targetId}`);
      } else if (role === "admin") {
        // Redirection as per specific request
        navigate(`/admin/manage-users/${notification.targetId}`);
      }
    }
    
    setIsOpen(false);
  };

  const markAllRead = async () => {
    try {
      await api.put("/notifications/mark-all-read");
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Error clearing notifications:", err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "success": return <CheckCircle2 size={16} className="text-emerald-500" />;
      case "warning": return <AlertCircle size={16} className="text-red-500" />;
      case "info": return <Info size={16} className="text-blue-500" />;
      case "complaint": return <ClipboardList size={16} className="text-blue-600" />;
      default: return <Info size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-xl transition-all duration-300 ${
          isOpen 
            ? "bg-slate-100 dark:bg-slate-800 text-red-600 shadow-inner" 
            : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-red-500"
        }`}
      >
        <Bell size={20} />
        {unseenCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full px-1.5 min-w-[18px] h-[18px] flex items-center justify-center font-bold border-2 border-white dark:border-gray-900 shadow-sm animate-in zoom-in duration-300">
            {unseenCount > 9 ? "9+" : unseenCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-80 md:w-96 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 z-50 overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                Notifications
                {unseenCount > 0 && (
                  <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {unseenCount} UNREAD
                  </span>
                )}
              </h3>
              <button 
                onClick={markAllRead}
                className="text-[10px] font-bold text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors uppercase tracking-widest"
              >
                <CheckCheck size={12} />
                Mark all read
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="py-12 text-center text-gray-400">
                  <Bell size={32} className="mx-auto mb-3 opacity-20" />
                  <p className="text-sm">No new notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50 dark:divide-slate-800/50">
                  {notifications.map((n) => (
                    <motion.div
                      key={n._id}
                      onClick={() => handleNotificationClick(n)}
                      className={`p-4 cursor-pointer transition-all ${
                        n.isRead 
                          ? "bg-white dark:bg-slate-900 text-gray-500" 
                          : "bg-blue-50 dark:bg-blue-900/10 font-medium"
                      } hover:bg-gray-100 dark:hover:bg-slate-800/50 group flex gap-3`}
                    >
                      <div className="mt-1 flex-shrink-0">
                        {getIcon(n.type)}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm leading-tight mb-1`}>
                          {n.message}
                        </p>
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <ExternalLink size={10} />
                          {formatTime(n.createdAt)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 bg-gray-50 dark:bg-slate-800/20 border-t border-gray-100 dark:border-gray-800 text-center">
               <p className="text-[9px] text-gray-400 font-medium uppercase tracking-tighter">
                 Professional System Active
               </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;
