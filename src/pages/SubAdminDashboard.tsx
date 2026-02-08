// src/pages/SubAdminDashboard.tsx
import React, { useEffect, useState, useMemo, useCallback } from "react";
import API from "../utils/api";
import { CSVLink } from "react-csv";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Html5QrcodeScanner } from "html5-qrcode";

interface Payment {
  _id: string;
  payerName: string;
  userEmail: string;
  dueName: string;
  confirmed: boolean;
  level?: string;
  baseAmount?: number;
  paidAt: string;
  metadata?: {
    payerName?: string;
    department?: string;
    matricNumber?: string;
    phone?: string;
    level?: string;
  };
}


const SubAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("swiftpay_user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
const scannerRef = React.useRef<Html5QrcodeScanner | null>(null);
const [scanActive, setScanActive] = useState(false);

  const [totalPaidOut, setTotalPaidOut] = useState<number>(0);
const [pendingAmount, setPendingAmount] = useState<number>(0);
const [payoutHistory, setPayoutHistory] = useState<any[]>([]); // array of payout records


const fetchPayments = useCallback(async () => {
  setLoading(true);
  try {
    const res = await API.get("/subadmin/payments");
    setPayments(res.data || []);
    console.log("Payments refreshed:", res.data.length);
  } catch (err) {
    console.error("Failed to load association payments:", err);
  } finally {
    setLoading(false);
  }
}
, []);

const confirmAndRefresh = useCallback(
  async (idOrRef: string, mode: "id" | "ref") => {
    if (mode === "id") {
      setPayments(prev =>
        prev.map(p =>
          p._id === idOrRef ? { ...p, confirmed: true } : p
        )
      );
    }

    try {
  if (mode === "id") {
    await API.post(`/payments/${idOrRef}/confirm`);
  } else {
    const res = await API.post(`/payments/verify/${idOrRef}`);
    if (res.data.status === "already_confirmed") {
      toast.info("Payment was already confirmed");
    }
  }
  toast.success("Payment confirmed ✅");
  await fetchPayments();
} catch (err: any) {
  toast.error(err.response?.data?.message || "Confirmation failed");
}

  },
  [fetchPayments]
);




useEffect(() => {
  if (!scanActive) return;

  scannerRef.current = new Html5QrcodeScanner(
    "qr-reader",
    { fps: 10, qrbox: 250 },
    false
  );

  scannerRef.current.render(
    async (text) => {
      if (!scanActive) return; // lock to prevent multiple calls
      setScanActive(false); // stop further scans
      await confirmAndRefresh(text, "ref");

      scannerRef.current?.clear();
      scannerRef.current = null;
      setScanActive(false);

      // ✅ MOVE TO VERIFY PAGE
navigate(`/verify/${text}`);
    },
    () => {}
  );
  

  return () => {
    scannerRef.current?.clear();
    scannerRef.current = null;
  };
}, [scanActive, confirmAndRefresh, navigate]);


useEffect(() => {
  const fetchPayoutData = async () => {
    try {
      const res = await API.get("/payouts/my"); // your endpoint
      setTotalPaidOut(res.data.totalPaidOut || 0);
      setPendingAmount(res.data.pendingAmount || 0);
      setPayoutHistory(res.data.payouts || []);
    } catch (err) {
      console.error("Failed to fetch payout data", err);
    }
  };

  fetchPayoutData();
}, []);

  console.log("Logged in subadmin:", user);

  useEffect(() => {
    fetchPayments(); // Initial fetch

    // Auto-refresh every 3 minutes (180,000 ms)
    const interval = setInterval(() => {
      fetchPayments();
      toast.info("Dashboard refreshed automatically", { autoClose: 3000 });
    }, 180000);

    // Cleanup interval when component unmounts
    return () => clearInterval(interval);
  }, [fetchPayments]); // Empty deps → runs once on mount + interval

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


  if (loading && payments.length === 0) {
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
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-rubik font-bold bg-gradient-to-r from-[#FDB515] to-[#F05822] bg-clip-text text-transparent drop-shadow-lg"
        >
          {user?.association ? `${user.association} Dashboard` : "Association Dashboard"}
        </motion.h1>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            localStorage.removeItem("swiftpay_token");
            localStorage.removeItem("swiftpay_user");
            navigate("/");
            toast.info("Logged out successfully");
          }}
          className="px-8 py-4 bg-gradient-to-r from-[#F05822] to-[#F0AA22] rounded-xl font-bold text-[#F9FBFD] shadow-lg hover:shadow-xl transition-all"
        >
          Logout
        </motion.button>
      </div>


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
          placeholder="Search payments (name, email, matric, level, due)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-2/3 p-4 rounded-xl bg-[#063A4F]/50 border border-[#063A4F]/30 text-[#F9FBFD] placeholder-[#F9FBFD]/50 focus:outline-none focus:border-[#FDB515] transition-all"
        />

        <CSVLink
          data={filteredPayments.map(p => ({
            Name: p.metadata?.payerName || "N/A",
            Email: p.userEmail,
            Due: p.dueName,
            Level: p.metadata?.level || "-",
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
      <div className="text-center my-6">
  <button
    onClick={() => setScanActive(true)}
    className="px-6 py-3 bg-green-500 text-black font-bold rounded-lg"
  >
    📷 Scan Receipt QR
  </button>
</div>

{scanActive && (
  <div id="qr-reader" className="w-full max-w-md mx-auto my-8" />
)}


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
                <th className="p-5 font-bold text-[#FDB515]">Confirmed</th>
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
filteredPayments.map((p) => {
  const isConfirmed = p.confirmed === true;

  return (
                  <motion.tr
  key={p._id}
  initial={{ opacity: 0, y: 10 }}
  animate={
    isConfirmed
      ? { scale: [1, 1.02, 1], backgroundColor: "rgba(34,197,94,0.08)" }
      : { opacity: 1, y: 0 }
  }
  transition={{ duration: 0.6 }}
  className={`border-t border-[#063A4F]/30 transition-colors ${
    isConfirmed ? "bg-green-500/10" : "hover:bg-[#063A4F]/40"
  }`}
>

                    <td className="p-5">{p.metadata?.payerName || "N/A"}</td>
                    <td className="p-5">{p.userEmail || "N/A"}</td>
                    <td className="p-5">{p.metadata?.matricNumber || "-"}</td>
                    <td className="p-5">{p.metadata?.department || "-"}</td>
                    <td className="p-5 font-medium text-[#FDB515]">{p.dueName}</td>
                    <td className="p-5">{p.metadata?.level || "-"}</td>
                    <td className="p-5">
  {p.confirmed ? (
  <div className="flex items-center gap-2 text-green-400 font-bold">
    <span className="w-3 h-3 rounded-full bg-green-400" />
    ✔ Confirmed
  </div>
) : (
 <button
  onClick={() => confirmAndRefresh(p._id, "id")}
  disabled={p.confirmed}
  className={`px-4 py-2 font-bold rounded-lg transition
    ${
      p.confirmed
        ? "bg-gray-400 cursor-not-allowed text-gray-700"
        : "bg-yellow-400 hover:bg-yellow-500 text-black"
    }
  `}
>
  ✔ Confirm Payment
</button>

)}


</td>

                    <td className="p-5 font-bold text-[#00B8C2]">₦{(p.baseAmount || 0).toLocaleString()}</td>
                    <td className="p-5 text-[#F9FBFD]/80">
                      {new Date(p.paidAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </motion.tr>
                );
              })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
      {/* === NEW: Earnings & Payout Summary Section === */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.6 }}
  className="mt-12 bg-[#124458]/80 backdrop-blur-md p-8 rounded-3xl border border-[#063A4F]/30 shadow-2xl"
>
  <h2 className="text-4xl font-rubik font-bold mb-8 text-center bg-gradient-to-r from-[#FDB515] to-[#F05822] bg-clip-text text-transparent">
    Your Association Earnings Overview
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
    {/* Total Collected */}
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-gradient-to-br from-[#063A4F] to-[#124458] p-8 rounded-2xl border border-[#063A4F]/40 shadow-xl text-center"
    >
      <p className="text-lg text-[#F9FBFD]/70 font-oxygen mb-3">Total Base Amount Collected</p>
      <p className="text-5xl font-bold text-[#00B8C2] drop-shadow-lg">
        ₦{totalBase?.toLocaleString() || "0"}
      </p>
    </motion.div>

    {/* Total Paid Out */}
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-gradient-to-br from-[#063A4F] to-[#124458] p-8 rounded-2xl border border-[#063A4F]/40 shadow-xl text-center"
    >
      <p className="text-lg text-[#F9FBFD]/70 font-oxygen mb-3">Total Amount Paid Out</p>
      <p className="text-5xl font-bold text-[#FDB515] drop-shadow-lg">
        ₦{totalPaidOut?.toLocaleString() || "0"}
      </p>
    </motion.div>

    {/* Amount Left */}
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-gradient-to-br from-[#063A4F] to-[#124458] p-8 rounded-2xl border border-[#063A4F]/40 shadow-xl text-center"
    >
      <p className="text-lg text-[#F9FBFD]/70 font-oxygen mb-3">Amount Left to Receive</p>
      <p className="text-5xl font-bold text-[#F05822] drop-shadow-lg">
        ₦{pendingAmount?.toLocaleString() || "0"}
      </p>
    </motion.div>
  </div>

  {/* Payout History (Compulsory) */}
  {payoutHistory.length > 0 ? (
    <div className="mt-10">
      <h3 className="text-2xl font-rubik font-bold mb-6 text-[#FDB515] text-center">
        Payout History
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left font-oxygen border-collapse">
          <thead className="bg-gradient-to-r from-[#F0AA22]/30 to-[#F05822]/30">
            <tr>
              <th className="p-5 font-bold text-[#FDB515]">Amount Paid</th>
              <th className="p-5 font-bold text-[#FDB515]">Date</th>
              <th className="p-5 font-bold text-[#FDB515]">Reference</th>
              <th className="p-5 font-bold text-[#FDB515]">Status</th>
            </tr>
          </thead>
          <tbody>
            {payoutHistory.map((p, index) => (
              <motion.tr
                key={p._id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-t border-[#063A4F]/30 hover:bg-[#063A4F]/40 transition-colors"
              >
                <td className="p-5 font-bold text-[#00B8C2]">₦{p.amount.toLocaleString()}</td>
                <td className="p-5 text-[#F9FBFD]/80">
                  {new Date(p.paidAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </td>
                <td className="p-5 text-[#F9FBFD]/70 truncate max-w-xs">{p.reference || "N/A"}</td>
                <td className="p-5">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      p.status === "success"
                        ? "bg-[#00B8C2]/20 text-[#00B8C2] border border-[#00B8C2]/50"
                        : p.status === "failed"
                        ? "bg-[#F05822]/20 text-[#F05822] border border-[#F05822]/50"
                        : "bg-[#FDB515]/20 text-[#FDB515] border border-[#FDB515]/50"
                    }`}
                  >
                    {p.status.toUpperCase()}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <div className="text-center py-12 text-[#F9FBFD]/70 text-xl font-medium">
      No payouts have been made yet. You'll see history here once transfers are completed.
    </div>
  )}
</motion.div>
  </div>
  );
};

export default SubAdminDashboard;
