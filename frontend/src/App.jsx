import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { ComplaintProvider } from "./context/ComplaintContext";

import Navbar from "./components/Navbar";

/* 🔥 NEW HOME */
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";

/* AUTH */
import Login from "./pages/auth/Login";
import UserLogin from "./pages/auth/UserLogin";
import OfficerLogin from "./pages/auth/OfficerLogin";
import AdminLogin from "./pages/auth/AdminLogin";
import Register from "./pages/auth/Register";

/* ROUTE GUARD */
import ProtectedRoute from "./routes/ProtectedRoute";

/* USER */
import UserDashboard from "./pages/user/UserDashboard";
import ViewComplaints from "./pages/user/ViewComplaints";
import PostComplaint from "./pages/user/PostComplaint";
import MyProfile from "./pages/user/MyProfile";

/* OFFICER */
import OfficerLayout from "./pages/officer/OfficerLayout";
import AssignedComplaints from "./pages/officer/AssignedComplaints";
import OfficerProfile from "./pages/officer/OfficerProfile";

/* ADMIN */
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ViewaComplaints from "./pages/admin/ViewaComplaints";
import AdminProfile from "./pages/admin/AdminProfile";

/* ===============================
   LAYOUT COMPONENT
================================ */
const Layout = ({ children }) => {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/" ||
    location.pathname.startsWith("/login") ||
    location.pathname === "/register";

  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <>
      {!hideNavbar && <Navbar />}

      <div
        style={
          isAdmin
            ? {}
            : {
                marginTop: hideNavbar ? 0 : "70px",
                padding: "0px",
              }
        }
      >
        {children}
      </div>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <ComplaintProvider>
        <Layout>
          <Routes>

            {/* 🔥 HOME */}
            <Route path="/" element={<Home />} />
            <Route path="/landing" element={<LandingPage />} />
            {/* PUBLIC */}
            <Route path="/login" element={<Login />} />
            <Route path="/login/user" element={<UserLogin />} />
            <Route path="/login/officer" element={<OfficerLogin />} />
            <Route path="/login/admin" element={<AdminLogin />} />
            <Route path="/register" element={<Register />} />

            {/* USER */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute role="Citizen">
                  <UserDashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<ViewComplaints />} />
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
              <Route path="profile" element={<OfficerProfile />} />
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
              <Route path="complaints" element={<ViewaComplaints />} />
              <Route path="profile" element={<AdminProfile />} />
            </Route>

          </Routes>
        </Layout>
      </ComplaintProvider>
    </AuthProvider>
  );
}

export default App;