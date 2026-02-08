// src/pages/VerifyPayment.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import API from "../utils/api";

interface Payment {
  payerName: string;
  metadata: {
    matricNumber?: string;
    dueName?: string;
    level?: string;
    payerName?: string;
  };
  status: string;
  paidAt: string;
  amount: number;
}

const VerifyPayment: React.FC = () => {
  const { reference } = useParams<{ reference: string }>();
  const navigate = useNavigate();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
     const storedUser = localStorage.getItem("swiftpay_user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user || user.role !== "subadmin") {
    toast.error("Unauthorized access");
    navigate("/");
    return;
  }
    const fetchPayment = async () => {
      try {
        const res = await API.get(`/payments/verify/${reference}`);
        setPayment(res.data.payment);
      } catch (err: any) {
        setError(err.response?.data?.message || "Invalid or expired reference");
        toast.error("Payment verification failed");
      } finally {
        setLoading(false);
      }
    };

    if (reference) fetchPayment();
    
  }, [reference, navigate]);
  

  useEffect(() => {
  const timer = setTimeout(() => {
    navigate(-1); // go back to dashboard
  }, 10000); // 10 seconds

  return () => clearTimeout(timer);
}, []);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#063A4F] to-[#124458]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="text-6xl font-bold text-[#FDB515]"
        >
          Verifying...
        </motion.div>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#063A4F] to-[#124458] text-[#F9FBFD]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-[#124458]/80 p-12 rounded-3xl shadow-2xl max-w-lg mx-4"
        >
          <h1 className="text-4xl font-bold text-[#F05822] mb-6">Payment Not Found</h1>
          <p className="text-xl text-[#F9FBFD]/80">{error || "Invalid reference"}</p>
        </motion.div>
      </div>
    );
  }

  const isSuccess = payment.status === "success";
  const payerName = payment.metadata?.payerName || "Unknown";
  const matric = payment.metadata?.matricNumber || "N/A";
  const due = payment.metadata?.dueName || "Unknown Due";
  const level = payment.metadata?.level || "N/A";
  const amount = payment.amount?.toLocaleString() || "0";
  const date = new Date(payment.paidAt).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#063A4F] to-[#124458] p-6 text-[#F9FBFD]">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-[#124458]/90 backdrop-blur-lg rounded-3xl shadow-2xl p-10 max-w-2xl w-full border border-[#063A4F]/30"
      >
        {/* Success Badge */}
        <div className="flex justify-center mb-8">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className={`px-8 py-4 rounded-full text-xl font-bold ${
              isSuccess ? "bg-[#00B8C2] text-[#063A4F]" : "bg-[#F05822] text-white"
            } shadow-lg`}
          >
            {isSuccess ? "PAYMENT SUCCESSFUL ✅" : "PENDING"}
          </motion.div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-rubik font-bold text-center mb-10 bg-gradient-to-r from-[#FDB515] to-[#F05822] bg-clip-text text-transparent">
          Payment Confirmation
        </h1>

        {/* Details Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div className="space-y-4">
            <div className="bg-[#063A4F]/50 p-6 rounded-2xl border border-[#063A4F]/30">
              <p className="text-sm text-[#F9FBFD]/70">Payer Name</p>
              <p className="text-2xl font-bold">{payerName}</p>
            </div>

            <div className="bg-[#063A4F]/50 p-6 rounded-2xl border border-[#063A4F]/30">
              <p className="text-sm text-[#F9FBFD]/70">Matric Number</p>
              <p className="text-2xl font-bold">{matric}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-[#063A4F]/50 p-6 rounded-2xl border border-[#063A4F]/30">
              <p className="text-sm text-[#F9FBFD]/70">Payment For</p>
              <p className="text-2xl font-bold">{due} (Level {level} ✅)</p>
            </div>

            <div className="bg-[#063A4F]/50 p-6 rounded-2xl border border-[#063A4F]/30">
              <p className="text-sm text-[#F9FBFD]/70">Amount Paid</p>
              <p className="text-3xl font-bold text-[#00B8C2]">₦{amount}</p>
            </div>
          </div>
        </div>

        {/* Status & Date */}
        <div className="text-center mb-10">
          <p className="text-xl mb-2">
            <span className="font-bold">Status:</span>{" "}
            <span className={isSuccess ? "text-[#00B8C2]" : "text-[#F05822]"}>
              {isSuccess ? "Successfully Confirmed ✅" : "Pending"}
            </span>
          </p>
          <p className="text-lg text-[#F9FBFD]/80">
            Date: {date}
          </p>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-lg font-bold text-[#FDB515]">Thank you for paying with SwiftPay!</p>
          <p className="text-sm text-[#F9FBFD]/70 mt-2">
            Powered by Honouraz Investments & Technologies
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyPayment;