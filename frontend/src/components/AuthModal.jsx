'use client';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess, setLoading, setError } from '@/redux/slices/authSlice';
import { X, Lock, Mail, User, CheckCircle, ShieldCheck } from 'lucide-react';
import { api } from '@/services/api';

export default function AuthModal({ onClose }) {
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState('login'); // login | register | otp
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  
  const [loadingLocal, setLoadingLocal] = useState(false);
  const [errorLocal, setErrorLocal] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorLocal('Please enter all fields.');
      return;
    }

    setLoadingLocal(true);
    setErrorLocal('');
    dispatch(setLoading(true));

    try {
      const data = await api.login({ email, password });
      dispatch(loginSuccess(data));
      onClose();
      window.location.reload();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed.';
      setErrorLocal(msg);
      dispatch(setError(msg));
    } finally {
      setLoadingLocal(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setErrorLocal('Please enter all fields.');
      return;
    }

    setLoadingLocal(true);
    setErrorLocal('');

    try {
      const result = await api.register({ name, email, password });
      setSuccessMessage(result.message);
      setActiveTab('otp'); // Switch to OTP verification state
    } catch (err) {
      setErrorLocal(err.response?.data?.message || err.message || 'Registration failed.');
    } finally {
      setLoadingLocal(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) {
      setErrorLocal('Please enter the 6-digit verification code.');
      return;
    }

    setLoadingLocal(true);
    setErrorLocal('');

    try {
      const data = await api.verifyOTP(email, otp);
      dispatch(loginSuccess(data));
      setSuccessMessage('Account verified successfully!');
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 1500);
    } catch (err) {
      setErrorLocal(err.response?.data?.message || err.message || 'OTP verification failed.');
    } finally {
      setLoadingLocal(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 duration-300">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors animate-pulse"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Content */}
        <div className="p-8">
          
          {/* Logo brand */}
          <div className="flex flex-col items-center text-center mb-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-100 mb-2">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {activeTab === 'otp' ? 'Secure Verification' : 'Welcome to AuraGlow'}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-[280px]">
              {activeTab === 'login' && 'Sign in to access your premium skincare dashboard.'}
              {activeTab === 'register' && 'Create your account to unlock free deliveries & organic perks.'}
              {activeTab === 'otp' && 'Verify your account using the 6-digit OTP code sent.'}
            </p>
          </div>

          {/* Tab Selection */}
          {activeTab !== 'otp' && (
            <div className="flex border border-slate-100 rounded-full bg-slate-50/50 p-1 mb-6">
              <button
                onClick={() => { setActiveTab('login'); setErrorLocal(''); }}
                className={`flex-1 rounded-full py-2 text-xs font-bold transition-all ${
                  activeTab === 'login'
                    ? 'bg-white text-emerald-950 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setActiveTab('register'); setErrorLocal(''); }}
                className={`flex-1 rounded-full py-2 text-xs font-bold transition-all ${
                  activeTab === 'register'
                    ? 'bg-white text-emerald-950 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Join Now
              </button>
            </div>
          )}

          {/* Form Content */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-xs outline-none focus:border-emerald-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-400" />
              </div>

              <div className="relative">
                <input
                  type="password"
                  placeholder="Password (password123)"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-xs outline-none focus:border-emerald-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-400" />
              </div>

              {errorLocal && <p className="text-xs text-red-600 pl-1">{errorLocal}</p>}

              <button
                type="submit"
                disabled={loadingLocal}
                className="w-full h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold tracking-wide shadow-md shadow-emerald-600/10 active:scale-95 transition-all cursor-pointer"
              >
                {loadingLocal ? 'Signing in...' : 'Sign In'}
              </button>

              <div className="text-center pt-2">
                <span className="text-[10px] text-slate-400">
                  Quick Login Demo: email <span className="font-bold text-slate-600">customer@ecommarce.com</span> or <span className="font-bold text-slate-600">admin@ecommarce.com</span> (pw: <span className="font-bold text-slate-600">password123</span>)
                </span>
              </div>
            </form>
          )}

          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-xs outline-none focus:border-emerald-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <User className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-400" />
              </div>

              <div className="relative">
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-xs outline-none focus:border-emerald-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-400" />
              </div>

              <div className="relative">
                <input
                  type="password"
                  placeholder="Create Password"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-xs outline-none focus:border-emerald-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-400" />
              </div>

              {errorLocal && <p className="text-xs text-red-600 pl-1">{errorLocal}</p>}

              <button
                type="submit"
                disabled={loadingLocal}
                className="w-full h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold tracking-wide shadow-md active:scale-95 transition-all cursor-pointer"
              >
                {loadingLocal ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          )}

          {activeTab === 'otp' && (
            <form onSubmit={handleVerifyOTP} className="space-y-4 animate-in slide-in-from-bottom duration-300">
              
              {successMessage && (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-3 text-center text-emerald-800 text-xs font-semibold mb-4">
                  {successMessage}
                </div>
              )}

              <div className="text-center mb-2">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/50 rounded-full px-3 py-1">
                  DEV TEST OTP BYPASS CODE IS: 123456
                </span>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter 6-Digit OTP Code (123456)"
                  maxLength="6"
                  required
                  className="w-full text-center tracking-widest text-lg font-black rounded-2xl border border-slate-200 bg-white py-3 outline-none focus:border-emerald-500"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>

              {errorLocal && <p className="text-xs text-red-600 text-center">{errorLocal}</p>}

              <button
                type="submit"
                disabled={loadingLocal}
                className="w-full h-12 rounded-full bg-emerald-650 hover:bg-emerald-700 bg-emerald-950 text-white font-bold tracking-wide shadow-md active:scale-95 transition-all cursor-pointer"
              >
                {loadingLocal ? 'Verifying...' : 'Verify OTP Code'}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
