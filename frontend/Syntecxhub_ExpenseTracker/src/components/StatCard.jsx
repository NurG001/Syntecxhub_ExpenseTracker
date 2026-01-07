import React from 'react';
import { CreditCard, Wallet, ReceiptText } from 'lucide-react';

const StatCard = ({ title, amount, iconType, color }) => {
  const getIcon = () => {
    switch (iconType) {
      case 'balance':
        return <CreditCard size={24} className="text-white" />;
      case 'income':
        return <Wallet size={24} className="text-white" />;
      case 'expense':
        return <ReceiptText size={24} className="text-white" />;
      default:
        return <CreditCard size={24} className="text-white" />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-md transition-all">
      <div 
        className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"
        style={{ backgroundColor: color }}
      >
        {getIcon()}
      </div>

      <div className="flex flex-col">
        <span className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">
          {title}
        </span>
        <span className="text-3xl font-black text-slate-900 tracking-tight">
          ${amount?.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
        </span>
      </div>
    </div>
  );
};

export default StatCard;