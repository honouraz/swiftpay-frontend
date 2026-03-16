// src/components/Navbar.tsx – INTEGRATED INTO LAYOUT, SO NO NEED FOR SEPARATE; BUT IF KEPT, UPDATE STYLES
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const { isAdmin } = useAuth();

  return (
    <nav className="bg-[#063A4F]/90 text-[#F9FBFD] p-4 flex justify-between font-rubik">
      <div className="font-bold text-xl">SWIFTPAY</div>
      <ul><div className="space-x-4">
        <p><Link to="/dashoard" className="hover:text-[#FDB515] transition">Dashboard - -</Link></p>
        <Link to="/profile" className="hover:text-[#FDB515] transition">Profile - - </Link>
        <Link to="/payment" className="hover:text-[#FDB515] transition">Pay</Link>
        {isAdmin && (
          <Link to="/admin" className="text-[#FDB515] font-semibold hover:text-[#F05822] transition">Admin Panel</Link>
        )}
      </div></ul>
    </nav>
  );
};

export default Navbar;