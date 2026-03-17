import { useAuth } from "../context/AuthContext";
import PayForSomeone from "../components/PayForSomeone";
import { useNavigate } from "react-router-dom";
import { LogOut, History, ShieldCheck, Zap } from "lucide-react";


const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return ( 

    // Dashboard.tsx
<div className="page-wrapper">
  <div className="main-container">
    <header className="mb-10">
      <h1 className="text-5xl font-bold text-slate-900">
        Welcome Back, <span className="text-indigo-600">{user?.name?.split(" ")[0]}</span>
      </h1>
      <p className="mt-2 text-xl text-slate-600 font-medium">
        PAY YOUR DUES SWIFTLY WITH SWIFTPAY
      </p>
    </header>

    <div className="dashboard-grid">
      {/* PayForSomeone goes here – wrap it in card */}
      <div className="card lg:col-span-2">
        <PayForSomeone />
      </div>

      {/* Sidebar stats / actions */}
      <div className="space-y-6">
        <div className="stat-card">
          <Zap className="text-emerald-600" size={32} />
          <div className="stat-number text-emerald-600">Instant</div>
          <div className="stat-label">Verification & Receipts</div>
        </div>

        <div className="stat-card">
          <ShieldCheck className="text-indigo-600" size={32} />
          <div className="stat-number">Secure</div>
          <div className="stat-label">End-to-End Encryption</div>
        </div>

        <button onClick={logout} className="button danger w-full flex items-center justify-center gap-2">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  </div>
</div>
      
  );
};

export default Dashboard;
