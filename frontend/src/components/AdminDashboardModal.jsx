'use client';

import React, { useState, useEffect } from 'react';
import { X, Settings, Package, ShoppingBag, Plus, Trash2, Edit3, BarChart, Tag, RefreshCw } from 'lucide-react';
import { api } from '@/services/api';

export default function AdminDashboardModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('analytics'); // analytics | inventory | orders | coupons

  // Analytics State
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // Inventory State
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Product Form Field States
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodCategory, setProdCategory] = useState('Facewash');
  const [prodStock, setProdStock] = useState('');
  const [prodImageUrl, setProdImageUrl] = useState('');

  // Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Coupons State
  const [coupons, setCoupons] = useState([
    { _id: 'c1', code: 'WELCOME10', discount: 10, expiryDate: '2026-12-31' },
    { _id: 'c2', code: 'SKINCARE20', discount: 20, expiryDate: '2026-06-30' }
  ]);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState('');
  const [couponExpiry, setCouponExpiry] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (activeTab === 'analytics') fetchAnalytics();
    if (activeTab === 'inventory') fetchProducts();
    if (activeTab === 'orders') fetchOrders();
  }, [activeTab]);

  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const data = await api.getAdminAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to load analytics:', err.message);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const data = await api.getProducts({ pageSize: 50 });
      setProducts(data.products);
    } catch (err) {
      console.error('Failed to load products:', err.message);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const data = await api.getAdminOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err.message);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const payload = {
      name: prodName,
      description: prodDesc,
      price: Number(prodPrice),
      category: prodCategory,
      stock: Number(prodStock),
      imageUrl: prodImageUrl || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60'
    };

    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct._id, payload);
        setMessage('Product updated successfully!');
      } else {
        await api.createProduct(payload);
        setMessage('Product created successfully!');
      }

      // Reset
      setProdName('');
      setProdDesc('');
      setProdPrice('');
      setProdStock('');
      setProdImageUrl('');
      setEditingProduct(null);
      setShowAddForm(false);
      fetchProducts();
    } catch (err) {
      setError(err.message || 'Product configuration failed.');
    }
  };

  const handleEditClick = (p) => {
    setEditingProduct(p);
    setProdName(p.name);
    setProdDesc(p.description);
    setProdPrice(p.price);
    setProdCategory(p.category);
    setProdStock(p.stock);
    setProdImageUrl(p.imageUrl);
    setShowAddForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await api.deleteProduct(id);
        fetchProducts();
        setMessage('Product deleted.');
        setTimeout(() => setMessage(''), 2000);
      } catch (err) {
        setError('Failed to delete product.');
      }
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      fetchOrders();
      setMessage('Order status updated!');
      setTimeout(() => setMessage(''), 2000);
    } catch (err) {
      setError('Failed to update order status.');
    }
  };

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!couponCode || !couponDiscount || !couponExpiry) {
      setError('Please fill in coupon details.');
      return;
    }

    const newCoupon = {
      _id: 'c-' + Date.now(),
      code: couponCode.toUpperCase(),
      discount: Number(couponDiscount),
      expiryDate: couponExpiry
    };

    setCoupons([newCoupon, ...coupons]);
    setCouponCode('');
    setCouponDiscount('');
    setCouponExpiry('');
    setMessage('Coupon created!');
    setTimeout(() => setMessage(''), 2000);
  };

  const handleDeleteCoupon = (id) => {
    setCoupons(coupons.filter(c => c._id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col h-[85vh]">
        
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-700">
              <Settings className="h-5 w-5" />
            </span>
            <span className="font-bold text-slate-900 text-base">Admin Management Console</span>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Console layout */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Sidebar */}
          <div className="w-48 border-r border-slate-100 bg-slate-50/50 p-4 space-y-2 hidden sm:block flex-shrink-0">
            {[
              { name: 'Analytics Board', val: 'analytics', icon: BarChart },
              { name: 'Manage Inventory', val: 'inventory', icon: Package },
              { name: 'Manage Orders', val: 'orders', icon: ShoppingBag },
              { name: 'Promo Vouchers', val: 'coupons', icon: Tag }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.val}
                  onClick={() => { setActiveTab(tab.val); setError(''); setMessage(''); }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-bold transition-colors cursor-pointer ${
                    activeTab === tab.val
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/10'
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
            
            {/* Mobile Navigation tab bar */}
            <div className="flex border border-slate-100 rounded-full bg-slate-50 p-1 mb-6 sm:hidden flex-shrink-0">
              {['analytics', 'inventory', 'orders', 'coupons'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setError(''); setMessage(''); }}
                  className={`flex-1 rounded-full py-2 text-[10px] font-bold uppercase tracking-wider transition-all ${
                    activeTab === tab ? 'bg-white text-amber-950 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* MESSAGE FEEDBACK pill */}
            {message && <p className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full py-1.5 px-4 mb-4">{message}</p>}
            {error && <p className="text-xs font-bold text-red-650 bg-red-50 border border-red-100 rounded-full py-1.5 px-4 mb-4">{error}</p>}

            {/* TAB: Analytics */}
            {activeTab === 'analytics' && analytics && (
              <div className="space-y-6 animate-in fade-in duration-300">
                
                {/* Stats cards Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'Total Revenue', value: `${analytics.summary.totalSales.toLocaleString()} BDT`, color: 'border-emerald-100 bg-emerald-50/20 text-emerald-800' },
                    { name: 'Client Purchases', value: analytics.summary.totalOrdersCount, color: 'border-blue-100 bg-blue-50/20 text-blue-800' },
                    { name: 'SKU Products', value: analytics.summary.totalProductsCount, color: 'border-purple-100 bg-purple-50/20 text-purple-800' },
                    { name: 'Registered Users', value: analytics.summary.totalUsersCount, color: 'border-amber-100 bg-amber-50/20 text-amber-800' }
                  ].map((stat, idx) => (
                    <div key={idx} className={`p-4 border rounded-3xl ${stat.color} flex flex-col`}>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{stat.name}</span>
                      <span className="text-lg font-black tracking-tight mt-1">{stat.value}</span>
                    </div>
                  ))}
                </div>

                {/* Aggregated Details tables */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Category sales bar */}
                  <div className="border border-slate-100 rounded-3xl p-6 bg-slate-50/30 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Sales By Skincare Category</h4>
                    <div className="space-y-3">
                      {analytics.categorySales.length === 0 ? (
                        <p className="text-xs text-slate-400 italic">No sales aggregates recorded yet.</p>
                      ) : (
                        analytics.categorySales.map((cat, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-xs font-bold text-slate-800">
                              <span>{cat._id}</span>
                              <span>{cat.totalRevenue.toLocaleString()} BDT</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2">
                              <div
                                className="bg-emerald-600 h-2 rounded-full"
                                style={{
                                  width: `${Math.min(100, (cat.totalRevenue / (analytics.summary.totalSales || 1)) * 100)}%`
                                }}
                              />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Stock warning notifications */}
                  <div className="border border-slate-100 rounded-3xl p-6 bg-slate-50/30 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Low Stock Inventory Alerts</h4>
                    <div className="divide-y divide-slate-100 max-h-[160px] overflow-y-auto pr-1">
                      {analytics.lowStockProducts.length === 0 ? (
                        <p className="text-xs text-emerald-700 italic">All product stocks healthy.</p>
                      ) : (
                        analytics.lowStockProducts.map((p) => (
                          <div key={p._id} className="flex justify-between items-center py-2 text-xs">
                            <span className="font-semibold text-slate-700 truncate max-w-[200px]">{p.name}</span>
                            <span className="rounded-full bg-red-150 bg-red-100 px-2.5 py-0.5 text-[10px] font-bold text-red-650 text-red-700 animate-pulse">
                              Only {p.stock} Left
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* TAB: Inventory */}
            {activeTab === 'inventory' && (
              <div className="space-y-6 flex-1 flex flex-col overflow-hidden">
                
                {/* Controls header */}
                <div className="flex justify-between items-center flex-shrink-0">
                  <h4 className="text-sm font-bold text-slate-800">Product List ({products.length})</h4>
                  <button
                    onClick={() => {
                      setShowAddForm(!showAddForm);
                      if (showAddForm) setEditingProduct(null);
                    }}
                    className="flex h-9 items-center gap-1.5 rounded-full bg-emerald-950 hover:bg-emerald-900 px-4 text-xs font-semibold text-white cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    {showAddForm ? 'Close Form' : 'Add Skincare'}
                  </button>
                </div>

                {/* Add/Edit Form Overlay */}
                {showAddForm && (
                  <form onSubmit={handleProductSubmit} className="border border-slate-100 rounded-3xl p-6 bg-slate-50/30 space-y-3 flex-shrink-0 animate-in slide-in-from-top duration-300">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {editingProduct ? 'Edit Existing Product' : 'Register New Skincare Item'}
                    </h5>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Product Name"
                        required
                        className="rounded-2xl border border-slate-200 bg-white py-2.5 px-3 text-xs outline-none"
                        value={prodName}
                        onChange={(e) => setProdName(e.target.value)}
                      />
                      <select
                        className="rounded-2xl border border-slate-200 bg-white py-2.5 px-3 text-xs outline-none"
                        value={prodCategory}
                        onChange={(e) => setProdCategory(e.target.value)}
                      >
                        <option value="Facewash">Facewash</option>
                        <option value="Serum">Serum</option>
                        <option value="Cream">Cream</option>
                        <option value="Sunscreen">Sunscreen</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        placeholder="Price (BDT)"
                        required
                        className="rounded-2xl border border-slate-200 bg-white py-2.5 px-3 text-xs outline-none"
                        value={prodPrice}
                        onChange={(e) => setProdPrice(e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="Stock Quantity"
                        required
                        className="rounded-2xl border border-slate-200 bg-white py-2.5 px-3 text-xs outline-none"
                        value={prodStock}
                        onChange={(e) => setProdStock(e.target.value)}
                      />
                    </div>

                    <input
                      type="text"
                      placeholder="Image URL Link"
                      className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 px-3 text-xs outline-none"
                      value={prodImageUrl}
                      onChange={(e) => setProdImageUrl(e.target.value)}
                    />

                    <textarea
                      placeholder="Detailed Description"
                      rows="2"
                      required
                      className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 px-3 text-xs outline-none"
                      value={prodDesc}
                      onChange={(e) => setProdDesc(e.target.value)}
                    />

                    <button
                      type="submit"
                      className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 text-xs shadow-md cursor-pointer"
                    >
                      {editingProduct ? 'Save Product' : 'Add Product'}
                    </button>
                  </form>
                )}

                {/* Table listings */}
                <div className="flex-1 overflow-y-auto max-h-[380px] pr-2">
                  {loadingProducts ? (
                    <p className="text-xs text-slate-400">Loading products...</p>
                  ) : (
                    <div className="border border-slate-100 rounded-3xl overflow-hidden divide-y divide-slate-150 divide-slate-100">
                      {products.map((p) => (
                        <div key={p._id} className="flex justify-between items-center p-3.5 hover:bg-slate-50 transition-colors text-xs">
                          <div className="flex items-center gap-3">
                            <img src={p.imageUrl} className="h-10 w-10 rounded-lg object-cover" />
                            <div>
                              <p className="font-bold text-slate-800 line-clamp-1">{p.name}</p>
                              <span className="text-[10px] text-slate-400 font-semibold">{p.category} | {p.price} BDT | Stock: {p.stock}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditClick(p)}
                              className="p-2 rounded-full hover:bg-blue-50 text-blue-600 transition-colors"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p._id)}
                              className="p-2 rounded-full hover:bg-red-50 text-red-650 text-red-600 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB: Orders */}
            {activeTab === 'orders' && (
              <div className="space-y-4 flex-1 flex flex-col overflow-hidden">
                <h4 className="text-sm font-bold text-slate-800 flex-shrink-0">Customer Orders Dashboard ({orders.length})</h4>
                
                <div className="flex-1 overflow-y-auto max-h-[420px] pr-2">
                  {loadingOrders ? (
                    <p className="text-xs text-slate-400">Loading orders...</p>
                  ) : orders.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No orders received yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((o) => (
                        <div key={o._id} className="border border-slate-100 rounded-3xl p-5 bg-slate-50/30 flex flex-col sm:flex-row justify-between gap-4 text-xs">
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-slate-900">{o._id}</span>
                              <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                                o.isPaid ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
                              }`}>
                                {o.isPaid ? 'PAID' : 'UNPAID'}
                              </span>
                            </div>
                            <p className="text-slate-400 text-[10px]">
                              Total: <span className="font-bold text-slate-800">{o.totalPrice.toLocaleString()} BDT</span> | Ph: {o.shippingAddress.phone}
                            </p>
                            <p className="text-slate-500 font-semibold truncate max-w-[400px]">
                              Items: {o.orderItems.map(item => `${item.name} (${item.qty})`).join(', ')}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 self-start sm:self-center">
                            <span className="text-[10px] font-bold text-slate-400">DISPATCH:</span>
                            <select
                              value={o.status}
                              onChange={(e) => handleStatusChange(o._id, e.target.value)}
                              className="rounded-full border border-slate-200 bg-white py-1.5 px-3 font-semibold text-slate-700 outline-none"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB: Coupons */}
            {activeTab === 'coupons' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-300">
                
                {/* List Coupons */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-800">Active Coupons</h4>
                  <div className="border border-slate-100 rounded-3xl overflow-hidden divide-y divide-slate-100 bg-slate-50/20">
                    {coupons.map((c) => (
                      <div key={c._id} className="flex justify-between items-center p-3 px-4 text-xs">
                        <div>
                          <p className="font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 inline-block">{c.code}</p>
                          <p className="text-slate-500 mt-1.5">Discount: <span className="font-bold text-slate-800">{c.discount}%</span> | Expires: {new Date(c.expiryDate).toLocaleDateString()}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteCoupon(c._id)}
                          className="p-2 rounded-full hover:bg-red-50 text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add Coupon Form */}
                <form onSubmit={handleCreateCoupon} className="border border-slate-100 rounded-3xl p-6 bg-slate-50/10 space-y-3 self-start">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Create Promo Voucher</h4>
                  <input
                    type="text"
                    placeholder="Coupon Code (e.g. SUMMERSKIN30)"
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 px-3 text-xs outline-none"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Discount Percentage (e.g. 30)"
                    required
                    min="1"
                    max="100"
                    className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 px-3 text-xs outline-none"
                    value={couponDiscount}
                    onChange={(e) => setCouponDiscount(e.target.value)}
                  />
                  <input
                    type="date"
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 px-3 text-xs outline-none text-slate-500"
                    value={couponExpiry}
                    onChange={(e) => setCouponExpiry(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="w-full rounded-full bg-emerald-950 hover:bg-emerald-900 text-white font-bold py-2.5 text-xs shadow-md cursor-pointer"
                  >
                    Add Coupon
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
