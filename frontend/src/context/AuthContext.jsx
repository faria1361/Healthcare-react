import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  async function loadUser() {
    try {
      const token = localStorage.getItem("healthcare_token");

      if (!token) {
        setUser(null);
        setAuthLoading(false);
        return;
      }

      const response = await api.get("/auth/me");

      if (response.data.success) {
        setUser(response.data.user);
      } else {
        localStorage.removeItem("healthcare_token");
        setUser(null);
      }
    } catch {
      localStorage.removeItem("healthcare_token");
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  }

  async function login(email, password) {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    if (response.data.success) {
      localStorage.setItem("healthcare_token", response.data.token);
      setUser(response.data.user);
    }

    return response.data;
  }

  async function signup(name, email, password, confirmPassword) {
    const response = await api.post("/auth/signup", {
      name,
      email,
      password,
      confirmPassword,
    });

    if (response.data.success) {
      localStorage.setItem("healthcare_token", response.data.token);
      setUser(response.data.user);
    }

    return response.data;
  }

  function logout() {
    localStorage.removeItem("healthcare_token");
    setUser(null);
  }

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        authLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}