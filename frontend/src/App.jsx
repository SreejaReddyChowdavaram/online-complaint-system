import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { AuthProvider } from "./context/AuthContext";
import { ComplaintProvider } from "./context/ComplaintContext";

import { GoogleOAuthProvider } from "@react-oauth/google"; // ✅ IMPORTANT

import Navbar from "./components/Navbar";

/* HOME */
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";

/* AUTH */
import Login from "./pages/auth/Login";
import UserLogin from "./pages/auth/UserLogin";
import OfficerLogin from "./pages/auth/OfficerLogin";
import AdminLogin from "./pages/auth/AdminLogin";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/ForgotPassword";

/* ROUTE GUARD */
import ProtectedRoute from "./routes/ProtectedRoute";

/* USER */
import UserDashboard from "./pages/user/UserDashboard";
import CitizenViewComplaints from "./pages/user/ViewComplaints";
import PostComplaint from "./pages/user/PostComplaint";
import MyProfile from "./pages/user/MyProfile";

/* OFFICER */
import OfficerLayout from "./pages/officer/OfficerLayout";
import AssignedComplaints from "./pages/officer/AssignedComplaints";
import OfficerProfile from "./pages/officer/OfficerProfile";
import OfficerFeedback from "./pages/officer/OfficerFeedback";

/* ADMIN */
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminViewComplaints from "./pages/admin/ViewComplaints";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminFeedback from "./pages/admin/AdminFeedback";
import ManageUsers from "./pages/admin/ManageUsers";
import ComplaintDetailView from "./pages/shared/ComplaintDetailView";

import ChatBot from "./components/ChatBot";

/* ===============================
   LAYOUT COMPONENT
================================ */
const Layout = ({ children }) => {
  const { t } = useTranslation();
  const location = useLocation();

  if (!t)
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Initializing translations...
      </div>
    );

  const hideNavbar =
    location.pathname === "/" ||
    location.pathname === "/landing" ||
    location.pathname.startsWith("/login") ||
    location.pathname === "/register" ||
    location.pathname === "/forgot-password" ||
    location.pathname.startsWith("/dashboard") ||
    location.pathname.startsWith("/officer") ||
    location.pathname.startsWith("/admin");

  const hideChatBot =
    location.pathname === "/" ||
    location.pathname === "/landing" ||
    location.pathname.startsWith("/login") ||
    location.pathname === "/register" ||
    location.pathname === "/forgot-password";

  return (
    <div className="layout">
      {!hideNavbar && <Navbar />}
      {children}
      {!hideChatBot && <ChatBot />}
    </div>
  );
};

function App() {
  return (
    // ✅ THIS FIXES YOUR GOOGLE LOGIN
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <ComplaintProvider>
          <Layout>
            <Routes>
              {/* HOME */}
              <Route path="/" element={<Home />} />
              <Route path="/landing" element={<LandingPage />} />

              {/* AUTH */}
              <Route path="/login" element={<Login />} />
              <Route path="/login/user" element={<UserLogin />} />
              <Route path="/login/officer" element={<OfficerLogin />} />
              <Route path="/login/admin" element={<AdminLogin />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* USER */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute role="Citizen">
                    <UserDashboard />
                  </ProtectedRoute>
                }
              >
                <Route index element={<CitizenViewComplaints />} />
                <Route
                  path="complaint/:id"
                  element={<ComplaintDetailView />}
                />
                <Route path="post-complaint" element={<PostComplaint />} />
                <Route path="profile" element={<MyProfile />} />
              </Route>

              {/* OFFICER */}
              <Route
                path="/officer"
                element={
                  <ProtectedRoute role="Officer">
                    <OfficerLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<AssignedComplaints />} />
                <Route path="complaints" element={<AssignedComplaints />} />
                <Route
                  path="complaints/:id"
                  element={<ComplaintDetailView />}
                />
                <Route path="profile" element={<OfficerProfile />} />
                <Route path="feedback" element={<OfficerFeedback />} />
              </Route>

              {/* ADMIN */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute role="Admin">
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="complaints" element={<AdminViewComplaints />} />
                <Route
                  path="complaints/:id"
                  element={<ComplaintDetailView />}
                />
                <Route path="profile" element={<AdminProfile />} />
                <Route path="feedback" element={<AdminFeedback />} />
                <Route path="manage-users" element={<ManageUsers />} />
              </Route>
            </Routes>
          </Layout>
        </ComplaintProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;