// src/components/PayForSomeone.tsx
import React, { useState, useEffect } from "react";
import API from "../utils/api";
import { useAuth } from "../context/AuthContext";

interface Due {
  _id: string;
  name: string;
  prices: Record<string, number>;
  extraCharge?: number;
  platformFeePercent?: number;
}

const PayForSomeone: React.FC = () => {
  const { token } = useAuth();
  const [dues, setDues] = useState<Due[]>([]);
  const [form, setForm] = useState({
    fullName: "",
    matricNumber: "",
    department: "",
    phone: "",
    email: "",
    dueId: "",
    level: "100",
  });

  const [loading, setLoading] = useState(false);
 useEffect(() => {
  if (!token) return;

  API.get("/dues")
    .then(res => setDues(res.data))
    .catch(err => console.error("Failed to fetch dues", err));
}, [token]);



  const selectedDue = dues.find(d => d._id === form.dueId);
const level = form.level; // e.g., "100", "200"

  const safePrices = selectedDue?.prices || {};
  const baseAmount = safePrices[form.level] ?? 0;
  const platformFee = selectedDue && selectedDue.extraCharge === 0
    ? Math.round((baseAmount * (selectedDue.platformFeePercent ?? 7)) / 100)
    : 0;
  const extraCharge = selectedDue?.extraCharge ?? 0;
  const totalAmount = baseAmount + platformFee + extraCharge;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return alert("Please login first");
    if (!form.dueId) return alert("Please select a due");
    if (!selectedDue) return alert("Due not found");

    setLoading(true);
    try {
      const res = await API.post("/payments/paystack/initialize", {
  email: form.email || "temp@swiftpay.com",
  dueId: form.dueId,
  level: form.level,
  name: form.fullName,
  matric: form.matricNumber,
  department: form.department,
  phone: form.phone,
  gateway: "flutterwave",
});

      window.location.href = res.data.authorization_url || res.data.data.authorization_url;
    } catch (err: any) {
      console.error(err.response?.data || err);
      alert("Payment failed: " + (err.response?.data?.message || "Try again"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePay} className="space-y-6 font-oxygen">
      <input type="text" placeholder="Full Name" required value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} className="w-full px-6 py-4 bg-[#124458] rounded-xl text-white" />
      <input type="text" placeholder="Matric Number" required value={form.matricNumber} onChange={e => setForm({ ...form, matricNumber: e.target.value })} className="w-full px-6 py-4 bg-[#124458] rounded-xl text-white" />
      <select required value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} className="w-full px-6 py-4 bg-[#124458] rounded-xl text-white">
        <option value="">Select Department</option>
        {["Computer Science", "Microbiology", "Physics And Electronics", "Industrial Chemistry", "Mathematics", "Statistics", "Plant Science and Biotechnology", "Biochemistry", "SLT", "Public Health", "Health Information Management"].map(dept => (
          <option key={dept} value={dept}>{dept}</option>
        ))}
      </select>
      <input type="tel" placeholder="Phone Number" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-6 py-4 bg-[#124458] rounded-xl text-white" />
      <input type="email" placeholder="Email (optional)" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-6 py-4 bg-[#124458] rounded-xl text-white" />

      <div className="grid grid-cols-2 gap-4">
        <select 
          required 
          value={form.dueId} 
          onChange={e => setForm({ ...form, dueId: e.target.value, level: "100" })} // reset level when due change
          className="px-6 py-4 bg-[#124458] rounded-xl text-white"
        >
          <option value="">Select Due</option>
          {dues.map(d => (
            <option key={d._id} value={d._id}>{d.name}</option>
          ))}
        </select>

        <select 
          value={form.level} 
          onChange={e => setForm({ ...form, level: e.target.value })}
          className="px-6 py-4 bg-[#124458] rounded-xl text-white"
          disabled={!form.dueId}
        >
          {[100, 200, 300, 400, 500].map(lvl => (
            <option key={lvl} value={lvl.toString()}>
              {lvl} Level — ₦{(safePrices[lvl.toString()] ?? 0).toLocaleString()}
            </option>
          ))}
        </select>
      </div>

      <div className="text-center py-8 bg-[#063A4F]/30 rounded-2xl">
        <p className="text-4xl font-bold text-[#FDB515] mb-2">
          ₦{baseAmount.toLocaleString()}
        </p>
        <p className="text-sm text-gray-300 mb-2">
          Platform Fee: ₦{platformFee.toLocaleString()}, Extra Charge: ₦{extraCharge.toLocaleString()}
        </p>
        <p className="text-sm text-gray-300">
          Total Payable: ₦{totalAmount.toLocaleString()}
        </p>

        <button
          type="submit"
          disabled={loading || !form.dueId}
          className="w-full py-5 rounded-xl bg-gradient-to-r from-[#F0AA22] to-[#F05822] text-white font-bold text-2xl disabled:opacity-70 mt-6"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </form>
  );
};

export default PayForSomeone;