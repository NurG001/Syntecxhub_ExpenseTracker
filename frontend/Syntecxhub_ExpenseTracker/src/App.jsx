import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { TransactionProvider } from "./context/TransactionContext";

// Layouts
import AuthLayout from "./components/layout/AuthLayout";

// Page Imports
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Success from "./pages/Auth/Success"; // ✅ Newly added Success page
import Home from "./pages/Dashboard/Home";
import Income from "./pages/Dashboard/Income";
import Expense from "./pages/Dashboard/Expense";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <TransactionProvider>
          {/* Notification system for feedback */}
          <Toaster 
            position="top-right" 
            toastOptions={{ 
              style: { fontFamily: 'Poppins, sans-serif', borderRadius: '1rem' } 
            }} 
          />

          <Routes>
            {/* --- 1. Wrapped Authentication Routes --- */}
            {/* All auth routes share the single white rounded container from AuthLayout */}
            
            <Route 
              path="/login" 
              element={
                <AuthLayout>
                  <Login />
                </AuthLayout>
              } 
            />
            
            <Route 
              path="/signup" 
              element={
                <AuthLayout>
                  <SignUp />
                </AuthLayout>
              } 
            />

            {/* ✅ Added Success Route: Triggered after successful registration */}
            <Route 
              path="/success" 
              element={
                <AuthLayout>
                  <Success />
                </AuthLayout>
              } 
            />

            {/* --- 2. Protected Dashboard Routes --- */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/income" 
              element={
                <ProtectedRoute>
                  <Income />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/expense" 
              element={
                <ProtectedRoute>
                  <Expense />
                </ProtectedRoute>
              } 
            />

            {/* Default Navigation Logic */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </TransactionProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;