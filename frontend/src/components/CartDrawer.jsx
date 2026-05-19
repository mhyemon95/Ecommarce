'use client';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, applyCoupon } from '@/redux/slices/cartSlice';
import { X, Trash2, Plus, Minus, Ticket, CreditCard, Tag } from 'lucide-react';
import { api } from '@/services/api';

export default function CartDrawer({ onClose, onOpenCheckout, onOpenAuth }) {
  const dispatch = useDispatch();
  const { cartItems, coupon } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  // Discount calculation
  const discountAmount = coupon ? (subtotal * (coupon.discount / 100)) : 0;
  const deliveryFee = subtotal > 1000 || subtotal === 0 ? 0 : 60; // 60 BDT delivery fee
  const finalTotal = subtotal - discountAmount + deliveryFee;

  const handleQtyChange = (item, direction) => {
    const newQty = item.qty + direction;
    if (newQty >= 1 && newQty <= item.stock) {
      dispatch(addToCart({ ...item, qty: newQty }));
    }
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      onOpenAuth();
      return;
    }

    if (!couponCode.trim()) {
      setCouponError('Please enter a code.');
      return;
    }

    setValidatingCoupon(true);
    setCouponError('');
    setCouponSuccess('');

    try {
      const result = await api.validateCoupon(couponCode);
      dispatch(applyCoupon({ code: result.code, discount: result.discount }));
      setCouponSuccess(result.message);
      setCouponCode('');
    } catch (err) {
      setCouponError(err.response?.data?.message || err.message || 'Invalid coupon.');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleCheckoutClick = () => {
    if (!userInfo) {
      onOpenAuth();
    } else {
      onClose();
      onOpenCheckout();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      
      {/* Background click overlay */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      {/* Drawer Body */}
      <div className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">Your Basket</span>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800">
              {cartItems.reduce((acc, item) => acc + item.qty, 0)} items
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12 text-slate-400">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-4 animate-bounce">
                <X className="h-8 w-8" />
              </span>
              <h4 className="font-bold text-slate-800 text-sm">Basket is empty</h4>
              <p className="text-xs text-slate-400 mt-1">Start adding premium skincare to reveal your glowing look!</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.product} className="flex gap-4 p-3 border border-slate-100 rounded-2xl bg-slate-50/50 hover:bg-white hover:shadow-md hover:shadow-emerald-950/[0.02] transition-all">
                
                {/* Image */}
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 line-clamp-1">{item.name}</h5>
                    <span className="text-xs font-black text-slate-900 mt-1 block">
                      {item.price.toLocaleString()} BDT
                    </span>
                  </div>

                  {/* Quantity adjustment */}
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => handleQtyChange(item, -1)}
                      className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                      disabled={item.qty <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-xs font-extrabold text-slate-900">{item.qty}</span>
                    <button
                      onClick={() => handleQtyChange(item, 1)}
                      className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                      disabled={item.qty >= item.stock}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => handleRemove(item.product)}
                  className="self-center p-2 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </button>

              </div>
            ))
          )}
        </div>

        {/* Footer Billing calculations */}
        {cartItems.length > 0 && (
          <div className="border-t border-slate-100 p-6 bg-slate-50/50 space-y-4">
            
            {/* Coupon Promo form */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Enter Promo Code (e.g. WELCOME10)"
                  className="w-full rounded-full border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs outline-none focus:border-emerald-500"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <Ticket className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              </div>
              <button
                type="submit"
                disabled={validatingCoupon}
                className="rounded-full bg-emerald-950 hover:bg-emerald-900 px-4 py-2 text-xs font-semibold text-white transition-all active:scale-95 cursor-pointer"
              >
                Apply
              </button>
            </form>

            {couponError && <p className="text-xs text-red-600 pl-1">{couponError}</p>}
            {couponSuccess && <p className="text-xs text-emerald-700 font-medium pl-1">{couponSuccess}</p>}

            {/* Calculations */}
            <div className="space-y-2 text-xs font-medium text-slate-500 pt-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-slate-900">{subtotal.toLocaleString()} BDT</span>
              </div>
              
              {coupon && (
                <div className="flex justify-between text-emerald-700">
                  <span className="flex items-center gap-1"><Tag className="h-3 w-3" /> Discount ({coupon.discount}%)</span>
                  <span>-{discountAmount.toLocaleString()} BDT</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="text-slate-900">
                  {deliveryFee === 0 ? <span className="text-emerald-700">FREE</span> : `${deliveryFee} BDT`}
                </span>
              </div>

              <div className="flex justify-between text-sm font-black border-t border-slate-100 pt-3 text-slate-900">
                <span>Total Amount</span>
                <span className="text-emerald-700">{finalTotal.toLocaleString()} BDT</span>
              </div>
            </div>

            {/* Checkout Action CTA */}
            <button
              onClick={handleCheckoutClick}
              className="w-full flex h-12 items-center justify-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold tracking-wide shadow-lg shadow-emerald-600/10 hover:shadow-xl hover:shadow-emerald-600/25 transition-all cursor-pointer"
            >
              <CreditCard className="h-4.5 w-4.5" />
              Proceed to Checkout
            </button>

          </div>
        )}

      </div>
    </div>
  );
}
