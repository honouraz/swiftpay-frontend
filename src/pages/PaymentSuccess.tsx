// src/pages/PaymentSuccess.tsx
import React, { useEffect, useState } from "react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://swiftpay-backend-djp0.onrender.com";

const PaymentSuccess: React.FC = () => {
  const [message, setMessage] = useState("Verifying your payment...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference =
      params.get("reference") ||    // Paystack
      params.get("trxref") ||       // Flutterwave old
      params.get("tx_ref");         // Flutterwave current

    if (!reference) {
      setMessage("No payment reference found");
      return;
    }

    setMessage("Payment successful! 🎉 Generating your receipt...");

    const downloadReceipt = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/receipt-by-ref/${reference}`);

        if (!response.ok) {
          setMessage("Payment successful! 🎉 But receipt could not be generated.");
          return;
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `SwiftPay_Receipt_${reference}.pdf`;

        // Safari fix: download attribute no dey work well for programmatic clicks
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

        if (isSafari) {
          // Safari: open in new tab (user go see and download manually)
          window.open(url, "_blank");
          setMessage("Payment successful! 🎉 Receipt opened in new tab (Safari). Download from there.");
        } else {
          // Other browsers: auto download
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setMessage("Payment successful! 🎉 Receipt downloaded.");
        }

        // Clean up
        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Receipt download error:", err);
        setMessage("Payment successful! 🎉 But receipt failed to load.");
      }
    };

    // Small delay for better UX
    setTimeout(() => {
      downloadReceipt();
    }, 1500);

    // Optional verify call (no harm)
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

      <footer style={{ marginTop: 60 }}>
        SWIFTPAY BY HONOURAZ INVESTMENTS AND TECHNOLOGIES
      </footer>
    </div>
  );
};

export default PaymentSuccess;
