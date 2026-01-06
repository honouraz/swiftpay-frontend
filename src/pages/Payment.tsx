// src/pages/Payment.tsx
import React, { useState, useEffect } from "react";
import API from "../utils/api";
import { useAuth } from "../context/AuthContext";

const Payment = () => {
  const { user } = useAuth();
  const [dues, setDues] = useState<any[]>([]);
  const [selectedDue, setSelectedDue] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get("/dues")
      .then((res) => setDues(res.data))
      .catch((err) => {
        console.log(err);
        alert("Failed to load dues");
      });
  }, []);

  const payNow = async () => {
    if (!selectedDue) return alert("Pick one due");
    if (!user) return alert("Please login first");

    setLoading(true);

    try {
      const res = await API.post("/payments/paystack/initialize", {
        email: user.email,
        dueId: selectedDue._id,
        name: user.name || "SwiftPay User",
        amount: selectedDue.amount,
      });

      window.location.href = res.data.data.authorization_url;
    } catch (err: any) {
      console.log("Paystack Error:", err.response?.data || err.message);
      alert("Payment failed: " + (err.response?.data?.message || "Try again"));
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/bg.jpg')" }}
    >
      <div className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-xl w-full max-w-lg">
        <h2 className="text-3xl font-bold text-green-700 text-center mb-6">
          Pay Your Dues
        </h2>

        <div className="space-y-4">
          {dues.length === 0 ? (
            <p className="text-center text-gray-600">Loading dues...</p>
          ) : (
            dues.map((due) => (
              <div
                key={due._id}
                onClick={() => setSelectedDue(due)}
                className={`p-4 rounded-xl cursor-pointer transition-all shadow 
                  ${
                    selectedDue?._id === due._id
                      ? "border-4 border-green-600 bg-green-50 scale-[1.02]"
                      : "border border-gray-400 hover:border-green-500 hover:bg-gray-100"
                  }`}
              >
                <p className="text-lg font-semibold">{due.name}</p>
                <p className="text-gray-700">₦{due.amount?.toLocaleString()}</p>
              </div>
            ))
          )}
        </div>

        {selectedDue && (
          <div className="mt-6 text-center">
            <h3 className="text-xl font-semibold mb-3">
              You selected: <span className="text-green-700">{selectedDue.name}</span>
            </h3>
            <p className="mb-4 text-gray-600 text-lg">
              Total: <span className="font-bold">₦{selectedDue.amount?.toLocaleString()}</span>
            </p>

            <button
              onClick={payNow}
              disabled={loading}
              className="w-full py-3 text-lg font-bold bg-green-600 text-white rounded-xl 
              hover:bg-green-700 transition-all shadow-lg hover:shadow-2xl disabled:opacity-60"
            >
              {loading ? "Processing..." : "Pay with Paystack"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;