// src/pages/SubAdminDashboard.tsx
import React, { useEffect, useState, useMemo } from "react";
import API from "../utils/api";
import { CSVLink } from "react-csv";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {  useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface Payment {
  _id: string;
  payerName: string;
  userEmail: string;
  dueName: string;
  level?: string;
  baseAmount?: number;
  paidAt: string;
  metadata?: {
    department?: string;
    matricNumber?: string;
    phone?: string;
  };
}

const SubAdminDashboard: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
    const navigate = useNavigate();
  const storedUser = localStorage.getItem("swiftpay_user");
  const user = storedUser ? JSON.parse(storedUser) : null;
console.log("Logged in subadmin:", user);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await API.get("/subadmin/payments");
        setPayments(res.data || []);
      } catch (err) {
        console.error("Failed to load association payments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  // Filter payments by search
  const filteredPayments = useMemo(() => {
    return payments.filter(p =>
      p.payerName?.toLowerCase().includes(search.toLowerCase()) ||
      p.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
      p.metadata?.matricNumber?.toLowerCase().includes(search.toLowerCase()) ||
      p.dueName?.toLowerCase().includes(search.toLowerCase())
    );
  }, [payments, search]);

  const totalStudents = filteredPayments.length;
  const totalBase = filteredPayments.reduce((acc, p) => acc + (p.baseAmount || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#063A4F] to-[#124458] text-[#F9FBFD]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="text-6xl font-bold text-[#FDB515]"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-[#063A4F] to-[#124458] text-[#F9FBFD]">
      {/* Header - Shows Real Association Name */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl font-rubik font-bold text-center mb-10 bg-gradient-to-r from-[#FDB515] to-[#F05822] bg-clip-text text-transparent drop-shadow-lg"
      >
        {user?.association ? `${user.association} Dashboard` : "Association Dashboard"}
      </motion.h1>

<motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => {
      localStorage.removeItem("swiftpay_token");
      navigate("/");
      toast.info("Logged out successfully");
    }}
    className="px-8 py-4 bg-gradient-to-r from-[#F05822] to-[#F0AA22] rounded-xl font-bold text-[#F9FBFD] shadow-lg hover:shadow-xl transition-all"
  >
    Logout
  </motion.button>
      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {[
          { label: "Total Students Paid", value: totalStudents, color: "#00B8C2" },
          { label: "Total Amount Collected", value: `₦${totalBase.toLocaleString()}`, color: "#FDB515" },
          { label: "Your Association", value: user?.association || "Not Linked", color: "#F05822" },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            className="bg-[#124458]/80 backdrop-blur-md p-6 rounded-2xl border border-[#063A4F]/30 shadow-xl text-center hover:scale-105 transition-transform"
          >
            <p className="text-sm text-[#F9FBFD]/70 font-oxygen mb-2">{stat.label}</p>
            <p className="text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Search & Export */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <input
          type="text"
          placeholder="Search payments (name, email, matric, due)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-2/3 p-4 rounded-xl bg-[#063A4F]/50 border border-[#063A4F]/30 text-[#F9FBFD] placeholder-[#F9FBFD]/50 focus:outline-none focus:border-[#FDB515] transition-all"
        />

        <CSVLink
          data={filteredPayments.map(p => ({
            Name: p.payerName,
            Email: p.userEmail,
            Due: p.dueName,
            Level: p.level || "-",
            Matric: p.metadata?.matricNumber || "-",
            Department: p.metadata?.department || "-",
            Phone: p.metadata?.phone || "-",
            BaseAmount: p.baseAmount || 0,
            PaidAt: new Date(p.paidAt).toLocaleString(),
          }))}
          filename={`${user?.association || "association"}_payments.csv`}
          className="w-full md:w-auto"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-[#F0AA22] to-[#F05822] rounded-xl font-bold text-[#F9FBFD] shadow-lg hover:shadow-xl transition-all"
          >
            Export CSV
          </motion.button>
        </CSVLink>
      </div>

      {/* Payments Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-[#124458]/80 backdrop-blur-md rounded-2xl border border-[#063A4F]/30 shadow-2xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left font-oxygen">
            <thead className="bg-gradient-to-r from-[#F0AA22]/30 to-[#F05822]/30">
              <tr>
                <th className="p-5 font-bold text-[#FDB515]">Name</th>
                <th className="p-5 font-bold text-[#FDB515]">Email</th>
                <th className="p-5 font-bold text-[#FDB515]">Matric</th>
                <th className="p-5 font-bold text-[#FDB515]">Department</th>
                <th className="p-5 font-bold text-[#FDB515]">Due</th>
                <th className="p-5 font-bold text-[#FDB515]">Level</th>
                <th className="p-5 font-bold text-[#FDB515]">Amount</th>
                <th className="p-5 font-bold text-[#FDB515]">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-[#F9FBFD]/70 text-xl font-medium">
                    No payments found yet for <span className="text-[#FDB515] font-bold">{user?.association || "your association"}</span>.<br />
                    <span className="text-sm mt-2 block">Make a test payment with this due to see it here.</span>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <motion.tr
                    key={p._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="border-t border-[#063A4F]/30 hover:bg-[#063A4F]/40 transition-colors"
                  >
                    <td className="p-5">{p.payerName || "N/A"}</td>
                    <td className="p-5">{p.userEmail || "N/A"}</td>
                    <td className="p-5">{p.metadata?.matricNumber || "-"}</td>
                    <td className="p-5">{p.metadata?.department || "-"}</td>
                    <td className="p-5 font-medium text-[#FDB515]">{p.dueName}</td>
                    <td className="p-5">{p.level || "-"}</td>
                    <td className="p-5 font-bold text-[#00B8C2]">₦{(p.baseAmount || 0).toLocaleString()}</td>
                    <td className="p-5 text-[#F9FBFD]/80">
                      {new Date(p.paidAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default SubAdminDashboard;