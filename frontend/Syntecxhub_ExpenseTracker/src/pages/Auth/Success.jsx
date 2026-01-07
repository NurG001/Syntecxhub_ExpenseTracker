import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import AuthLayout from "../../components/layout/AuthLayout";

export default function Success() {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col items-center justify-center p-8 md:p-16 lg:p-24 bg-white text-center">
      <div className="max-w-md w-full space-y-8">
        {/* Success Icon with Animation */}
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center animate-bounce-slow">
            <CheckCircle className="text-green-500" size={64} />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-4xl font-black text-slate-900 leading-tight">
            Account Created!
          </h1>
          <p className="text-slate-400 font-medium text-lg">
            Your journey to better financial tracking starts here. Your account has been successfully set up.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => navigate('/login')}
          className="w-full flex items-center justify-center gap-2 py-5 bg-[#E6D9FF] hover:bg-primary text-primary hover:text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all active:scale-95 shadow-sm group"
        >
          Proceed to Login
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>

        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest pt-4">
          Expense Tracker • MERN Stack Project
        </p>
      </div>
    </div>
  );
}