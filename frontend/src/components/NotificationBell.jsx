import React, { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { useTranslation } from "react-i18next";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import { Bell } from "lucide-react";
import "./NotificationBell.css";

const NotificationBell = () => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const dropdownRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    
    // Note: Socket.io is disabled for Vercel serverless compatibility.
    // For real-time functionality, consider using a specialized service (Pusher, Ably) 
    // or set up a polling interval here.
  }, [user?._id]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => !n.isRead).length);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/mark-as-read/${id}`, {});
      fetchNotifications();
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put("/notifications/mark-all-read", {});
      fetchNotifications();
    } catch (err) {
      console.error("Error marking all read:", err);
    }
  };

  return (
    <div className="notification-container" ref={dropdownRef}>
      <button className="bell-btn" onClick={() => setIsOpen(!isOpen)}>
        <Bell size={20} />
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="dropdown-header">
            <h3>{t("notifications.title")}</h3>
            {unreadCount > 0 && (
              <button className="mark-all-btn" onClick={markAllAsRead}>
                {t("notifications.mark_all")}
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="empty-notif">{t("notifications.empty")}</div>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n._id} 
                  className={`notif-item ${!n.isRead ? "unread" : ""}`}
                  onClick={() => !n.isRead && markAsRead(n._id)}
                >
                  <div className="notif-content">
                    <p className="notif-msg">{n.message}</p>
                    <span className="notif-date">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {!n.isRead && <span className="unread-dot" title="Unread"></span>}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
