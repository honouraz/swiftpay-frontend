// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import API from "../utils/api";

type User = {
  _id?: string;
  name?: string;
  email?: string;
  role?: "superadmin" | "subadmin" | "user"; // optional role
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("swiftpay_token"));
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("swiftpay_user");
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (token) localStorage.setItem("swiftpay_token", token);
    else localStorage.removeItem("swiftpay_token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("swiftpay_user", JSON.stringify(user));
    else localStorage.removeItem("swiftpay_user");
  }, [user]);

  const login = async (email: string, password: string) => {
    const res = await API.post("/users/login", { email, password });
    const data = res.data;

    if (!data?.token) throw new Error(data?.message || "No token returned");

    setToken(data.token);
    setUser(data.user);
  };

  const register = async (email: string, password: string, name?: string) => {
    const res = await API.post("/users/register", { email, password, name });
    return res.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  // Detect admin by role first, fallback to email
  const ADMIN_EMAILS = [
    "olugbengaolajide069@gmail.com",
    "oluwahonouraz@gmail.com"
  ];

  const isAdmin = user?.role === "superadmin"
    ? true
    : user?.email
      ? ADMIN_EMAILS.includes(user.email.trim().toLowerCase())
      : false;

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
