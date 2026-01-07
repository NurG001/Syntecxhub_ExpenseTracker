import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) return <div className="p-10 font-poppins text-slate-400 text-center">Loading...</div>;

  // If no token exists, send user back to login
  return token ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;