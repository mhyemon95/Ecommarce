'use client';

import React from 'react';
import { Star, ShoppingCart, Eye } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/redux/slices/cartSlice';

export default function ProductCard({ product, onViewDetails, onOpenCart }) {
  const dispatch = useDispatch();

  const imageUrl = product.images && product.images.length > 0
    ? product.images[0]
    : 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60';

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const cartItem = {
      product: product._id,
      name: product.title, // Keep internal slice names or maps
      price: product.price,
      imageUrl: imageUrl,
      qty: 1,
      stock: product.stock
    };
    dispatch(addToCart(cartItem));
    if (onOpenCart) onOpenCart();
  };

  const isOutOfStock = product.stock <= 0;

  const getCategoryStyles = (category) => {
    switch (category) {
      case 'Facewash':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Serum':
        return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'Cream':
        return 'bg-pink-50 text-pink-700 border-pink-100';
      case 'Sunscreen':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    }
  };

  return (
    <div
      onClick={() => onViewDetails(product)}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white p-3.5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-emerald-950/[0.04] cursor-pointer"
    >
      
      {/* Product Image Area */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-50">
        <img
          src={imageUrl}
          alt={product.title}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Quick View Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-emerald-950/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-emerald-950 shadow-lg transform scale-75 group-hover:scale-100 transition-all duration-300">
            <Eye className="h-5 w-5" />
          </span>
        </div>

        {/* Stock Alert */}
        {isOutOfStock ? (
          <span className="absolute top-2.5 left-2.5 rounded-full bg-red-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
            Out of Stock
          </span>
        ) : product.stock < 5 ? (
          <span className="absolute top-2.5 left-2.5 rounded-full bg-amber-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm animate-pulse">
            Only {product.stock} Left
          </span>
        ) : null}
      </div>

      {/* Product Content Details */}
      <div className="flex flex-1 flex-col pt-4">
        
        {/* Category Badge & Rating */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${getCategoryStyles(product.category)}`}>
            {product.category}
          </span>
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-slate-700">{product.rating}</span>
            <span className="text-[10px] text-slate-400">({product.reviews ? product.reviews.length : 0})</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold tracking-tight text-slate-900 line-clamp-2 min-h-[40px] group-hover:text-emerald-700 transition-colors">
          {product.title}
        </h3>

        {/* Description Snippet */}
        <p className="mt-1 text-xs text-slate-400 line-clamp-2 flex-grow leading-relaxed">
          {product.description}
        </p>

        {/* Price and Cart */}
        <div className="mt-4 flex items-center justify-between gap-4 border-t border-slate-50 pt-3">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Price</span>
            <span className="text-base font-extrabold text-slate-900 tracking-tight">
              {product.price.toLocaleString()} BDT
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex h-10 w-10 items-center justify-center rounded-full transition-all active:scale-90 cursor-pointer ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/10 hover:shadow-lg hover:shadow-emerald-600/20'
            }`}
          >
            <ShoppingCart className="h-4.5 w-4.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
