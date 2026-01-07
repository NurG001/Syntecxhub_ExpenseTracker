import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../services/api'; 
import { useAuth } from '../../context/AuthContext'; 

import authSideImg from '../../assets/img/auth-bg.png'; 

export default function Login() {
  // ✅ 1. Initialize email from localStorage if it exists
  const savedEmail = localStorage.getItem('rememberedEmail') || '';
  
  const [formData, setFormData] = useState({ email: savedEmail, password: '' });
  const [rememberMe, setRememberMe] = useState(!!savedEmail); // ✅ 2. Set initial checkbox state
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', formData);
      
      // ✅ 3. Persistence Logic
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      login(data, data.token);
      toast.success(`Welcome back, ${data.fullName}!`);
      navigate('/'); 
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FD] p-4 md:p-6 font-poppins">
      <div className="flex w-full bg-white rounded-[40px] shadow-sm overflow-hidden border border-slate-100">
        
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-20 lg:px-24">
          <div className="mb-10">
            <h1 className="text-xl font-black mb-10 tracking-tight text-slate-900 uppercase">
                Expense<span className="text-[#7B61FF]">Tracker</span>
            </h1>
            <h2 className="text-4xl font-black text-slate-900 mb-2 leading-tight">Welcome Back</h2>
            <p className="text-slate-400 font-medium">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  type="email" placeholder="mike@example.com" required
                  className="w-full pl-12 pr-4 py-5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#7B61FF] outline-none font-bold"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••" required
                  className="w-full pl-12 pr-14 py-5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#7B61FF] outline-none font-bold"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* ✅ 4. Remember Me UI */}
            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-slate-200 text-[#7B61FF] focus:ring-[#7B61FF]" 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)} 
                />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-600">Remember Me</span>
              </label>
              <Link to="/forgot-password" size={10} className="text-[10px] font-black text-[#7B61FF] uppercase hover:underline">Forgot Password?</Link>
            </div>

            <button disabled={loading} className="w-full py-5 bg-[#7B61FF] hover:bg-[#6446FF] text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-purple-100 transition-all active:scale-[0.98]">
              {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Log In'}
            </button>

            <p className="text-center text-sm font-bold text-slate-400 mt-8">
              New here? <Link to="/signup" className="text-[#7B61FF] hover:underline">Create an account</Link>
            </p>
          </form>
        </div>

        <div className="hidden lg:block w-1/2 p-6">
          <div className="h-full w-full rounded-4xl overflow-hidden relative shadow-2xl">
            <img 
              src={authSideImg} 
              alt="Auth Background" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#7B61FF]/60 to-transparent flex flex-col justify-end p-16">
               <h3 className="text-white text-4xl font-black leading-tight">
                  Seamlessly track <br /> every penny.
               </h3>
               <p className="text-white/80 font-medium mt-4">
                  Join thousands of users managing their finances with modern precision.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}