// src/pages/AdminDashboard.tsx
import React, { useEffect, useState, useMemo, useCallback } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../context/AuthContext";
import API from "../utils/api";
import { CSVLink } from "react-csv";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

interface Payment {
  matricNumber: string;
  _id: string;
  payerName: string;
  userEmail: string;
  amount: number;
  dueName: string;
  status: string;
  level?: string;
  paidAt: string;
  baseAmount?: number;
  platformCommission?: number;
  extraCharge?: number;
  dueType?: string;
  metadata?: {
    payerName?: string;
    level?: string;
    phone?: string;
    matricNumber?: string;
    department?: string;
    [key: string]: any;
  };
}

interface Due {
  bankName: string;
  accountNumber: string;
  accountName: string;
  _id?: string;
  name: string;
  description: string;
  prices: { '100': number; '200': number; '300': number; '400': number; '500': number; };
  extraCharge?: number;
  platformFeePercent?: number;
    flutterwaveSubaccountId?: string;

  
}

interface SubAdmin {
  _id: string;
  name: string;
  email: string;
  role?: string;
  association?: string;
  createdAt: string;
  createdBy?: string;
}

interface Bank {
  name: string;
  code: string;
}

const initialDue: Due = {
  name: "",
  description: "",
  prices: { '100': 0, '200': 0, '300': 0, '400': 0, '500': 0 },
  extraCharge: 0,
  platformFeePercent: 7,
  flutterwaveSubaccountId: "",
  bankName: "",
  accountNumber: "",
  accountName: ""
};
const AdminDashboard: React.FC = () => {
  const { token, isAdmin } = useAuth(); // <-- single, correct destructure

  const [activeTab, setActiveTab] = useState<"payments" | "dues" | "subadmins" | "payouts">("payments");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [dues, setDues] = useState<Due[]>([]);
  const [subAdmins, setSubAdmins] = useState<SubAdmin[]>([]);
  const [loading, setLoading] = useState(true);

  const [paymentSearch, setPaymentSearch] = useState("");
  const [dueSearch, setDueSearch] = useState("");
  const [subAdminSearch, setSubAdminSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingDue, setEditingDue] = useState<Due | null>(null);
const [formData, setFormData] = useState<Due>(initialDue);

const [banks, setBanks] = useState<Bank[]>([]);
useEffect(() => {
  API.get("/payments/flutterwave/banks")
  .then(res => setBanks(res.data || [])).catch(console.error);
}, []);

const [payouts, setPayouts] = useState<any[]>([]);
const [totalBase, setTotalBase] = useState<Record<string, number>>({});
const [totalPaid, setTotalPaid] = useState<Record<string, number>>({});
const [pendingAmounts, setPendingAmounts] = useState<Record<string, number>>({});

const [selectedDueId, setSelectedDueId] = useState("");
const [payAmount, setPayAmount] = useState<number>(0);
const [loadingPayout, setLoadingPayout] = useState(false);

useEffect(() => {
  API.get("/payments/payouts/all").then(res => {
    setPayouts(res.data);
    const baseMap: Record<string, number> = {};
    const paidMap: Record<string, number> = {};
    const pendingMap: Record<string, number> = {};
    res.data.forEach((p: any) => {
      baseMap[p.dueId] = p.totalCollectedBase;
      paidMap[p.dueId] = p.totalPaidOut;
      pendingMap[p.dueId] = p.pendingAmount;
    });
    setTotalBase(baseMap);
    setTotalPaid(paidMap);
    setPendingAmounts(pendingMap);
  });
}, []);

  const [showSubAdminModal, setShowSubAdminModal] = useState(false);
  const [subAdminForm, setSubAdminForm] = useState({ name: "", email: "", password: "", association: "" });
  const [matricSearch, setMatricSearch] = useState("");

  const loadDashboard = async () => {
    try {
      const tx = await API.get("/payments/all");
      setPayments(tx.data);
    } catch (e) {
      console.error("Tx error", e);
    }

    try {
      const duesRes = await API.get("/dues/admin");
      setDues(duesRes.data);
    } catch (e) {
      console.error("Dues error", e);
    }

    try {
      const subRes = await API.get("/subadmin");
      setSubAdmins(subRes.data);
    } catch (e) {
      console.error("Subadmin error", e);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

const fetchData = useCallback(async () => {
  if (!token) {
    alert("Login as superadmin first!");
    return;
  }
  setLoading(true);
  try {
    const [payRes, dueRes, subRes] = await Promise.all([
      API.get("/payments/all"),
      API.get("/dues/admin"),
      API.get("/subadmin"),
    ]);
    setPayments(payRes.data || []);
    setDues(dueRes.data || []);
    setSubAdmins(subRes.data || []);
    console.log("Loaded: Payments", payRes.data.length, "Dues", dueRes.data.length);
  } catch (err: any) {
    console.error(err);
    alert(err.response?.data?.message || "Backend no respond");
  } finally {
    setLoading(false);
  }
}, [token]);  // ← Only depend on token (stable)

  useEffect(() => {
  if (!isAdmin || !token) {
    console.log("Not admin or no token");
    return;
  }
  fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [isAdmin, token, fetchData]);

  // ===== FILTERS =====
  const filteredPayments = useMemo(() => payments.filter(p => 
  p.status === "success" && (
    p.payerName?.toLowerCase().includes(paymentSearch.toLowerCase()) ||
    p.userEmail?.toLowerCase().includes(paymentSearch.toLowerCase()) ||
    p.metadata?.matricNumber?.toLowerCase().includes(paymentSearch.toLowerCase()) ||
    p.dueName?.toLowerCase().includes(paymentSearch.toLowerCase())
  )
), [payments, paymentSearch]);

  const filteredDues = useMemo(() => dues.filter(d => d.name.toLowerCase().includes(dueSearch.toLowerCase())), [dues, dueSearch]);
  const filteredSubAdmins = useMemo(() => subAdmins.filter(sa =>
    sa.name.toLowerCase().includes(subAdminSearch.toLowerCase()) ||
    sa.email.toLowerCase().includes(subAdminSearch.toLowerCase())
  ), [subAdmins, subAdminSearch]);


  const totalAmount = useMemo(() => filteredPayments.reduce((acc, p) => acc + (p.amount || 0), 0), [filteredPayments]);
 
const safe = (n?: any) => {
  const num = Number(n);
  return Number.isFinite(num) ? Number(num.toFixed(2)) : 0;
};

  const totalCommission = useMemo(
  () => filteredPayments.reduce(
    (acc, p) => acc + safe(p.metadata?.platformCommission),
    0
  ),
  [filteredPayments]
);

const totalExtraCharges = useMemo(
  () => filteredPayments.reduce(
    (acc, p) => acc + safe(p.metadata?.extraCharge),
    0
  ),
  [filteredPayments]
);


  const totalPending = useMemo(() => filteredPayments.filter(p => p.status === "pending").length, [filteredPayments]);
  const totalSuccess = useMemo(() => filteredPayments.filter(p => p.status === "success").length, [filteredPayments]);
  const totalFailed = useMemo(() => filteredPayments.filter(p => p.status === "failed").length, [filteredPayments]);

  // ===== HANDLERS =====
 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;

  setFormData(prev => ({
    ...prev,
    [name]: name === "extraCharge" || name === "platformFeePercent"
      ? parseFloat(value) || 0
      : value, // flutterwaveSubaccountId na string — no parseFloat
  }));

  // Your extra logic (still works)
  if (name === "extraCharge" && parseFloat(value) > 0) {
    setFormData(prev => ({ ...prev, platformFeePercent: 0 }));
  } else if (name === "platformFeePercent" && parseFloat(value) > 0) {
    setFormData(prev => ({ ...prev, extraCharge: 0 }));
  }
};

  
  const handlePriceChange = (level: keyof Due["prices"], value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData(prev => ({ ...prev, prices: { ...prev.prices, [level]: numValue } }));
  };

const handleEdit = (due: Due) => {
  setEditingDue(due);
  setFormData({
    ...due, // Spread everything from due
    prices: { ...due.prices }, // Deep copy prices
    flutterwaveSubaccountId: due.flutterwaveSubaccountId || "", // Explicitly copy the new field
  });
  setShowModal(true);
};
  const handleDelete = async (id: string) => { if (!window.confirm("Are you sure?")) return; try { await API.delete(`/dues/${id}`); fetchData(); } catch (err) { console.error(err); } };

const handleSubAdminInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  setSubAdminForm(prev => ({ ...prev, [name]: value }));
};  const handleCreateSubAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
const res = await API.post("/subadmin/create", subAdminForm);      setSubAdmins(prev => [...prev, res.data]);
      setShowSubAdminModal(false);
      setSubAdminForm({ name: "", email: "", password: "", association: "" });
    } catch (err) { console.error(err); alert("Failed to create subadmin"); }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
   if (editingDue?._id) {
  await API.put(`/dues/${editingDue._id}`, formData);
} else {
  await API.post("/dues", formData);
}
    await fetchData();
    setShowModal(false);
    setEditingDue(null);
    setFormData(initialDue);
  } catch (err) {
    console.error(err);
    alert("Failed to save due");
  }
};

