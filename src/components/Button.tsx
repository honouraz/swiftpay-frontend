// src/components/Button.tsx — FIXED, NO MORE ERROR
import React from "react";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  type?: "button" | "submit";
  loading?: boolean;        // ← THIS ONE WAS MISSING
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  text, 
  onClick, 
  type = "button", 
  loading = false, 
  className = "" 
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className={`w-full py-4 px-8 rounded-xl font-bold text-xl text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transform transition-all duration-300 hover:scale-105 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? "Processing..." : text}
    </button>
  );
};

export default Button;