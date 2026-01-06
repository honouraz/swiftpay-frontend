// src/pages/Success.tsx
import React, { useEffect } from "react";
import API from "../utils/api";
import { useParams, useNavigate } from "react-router-dom";

const Success = () => {
  const { reference } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!reference) {
      alert("No payment reference");
      navigate("/dashboard");
      return;
    }

    API.get(`/payments/paystack/verify/${reference}`)
      .then((res) => {
        if (res.data.status === "success") {
          alert("Payment Successful!");
          navigate("/dashboard");
        } else {
          alert("Payment not verified");
        }
      })
      .catch(() => {
        alert("Verification failed");
      });
  }, [reference, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-xl text-center">
        <h1 className="text-2xl font-bold text-green-600">Verifying Payment...</h1>
        <p>Please wait...</p>
      </div>
    </div>
  );
};

export default Success;