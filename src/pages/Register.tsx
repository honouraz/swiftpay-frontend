// src/pages/Register.tsx – MONNIFY-INSPIRED: ELEGANT FORM, GRADIENT ACCENTS, SMOOTH TRANSITIONS
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(email, password, name);
      toast.success("Account created! Welcome To SwiftPay! 🔥");
      navigate("/");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: 'url("../assets/bg.jpg")' }}>
      {/* Monnify overlay for depth */}
      <div className="absolute inset-0 bg-[#063A4F]/40 backdrop-blur-sm" />

      {/* Glowing orbs */}
      <div className="absolute top-10 right-10 w-80 h-80 bg-[#00B8C2]/50 rounded-full blur-3xl opacity-60 animate-pulse" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#FDB515]/50 rounded-full blur-3xl opacity-60 animate-pulse [animation-delay:1s]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-lg mx-4"
      >
        <div className="bg-[#F9FBFD]/10 backdrop-blur-2xl rounded-3xl border border-[#063A4F]/20 shadow-2xl p-12">
          {/* Title – Gradient like Monnify */}
          <div className="text-center mb-12">
            <motion.h1 
              className="text-7xl font-bold font-rubik bg-gradient-to-r from-[#00B8C2] to-[#FDB515] bg-clip-text text-transparent drop-shadow-2xl"
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              SwiftPay
            </motion.h1>
            <p className="text-[#063A4F]/70 text-xl mt-4 font-oxygen">Come Join The SwiftPay Community And Get Your Dues Paid.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-7">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="w-full px-6 py-5 text-lg bg-[#124458] border border-[#063A4F]/30 rounded-xl text-[#F9FBFD] placeholder-[#F9FBFD]/50 focus:outline-none focus:border-[#FDB515] focus:ring-4 focus:ring-[#FDB515]/30 transition-all font-oxygen"
            />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-6 py-5 text-lg bg-[#124458] border border-[#063A4F]/30 rounded-xl text-[#F9FBFD] placeholder-[#F9FBFD]/50 focus:outline-none focus:border-[#FDB515] focus:ring-4 focus:ring-[#FDB515]/30 transition-all font-oxygen"
            />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create Password"
              className="w-full px-6 py-5 text-lg bg-[#124458] border border-[#063A4F]/30 rounded-xl text-[#F9FBFD] placeholder-[#F9FBFD]/50 focus:outline-none focus:border-[#FDB515] focus:ring-4 focus:ring-[#FDB515]/30 transition-all font-oxygen"
            />

            {/* KILLER BUTTON – Monnify gradient with hover shadow */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="w-full py-6 rounded-xl font-bold text-2xl text-[#F9FBFD] bg-gradient-to-r from-[#F0AA22] to-[#F05822] shadow-md hover:shadow-lg transition-shadow duration-300 font-rubik"
            >
              {loading ? "Creating..." : "JOIN SWIFTPAY"}
            </motion.button>
          </form>

          <p className="text-center mt-10 text-[#063A4F]/70 font-oxygen">
            Already a User?{" "}
            <Link to="/" className="font-bold text-[#00B8C2] hover:text-[#FDB515] transition">
              Login →
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;