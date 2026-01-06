// src/components/Card.tsx – ENHANCED FOR RESPONSIVE: AUTO-WIDTH ON MOBILE/LAPTOP, MONNIFY SHADOW/BLUR
import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = "", glow = false }) => {
  return (
    <div className={`w-full md:w-auto bg-[#F9FBFD]/10 backdrop-blur-xl rounded-2xl border border-[#063A4F]/20 shadow-xl p-6 md:p-8 ${glow ? "shadow-[#00B8C2]/50" : ""} ${className}`}>
      {children}
    </div>
  );
};

export default Card;