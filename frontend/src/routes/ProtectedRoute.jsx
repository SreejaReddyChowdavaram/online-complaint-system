import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Protects a route by role.
 * usage: <ProtectedRoute role="Admin"><AdminLayout/></ProtectedRoute>
 */
export default function ProtectedRoute({ children, role }) {
  const { user, token } = useAuth();

  // not logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // role check if provided
  if (role && user.role !== role) {
    // optionally redirect non-admins to their dashboard
    if (user.role === "Officer") return <Navigate to="/officer" replace />;
    return <Navigate to="/" replace />;
  }

  // allow
  return children;
}