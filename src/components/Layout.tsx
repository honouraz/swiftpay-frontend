import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, CreditCard, LayoutDashboard, LogOut, ShieldCheck, FileText } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout, isAdmin, isSubAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "My Transactions", path: "/transactions", icon: CreditCard },
    { name: "Terms & Conditions", path: "/terms", icon: FileText },
  ];

  if (isAdmin || isSubAdmin) {
    navItems.push({ name: "Admin Panel", path: "/admin", icon: ShieldCheck });
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#063A4F] text-white font-sans relative overflow-hidden flex">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-20 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: 'url("/assets/bg.jpg")' }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#063A4F]/80 to-[#063A4F] pointer-events-none" />

      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden lg:flex w-72 bg-[#063A4F]/60 backdrop-blur-xl border-r border-white/10 flex-col relative z-30">
        <div className="p-8 flex-1">
          <Link to="/" className="flex items-center gap-3 mb-10">
            <img src="/assets/swiftpay-logo.png" alt="SwiftPay" className="h-12 w-auto" />
            <span className="text-2xl font-bold tracking-tight">
              Swift<span className="text-[#FDB515]">Pay</span>
            </span>
          </Link>

          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${
                  location.pathname === item.path 
                    ? "bg-[#FDB515] text-[#063A4F] font-bold shadow-lg shadow-[#FDB515]/20" 
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className={`w-5 h-5 ${location.pathname === item.path ? "text-[#063A4F]" : "text-[#FDB515] group-hover:scale-110 transition-transform"}`} />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-8 border-t border-white/10">
          {user ? (
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FDB515] to-[#F05822] flex items-center justify-center font-bold text-[#063A4F]">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{user.name}</p>
                <p className="text-xs text-gray-400 capitalize">{user.role}</p>
              </div>
            </div>
          ) : null}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 relative z-20">
        {/* Top Navigation Bar */}
        <header className="bg-[#063A4F]/60 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between lg:justify-end">
          <div className="flex items-center gap-4 lg:hidden">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-[#FDB515]" />
            </button>
            <Link to="/" className="flex items-center gap-3">
              <img src="/assets/swiftpay-logo.png" alt="SwiftPay" className="h-8 w-auto" />
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-gray-300">System Online</span>
            </div>
            
            {user ? (
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold">{user.name}</p>
                  <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FDB515] to-[#F05822] flex lg:hidden items-center justify-center font-bold text-[#063A4F]">
                  {user.name.charAt(0)}
                </div>
              </div>
            ) : null}
          </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 bottom-0 z-50 w-72 bg-[#063A4F] border-r border-white/10 p-6 flex flex-col lg:hidden"
              >
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-3">
                    <img src="/assets/swiftpay-logo.png" alt="SwiftPay" className="h-8 w-auto" />
                    <span className="text-xl font-bold">Swift<span className="text-[#FDB515]">Pay</span></span>
                  </div>
                  <button onClick={() => setIsSidebarOpen(false)}>
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>

                <nav className="flex-1 space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                        location.pathname === item.path 
                          ? "bg-[#FDB515] text-[#063A4F] font-bold" 
                          : "text-gray-300 hover:bg-white/5"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  ))}
                </nav>

                <div className="pt-6 border-t border-white/10">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
