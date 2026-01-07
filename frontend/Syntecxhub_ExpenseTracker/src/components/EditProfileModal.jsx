import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import api from '../services/api'; //
import { useAuth } from '../context/AuthContext'; //
import { X } from 'lucide-react';

const AVATAR_STYLES = [
  'avataaars', 'personas', 'notionists', 'adventurer', 'lorelei', 
  'bottts', 'pixel-art', 'fun-emoji', 'open-peeps', 'big-ears', 
  'big-smile', 'croodles', 'miniavs', 'shapes'
];

const EditProfileModal = ({ isOpen, onClose }) => {
  const { user, login } = useAuth(); //
  const [fullName, setFullName] = useState("");
  const [selectedStyle, setSelectedStyle] = useState('avataaars');
  const [loading, setLoading] = useState(false);

  // Sync state with user data
  useEffect(() => {
    if (user && isOpen) setFullName(user.fullName);
  }, [user, isOpen]);

  // Generate the actual URL that will be saved to MongoDB
  const currentAvatarUrl = `https://api.dicebear.com/9.x/${selectedStyle}/svg?seed=${fullName || 'default'}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.put('/auth/profile', { 
        fullName, 
        avatar: currentAvatarUrl 
      }); //
      
      login(response.data, response.data.token); // Update global state
      onClose();
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || "Update failed"));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
      <div className="bg-white p-10 rounded-[3rem] w-full max-w-lg shadow-2xl relative animate-in fade-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 transition-colors">
          <X size={28} />
        </button>
        
        <h2 className="text-3xl font-black mb-10 text-center text-slate-900 tracking-tight">Edit Profile</h2>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Visual Avatar Selection Grid */}
          <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
            <div className="flex flex-col items-center gap-6">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white scale-110">
                <img src={currentAvatarUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
              
              <div className="w-full mt-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 text-center">Choose Your Style</p>
                <div className="flex gap-4 overflow-x-auto pb-4 px-2 scrollbar-hide snap-x">
                  {AVATAR_STYLES.map(style => (
                    <button 
                      key={style}
                      type="button"
                      onClick={() => setSelectedStyle(style)}
                      className={`shrink-0 w-20 h-20 rounded-2xl border-2 transition-all snap-center bg-white ${
                        selectedStyle === style ? 'border-[#7B61FF] shadow-lg scale-105' : 'border-transparent opacity-60 grayscale hover:grayscale-0 hover:opacity-100'
                      }`}
                    >
                      <img src={`https://api.dicebear.com/9.x/${style}/svg?seed=preview`} alt={style} className="w-full h-full p-2" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Full Name Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Full Name</label>
            <input 
              type="text"
              className="w-full p-6 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-[#7B61FF] focus:bg-white outline-none transition-all font-bold text-slate-800"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your name..."
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-6 bg-[#7B61FF] text-white rounded-3xl font-black text-lg shadow-xl shadow-purple-200 hover:bg-[#6446FF] transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>,
    document.body // Critical Portal fix for chart overlapping
  );
};

export default EditProfileModal;