import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AuthContext = createContext();

/**
 * 🔹 HELPER: Robust user data extraction
 * Handles: { user: {...} }, { data: { user: {...} } }, or direct {...}
 */
const normalizeUser = (data) => {
  if (!data) return null;
  let user = data.user || data.data?.user || data.data || data;
  if (typeof user !== 'object') return null;

  // 🔹 Standardize ID naming
  if (user._id && !user.id) user.id = user._id;
  if (user.id && !user._id) user._id = user.id;

  return user;
};


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔹 Load user on app start
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem("token");

        if (!storedToken) {
          setLoading(false);
          return;
        }

        setToken(storedToken);
        const res = await api.get("/users/me");

        // ✅ Robust Extraction
        const userData = normalizeUser(res?.data);

        if (userData) {
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
          localStorage.setItem("role", userData.role || "");
        } else {
          throw new Error("Invalid user data in response");
        }
      } catch (error) {
        console.error("Auth init failed:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // 🔹 Login
  const login = useCallback((token, rawUser) => {
    const userData = normalizeUser(rawUser);

    if (!userData) {
      console.warn("Attempted to login with invalid user data:", rawUser);
      return;
    }

    setToken(token);
    setUser(userData);

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("role", userData.role || "");
  }, []);

  // 🔹 Update user
  const updateUser = useCallback((updatedData) => {
    setUser((prevUser) => {
      if (!prevUser) return prevUser;

      const newUser = { ...prevUser, ...updatedData };
      localStorage.setItem("user", JSON.stringify(newUser));
      return newUser;
    });
  }, []);

  // 🔹 Logout
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.clear();
    navigate("/", { replace: true });
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        updateUser,
        isAuthenticated: !!token && !!user,
        role: user?.role || null,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};