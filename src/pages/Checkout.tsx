import { useEffect, useState } from "react";
import axios from "axios";
import QRCode from "react-qr-code";
import "../styles/checkout.css";

export default function Checkout() {
  const [account, setAccount] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(600);
  const [copied, setCopied] = useState(false);
  const [checking, setChecking] = useState(false);

  const reference = new URLSearchParams(window.location.search).get("ref");

  useEffect(() => {
    async function createVA() {
      const res = await axios.post("/api/payments/create-va", { reference });
      setAccount(res.data);
    }
    createVA();
  }, [reference]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await axios.get(`/api/payments/status/${reference}`);

      if (res.data.status === "success") {
        window.location.href = `/payment-success?ref=${reference}`;
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [reference]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  async function confirmPayment() {
    setChecking(true);
    const res = await axios.get(`/api/payments/status/${reference}`);

    if (res.data.status === "success") {
      window.location.href = `/payment-success?ref=${reference}`;
    } else {
      setChecking(false);
      alert("Payment not detected yet.");
    }
  }

  function copyAccount() {
    navigator.clipboard.writeText(account.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!account)
    return (
      <div className="checkout-container">
        <div className="card skeleton"></div>
      </div>
    );

  return (
    <div className="checkout-container">

      <img src="/swiftpay-logo.png" className="logo" />

      <h2>SwiftPay Secure Checkout</h2>

      <div className="card">

        <div className="amount">
          Pay <strong>₦{account.amount}</strong>
        </div>

        <div className="bank-box">
          <p><b>Bank</b></p>
          <h3>{account.bankName}</h3>

          <p><b>Account Number</b></p>
          <h2>{account.accountNumber}</h2>

          <p><b>Account Name</b></p>
          <h4>{account.accountName}</h4>
        </div>

        <button onClick={copyAccount} className="copy-btn">
          {copied ? "Copied ✓" : "Copy Account Number"}
        </button>

        <div className="qr-box">
          <QRCode value={account.accountNumber} size={120} />
          <p>Scan to pay</p>
        </div>

        <p className="timer">
          Account expires in {Math.floor(timeLeft / 60)}:
          {String(timeLeft % 60).padStart(2, "0")}
        </p>

        <button
          className="paid-btn"
          onClick={confirmPayment}
        >
          {checking ? "Checking Payment..." : "I HAVE PAID"}
        </button>

        <div className="timeline">

          <div className="step active">Create Payment</div>
          <div className="step">Transfer Money</div>
          <div className="step">Payment Confirmed</div>

        </div>

      </div>

      <p className="footer">
        Secure payment powered by SWIFTPAY THROUGH Flutterwave
      </p>

    </div>
  );
}
