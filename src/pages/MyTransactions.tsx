// src/pages/MyTransactions.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";
import API from "../utils/api";
import { CSVLink } from "react-csv";

const MyTransactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    API.get("/payments/my")
      .then((res) => setTransactions(res.data))
      .catch((err) => {
        console.log(err);
        alert("Failed to load transactions");
      });
  }, [user]);

  const csvData = transactions.map((t) => ({
    Date: new Date(t.paidAt).toLocaleDateString(),
    Student: t.metadata?.payerName || "N/A",
    Matric: t.metadata?.matricNumber || "-",
    Due: t.metadata?.dueName || "SwiftPay Payment",
    Amount: `₦${t.amount?.toLocaleString()}`,
    Status: t.status,
    Reference: t.reference,
  }));

  const handleViewReceipt = (reference: string) => {
    window.open(`${API.defaults.baseURL}/receipt-by-ref/${reference}`, "_blank");
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-[#063A4F] mb-6">My Transactions</h1>

          {transactions.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-10 text-center">
              <p className="text-xl text-gray-600">No transactions yet.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="p-4 bg-[#063A4F] text-white flex justify-between items-center">
                <h2 className="text-xl font-bold">Payment History</h2>
                <CSVLink
                  data={csvData}
                  filename="swiftpay_transactions.csv"
                  className="bg-[#FDB515] px-4 py-2 rounded-lg hover:bg-yellow-500 transition"
                >
                  Download CSV
                </CSVLink>
              </div>

              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th>Date</th>
  <th>Student Name</th>
  <th>Matric No</th>
  <th>Due</th>
  <th>Level</th>
  <th>Amount</th>
  <th>Status</th>
  <th>Receipt</th>
   </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t._id} className="border-b hover:bg-gray-50">
                      <td className="p-4">{new Date(t.paidAt).toLocaleDateString()}</td>
                      <td className="p-4">{t.metadata?.payerName || "N/A"}</td>
                      <td className="p-4">{t.metadata?.matricNumber || "-"}</td>
                      <td className="p-4">{t.metadata?.dueName || "SwiftPay Payment"}</td>
                      <td className="p-4">{t.metadata?.level || "-"}</td>
                      <td className="p-4 font-bold">₦{t.amount?.toLocaleString()}</td>
                      <td className="p-4">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          {t.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <button onClick={() => handleViewReceipt(t.reference)} className="flex items-center gap-1 text-[#063A4F] hover:text-[#FDB515]">
  <span>📄</span> Receipt
</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default MyTransactions;