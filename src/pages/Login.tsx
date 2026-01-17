// src/pages/Login.tsx – With Role Dropdown (Admin/User vs Subadmin)
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import API from "../utils/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "subadmin">("user"); // Default to normal user/admin
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let endpoint = "/users/login";
      let redirectPath = "/dashboard"; // Default for normal users + superadmins

      if (role === "subadmin") {
        endpoint = "/subadmin/login";
        redirectPath = "/subadmin-dashboard"; // Your subadmin dashboard route
      }

      const res = await API.post(endpoint, { email, password });
      const { token, user } = res.data;

      // Save token (your auth method)
      localStorage.setItem("swiftpay_token", token);

      toast.success(`🔥 Welcome ${user.name || "Boss"}!`);

      navigate(redirectPath);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Wrong email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: 'url("../assets/bg.jpg")' }}>
      <div className="absolute inset-0 bg-[#063A4F]/40 backdrop-blur-sm" />
      <div className="absolute top-20 left-20 w-96 h-96 bg-[#00B8C2]/40 rounded-full blur-3xl opacity-60 animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#FDB515]/40 rounded-full blur-3xl opacity-60 animate-pulse [animation-delay:1s]" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative z-10 w-full max-w-lg mx-4"
      >
        <div className="bg-[#F9FBFD]/10 backdrop-blur-2xl rounded-3xl border border-[#063A4F]/20 shadow-2xl p-12">
          <div className="text-center mb-12">
            <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 6, repeat: Infinity }}>
              <h1 className="text-7xl font-bold font-rubik bg-gradient-to-r from-[#00B8C2] to-[#FDB515] bg-clip-text text-transparent drop-shadow-2xl">
                SwiftPay
              </h1>
            </motion.div>
            <p className="text-[#063A4F]/70 text-xl mt-4 font-oxygen tracking-wider">Pay Smart Dues. Zero Stress.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-7">
            {/* Role Dropdown */}
            <div>
              <label className="block mb-2 font-oxygen text-[#F9FBFD]">Login As</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as "user" | "subadmin")}
                className="w-full px-6 py-5 text-lg bg-[#124458] border border-[#063A4F]/30 rounded-xl text-[#F9FBFD] focus:outline-none focus:border-[#FDB515] focus:ring-4 focus:ring-[#FDB515]/30 transition-all duration-300 font-oxygen"
              >
                <option value="user">User / Admin</option>
                <option value="subadmin">Association Subadmin</option>
              </select>
            </div>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-6 py-5 text-lg bg-[#124458] border border-[#063A4F]/30 rounded-xl text-[#F9FBFD] placeholder-[#F9FBFD]/50 focus:outline-none focus:border-[#FDB515] focus:ring-4 focus:ring-[#FDB515]/30 transition-all duration-300 font-oxygen"
            />

            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-6 py-5 text-lg bg-[#124458] border border-[#063A4F]/30 rounded-xl text-[#F9FBFD] placeholder-[#F9FBFD]/50 focus:outline-none focus:border-[#FDB515] focus:ring-4 focus:ring-[#FDB515]/30 transition-all duration-300 font-oxygen"
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="w-full py-6 rounded-xl font-bold text-2xl text-[#F9FBFD] bg-gradient-to-r from-[#F0AA22] to-[#F05822] shadow-md hover:shadow-lg transition-shadow duration-300 relative overflow-hidden group font-rubik"
            >
              <span className="relative z-10">{loading ? "Entering..." : "LOGIN NOW"}</span>
              <div className="absolute inset-0 bg-[#F9FBFD]/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </motion.button>
          </form>

          <p className="text-center mt-10 text-[#063A4F]/70 font-oxygen">
            NEW USER?{" "}
            <Link to="/register" className="font-bold text-[#00B8C2] hover:text-[#FDB515] transition">
              CREATE A SWIFTPAY ACCOUNT →
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;