// src/pages/Dashboard.tsx – UPGRADED WITH MONNIFY-INSPIRED DESIGN: CLEAN LAYOUT, SUBTLE ANIMATIONS, FINTECH COLORS
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
import Card from "../components/Card";
import PayForSomeone from "../components/PayForSomeone";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

const DashboardContent = () => {
  const { user, logout, isAdmin } = useAuth();
  const [, setPayments] = useState([]);
  const navigate = useNavigate();

 useEffect(() => {
  API.get("/payments/my").then(res => setPayments(res.data));
}, []);


  return (
    <div className="min-h-screen pt-20 pb-10 px-6 bg-cover bg-center" style={{ backgroundImage: 'url("../assets/bg.jpg")' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header – Monnify-like title with gradient text and subtle fade-in */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-6xl font-bold font-rubik bg-gradient-to-r from-[#FDB515] to-[#F05822] bg-clip-text text-transparent"
          >
            Welcome back, {user?.name?.split(" ")[0] || "Boss"}!
          </motion.h1>
          <motion.p 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-[#063A4F]/70 text-xl mt-4 font-oxygen"
          >
            SWIFTLY PAY YOUR DUES WITH SWIFTPAY 
          </motion.p>

          {/* ADMIN PANEL BUTTON – Styled like Monnify's primary button with gradient */}
          {isAdmin && (
            <motion.button
              onClick={() => navigate("/admin")}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="mt-6 px-8 py-4 bg-gradient-to-r from-[#F0AA22] to-[#F05822] text-[#F9FBFD] font-rubik font-bold rounded-md shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              ADMIN DASHBOARD
            </motion.button>
          )}
        </div>

        {/* Pay For Someone Card – Monnify card style: shadow, rounded, centered content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="mb-12 bg-[#F9FBFD]/10 backdrop-blur-md rounded-xl border border-[#063A4F]/10 shadow-xl p-8">
            <h2 className="text-4xl font-bold font-rubik text-center mb-8 bg-gradient-to-r from-[#00B8C2] to-[#FDB515] bg-clip-text text-transparent">
              Pay Dues. FLUTTERWAVE IS RECOMMENDED.
            </h2>
            <PayForSomeone />
          </Card>
        </motion.div>

        {/* Quick Actions – Grid of cards like Monnify's pricing cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "My Payments", desc: "View all your transactions" },
            { title: "Receipts", desc: "Download any receipt instantly" },
            { title: "Support", desc: "We're here 24/7" }
          ].map((action, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + idx * 0.1 }}
            >
              <Card className="bg-[#F9FBFD]/5 backdrop-blur-md rounded-xl border border-[#063A4F]/10 shadow-md p-6 text-center">
                <h3 className="text-2xl font-bold font-rubik text-[#063A4F] mb-4">{action.title}</h3>
                <p className="text-[#063A4F]/70 font-oxygen">{action.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
<motion.button
  onClick={() => navigate("/my-transactions")}
  className="mt-6 px-8 py-4 bg-gradient-to-r from-[#00B8C2] to-[#FDB515] text-[#F9FBFD] font-rubik font-bold rounded-md shadow-md hover:shadow-lg transition-shadow duration-300"
>
  My Transactions
</motion.button>

        {/* Logout Button – Positioned like Monnify's fixed elements, with hover effect */}
        <motion.button
          onClick={logout}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.7 }}
          className="fixed bottom-8 right-8 py-4 px-8 bg-gradient-to-r from-[#F05822] to-[#FDB515] text-[#F9FBFD] font-rubik font-bold rounded-full shadow-2xl hover:scale-110 transition-transform duration-300"
        >
          Logout
        </motion.button>
      </div>
    </div>
  );
};

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}