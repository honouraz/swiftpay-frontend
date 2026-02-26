// src/pages/Splash.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login'); // or '/dashboard' if logged in (check later)
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#063A4F] to-[#0A1F2E] relative overflow-hidden">
      {/* Subtle animated orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#00B8C2]/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#FDB515]/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="text-center z-10"
      >
        <h1 className="text-8xl md:text-10xl font-rubik font-extrabold bg-gradient-to-r from-[#00B8C2] via-[#FDB515] to-[#F05822] bg-clip-text text-transparent drop-shadow-2xl">
          🌟 Swiftpay
        </h1>
        <p className="text-2xl md:text-4xl text-[#F9FBFD]/80 mt-6 font-oxygen tracking-wide">
          powered by SWIFTTECH'26
        </p>
        <p className="text-xl text-[#F9FBFD]/60 mt-4">Pay Dues. Fast. Secure. Student-First.</p>
      </motion.div>
    </div>
  );
};

export default Splash;