// src/components/Layout.tsx – FIXED VISIBILITY: EVEN STRONGER OVERLAY (#063A4F/80 FOR BETTER CONTRAST), SINGLE BG IMAGE (NO DUPLICATES), KEEP IMAGE VISIBLE; SPACING IN NAV; RESPONSIVE
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-cover bg-center relative" style={{ backgroundImage: 'url("../ssets/bg.jpg")' }}> {/* Single BG here – no duplicates */}
      {/* Stronger overlay: #063A4F/80 for darker tint, texts now pop (white on dark navy overlay) */}
      <div className="absolute inset-0 bg-[#063A4F]/80" />

      {/* HEADER – Spacing: space-x-8; fine buttons */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-20 bg-[#F9FBFD]/5 backdrop-blur-md border-b border-[#063A4F]/10 shadow-md py-4 px-4 md:px-12 lg:px-16"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <h1 className="text-3xl md:text-5xl font-rubik font-bold bg-gradient-to-r from-[#00B8C2] to-[#FDB515] bg-clip-text text-transparent">SwiftPay</h1>
          </Link>
          {/* Actions – Desktop: fine buttons with gradients/shadows */}
          

          {/* Mobile Trigger */}
          <button onClick={() => setIsMenuOpen(true)} className="md:hidden text-[#F9FBFD]">
            <svg width="25" height="14" viewBox="0 0 25 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M0 1C0 0.447715 0.447715 0 1 0H24C24.5523 0 25 0.447715 25 1C25 1.55228 24.5523 2 24 2H1C0.447715 2 0 1.55228 0 1Z" fill="#F9FBFD" />
              <path fillRule="evenodd" clipRule="evenodd" d="M0 12.0263C0 11.474 0.447715 11.0263 1 11.0263H24C24.5523 11.0263 25 11.474 25 12.0263C25 12.5786 24.5523 13.0263 24 13.0263H1C0.447715 13.0263 0 12.5786 0 12.0263Z" fill="#F9FBFD" />
            </svg>
          </button>
        </div>
      </motion.header>

      {/* SIDENAV – Dark bg, white text */}
      {isMenuOpen && (
        <motion.div 
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 right-0 h-full w-full md:w-64 bg-[#063A4F] z-50 p-8 shadow-2xl md:hidden text-[#F9FBFD]"
        >
          <button onClick={() => setIsMenuOpen(false)} className="absolute top-4 right-4 text-[#F9FBFD]">
            <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.6328 9.9945L19.7328 1.8945C19.9149 1.68194 20.01 1.40852 19.9992 1.12888C19.9884 0.849242 19.8724 0.583977 19.6746 0.386094C19.4767 0.188211 19.2114 0.0722855 18.9318 0.0614842C18.6521 0.050683 18.3787 0.145801 18.1662 0.327831L10.0662 8.42783L1.96616 0.316719C1.7536 0.13469 1.48019 0.0395727 1.20055 0.0503739C0.920905 0.0611752 0.65564 0.1771 0.457757 0.374982C0.259874 0.572865 0.143948 0.838131 0.133147 1.11777C0.122346 1.39741 0.217464 1.67083 0.399494 1.88339L8.49949 9.9945L0.388382 18.0945C0.272069 18.1941 0.177602 18.3167 0.11091 18.4545C0.044217 18.5924 0.00673853 18.7425 0.000827977 18.8955C-0.00508257 19.0486 0.0207018 19.2012 0.0765624 19.3437C0.132423 19.4863 0.217154 19.6158 0.325438 19.7241C0.433721 19.8324 0.563218 19.9171 0.705801 19.973C0.848384 20.0288 1.00098 20.0546 1.154 20.0487C1.30702 20.0428 1.45717 20.0053 1.59502 19.9386C1.73287 19.8719 1.85544 19.7775 1.95505 19.6612L10.0662 11.5612L18.1662 19.6612C18.3787 19.8432 18.6521 19.9383 18.9318 19.9275C19.2114 19.9167 19.4767 19.8008 19.6746 19.6029C19.8724 19.405 19.9884 19.1398 19.9992 18.8601C20.01 18.5805 19.9149 18.3071 19.7328 18.0945L11.6328 9.9945Z" fill="#F9FBFD" />
            </svg>
          </button>
          <ul className="space-y-6 mt-16 text-[#F9FBFD] font-rubik font-medium text-xl">
            <li><Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block hover:text-[#FDB515] transition">Dashboard</Link></li>
            <li><Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block hover:text-[#FDB515] transition">Profile</Link></li>
            <li><Link to="/payment" onClick={() => setIsMenuOpen(false)} className="block hover:text-[#FDB515] transition">Pay</Link></li>
            {isAdmin && <li><Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block text-[#FDB515] font-bold hover:text-[#F05822] transition">Admin Panel</Link></li>}
          <li><Link to="/terms" className="hover:text-[#FDB515] transition">Terms</Link></li>
              <li><Link to="/privacy" className="hover:text-[#FDB515] transition">Privacy</Link></li>
          </ul>
          <div className="container max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 font-oxygen text-sm md:text-base">
          <div>
            
              <h4 className="text-2xl md:text-3xl font-rubik font-bold bg-gradient-to-r from-[#00B8C2] to-[#b90fabff] bg-clip-text text-transparent mb-4">SwiftPay</h4>           
          </div>
            <h4 className="font-rubik font-bold mb-4 text-lg md:text-xl">Community</h4>
            
        
          
            <h4 className="font-rubik font-bold mb-4 text-lg md:text-xl">Legal</h4>
        </div>
        <div className="mt-8 text-center text-sm md:text-base text-[#F9FBFD]/70 font-oxygen">
                       <h2 className="text-2xl md:text-3xl font-rubik font-bold bg-gradient-to-r from-[#00B8C2] to-[#b90fabff] bg-clip-text text-transparent mb-4"> © 2026 SwiftPay by HonTech. All rights reserved.</h2>
        </div>
        </motion.div>
      )}

      {/* MAIN CONTENT – Increased padding, centered */}
      <main className="relative z-10 flex-grow container max-w-5xl lg:max-w-7xl mx-auto px-4 py-12 md:py-16 lg:py-20 flex flex-col items-center">
        {children}
      </main>
    </div>
  );
}