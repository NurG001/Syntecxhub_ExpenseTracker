import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../services/api'; //
import { useAuth } from '../../context/AuthContext'; //

// Ensure the path to your local asset is correct
import authSideImg from '../../assets/img/auth-bg.png'; 

const AVATAR_STYLES = ['avataaars', 'personas', 'notionists', 'adventurer', 'lorelei', 'bottts', 'pixel-art'];

export default function SignUp() {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [selectedStyle, setSelectedStyle] = useState('avataaars');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); //
  const navigate = useNavigate();

  // Generate the avatar URL dynamically based on name and style
  const currentAvatarUrl = `https://api.dicebear.com/9.x/${selectedStyle}/svg?seed=${formData.fullName || 'default'}`;

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // ✅ Sends registration data including the chosen avatar URL
      const { data } = await api.post('/auth/register', {
        ...formData,
        avatar: currentAvatarUrl
      });

      // ✅ Auto-login after successful registration
      login(data, data.token);
      toast.success("Account created! Welcome to SyntecxHub.");
      
      // ✅ Redirect to success page or dashboard
      navigate('/success'); 
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FD] p-4 md:p-6 font-poppins">
      <div className="flex w-full bg-white rounded-[40px] shadow-sm overflow-hidden border border-slate-100">
        
        {/* --- Left Form Section --- */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-20 lg:px-24 py-12">
          <div className="mb-8">
            <h1 className="text-xl font-black mb-8 tracking-tight text-slate-900 uppercase">
                Expense_ <span className="text-[#7B61FF]">Tracker</span>
            </h1>
            <h2 className="text-4xl font-black text-slate-900 mb-2 leading-tight">Create Account</h2>
            <p className="text-slate-400 font-medium">Join us today by entering your details below.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            
            {/* --- Avatar Selection Grid --- */}
            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden bg-white shrink-0">
                  <img src={currentAvatarUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {AVATAR_STYLES.map(style => (
                    <button 
                      key={style}
                      type="button"
                      onClick={() => setSelectedStyle(style)}
                      className={`w-12 h-12 rounded-xl border-2 transition-all shrink-0 bg-white p-1 ${
                        selectedStyle === style ? 'border-[#7B61FF] shadow-sm scale-105' : 'border-transparent opacity-50'
                      }`}
                    >
                      <img src={`https://api.dicebear.com/9.x/${style}/svg?seed=preview`} alt={style} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Name Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  type="text" placeholder="Mike William" required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#7B61FF] outline-none font-bold"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  type="email" placeholder="mike@example.com" required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#7B61FF] outline-none font-bold"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••" required minLength={6}
                  className="w-full pl-12 pr-14 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#7B61FF] outline-none font-bold"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button disabled={loading} className="w-full py-5 bg-[#7B61FF] hover:bg-[#6446FF] text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-purple-100 transition-all active:scale-[0.98]">
              {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Create Account'}
            </button>

            {/* ✅ Added Login Link */}
            <p className="text-center text-sm font-bold text-slate-400 mt-6">
              Already have an account? <Link to="/login" className="text-[#7B61FF] hover:underline">Log In</Link>
            </p>
          </form>
        </div>

        {/* --- Right Visual Section (Matches Login) --- */}
        <div className="hidden lg:block w-1/2 p-6">
          <div className="h-full w-full rounded-4xl overflow-hidden relative shadow-2xl">
            <img 
              src={authSideImg} 
              alt="Auth Background" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#7B61FF]/60 to-transparent flex flex-col justify-end p-16">
               <h3 className="text-white text-4xl font-black leading-tight"> Master your money <br /> with modern precision. </h3>
               <p className="text-white/80 font-medium mt-4"> Join ExpenseTracker to track expenses, manage income, and reach your goals. </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}