import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Props {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<Props> = ({ children, adminOnly = false }) => {
  const { token, isAdmin, authReady } = useAuth();

  // ⏳ wait until auth initializes
  if (!authReady) return null;

  // 🔐 not logged in
  if (!token) return <Navigate to="/" replace />;

  // 🔐 admin-only route
  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
