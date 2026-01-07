import React from 'react';

const AuthLayout = ({ children }) => {
  const currentYear = new Date().getFullYear();
  
  // You can change this URL to any image you prefer
  const bgImageUrl = "https://wallpaperaccess.com/full/2008050.jpg";

  return (
    <div 
      className="w-full min-h-screen font-poppins flex flex-col overflow-x-hidden bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${bgImageUrl})` }}
    >
      {/* Dark Overlay: Ensures the white container and footer text are readable */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"></div>

      {/* Main Content Area: Centers the single rounded container */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 lg:p-12 relative z-10">
        
        {/* ✅ THE SINGLE CONTAINER */}
        <div className="w-full max-w-7xl bg-white/95 rounded-[3.5rem] shadow-2xl flex flex-col lg:flex-row overflow-hidden min-h-[85vh] border border-white/20 backdrop-blur-md">
          {children}
        </div>
      </main>

      {/* ✅ THE SINGLE FOOTER */}
      <footer className="w-full py-8 relative z-10">
        <p className="text-center text-[10px] md:text-xs font-bold text-white uppercase tracking-[0.2em] drop-shadow-md">
          © {currentYear} SYNTECXHUB. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </div>
  );
};

export default AuthLayout;