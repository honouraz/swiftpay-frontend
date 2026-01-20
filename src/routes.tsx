// src/routes.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Payment from "./pages/Payment";
import Profile from "./pages/Profile";
import Success from "./pages/Success";
import PaymentSuccess from "./pages/PaymentSuccess";   // ← ADD THIS IMPORT
import ProtectedRoute from "./components/ProtectedRoute";
import MyTransactions from "./pages/MyTransactions";
import SubAdminDashboard from "./pages/SubAdminDashboard";
import SubAdminLogin from "./pages/SubAdminLogin";
import VerifyPayment from "./pages/VerifyPayment";
let AuthProvider: any = ({ children }: any) => children;
try {
  AuthProvider = require("./context/AuthContext").AuthProvider;
} catch (e) {
  AuthProvider = ({ children }: any) => <>{children}</>;
}

export default function AppRoutes() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Login /></Layout>} />
          <Route path="/verify/:reference" element={<VerifyPayment />} />
          <Route path="/register" element={<Layout><Register /></Layout>} />
          <Route path="/subadmin-dashboard" element={<SubAdminDashboard />} />
         <Route path="/subadmin-login" element={<SubAdminLogin />} />
          <Route path="/dashboard" element={<Layout><ProtectedRoute><Dashboard /></ProtectedRoute></Layout>} />
          <Route path="/payment" element={<Layout><ProtectedRoute><Payment /></ProtectedRoute></Layout>} />
          <Route path="/profile" element={<Layout><ProtectedRoute><Profile /></ProtectedRoute></Layout>} />
          <Route path="/my-transactions" element={<Layout><ProtectedRoute><MyTransactions /></ProtectedRoute></Layout>} />
          {/* SUCCESS PAGE AFTER PAYSTACK */}
          <Route path="/payment-success" element={<PaymentSuccess />} />   {/* ← CORRECT SPELLING */}

          <Route path="/payment/success/:reference" element={<Layout><Success /></Layout>} />
<Route 
  path="/admin" 
  element={
    <Layout>
      <ProtectedRoute adminOnly>
        <AdminDashboard />
      </ProtectedRoute>
    </Layout>
  }
/>        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}