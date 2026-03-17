// src/pages/Login.tsx – MONNIFY-STYLE: CLEAN FORM, GRADIENT BUTTONS, SUBTLE GLOW ANIMATIONS
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("🔥 Welcome Boss!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error("Wrong email or password");
    } finally {
      setLoading(false);
    }
  };
  const [showPassword, setShowPassword] = useState(false);


  return (
    // Replace most of the outer div with:
<div className="page-wrapper bg-gradient-to-br from-indigo-50 via-white to-emerald-50">
  <div className="center-card">
    <div className="glass-card max-w-md w-full">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent">
          SwiftPay
        </h1>
        <p className="mt-3 text-lg text-slate-600 font-medium">
          Pay Smart. Dues. Zero Stress.
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full"   // ← your global input style kicks in
          required
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-600"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={loading}
          className="w-full button"   // ← uses your global button gradient
        >
          {loading ? "Entering..." : "LOGIN NOW"}
        </motion.button>
      </form>

      <div className="mt-8 text-center text-sm text-slate-600 space-y-2">
        <p>
          NEW USER?{" "}
          <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
            CREATE A SWIFTPAY ACCOUNT →
          </Link>
        </p>
        <p>
          ASSOCIATION ADMIN?{" "}
          <Link to="/subadmin-login" className="text-indigo-600 font-semibold hover:underline">
            LOGIN AS SUBADMIN →
          </Link>
        </p>
      </div>
    </div>
  </div>
</div>
  );
};

export default Login;
