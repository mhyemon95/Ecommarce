'use client';

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserSuccess } from '@/redux/slices/authSlice';
import { X, User, MapPin, Package, Heart, RefreshCw, ShieldCheck, MapPinIcon, Info } from 'lucide-react';
import { api } from '@/services/api';

export default function UserDashboardModal({ onClose }) {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('orders'); // orders | profile | addresses
  const [name, setName] = useState(userInfo?.name || '');
  const [password, setPassword] = useState('');
  
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [addresses, setAddresses] = useState(userInfo?.addresses || []);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setAddresses(userInfo.addresses || []);
    }
  }, [userInfo]);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchMyOrders();
    }
  }, [activeTab]);

  const fetchMyOrders = async () => {
    setLoadingOrders(true);
    try {
      const data = await api.getMyOrders();
      setOrders(data);
      if (data.length > 0) {
        setSelectedOrder(data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err.message);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const updated = await api.updateProfile({ name, password });
      dispatch(updateUserSuccess(updated));
      setMessage('Profile updated successfully!');
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Update failed.');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!street || !city || !postalCode || !phone) {
      setError('Please enter all fields.');
      return;
    }

    try {
      // Mock or active address addition
      const mockAddr = { _id: 'addr-' + Date.now(), street, city, postalCode, phone, country: 'Bangladesh' };
      const updatedList = [...addresses, mockAddr];
      setAddresses(updatedList);
      
      // Update store
      dispatch(updateUserSuccess({ addresses: updatedList }));

      setStreet('');
      setCity('');
      setPostalCode('');
      setPhone('');
      setMessage('Address added successfully!');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setError('Failed to add address.');
    }
  };

  // Helper to map order tracker status
  const getStatusStep = (status) => {
    switch (status) {
      case 'Pending':
        return 1;
      case 'Processing':
        return 2;
      case 'Shipped':
        return 3;
      case 'Delivered':
        return 4;
      default:
        return 1;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col h-[85vh]">
        
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <User className="h-5 w-5" />
            </span>
            <span className="font-bold text-slate-900 text-base">User Control Center</span>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors animate-pulse"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Dashboard Content split */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Sidebar */}
          <div className="w-48 border-r border-slate-100 bg-slate-50/50 p-4 space-y-2 hidden sm:block flex-shrink-0">
            {[
              { name: 'My Orders', val: 'orders', icon: Package },
              { name: 'Update Profile', val: 'profile', icon: User },
              { name: 'Saved Addresses', val: 'addresses', icon: MapPin }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.val}
                  onClick={() => { setActiveTab(tab.val); setError(''); setMessage(''); }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold transition-colors cursor-pointer ${
                    activeTab === tab.val
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/10'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.name}
                </button>
              );
            })}
          </div>

          {/* Main Area */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col">
            
            {/* Mobile Tab Selectors */}
            <div className="flex border border-slate-100 rounded-full bg-slate-50 p-1 mb-6 sm:hidden flex-shrink-0">
              {['orders', 'profile', 'addresses'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setError(''); setMessage(''); }}
                  className={`flex-1 rounded-full py-2 text-[10px] font-bold uppercase tracking-wider transition-all ${
                    activeTab === tab ? 'bg-white text-emerald-950 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* TAB: Orders */}
            {activeTab === 'orders' && (
              <div className="space-y-6 flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
                
                {/* Orders List Column */}
                <div className="flex-1 overflow-y-auto pr-2 space-y-3 max-h-[480px]">
                  <h4 className="text-sm font-bold text-slate-800">Purchased Logs</h4>
                  
                  {loadingOrders ? (
                    <p className="text-xs text-slate-400">Loading orders...</p>
                  ) : orders.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No orders purchased yet.</p>
                  ) : (
                    orders.map((order) => (
                      <div
                        key={order._id}
                        onClick={() => setSelectedOrder(order)}
                        className={`p-4 border rounded-2xl cursor-pointer hover:bg-slate-50/50 transition-all ${
                          selectedOrder?._id === order._id ? 'border-emerald-600 bg-emerald-50/10' : 'border-slate-100'
                        }`}
                      >
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-extrabold text-slate-900 truncate max-w-[120px]">{order._id}</span>
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2">
                          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                          <span className="font-bold text-slate-700">{order.totalPrice.toLocaleString()} BDT</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Selected Order Tracking Detail Column */}
                {selectedOrder && (
                  <div className="w-full md:w-80 border border-slate-100 rounded-3xl p-6 bg-slate-50/30 flex flex-col space-y-4 max-h-[480px] overflow-y-auto">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Order Delivery Tracker</h4>
                      <span className="text-xs font-extrabold text-slate-900 mt-1 block">Ref: {selectedOrder._id}</span>
                    </div>

                    {/* Stepper Graphic */}
                    <div className="space-y-4 pt-2">
                      {[
                        { step: 1, name: 'Placed & Confirmed', desc: 'SKU packed for verification.' },
                        { step: 2, name: 'Processing Skin Batch', desc: 'Skincare batch checked for dispatch.' },
                        { step: 3, name: 'Shipped (On The Road)', desc: 'Courier dispatches SKU package.' },
                        { step: 4, name: 'Delivered', desc: 'Arrived at destination address.' }
                      ].map((s) => {
                        const activeStep = getStatusStep(selectedOrder.status);
                        const isDone = s.step <= activeStep;
                        return (
                          <div key={s.step} className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold border transition-colors ${
                                isDone 
                                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-650/10' 
                                  : 'bg-white text-slate-300 border-slate-200'
                              }`}>
                                {s.step}
                              </span>
                              {s.step < 4 && <div className={`w-0.5 h-10 border-l ${isDone ? 'border-emerald-500' : 'border-slate-200'}`} />}
                            </div>
                            <div>
                              <h5 className={`text-xs font-bold ${isDone ? 'text-slate-900 font-extrabold' : 'text-slate-400'}`}>{s.name}</h5>
                              <p className="text-[10px] text-slate-400 leading-normal mt-0.5">{s.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Order summary info */}
                    <div className="border-t border-slate-100 pt-4 text-[11px] space-y-2 text-slate-500">
                      <div className="flex justify-between">
                        <span>Payment Method</span>
                        <span className="font-bold text-slate-800">{selectedOrder.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Paid Status</span>
                        <span className={`font-bold ${selectedOrder.isPaid ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {selectedOrder.isPaid ? 'PAID' : 'PAY ON DELIVERY'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: Profile */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-sm">
                <h4 className="text-sm font-bold text-slate-800">Personal Details</h4>

                <div className="space-y-3">
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
                      disabled
                      className="w-full rounded-2xl border border-slate-200 bg-slate-100 py-3 pl-11 pr-4 text-xs text-slate-500 outline-none cursor-not-allowed"
                      value={userInfo?.email}
                    />
                    <Package className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-400" />
                  </div>

                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Change Password (leave empty to keep)"
                      className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-xs outline-none focus:border-emerald-500"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <User className="absolute left-4 top-3.5 h-4.5 w-4.5 text-slate-400" />
                  </div>
                </div>

                {message && <p className="text-xs text-emerald-755 text-emerald-700 font-bold">{message}</p>}
                {error && <p className="text-xs text-red-655 text-red-600">{error}</p>}

                <button
                  type="submit"
                  className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 text-xs shadow-md transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </form>
            )}

            {/* TAB: Addresses */}
            {activeTab === 'addresses' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* List Addresses */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-800">Saved Shipping Locations</h4>
                  {addresses.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No addresses saved yet.</p>
                  ) : (
                    addresses.map((addr) => (
                      <div key={addr._id} className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 flex gap-3 text-xs">
                        <MapPinIcon className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-extrabold text-slate-900">{addr.street}</p>
                          <p className="text-slate-500 mt-1">{addr.city}, {addr.postalCode}</p>
                          <p className="text-slate-400 font-bold mt-1">Ph: {addr.phone}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Add Address Form */}
                <form onSubmit={handleAddAddress} className="border border-slate-100 rounded-3xl p-6 bg-slate-50/10 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Register New Address</h4>
                  <input
                    type="text"
                    placeholder="Street Address (Gulshan-2 etc.)"
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 px-3 text-xs outline-none focus:border-emerald-500"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="City"
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 px-3 text-xs outline-none focus:border-emerald-500"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Postal Code"
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 px-3 text-xs outline-none focus:border-emerald-500"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Delivery Phone Number"
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 px-3 text-xs outline-none focus:border-emerald-500"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />

                  {message && <p className="text-xs text-emerald-700 pl-1">{message}</p>}

                  <button
                    type="submit"
                    className="w-full rounded-full bg-emerald-950 hover:bg-emerald-900 text-white font-bold py-2.5 text-xs shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    Add Address
                  </button>
                </form>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
