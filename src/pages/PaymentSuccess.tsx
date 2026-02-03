// src/pages/PaymentSuccess.tsx
import React, { useEffect, useState } from "react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://swiftpay-backend-djp0.onrender.com";

const PaymentSuccess: React.FC = () => {
  const [message, setMessage] = useState("Verifying your payment...");

  const params = new URLSearchParams(window.location.search);
    const reference = 
      params.get("reference") ||          // Paystack
      params.get("trxref") ||             // Flutterwave old
      params.get("tx_ref");               // Flutterwave current


  const downloadReceipt = () => {
    if (!reference) return;
  const receiptUrl = `${API_BASE_URL}/receipt-by-ref/${reference}`;

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  if (isSafari) {
    // Safari: Open receipt in new tab directly (user fit download from there)
    const newTab = window.open(receiptUrl, "_blank");
    if (newTab) {
      newTab.focus();
    } else {
      // If popup blocked
      alert("Please allow pop-ups for this site to download receipt on Safari");
    }
  } else {
    // Other browsers: auto download
    const link = document.createElement("a");
    link.href = receiptUrl;
    link.download = `SwiftPay_Receipt_${reference}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

  useEffect(() => { 
    if (!reference) {
      setMessage("No payment reference found");
      return;
    }

    setMessage("Payment successful! 🎉 Generating your receipt...");
    
    setTimeout(() => {
      downloadReceipt();
      setMessage("Payment successful! 🎉 Receipt downloaded.");
    }, 1500);

    // Optional verify (no harm)
    const verify = async () => {
      try {
        await fetch(`${API_BASE_URL}/api/payments/flutterwave/verify/${reference}`);
      } catch {}
    };
    verify();

  }, []);

  return (
    <div style={{
      padding: "100px 20px",
      textAlign: "center",
      color: "white",
      minHeight: "100vh",
      background: "#000",
    }}>
      <h1 style={{ fontSize: 48, color: "#00A86B" }}>
        Payment Successful!
      </h1>

      <div style={{ marginTop: 50, fontSize: 24 }}>
        {message}
      </div>

      <p style={{ marginTop: 40 }}>
        If download didn’t start,&nbsp;
        <a
          href="/dashboard"
          style={{ color: "#00ff00", fontSize: 18 }}
        >
          go back to dashboard
        </a>
      </p>

<button
  onClick={downloadReceipt}
  style={{
    marginTop: 30,
    padding: "14px 30px",
    fontSize: 18,
    background: "#00A86B",
    color: "#000",
    borderRadius: 10,
    cursor: "pointer",
  }}
>
  Download Receipt
</button>


      <footer style={{ marginTop: 60 }}>
        SWIFTPAY BY HONOURAZ INVESTMENTS AND TECHNOLOGIES
      </footer>
    </div>
  );
};

export default PaymentSuccess;
