import { useAuth } from "../context/AuthContext";
import PayForSomeone from "../components/PayForSomeone";
import { useNavigate } from "react-router-dom";
import { LogOut, History, ShieldCheck, Zap } from "lucide-react";
import "../styles/checkout.css";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

 return (
<div className="dashboard-layout">

    {/* TOP BAR */}
    <div className="topbar">
      <h3>SwiftPay</h3>
      <button className="menu-btn">☰</button>
    </div>

    {/* MAIN CONTENT */}
    <div className="main-content">

      <div className="max-w-7xl mx-auto px-6 mt-12">

        <header className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-black uppercase">
              Welcome Back, <span className="text-[#00B8C2]">{user?.name?.split(" ")[0]}</span>
            </h1>
            <p className="text-xl font-bold text-gray-500 mt-2">
              PAY YOUR DUES SWIFTLY WITH SWIFTPAY
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Payment Section */}
          <div className="lg:col-span-2">
            <PayForSomeone />
          </div>
</div>
<div className="space-y-8">
<button 
            onClick={() => navigate("/my-transactions")}
            className="btn-brutal bg-[#00B8C2] text-white flex items-center gap-3"
          >
            <History size={25} /> View Transaction History And Download Receipts
          </button>

          {/* Quick Stats Sidebar */}
          <div className="space-y-8">
            <div className="card-brutal bg-[#FF6B35] text-white">
              <Zap size={40} className="mb-4" />
              <h3 className="text-2xl font-black uppercase">Fast Verification</h3>
              <p className="font-bold opacity-90 mt-2">All transanctions are synced and verified instantly and receipts generated SWIFTLY</p>
            </div>

            <div className="card-brutal bg-white">
              <ShieldCheck size={40} className="mb-4 text-[#00B8C2]" />
              <h3 className="text-2xl font-black uppercase text-black">Security</h3>
              <p className="font-bold text-gray-500 mt-2">Secured by Swiftpay End-to-End Encryption and Flutterwave.</p>
            <button onClick={logout} className="text-xs font-bold hover:text-[#FF6B35] flex items-center gap-2">
          <LogOut size={14} /> LOGOUT
        </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Dashboard;