// src/pages/Register.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(email, password, name);
      toast.success('Account created! Welcome to SwiftPay 🔥');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <motion.h1
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-6xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 to-yellow-400 bg-clip-text text-transparent mb-4"
          >
            SwiftPay
          </motion.h1>
          <p className="text-lg opacity-80">Join the fastest student dues platform</p>
        </div>

        <div className={`rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-xl border
          dark:bg-gray-900/60 dark:border-cyan-500/20 
          bg-white/70 border-purple-200/40`}>
          
          <form onSubmit={handleRegister} className="space-y-6">
            <Input
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              className="w-full py-5 rounded-2xl bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-bold text-xl shadow-xl hover:shadow-2xl transition-all disabled:opacity-60"
            >
              {loading ? 'Creating...' : 'CREATE ACCOUNT'}
            </motion.button>
          </form>

          <p className="text-center mt-8 opacity-80">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-cyan-400 hover:text-cyan-300 transition">
              Login here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;