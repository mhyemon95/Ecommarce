'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ProductDetailsModal from '@/components/ProductDetailsModal';
import CartDrawer from '@/components/CartDrawer';
import AuthModal from '@/components/AuthModal';
import CheckoutModal from '@/components/CheckoutModal';
import UserDashboardModal from '@/components/UserDashboardModal';
import AdminDashboardModal from '@/components/AdminDashboardModal';
import { api } from '@/services/api';
import { Sparkles, ArrowRight, Grid, Filter, SortAsc } from 'lucide-react';

export default function Home() {
  // Filters & Listings State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // Modals & Panels Overlay States
  const [viewingProduct, setViewingProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isUserDashboardOpen, setIsUserDashboardOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  // Fetch catalog reactively on filter/search changes
  useEffect(() => {
    fetchProducts();
  }, [activeCategory, searchKeyword, sort, page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts({
        category: activeCategory,
        keyword: searchKeyword,
        sort,
        page,
        pageSize: 8
      });
      setProducts(data.products || []);
      setPages(data.pages || 1);
    } catch (err) {
      console.error('Failed to fetch products:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Dynamic Header */}
      <Navbar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenUserDashboard={() => setIsUserDashboardOpen(true)}
        onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
      />

      {/* Hero Brand Banner */}
      {activeCategory === '' && searchKeyword === '' && (
        <section className="relative overflow-hidden bg-gradient-to-tr from-emerald-950 via-emerald-900 to-slate-900 text-white py-20 px-6 sm:px-12 lg:px-24">
          {/* Circular abstract blobs */}
          <div className="absolute top-0 right-0 h-[350px] w-[350px] rounded-full bg-emerald-700/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-[250px] w-[250px] rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="relative mx-auto max-w-7xl flex flex-col md:flex-row items-center gap-12 justify-between">
            <div className="space-y-6 max-w-xl text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 py-1.5 px-4 text-xs font-bold uppercase tracking-wider text-emerald-350 text-emerald-400">
                <Sparkles className="h-3.5 w-3.5" />
                Pure Skincare Solutions
              </span>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
                Reveal Your Natural <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-emerald-500">Organic Glow</span>
              </h1>
              <p className="text-slate-350 text-slate-300 text-sm leading-relaxed">
                Experience dermatologist-formulated skincare crafted with natural, potent bio-actives. Cruelty-free, vegan-approved, and tailored for beautiful hydration.
              </p>
              
              {/* Promo Banner Codes */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
                <span className="rounded-xl border border-emerald-500/30 bg-emerald-900/40 px-3.5 py-2 text-xs font-semibold">
                  10% OFF Code: <span className="text-emerald-300 font-extrabold">WELCOME10</span>
                </span>
                <span className="rounded-xl border border-emerald-500/30 bg-emerald-900/40 px-3.5 py-2 text-xs font-semibold">
                  20% OFF Code: <span className="text-emerald-300 font-extrabold">SKINCARE20</span>
                </span>
              </div>
            </div>

            {/* Skincare Product Showcase graphic */}
            <div className="relative aspect-square w-72 md:w-[350px] rounded-3xl overflow-hidden shadow-2xl border border-emerald-800 flex-shrink-0 animate-pulse">
              <img
                src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80"
                alt="Glowing Serum Banner"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-left">
                <h3 className="font-extrabold text-sm text-white">Niacinamide Aura Serum</h3>
                <p className="text-[10px] text-emerald-300 mt-1">Our #1 Top-Selling Skincare Serum</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Catalog section */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        
        {/* Catalog settings header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Grid className="h-5 w-5 text-emerald-600" />
              {searchKeyword ? `Search results for: "${searchKeyword}"` : activeCategory ? `${activeCategory} Collection` : 'Featured Collections'}
            </h2>
            <p className="text-xs text-slate-400 mt-1 leading-normal">
              Explore dermatology-grade formulas crafted for pore reduction and cellular rejuvenation.
            </p>
          </div>

          {/* Sort selection */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            <SortAsc className="h-4 w-4 text-slate-400" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-full border border-slate-200 bg-white py-1.5 px-4 text-xs font-semibold text-slate-700 outline-none"
            >
              <option value="">Sort: Newest First</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Catalog Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((idx) => (
              <div key={idx} className="h-80 w-full bg-slate-100 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 border border-slate-100 rounded-3xl bg-slate-50/20">
            <p className="text-sm text-slate-400 italic">No products match your filters or query. Try another keyword!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((prod) => (
              <ProductCard
                key={prod._id}
                product={prod}
                onViewDetails={(p) => setViewingProduct(p)}
                onOpenCart={() => setIsCartOpen(true)}
              />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {pages > 1 && (
          <div className="flex justify-center items-center gap-2 pt-6">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="rounded-full border border-slate-200 py-1.5 px-4 text-xs font-bold disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-xs font-bold text-slate-500">Page {page} of {pages}</span>
            <button
              disabled={page >= pages}
              onClick={() => setPage(page + 1)}
              className="rounded-full border border-slate-200 py-1.5 px-4 text-xs font-bold disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

      </main>

      {/* Footer Branding */}
      <Footer />

      {/* MODALS overlays render */}
      
      {/* 1. Product details Modal */}
      {viewingProduct && (
        <ProductDetailsModal
          product={viewingProduct}
          onClose={() => setViewingProduct(null)}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
        />
      )}

      {/* 2. Cart Drawer */}
      {isCartOpen && (
        <CartDrawer
          onClose={() => setIsCartOpen(false)}
          onOpenCheckout={() => setIsCheckoutOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
        />
      )}

      {/* 3. Authentication Login / Register Modal */}
      {isAuthOpen && (
        <AuthModal
          onClose={() => setIsAuthOpen(false)}
        />
      )}

      {/* 4. Checkout Processing Modal */}
      {isCheckoutOpen && (
        <CheckoutModal
          onClose={() => setIsCheckoutOpen(false)}
          onOpenUserDashboard={() => setIsUserDashboardOpen(true)}
        />
      )}

      {/* 5. User Control Center Dashboard Modal */}
      {isUserDashboardOpen && (
        <UserDashboardModal
          onClose={() => setIsUserDashboardOpen(false)}
        />
      )}

      {/* 6. Admin Panel Management Modal */}
      {isAdminDashboardOpen && (
        <AdminDashboardModal
          onClose={() => setIsAdminDashboardOpen(false)}
        />
      )}

    </div>
  );
}
