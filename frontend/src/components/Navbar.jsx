'use client';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/redux/slices/authSlice';
import { ShoppingBag, Search, User, Heart, LogOut, Grid, Settings } from 'lucide-react';

export default function Navbar({
  activeCategory,
  setActiveCategory,
  searchKeyword,
  setSearchKeyword,
  onOpenCart,
  onOpenAuth,
  onOpenUserDashboard,
  onOpenAdminDashboard
}) {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const [showDropdown, setShowDropdown] = useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const handleLogout = () => {
    dispatch(logout());
    setShowDropdown(false);
    window.location.reload();
  };

  const categories = [
    { name: 'All', value: '' },
    { name: 'Facewash', value: 'Facewash' },
    { name: 'Serum', value: 'Serum' },
    { name: 'Cream', value: 'Cream' },
    { name: 'Sunscreen', value: 'Sunscreen' }
  ];

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-emerald-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setActiveCategory(''); setSearchKeyword(''); }}>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md shadow-emerald-200">
              <ShoppingBag className="h-5 w-5" />
            </span>
            <span className="text-xl font-bold tracking-wider text-emerald-950">
              AURA<span className="text-emerald-600">GLOW</span>
            </span>
          </div>

          {/* Search bar */}
          <div className="hidden max-w-md flex-1 sm:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search premium skincare..."
                className="w-full rounded-full border border-emerald-100 bg-emerald-50/30 py-2 pl-10 pr-4 text-sm text-emerald-950 placeholder-emerald-400 outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-500"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
              <Search className="absolute left-3.5 top-2.5 h-4.5 w-4.5 text-emerald-400" />
            </div>
          </div>

          {/* User Controls */}
          <div className="flex items-center gap-4">
            
            {/* Wishlist Button (Simple indicator) */}
            <button className="relative p-2 text-slate-500 hover:text-rose-500 transition-colors">
              <Heart className="h-6 w-6" />
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2 text-slate-600 hover:text-emerald-600 transition-colors"
            >
              <ShoppingBag className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white ring-2 ring-white animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth Dropdown */}
            <div className="relative">
              {userInfo ? (
                <div>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50/50 py-1.5 px-3 text-sm font-medium text-emerald-900 transition-all hover:bg-emerald-100/50"
                  >
                    <User className="h-4 w-4 text-emerald-600" />
                    <span className="max-w-[80px] truncate">{userInfo.name}</span>
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-emerald-100 bg-white p-2 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-3 py-2 text-xs font-semibold text-emerald-900 border-b border-slate-50">
                        Welcome, {userInfo.name}!
                      </div>
                      
                      <button
                        onClick={() => { setShowDropdown(false); onOpenUserDashboard(); }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                      >
                        <User className="h-4 w-4" />
                        My Profile
                      </button>

                      {userInfo.role === 'admin' && (
                        <button
                          onClick={() => { setShowDropdown(false); onOpenAdminDashboard(); }}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-amber-700 hover:bg-amber-50 transition-colors"
                        >
                          <Settings className="h-4 w-4" />
                          Admin Console
                        </button>
                      )}

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-1.5 rounded-full bg-emerald-950 hover:bg-emerald-900 py-1.5 px-4 text-sm font-semibold text-white shadow-md shadow-emerald-900/10 transition-all active:scale-95"
                >
                  <User className="h-4 w-4" />
                  Sign In
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Mobile Search and Category Bar */}
        <div className="border-t border-emerald-50 py-3 block sm:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full rounded-full border border-emerald-100 bg-emerald-50/20 py-2 pl-9 pr-4 text-sm text-emerald-950 placeholder-emerald-400 outline-none"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-emerald-400" />
          </div>
        </div>

        {/* Category Navigation Bar */}
        <div className="flex items-center gap-1 overflow-x-auto py-2.5 border-t border-emerald-50/50 scrollbar-none">
          <Grid className="h-4 w-4 text-emerald-500 mr-2 flex-shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => {
                setActiveCategory(cat.value);
                setSearchKeyword('');
              }}
              className={`rounded-full px-4.5 py-1 text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer whitespace-nowrap ${
                (activeCategory === cat.value && searchKeyword === '')
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

      </div>
    </nav>
  );
}
