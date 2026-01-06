// src/components/Input.tsx – FIXED FOR LAPTOP: FULL-WIDTH, MONNIFY FOCUS GLOW
import React from "react";

interface InputProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

const Input: React.FC<InputProps> = ({ placeholder, value, onChange, type = "text" }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-6 py-4 bg-[#124458] border border-[#063A4F]/30 rounded-xl text-[#F9FBFD] placeholder-[#F9FBFD]/60 focus:outline-none focus:border-[#FDB515] focus:ring-4 focus:ring-[#FDB515]/30 transition-all duration-300 font-oxygen"
    />
  );
};

export default Input;