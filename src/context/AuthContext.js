import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => sessionStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      sessionStorage.setItem("token", token);
    } else {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("role");
      sessionStorage.removeItem("user");
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}login`, { email, password });

      const userData = response.data.user;
      const userRole = userData.role;

      setUser(userData);
      setToken(response.data.token);

      // Simpan ke sessionStorage
      sessionStorage.setItem("token", response.data.token);
      sessionStorage.setItem("role", userRole);
      sessionStorage.setItem("user", JSON.stringify(userData));

      return true;
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
