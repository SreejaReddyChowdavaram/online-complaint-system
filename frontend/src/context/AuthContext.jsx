import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

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

        const res = await axios.get("/api/users/me", {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        // ✅ FIX: always extract correct user object
        const userData =
          res?.data?.user || res?.data?.data || res?.data || null;

        setUser(userData);

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("role", userData?.role || "");
      } catch (error) {
        console.error("Auth init failed:", error);
        localStorage.clear();
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // 🔹 Login
  const login = (token, user) => {
    const userData =
      user?.user || user?.data || user || null;

    setToken(token);
    setUser(userData);

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("role", userData?.role || "");
  };

  // 🔹 Update user
  const updateUser = (updatedData) => {
    setUser((prevUser) => {
      if (!prevUser) return prevUser;

      const newUser = { ...prevUser, ...updatedData };
      localStorage.setItem("user", JSON.stringify(newUser));
      return newUser;
    });
  };

  // 🔹 Logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        updateUser,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);