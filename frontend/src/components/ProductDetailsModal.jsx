'use client';

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '@/redux/slices/cartSlice';
import { X, Star, ShoppingBag, Plus, Minus, Send, Check } from 'lucide-react';
import { api } from '@/services/api';

export default function ProductDetailsModal({ product, onClose, onOpenCart, onOpenAuth }) {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  
  const [qty, setQty] = useState(1);
  const [reviews, setReviews] = useState(product.reviewsList || product.reviews || []);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [averageRating, setAverageRating] = useState(product.rating || 0);
  const [numReviews, setNumReviews] = useState(product.reviews ? product.reviews.length : 0);

  const imageUrl = product.images && product.images.length > 0
    ? product.images[0]
    : 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60';

  useEffect(() => {
    setReviews(product.reviewsList || product.reviews || []);
    setAverageRating(product.rating || 0);
    setNumReviews(product.reviews ? product.reviews.length : 0);
    setQty(1);
    setReviewError('');
    setReviewSuccess(false);
  }, [product]);

  const handleAddToCart = () => {
    const cartItem = {
      product: product._id,
      name: product.title,
      price: product.price,
      imageUrl: imageUrl,
      qty,
      stock: product.stock
    };
    dispatch(addToCart(cartItem));
    onClose();
    if (onOpenCart) onOpenCart();
  };

  const handleQtyChange = (val) => {
    const newQty = qty + val;
    if (newQty >= 1 && newQty <= product.stock) {
      setQty(newQty);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      onOpenAuth();
      return;
    }

    if (!comment.trim()) {
      setReviewError('Please write a comment.');
      return;
    }

    try {
      await api.createReview(product._id, {
        name: userInfo.name,
        rating,
        comment
      });

      setReviewSuccess(true);
      setReviewError('');
      
      const newReview = {
        _id: 'new-rev-' + Date.now(),
        name: userInfo.name,
        user: { name: userInfo.name },
        rating,
        comment,
        createdAt: new Date().toISOString()
      };
      
      const updatedReviews = [newReview, ...reviews];
      setReviews(updatedReviews);
      setNumReviews(updatedReviews.length);
      
      const newAvg = (updatedReviews.reduce((acc, r) => acc + (r.rating || 0), 0) / updatedReviews.length).toFixed(1);
      setAverageRating(Number(newAvg));

      setComment('');
    } catch (err) {
      setReviewError(err.response?.data?.message || err.message || 'Failed to submit review.');
    }
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="overflow-y-auto flex-1 p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Column 1: Image */}
            <div className="flex flex-col gap-4">
              <div className="aspect-square w-full overflow-hidden rounded-2xl bg-slate-50 border border-slate-100">
                <img
                  src={imageUrl}
                  alt={product.title}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Category:</span>
                <span className="rounded-full bg-emerald-50 border border-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-800">
                  {product.category}
                </span>
              </div>
            </div>

            {/* Column 2: Content */}
            <div className="flex flex-col">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
                {product.title}
              </h2>

              {/* Rating Summary */}
              <div className="mt-2 flex items-center gap-1">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= Math.round(averageRating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-slate-800">{averageRating}</span>
                <span className="text-xs text-slate-400">({numReviews} customer reviews)</span>
              </div>

              {/* Price & Stock */}
              <div className="mt-4 flex items-center justify-between border-y border-slate-100 py-3.5">
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  {product.price.toLocaleString()} BDT
                </span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  isOutOfStock 
                    ? 'bg-red-50 text-red-700' 
                    : 'bg-emerald-50 text-emerald-800'
                }`}>
                  {isOutOfStock ? 'Out of Stock' : `In Stock: ${product.stock}`}
                </span>
              </div>

              {/* Description */}
              <p className="mt-4 text-sm text-slate-500 leading-relaxed">
                {product.description}
              </p>

              {/* Quantity Selector */}
              {!isOutOfStock && (
                <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex items-center border border-slate-200 rounded-full py-1.5 px-3 bg-slate-50">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-4 select-none">Qty</span>
                    <button
                      onClick={() => handleQtyChange(-1)}
                      className="p-1 rounded-full hover:bg-slate-200 text-slate-600 transition-colors"
                      disabled={qty <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center font-extrabold text-slate-950 text-sm">{qty}</span>
                    <button
                      onClick={() => handleQtyChange(1)}
                      className="p-1 rounded-full hover:bg-slate-200 text-slate-600 transition-colors"
                      disabled={qty >= product.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="flex-1 flex h-12 items-center justify-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold tracking-wide shadow-lg shadow-emerald-600/10 w-full sm:w-auto"
                  >
                    <ShoppingBag className="h-5 w-5" />
                    Add To Cart
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Customer Reviews */}
          <div className="mt-12 border-t border-slate-100 pt-8">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Customer Reviews</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Review List */}
              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                {reviews.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">No reviews yet for this product.</p>
                ) : (
                  reviews.map((rev, index) => (
                    <div key={rev._id || index} className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-slate-800">{rev.user?.name || rev.name || 'Verified User'}</span>
                        <span className="text-[10px] text-slate-400">
                          {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Just now'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3 w-3 ${
                              star <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Review Form */}
              <div className="border border-slate-100 rounded-3xl p-6 bg-emerald-50/10">
                <h4 className="text-sm font-bold text-slate-900 mb-4">Write a Review</h4>
                
                {reviewSuccess ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center text-emerald-800">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 mb-2">
                      <Check className="h-6 w-6" />
                    </span>
                    <h5 className="font-bold text-sm">Review Submitted!</h5>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Rating</span>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setRating(star)}
                            className="p-1 hover:scale-110 transition-transform cursor-pointer"
                          >
                            <Star
                              className={`h-6 w-6 ${
                                star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your feedback</span>
                      <textarea
                        rows="3"
                        placeholder="Share your skin results..."
                        className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-xs outline-none focus:border-emerald-500"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                    </div>

                    {reviewError && (
                      <p className="text-xs text-red-600">{reviewError}</p>
                    )}

                    <button
                      type="submit"
                      className="w-full flex h-10 items-center justify-center gap-2 rounded-full bg-emerald-950 hover:bg-emerald-900 text-white text-xs font-semibold shadow-md active:scale-95 transition-all"
                    >
                      <Send className="h-3.5 w-3.5" />
                      Submit Review
                    </button>

                  </form>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
