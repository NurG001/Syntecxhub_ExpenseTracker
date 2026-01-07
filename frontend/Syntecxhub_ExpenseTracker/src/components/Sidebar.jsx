import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Wallet, ReceiptText, 
  LogOut, Settings, X 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext'; //
import EditProfileModal from './EditProfileModal';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth(); //
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); //
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Income', path: '/income', icon: Wallet },
    { name: 'Expense', path: '/expense', icon: ReceiptText },
  ];

  return (
    <>
      {/* Mobile Overlay: Dims background when menu is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-60 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-70 w-72 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 lg:static lg:block
        bg-[#0F172A] text-white min-h-screen border-r border-slate-800 flex flex-col font-poppins
      `}>
        
        {/* Mobile Close Button */}
        <button onClick={toggleSidebar} className="lg:hidden absolute top-6 right-6 text-slate-400 hover:text-white">
          <X size={24} />
        </button>

        {/* Project Branding Header */}
        <div className="px-10 pt-10 pb-4">
          <h1 className="text-xl font-black text-white tracking-tight leading-tight">
            EXPENSE<span className="text-[#7B61FF]">TRACKER</span>
          </h1>
        </div>

        {/* Profile Section with visual Avatar */}
        <div className="p-10 pt-6 flex flex-col items-center border-b border-slate-800/50 mb-4">
          <div onClick={() => setIsProfileModalOpen(true)} className="relative group cursor-pointer">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-slate-700 shadow-md group-hover:border-[#7B61FF]/40 transition-all">
              <img 
                src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.fullName || 'User'}`} 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 bg-[#7B61FF] text-white p-1.5 rounded-full border-2 border-[#0F172A] shadow-sm">
              <Settings size={12} />
            </div>
          </div>
          
          <h3 className="mt-4 font-black text-white text-lg text-center tracking-tight">
            {user?.fullName || "User"}
          </h3>
          <button 
            onClick={() => setIsProfileModalOpen(true)}
            className="text-[10px] font-bold uppercase text-[#7B61FF] mt-1 hover:underline tracking-widest"
          >
            Edit Profile
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-6 space-y-2 mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => window.innerWidth < 1024 && toggleSidebar()} // Close menu on select (mobile)
              className={({ isActive }) =>
                `flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                  isActive 
                  ? 'bg-[#7B61FF] text-white shadow-lg shadow-purple-900/40' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`
              }
            >
              <item.icon size={22} />
              <span>{item.name}</span>
            </NavLink>
          ))}

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all text-left mt-auto mb-4"
          >
            <LogOut size={22} />
            <span>Logout</span>
          </button>
        </nav>

        {/* Edit Profile Modal (Using Portal for chart fix) */}
        <EditProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
      </aside>
    </>
  );
};

export default Sidebar;