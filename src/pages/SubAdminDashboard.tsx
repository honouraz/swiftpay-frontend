import React, { useEffect, useState } from "react";
import API from "../utils/api";
import { CSVLink } from "react-csv";

interface Payment {
  _id: string;
  payerName: string;
  userEmail: string;
  dueName: string;
  level?: string;
  baseAmount?: number;
  paidAt: string;
}

const SubAdminDashboard: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    API.get("/subadmin/payments").then(res => setPayments(res.data));
  }, []);

  const totalBase = payments.reduce((acc, p) => acc + (p.baseAmount || 0), 0);

  return (
    <div className="p-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Association Dashboard</h1>
      <p>Total Students Paid: {payments.length}</p>
      <p>Total Base Amount Collected: ₦{totalBase.toLocaleString()}</p>

      <CSVLink
        data={payments.map(p => ({
          Name: p.payerName,
          Email: p.userEmail,
          Due: p.dueName,
          Level: p.level,
          BaseAmount: p.baseAmount,
          PaidAt: p.paidAt,
        }))}
        filename="association_payments.csv"
      >
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg mt-4">Download CSV</button>
      </CSVLink>

      <table className="mt-6 w-full border">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Due</th>
            <th>Level</th>
            <th>BaseAmount</th>
            <th>PaidAt</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(p => (
            <tr key={p._id}>
              <td>{p.payerName}</td>
              <td>{p.userEmail}</td>
              <td>{p.dueName}</td>
              <td>{p.level || "-"}</td>
              <td>₦{p.baseAmount?.toLocaleString()}</td>
              <td>{new Date(p.paidAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubAdminDashboard;
