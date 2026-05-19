'use client';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '@/redux/slices/cartSlice';
import { X, MapPin, CreditCard, ChevronRight, CheckCircle2, ShoppingBag } from 'lucide-react';
import { api } from '@/services/api';

export default function CheckoutModal({ onClose, onOpenUserDashboard }) {
  const dispatch = useDispatch();
  const { cartItems, shippingAddress, paymentMethod, coupon } = useSelector((state) => state.cart);

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review, 4: Success
  const [street, setStreet] = useState(shippingAddress.street || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [phone, setPhone] = useState(shippingAddress.phone || '');
  const [method, setMethod] = useState(paymentMethod || 'Cash on Delivery');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdOrder, setCreatedOrder] = useState(null);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const discountAmount = coupon ? (subtotal * (coupon.discount / 100)) : 0;
  const deliveryFee = subtotal > 1000 ? 0 : 60;
  const totalAmount = subtotal - discountAmount + deliveryFee;

  const handleNextStep = () => {
    if (step === 1) {
      if (!street || !city || !postalCode || !phone) {
        setError('Please enter all shipping details.');
        return;
      }
      setError('');
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');

    const orderData = {
      orderItems: cartItems.map(item => ({
        name: item.name,
        qty: item.qty,
        imageUrl: item.imageUrl,
        price: item.price,
        product: item.product
      })),
      shippingAddress: { street, city, postalCode, phone, country: 'Bangladesh' },
      paymentMethod: method,
      itemsPrice: subtotal,
      taxPrice: 0,
      shippingPrice: deliveryFee,
      totalPrice: totalAmount
    };

    try {
      const order = await api.createOrder(orderData);
      setCreatedOrder(order);
      dispatch(clearCart());
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100 flex-shrink-0">
          <h3 className="font-bold text-slate-900 text-base">
            {step === 4 ? 'Order Placed!' : 'Secure Checkout'}
          </h3>
          {step !== 4 && (
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Steps Indicators */}
        {step < 4 && (
          <div className="flex border-b border-slate-50 bg-slate-50/50 py-3 px-6 text-xs font-bold text-slate-400 gap-4 flex-shrink-0">
            <span className={step === 1 ? 'text-emerald-700' : 'text-slate-700'}>1. Shipping</span>
            <ChevronRight className="h-4 w-4" />
            <span className={step === 2 ? 'text-emerald-700' : step > 2 ? 'text-slate-700' : ''}>2. Payment</span>
            <ChevronRight className="h-4 w-4" />
            <span className={step === 3 ? 'text-emerald-700' : ''}>3. Confirmation</span>
          </div>
        )}

        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2"><MapPin className="h-4 w-4 text-emerald-600" /> Delivery Address</h4>
              
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Street Address / Area (e.g. Gulshan-2, Road 45)"
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 px-4 text-xs outline-none focus:border-emerald-500"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="City (e.g. Dhaka)"
                    className="w-full rounded-2xl border border-slate-200 bg-white py-3 px-4 text-xs outline-none focus:border-emerald-500"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Postal Code"
                    className="w-full rounded-2xl border border-slate-200 bg-white py-3 px-4 text-xs outline-none focus:border-emerald-500"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Contact Mobile Number"
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 px-4 text-xs outline-none focus:border-emerald-500"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2"><CreditCard className="h-4 w-4 text-emerald-600" /> Payment Selection</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { name: 'Cash on Delivery', desc: 'Pay when products arrive.' },
                  { name: 'bKash', desc: 'Secure local mobile finance.' },
                  { name: 'Nagad', desc: 'Instant local post payment.' },
                  { name: 'SSLCommerz', desc: 'Integrated Bangladesh banking gateway.' },
                  { name: 'Stripe', desc: 'Global card services payment.' }
                ].map((m) => (
                  <label
                    key={m.name}
                    className={`flex flex-col p-4 border rounded-2xl cursor-pointer hover:bg-emerald-50/10 transition-colors ${
                      method === m.name ? 'border-emerald-600 bg-emerald-50/10' : 'border-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={m.name}
                        checked={method === m.name}
                        onChange={() => setMethod(m.name)}
                        className="accent-emerald-655"
                      />
                      <span className="text-xs font-bold text-slate-900">{m.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 pl-5.5 mt-1">{m.desc}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <h4 className="text-sm font-bold text-slate-800">Final Order Verification</h4>

              {/* Items List */}
              <div className="border border-slate-100 rounded-2xl divide-y divide-slate-50 bg-slate-50/20 max-h-[180px] overflow-y-auto p-2">
                {cartItems.map((item) => (
                  <div key={item.product} className="flex justify-between items-center py-2 px-3 text-xs">
                    <span className="text-slate-600 font-semibold truncate max-w-[300px]">{item.name} x {item.qty}</span>
                    <span className="font-extrabold text-slate-950">{(item.price * item.qty).toLocaleString()} BDT</span>
                  </div>
                ))}
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/30">
                  <h5 className="font-bold text-slate-800 mb-2">Shipping To</h5>
                  <p className="text-slate-500">{street}, {city}, {postalCode}</p>
                  <p className="text-slate-500 font-bold mt-1">Ph: {phone}</p>
                </div>
                <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/30">
                  <h5 className="font-bold text-slate-800 mb-2">Payment Method</h5>
                  <p className="text-slate-500">{method}</p>
                  <p className="text-slate-400 text-[10px] mt-1">Status: Paid at delivery / instant verification</p>
                </div>
              </div>

              {/* Total calculations */}
              <div className="border-t border-slate-100 pt-4 space-y-2 text-xs text-slate-500">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-900">{subtotal.toLocaleString()} BDT</span>
                </div>
                {coupon && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Coupon Discount (-{coupon.discount}%)</span>
                    <span>-{discountAmount.toLocaleString()} BDT</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span>{deliveryFee === 0 ? 'FREE' : `${deliveryFee} BDT`}</span>
                </div>
                <div className="flex justify-between text-sm font-black border-t border-slate-100 pt-3 text-slate-950">
                  <span>Total Payable</span>
                  <span className="text-emerald-700">{totalAmount.toLocaleString()} BDT</span>
                </div>
              </div>
            </div>
          )}

          {step === 4 && createdOrder && (
            <div className="flex flex-col items-center justify-center text-center py-8 space-y-4 animate-in zoom-in duration-300">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 animate-bounce">
                <CheckCircle2 className="h-10 w-10" />
              </span>
              <div>
                <h4 className="text-lg font-black text-slate-900">Your Skincare is Booked!</h4>
                <p className="text-xs text-slate-400 mt-1">Order Ref: <span className="font-extrabold text-slate-650 text-emerald-700">{createdOrder._id}</span></p>
              </div>

              <div className="border border-emerald-100 rounded-3xl p-6 bg-emerald-50/10 w-full max-w-sm space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">Order Delivery Roadmap</h5>
                {/* Steppers */}
                <div className="flex justify-between text-[10px] font-bold text-emerald-800 gap-2">
                  <div className="flex flex-col items-center">
                    <span className="h-5 w-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">1</span>
                    <span className="mt-1">Booked</span>
                  </div>
                  <div className="h-0.5 bg-emerald-200 flex-1 self-center" />
                  <div className="flex flex-col items-center text-slate-400">
                    <span className="h-5 w-5 rounded-full bg-slate-200 flex items-center justify-center">2</span>
                    <span className="mt-1">Shipped</span>
                  </div>
                  <div className="h-0.5 bg-slate-200 flex-1 self-center" />
                  <div className="flex flex-col items-center text-slate-400">
                    <span className="h-5 w-5 rounded-full bg-slate-200 flex items-center justify-center">3</span>
                    <span className="mt-1">Arrived</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 w-full justify-center">
                <button
                  onClick={() => { onClose(); onOpenUserDashboard(); }}
                  className="rounded-full border border-emerald-600 text-emerald-700 font-bold px-6 py-2.5 text-xs hover:bg-emerald-50 transition-all cursor-pointer"
                >
                  Track in Profile
                </button>
                <button
                  onClick={onClose}
                  className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 text-xs shadow-md transition-all cursor-pointer"
                >
                  Back to Shop
                </button>
              </div>
            </div>
          )}

          {error && <p className="text-xs text-red-600 text-center">{error}</p>}
        </div>

        {/* Footer actions */}
        {step < 4 && (
          <div className="flex justify-between p-6 border-t border-slate-100 bg-slate-50 flex-shrink-0">
            <button
              onClick={() => {
                if (step > 1) setStep(step - 1);
                else onClose();
              }}
              className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all"
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </button>
            <button
              onClick={step === 3 ? handlePlaceOrder : handleNextStep}
              disabled={loading}
              className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 text-xs font-bold shadow-md active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
            >
              {loading ? 'Processing...' : step === 3 ? 'Place Order' : 'Next Step'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
