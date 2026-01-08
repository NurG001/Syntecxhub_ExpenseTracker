import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { X, Calendar, DollarSign, Type, Loader2 } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const AddTransactionModal = ({ isOpen, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    text: '',
    amount: '',
    type: 'income',
    date: new Date().toISOString().split('T')[0],
    category: 'Income',
    icon: '💰'
  });

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const onEmojiClick = (emojiData) => {
    setFormData(prev => ({ ...prev, icon: emojiData.emoji }));
    setShowEmojiPicker(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const numericAmount = Math.abs(Number(formData.amount));
      const finalAmount =
        formData.type === 'expense' ? -numericAmount : numericAmount;

      await api.post('/transactions', {
        text: formData.text,
        amount: finalAmount,
        category: formData.category,
        date: formData.date,
        icon: formData.icon
      });

      toast.success(
        `${formData.type === 'income' ? 'Income' : 'Expense'} added successfully!`
      );

      onRefresh();
      onClose();

      setFormData({
        text: '',
        amount: '',
        type: 'income',
        date: new Date().toISOString().split('T')[0],
        category: 'Income',
        icon: '💰'
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 relative">

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 text-slate-400 hover:text-slate-600"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-black mb-6 text-center">
          Add {formData.type === 'income' ? 'Income' : 'Expense'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Income / Expense Toggle (FIXED) */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  type: 'income',
                  category: 'Income',
                  icon: '💰'
                })
              }
              className={`flex-1 py-3 rounded-xl font-semibold transition-all
                ${formData.type === 'income'
                  ? 'bg-primary text-white shadow-md shadow-primary/30'
                  : 'bg-transparent text-slate-400 hover:text-slate-600'}
              `}
            >
              Income
            </button>

            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  type: 'expense',
                  category: 'Expense',
                  icon: '💸'
                })
              }
              className={`flex-1 py-3 rounded-xl font-semibold transition-all
                ${formData.type === 'expense'
                  ? 'bg-black text-white shadow-md shadow-black/30'
                  : 'bg-transparent text-slate-400 hover:text-slate-600'}
              `}
            >
              Expense
            </button>
          </div>

          {/* Emoji + Source */}
          <div className="flex gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEmojiPicker(v => !v);
                }}
                className="w-14 h-14 bg-slate-50 rounded-2xl text-3xl border hover:bg-slate-100"
              >
                {formData.icon}
              </button>

              {showEmojiPicker && (
                <div
                  className="absolute top-16 left-0 z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <EmojiPicker
                    onEmojiClick={onEmojiClick}
                    previewConfig={{ showPreview: false }}
                    searchDisabled
                    skinTonesDisabled
                    height={350}
                    width={280}
                  />
                </div>
              )}
            </div>

            <div className="flex-1 relative">
              <Type className="absolute left-4 top-4 text-slate-300" size={20} />
              <input
                required
                className="w-full pl-12 py-4 bg-slate-50 rounded-2xl focus:ring-2 focus:ring-primary outline-none"
                placeholder="Source (Salary, Freelance, etc.)"
                value={formData.text}
                onChange={(e) =>
                  setFormData({ ...formData, text: e.target.value })
                }
              />
            </div>
          </div>

          {/* Amount */}
          <div className="relative">
            <DollarSign className="absolute left-4 top-4 text-slate-300" size={20} />
            <input
              type="number"
              required
              className="w-full pl-12 py-4 bg-slate-50 rounded-2xl focus:ring-2 focus:ring-primary outline-none"
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
            />
          </div>

          {/* Date */}
          <div className="relative">
            <Calendar className="absolute left-4 top-4 text-slate-300" size={20} />
            <input
              type="date"
              required
              className="w-full pl-12 py-4 bg-slate-50 rounded-2xl focus:ring-2 focus:ring-primary outline-none"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-3xl font-black text-white flex justify-center items-center gap-2 transition-all active:scale-95
              ${formData.type === 'income'
                ? 'bg-primary shadow-lg shadow-primary/30'
                : 'bg-black shadow-lg shadow-black/20'}
            `}
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              `Confirm ${formData.type === 'income' ? 'Income' : 'Expense'}`
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
