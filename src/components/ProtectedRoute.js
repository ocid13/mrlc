import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { token } = useAuth();

  // Jika tidak ada token (pengguna belum login), redirect ke halaman login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Jika ada token (pengguna sudah login), tampilkan komponen anak
  return children;
}

export default ProtectedRoute;