const handleInitiatePayout = async (dueId: string) => {
  if (payAmount <= 0 || payAmount > (pendingAmounts[dueId] || 0)) {
    toast.error("Invalid amount");
    return;
  }

  setLoadingPayout(true);
  try {
    await API.post(`/payments/payouts/initiate/${dueId}`, { amount: payAmount });
    toast.success(`₦${payAmount.toLocaleString()} payout initiated successfully!`);
    setPayAmount(0);
    fetchData(); // Refresh all data
  } catch (err) {
    toast.error("Payout failed – check console");
    console.error(err);
  } finally {
    setLoadingPayout(false);
  }
};

  const handleDownloadReceipt = async (matric: string) => {
    if (!matric) return alert("Enter a matric number");
    try {
      const res = await API.get(`/payments/receipt/${matric}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt_${matric}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) { console.error(err); alert("Receipt not found"); }
  };
    if (!isAdmin) return <div className="min-h-screen flex items-center justify-center text-[#F9FBFD]">Access Denied</div>;
  if (loading) return <div className="min-h-screen flex items-center justify-center text-[#F9FBFD]">Loading...</div>;

  const sortedDues = [...dues].sort((a, b) => {
  const sumA = payments
    .filter(p => p.status === "success" && (p.dueName?.toLowerCase() === a.name.toLowerCase() || p.metadata?.dueName?.toLowerCase() === a.name.toLowerCase()))
    .reduce((acc, p) => acc + (p.baseAmount || p.amount || 0), 0);
  const sumB = payments
    .filter(p => p.status === "success" && (p.dueName?.toLowerCase() === b.name.toLowerCase() || p.metadata?.dueName?.toLowerCase() === b.name.toLowerCase()))
    .reduce((acc, p) => acc + (p.baseAmount || p.amount || 0), 0);
  return sumB - sumA;
});

  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen p-8 text-[#F9FBFD]">
        {/* HEADER */}
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-rubik font-bold text-center mb-6 bg-gradient-to-r from-[#FDB515] to-[#F05822] bg-clip-text text-transparent">
          ADMIN CONTROL CENTER
        </motion.h1>

{/* ================== SIDE-BY-SIDE LAYOUT: LEFT (MAIN STATS + STATUS) + RIGHT (COMPACT PER ASSOCIATION) ================== */}
<div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
  {/* LEFT: Main Stats + Status (your original layout, now takes most space) */}
  <div className="lg:col-span-3 space-y-8">
    {/* Main Stats - Your 4 cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { label: "Total Payments", value: filteredPayments.length, color: "#00B8C2" },
        { label: "Total Amount Collected", value: `₦${totalAmount.toLocaleString()}`, color: "#FDB515" },
        { label: "Total Platform Fee", value: `₦${totalCommission.toLocaleString()}`, color: "#F05822" },
        { label: "Total Extra Charges", value: `₦${totalExtraCharges.toLocaleString()}`, color: "#00B8C2" },
      ].map((stat, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-[#124458] p-6 rounded-xl text-center shadow-md"
        >
          <p className="text-sm text-[#F9FBFD]/70 font-oxygen">{stat.label}</p>
          <p className="text-2xl font-rubik font-bold" style={{ color: stat.color }}>
            {stat.value}
          </p>
        </motion.div>
      ))}
    </div>

    {/* Status - Pending/Completed/Failed */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {[
        { label: "Pending", value: totalPending, color: "#FDB515" },
        { label: "Completed", value: totalSuccess, color: "#00B8C2" },
        { label: "Failed", value: totalFailed, color: "#F05822" },
      ].map((stat, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-[#124458] p-6 rounded-xl text-center shadow-md"
        >
          <p className="text-sm text-[#F9FBFD]/70 font-oxygen">{stat.label}</p>
          <p className="text-2xl font-rubik font-bold" style={{ color: stat.color }}>
            {stat.value}
          </p>
        </motion.div>
      ))}
    </div>
  </div>

  {/* RIGHT: Compact Vertical List - Slim, tight, extreme right */}
  <div className="bg-[#124458]/90 backdrop-blur-md p-5 rounded-2xl border border-[#063A4F]/40 shadow-xl h-fit">
    <h3 className="text-lg font-rubik font-bold text-center mb-4 text-[#FDB515]">
      Per Dues Totals
    </h3>

    <div className="space-y-2 max-h-[320px] overflow-y-auto text-sm pr-1">
      {dues.length === 0 ? (
        <p className="text-center text-[#F9FBFD]/60 text-xs">
          No dues yet
        </p>
      ) : (
        sortedDues.map((due) => {
          const total = payments
            .filter(p => p.status === "success" && 
              (p.dueName?.toLowerCase() === due.name.toLowerCase() || 
               p.metadata?.dueName?.toLowerCase() === due.name.toLowerCase()))
            .reduce((acc, p) => acc + (p.baseAmount || p.amount || 0), 0);

          return (
            <div 
              key={due._id || due.name}
              className="flex justify-between items-center bg-[#063A4F]/40 p-2.5 rounded-lg hover:bg-[#063A4F]/60 transition-colors"
            >
              <span className="text-[#F9FBFD] truncate max-w-[60%] text-xs">
                {due.name}
              </span>
              <span className="text-[#00B8C2] font-bold text-xs">
                ₦{total.toLocaleString()}
              </span>
            </div>
          );
        })
      )}
    </div>
  </div>
</div>

        {/* TABS */}
        <div className="flex justify-center gap-8 mb-10">
          <button onClick={() => setActiveTab("payments")} className={`px-8 py-4 rounded-xl font-rubik font-bold text-xl transition-all ${activeTab === "payments" ? "bg-gradient-to-r from-[#F0AA22] to-[#F05822] shadow-lg shadow-[#FDB515]/50 text-[#F9FBFD]" : "bg-[#124458] hover:bg-[#063A4F] text-[#F9FBFD]/80"}`}>Payments ({filteredPayments.length})</button>
          <button onClick={() => setActiveTab("dues")} className={`px-8 py-4 rounded-xl font-rubik font-bold text-xl transition-all ${activeTab === "dues" ? "bg-gradient-to-r from-[#F0AA22] to-[#F05822] shadow-lg shadow-[#FDB515]/50 text-[#F9FBFD]" : "bg-[#124458] hover:bg-[#063A4F] text-[#F9FBFD]/80"}`}>Manage Dues ({filteredDues.length})</button>
          <button onClick={() => setActiveTab("subadmins")} className={`px-8 py-4 rounded-xl font-rubik font-bold text-xl transition-all ${activeTab === "subadmins" ? "bg-gradient-to-r from-[#F0AA22] to-[#F05822] shadow-lg shadow-[#FDB515]/50 text-[#F9FBFD]" : "bg-[#124458] hover:bg-[#063A4F] text-[#F9FBFD]/80"}`}>SubAdmins ({filteredSubAdmins.length})</button>
        <button onClick={() => setActiveTab("payouts")} className={`px-8 py-4 rounded-xl font-rubik font-bold text-xl transition-all ${activeTab === "payouts" ? "bg-gradient-to-r from-[#F0AA22] to-[#F05822] shadow-lg shadow-[#FDB515]/50 text-[#F9FBFD]" : "bg-[#124458] hover:bg-[#063A4F] text-[#F9FBFD]/80"}`}>Payouts</button>
        </div>

        {/* MATRIC SEARCH & DOWNLOAD */}
        <div className="mb-6 flex gap-4 items-center">
          <input
            type="text"
            placeholder="Enter matric number..."
            value={matricSearch}
            onChange={(e) => setMatricSearch(e.target.value)}
            className="p-3 rounded-lg bg-[#063A4F] text-[#F9FBFD] w-1/3 font-oxygen border border-[#063A4F]/30 focus:border-[#FDB515]"
          />
          <button
            onClick={() => handleDownloadReceipt(matricSearch)}
            className="px-6 py-3 bg-gradient-to-r from-[#F0AA22] to-[#F05822] rounded-xl font-rubik font-bold text-[#F9FBFD]"
          >
            Download Receipt
          </button>
        </div>

        {/* ================== PAYMENTS TAB ================== */}
        {activeTab === "payments" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto bg-[#124458] rounded-3xl p-8 border border-[#063A4F]/20 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <input type="text" placeholder="Search payments..." value={paymentSearch} onChange={(e) => setPaymentSearch(e.target.value)}
                className="p-3 rounded-lg bg-[#063A4F] text-[#F9FBFD] w-1/3 font-oxygen border border-[#063A4F]/30 focus:border-[#FDB515]" />
              <CSVLink data={filteredPayments.map(p => ({
                Name: p.metadata?.payerName || p.payerName || "Anonymous",
                Phone: p.metadata?.phone || "-",
                Email: p.userEmail || "-",
                MatricNumber: p.metadata?.matricNumber || "-",
                Department: p.metadata?.department || "-",
                Due: p.dueName,
                Level: p.metadata?.level || p.level || "-",
                BaseAmount: p.baseAmount || 0,
                PlatformFee: p.platformCommission || 0,
                ExtraCharge: p.extraCharge || 0,
                TotalPaid: p.amount || 0,
                Status: p.status,
                PaidAt: p.paidAt,
              }))} filename="swiftpay_payments.csv">
                <button className="px-6 py-3 bg-gradient-to-r from-[#F0AA22] to-[#F05822] hover:from-[#F05822] to-[#FDB515] rounded-xl font-rubik font-bold text-[#F9FBFD]">Export CSV</button>
              </CSVLink>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full font-oxygen">
                <thead className="bg-[#063A4F]/50">
                  <tr>
                    <th className="text-left p-4 text-[#F9FBFD]">Name</th>
                    <th className="text-left p-4 text-[#F9FBFD]">Matric Number</th>
                    <th className="text-left p-4 text-[#F9FBFD]">Email</th>
                    <th className="text-left p-4 text-[#F9FBFD]">Due</th>
                    <th className="text-left p-4 text-[#F9FBFD]">Level</th>
                    <th className="text-left p-4 text-[#F9FBFD]">Base Amount</th>
                    <th className="text-left p-4 text-[#F9FBFD]">Platform Fee</th>
                    <th className="text-left p-4 text-[#F9FBFD]">Extra Charge</th>
                    <th className="text-left p-4 text-[#F9FBFD]">Total Paid</th>
                    <th className="text-left p-4 text-[#F9FBFD]">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map(p => (
                    <tr key={p._id} className="border-t border-[#063A4F]/20">
                      <td className="p-4">{p.metadata?.payerName || "Anonymous"}</td>
                      <td className="p-4">{p.metadata?.matricNumber || "-"}</td>
                      <td className="p-4">{p.userEmail}</td>
                      <td className="p-4">{p.metadata?.dueName}</td>
                      <td className="p-4">{p.metadata?.level || "-"}</td>
                      <td className="p-4 font-bold text-[#F9FBFD]/70">₦{p.metadata?.baseAmount?.toLocaleString()}</td>
                      <td className="p-4 font-bold text-[#FDB515]">₦{p.metadata?.platformCommission?.toLocaleString()}</td>
                      <td className="p-4 font-bold text-[#F05822]">₦{p.metadata?.extraCharge?.toLocaleString()}</td>
                      <td className="p-4 font-bold text-[#00B8C2]">₦{p.amount.toLocaleString()}</td>
                      <td className="p-4">{new Date(p.paidAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {filteredPayments.length === 0 && <tr><td colSpan={9} className="text-center p-4 text-[#F9FBFD]/70">No payments found.</td></tr>}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
                {/* ================== DUES TAB ================== */}
        {activeTab === "dues" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-end mb-4">
              <input type="text" placeholder="Search dues..." value={dueSearch} onChange={(e) => setDueSearch(e.target.value)}
                className="p-3 rounded-lg bg-[#063A4F] text-[#F9FBFD] w-1/2 font-oxygen border border-[#063A4F]/30 focus:border-[#FDB515]" />
            </div>

            {filteredDues.map(due => (
              <div key={due._id} className="bg-[#124458] rounded-2xl p-8 border border-[#063A4F]/20 shadow-md relative">
                <h3 className="text-2xl font-rubik font-bold mb-4 text-[#F9FBFD]">{due.name}</h3>
                <p className="text-[#F9FBFD]/70 mb-6 font-oxygen">{due.description}</p>
                <div className="grid grid-cols-5 gap-4 mb-6">
                  {(['100', '200', '300', '400', '500'] as const).map(lvl => (
                    <div key={lvl} className="bg-[#063A4F] rounded-lg p-4 text-center font-oxygen">
                      <p className="text-[#FDB515] font-bold">{lvl}</p>
                      <p className="text-[#F9FBFD]/70">₦{due.prices[lvl].toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4">
                  <button onClick={() => handleEdit(due)} className="px-6 py-3 bg-[#00B8C2] rounded-xl font-rubik font-bold text-[#F9FBFD]">Edit</button>
                  <button onClick={() => handleDelete(due._id!)} className="px-6 py-3 bg-[#F05822] rounded-xl font-rubik font-bold text-[#F9FBFD]">Delete</button>
                </div>
              </div>
            ))}

            <button onClick={() => { setShowModal(true); setEditingDue(null); setFormData(initialDue); }}
              className="px-6 py-3 bg-gradient-to-r from-[#F0AA22] to-[#F05822] rounded-xl font-rubik font-bold text-[#F9FBFD]">Add New Due</button>

            {/* DUE MODAL */}
            {showModal && (
              <div className="fixed inset-0 bg-[#063A4F]/50 flex items-center justify-center z-50">
                <div className="bg-[#124458] p-8 rounded-2xl w-1/2 shadow-xl relative">
                  <h2 className="text-3xl font-rubik font-bold mb-6">{editingDue?._id ? "Edit Due" : "Add New Due"}</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block mb-1 font-oxygen">Name</label>
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full p-3 rounded-lg bg-[#063A4F] text-[#F9FBFD]" required />
                    </div>
                    <div>
  <label className="block mb-1 font-oxygen">Flutterwave Subaccount ID (for split)</label>
  <input
    type="text"
    name="flutterwaveSubaccountId"
    value={formData.flutterwaveSubaccountId ?? ""}
    onChange={handleInputChange}
    className="w-full p-3 rounded-lg bg-[#063A4F] text-[#F9FBFD] border border-[#063A4F]/30 focus:border-[#FDB515]"
    placeholder="RS_39BF2FAE47D4C83EE7A123617CDD8351"
  />
  <p className="text-xs text-[#F9FBFD]/70 mt-1">
    Paste from Flutterwave dashboard (optional)
  </p>
</div>
<div className="grid grid-cols-2 gap-4">
  <div>
    <label className="block mb-1">Bank Name</label>
    <select
      name="bankName"
      value={formData.bankName || ""}
      onChange={(e) => {
        setFormData(prev => ({ ...prev, bankName: e.target.value }));
        // Optional: auto set bankCode if you want to store it later
      }}
      className="w-full p-3 rounded-lg bg-[#063A4F] text-[#F9FBFD]"
    >
      <option value="">Select Bank</option>
      {banks.map(bank => (
        <><option key={bank.code} value={bank.name}>
          {bank.name}
        </option><select>
            value={bank.code}
          </select></>

      ))}
    </select>
  </div>

  <div>
    <label className="block mb-1">Account Number</label>
    <input
      type="text"
      name="accountNumber"
      value={formData.accountNumber || ""}
      onChange={handleInputChange}
      className="w-full p-3 rounded-lg bg-[#063A4F] text-[#F9FBFD]"
      maxLength={10}
    />
  </div>
</div>

<div>
  <label className="block mb-1">Account Name (Auto-verified)</label>
  <input
    type="text"
    value={formData.accountName || ""}
    readOnly
    className="w-full p-3 rounded-lg bg-[#063A4F]/50 text-[#F9FBFD]"
    placeholder="Will auto-fill after verification"
  />
  <button
    type="button"
    onClick={async () => {
      if (!formData.accountNumber || !formData.bankName) return alert("Enter account number and select bank");
      try {
        const bank = banks.find(b => b.name === formData.bankName);
        if (!bank) return alert("Invalid bank selected");

        const res = await API.post("/flutterwave/verify-account", {
          accountNumber: formData.accountNumber,
          bankCode: bank.code
        });
        setFormData(prev => ({ ...prev, accountName: res.data.accountName }));
      } catch (err) {
        alert("Could not verify name");
      }
    }}
    className="mt-2 px-4 py-2 bg-[#00B8C2] rounded-lg text-sm"
  >
    Verify Account Name
  </button>
</div>
                    <div>
                      <label className="block mb-1 font-oxygen">Description</label>
                      <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full p-3 rounded-lg bg-[#063A4F] text-[#F9FBFD]" required />
                    </div>
                    <div className="grid grid-cols-5 gap-4">
                      {(['100', '200', '300', '400', '500'] as const).map(lvl => (
                        <div key={lvl}>
                          <label className="block mb-1 font-oxygen">{lvl}</label>
                          <input type="number" value={formData.prices[lvl]} onChange={(e) => handlePriceChange(lvl, e.target.value)} className="w-full p-2 rounded-lg bg-[#063A4F] text-[#F9FBFD]" />
                        </div>
                      ))}
                    </div>
                    <div>
<label className="block mb-1 font-oxygen">
  Extra Charge (set {">"}0 to override percent fee)
</label>                      <input type="number" name="extraCharge" value={formData.extraCharge} onChange={handleInputChange} className="w-full p-3 rounded-lg bg-[#063A4F] text-[#F9FBFD]" />
                    </div>
                    <div>
                      <label className="block mb-1 font-oxygen">Platform Fee Percent (default 7%, auto 0 if extra charge set)</label>
                      <input type="number" name="platformFeePercent" value={formData.platformFeePercent} onChange={handleInputChange} className="w-full p-3 rounded-lg bg-[#063A4F] text-[#F9FBFD]" />
                    </div>
                    <div className="flex gap-4 mt-4">
                      <button type="submit" className="px-6 py-3 bg-[#00B8C2] rounded-xl font-rubik font-bold text-[#F9FBFD]">Save</button>
                      <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 bg-[#F05822] rounded-xl font-rubik font-bold text-[#F9FBFD]">Cancel</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </motion.div>
        )}
        {/* ================== PAYOUTS TABS ================== */}
{activeTab === "payouts" && (
  <motion.div 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    className="max-w-6xl mx-auto bg-[#124458] rounded-3xl p-8 border border-[#063A4F]/20 shadow-xl"
  >
    <h2 className="text-4xl font-rubik font-bold mb-8 text-center bg-gradient-to-r from-[#FDB515] to-[#F05822] bg-clip-text text-transparent">
      Manual Payouts to Associations
    </h2>

    {/* Dropdown to Select Due */}
    <div className="mb-8">
      <label className="block mb-2 text-lg font-medium text-[#F9FBFD]">Select Association/Due to Pay</label>
      <select
        value={selectedDueId}
        onChange={(e) => {
          setSelectedDueId(e.target.value);
          setPayAmount(0); // Reset amount when changing due
        }}
        className="w-full md:w-1/2 p-4 rounded-xl bg-[#063A4F] text-[#F9FBFD] border border-[#063A4F]/30 focus:border-[#FDB515] outline-none"
      >
        <option value="">-- Choose Due --</option>
        {dues.map(d => (
          <option key={d._id} value={d._id}>
            {d.name} - Pending: ₦{(pendingAmounts[d._id!] || 0).toLocaleString()}
          </option>
        ))}
      </select>
    </div>

    {/* Show details & Pay button only when due is selected */}
    {selectedDueId && (
      <div className="bg-[#063A4F]/50 p-8 rounded-2xl border border-[#063A4F]/40">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center bg-[#124458]/80 p-6 rounded-xl">
            <p className="text-[#F9FBFD]/70 mb-2">Total Base Collected</p>
            <p className="text-3xl font-bold text-[#00B8C2]">₦{(totalBase[selectedDueId] || 0).toLocaleString()}</p>
          </div>
          <div className="text-center bg-[#124458]/80 p-6 rounded-xl">
            <p className="text-[#F9FBFD]/70 mb-2">Total Paid Out</p>
            <p className="text-3xl font-bold text-[#FDB515]">₦{(totalPaid[selectedDueId] || 0).toLocaleString()}</p>
          </div>
          <div className="text-center bg-[#124458]/80 p-6 rounded-xl">
            <p className="text-[#F9FBFD]/70 mb-2">Pending to Pay</p>
            <p className="text-3xl font-bold text-[#F05822]">₦{(pendingAmounts[selectedDueId] || 0).toLocaleString()}</p>
          </div>
        </div>

        {/* Amount Input + Pay Now Button */}
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block mb-2 text-lg font-medium text-[#F9FBFD]">
              Amount to Pay (max: ₦{(pendingAmounts[selectedDueId] || 0).toLocaleString()})
            </label>
            <input
              type="number"
              value={payAmount}
              onChange={(e) => {
                const val = Number(e.target.value);
                setPayAmount(Math.min(val, pendingAmounts[selectedDueId] || 0));
              }}
              min={0}
              max={pendingAmounts[selectedDueId] || 0}
              className="w-full p-4 rounded-xl bg-[#063A4F] text-[#F9FBFD] border border-[#063A4F]/30 focus:border-[#FDB515] outline-none"
              placeholder="Enter amount"
            />
          </div>

          <button
            onClick={() => handleInitiatePayout(selectedDueId)}
            disabled={payAmount <= 0 || payAmount > (pendingAmounts[selectedDueId] || 0) || loadingPayout}
            className={`px-10 py-4 rounded-xl font-bold text-[#F9FBFD] shadow-lg transition-all ${
              loadingPayout 
                ? "bg-[#063A4F] cursor-not-allowed" 
                : "bg-gradient-to-r from-[#00B8C2] to-[#FDB515] hover:brightness-110"
            }`}
          >
            {loadingPayout ? "Processing..." : "Pay Now"}
          </button>
        </div>

        {/* Small note */}
        <p className="mt-4 text-sm text-[#F9FBFD]/70 text-center">
          This will transfer the amount to the association's account via Flutterwave.
        </p>
      </div>
    )}

    {/* Recent Payouts History Table */}
    <div className="mt-12">
      <h3 className="text-2xl font-bold mb-4 text-[#FDB515]">Recent Payouts</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#063A4F]/70">
            <tr>
              <th className="p-4 text-left text-[#FDB515]">Due</th>
              <th className="p-4 text-left text-[#FDB515]">Amount</th>
              <th className="p-4 text-left text-[#FDB515]">Date</th>
              <th className="p-4 text-left text-[#FDB515]">Reference</th>
              <th className="p-4 text-left text-[#FDB515]">Status</th>
            </tr>
          </thead>
<tbody>
  {payouts.flatMap((p) =>
    (p.payouts || []).map((entry: { amount: { toLocaleString: () => string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }; paidAt: string | number | Date; reference: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; status: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }, index: any) => (
      <tr key={`${p._id || p.associationName || 'due'}-${index}`}>
        <td>{p.associationName}</td>
        <td>₦{entry.amount.toLocaleString()}</td>
        <td>{new Date(entry.paidAt).toLocaleDateString()}</td>
        <td>{entry.reference}</td>
        <td>{entry.status}</td>
      </tr>
    ))
  )}
</tbody>
        </table>
      </div>
    </div>
  </motion.div>
)}
        {/* ================== SUBADMINS TAB ================== */}
        {activeTab === "subadmins" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-end mb-4">
              <input type="text" placeholder="Search subadmins..." value={subAdminSearch} onChange={(e) => setSubAdminSearch(e.target.value)}
                className="p-3 rounded-lg bg-[#063A4F] text-[#F9FBFD] w-1/3 font-oxygen border border-[#063A4F]/30 focus:border-[#FDB515]" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full font-oxygen">
               <thead className="bg-[#063A4F]/50">
  <tr>
    <th className="text-left p-4 text-[#F9FBFD]">Name</th>
    <th className="text-left p-4 text-[#F9FBFD]">Email</th>
    <th className="text-left p-4 text-[#F9FBFD]">Association</th> {/* ← NEW */}
    <th className="text-left p-4 text-[#F9FBFD]">Role</th>
    <th className="text-left p-4 text-[#F9FBFD]">Created At</th>
  </tr>
</thead>
<tbody>
  {filteredSubAdmins.map(sa => (
    <tr key={sa._id} className="border-t border-[#063A4F]/20">
      <td className="p-4">{sa.name}</td>
      <td className="p-4">{sa.email}</td>
      <td className="p-4">{sa.association || "-"}</td> {/* ← NEW */}
      <td className="p-4">{sa.role || "subadmin"}</td>
      <td className="p-4">{new Date(sa.createdAt).toLocaleDateString()}</td>
    </tr>
                  ))}
                  {filteredSubAdmins.length === 0 && <tr><td colSpan={4} className="text-center p-4 text-[#F9FBFD]/70">No subadmins found.</td></tr>}
                </tbody>
              </table>
            </div>

            <button onClick={() => setShowSubAdminModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-[#F0AA22] to-[#F05822] rounded-xl font-rubik font-bold text-[#F9FBFD]">Add SubAdmin</button>

            {/* SUBADMIN MODAL */}
            {/* SUBADMIN MODAL */}
{showSubAdminModal && (
  <div className="fixed inset-0 bg-[#063A4F]/50 flex items-center justify-center z-50">
    <div className="bg-[#124458] p-8 rounded-2xl w-1/2 shadow-xl relative">
      <h2 className="text-3xl font-rubik font-bold mb-6">Add SubAdmin</h2>
      <form onSubmit={handleCreateSubAdmin} className="space-y-4">
        <div>
          <label className="block mb-1 font-oxygen">Name</label>
          <input type="text" name="name" value={subAdminForm.name} onChange={handleSubAdminInput} className="w-full p-3 rounded-lg bg-[#063A4F] text-[#F9FBFD]" required />
        </div>
        <div>
          <label className="block mb-1 font-oxygen">Email</label>
          <input type="email" name="email" value={subAdminForm.email} onChange={handleSubAdminInput} className="w-full p-3 rounded-lg bg-[#063A4F] text-[#F9FBFD]" required />
        </div>
        <div>
          <label className="block mb-1 font-oxygen">Password</label>
          <input type="password" name="password" value={subAdminForm.password} onChange={handleSubAdminInput} className="w-full p-3 rounded-lg bg-[#063A4F] text-[#F9FBFD]" required />
        </div>

        {/* Dropdown for existing Dues/Associations */}
        <div>
          <label className="block mb-1 font-oxygen">Association (Select Existing Due)</label>
          <select
            name="association"
            value={subAdminForm.association || ""}
            onChange={handleSubAdminInput}
            className="w-full p-3 rounded-lg bg-[#063A4F] text-[#F9FBFD] border border-[#063A4F]/30 focus:border-[#FDB515]"
            required
          >
            <option value="">Select Due / Association</option>
            {dues.map((due) => (
              <option key={due._id} value={due.name}>
                {due.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4 mt-4">
          <button type="submit" className="px-6 py-3 bg-[#00B8C2] rounded-xl font-rubik font-bold text-[#F9FBFD]">
            Save
          </button>
          <button type="button" onClick={() => setShowSubAdminModal(false)} className="px-6 py-3 bg-[#F05822] rounded-xl font-rubik font-bold text-[#F9FBFD]">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}
          </motion.div>
        )}

      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;