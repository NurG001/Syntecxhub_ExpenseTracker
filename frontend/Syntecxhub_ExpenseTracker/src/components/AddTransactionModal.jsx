import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { X, Calendar, DollarSign, Type, Loader2, Smile } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const AddTransactionModal = ({ isOpen, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    text: '',
    amount: '',
    type: 'income', // Defaulting to income as per your current task
    date: new Date().toISOString().split('T')[0],
    category: 'Income',
    icon: '💰'
  });
  
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  /**
   * ✅ FIXED: Emoji Selection Handler
   * Specifically targets the emoji property to ensure state updates.
   */
  const onEmojiClick = (emojiData) => {
    setFormData(prev => ({ ...prev, icon: emojiData.emoji }));
    setShowEmojiPicker(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const numericAmount = Math.abs(Number(formData.amount));
      const finalAmount = formData.type === 'expense' ? -numericAmount : numericAmount;

      const payload = {
        text: formData.text,
        amount: finalAmount,
        category: formData.category,
        date: formData.date,
        icon: formData.icon // ✅ Icon now included in the payload
      };

      await api.post('/transactions', payload);
      toast.success("Income added successfully!");
      
      onRefresh(); 
      onClose();
      
      // Reset form to default values
      setFormData({ 
        text: '', 
        amount: '', 
        type: 'income', 
        date: new Date().toISOString().split('T')[0], 
        category: 'Income', 
        icon: '💰' 
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 relative">
        <button onClick={onClose} className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 transition-colors">
          <X size={24} />
        </button>

        <h2 className="text-2xl font-black mb-6 text-slate-900 text-center">Add Income</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Type Toggle */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl">
            <button
              type="button"
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${formData.type === 'income' ? 'bg-white text-primary shadow-sm' : 'text-slate-400'}`}
              onClick={() => setFormData({ ...formData, type: 'income', category: 'Income', icon: '💰' })}
            > Income </button>
            <button
              type="button"
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${formData.type === 'expense' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
              onClick={() => setFormData({ ...formData, type: 'expense', category: 'Expense', icon: '💸' })}
            > Expense </button>
          </div>

          <div className="flex gap-3">
            <div className="relative">
              {/* ✅ Interactive Emoji Button */}
              <button
                type="button"
                className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl hover:bg-slate-100 transition-colors border border-slate-100"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              > 
                {formData.icon} 
              </button>
              
              {showEmojiPicker && (
                <div className="absolute top-16 left-0 z-50 shadow-2xl rounded-2xl overflow-hidden border border-slate-100">
                  <EmojiPicker 
                    onEmojiClick={onEmojiClick} 
                    previewConfig={{ showPreview: false }}
                    searchDisabled={true}
                    skinTonesDisabled={true}
                    height={350}
                    width={280}
                  />
                </div>
              )}
            </div>
            
            <div className="flex-1 relative">
              <Type className="absolute left-4 top-4 text-slate-300" size={20} />
              <input
                type="text" 
                placeholder="Source (e.g., Freelance, Salary)" 
                required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none"
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              />
            </div>
          </div>

          <div className="relative">
            <DollarSign className="absolute left-4 top-4 text-slate-300" size={20} />
            <input
              type="number" 
              placeholder="Amount" 
              required
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
          </div>

          <div className="relative">
            <Calendar className="absolute left-4 top-4 text-slate-300" size={20} />
            <input
              type="date" 
              required
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <button
            disabled={loading}
            className={`w-full py-5 rounded-3xl font-black text-white transition-all active:scale-95 flex items-center justify-center gap-2 ${formData.type === 'income' ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-black shadow-lg shadow-black/10'}`}
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Confirm Income'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;