import { createSlice } from '@reduxjs/toolkit';

// Safe local storage fetcher (returns undefined on SSR)
const getInitialState = (key, fallback) => {
  if (typeof window !== 'undefined') {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  }
  return fallback;
};

const initialState = {
  cartItems: getInitialState('cartItems', []),
  shippingAddress: getInitialState('shippingAddress', {
    street: '',
    city: '',
    postalCode: '',
    country: 'Bangladesh',
    phone: ''
  }),
  paymentMethod: getInitialState('paymentMethod', 'Cash on Delivery'),
  coupon: null // { code, discount }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload; // { product, name, price, imageUrl, qty, stock }
      const existItem = state.cartItems.find((x) => x.product === item.product);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x.product === existItem.product ? { ...x, qty: item.qty } : x
        );
      } else {
        state.cartItems.push(item);
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      }
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x.product !== action.payload);
      if (typeof window !== 'undefined') {
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
      }
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
      }
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('paymentMethod', JSON.stringify(action.payload));
      }
    },
    applyCoupon: (state, action) => {
      state.coupon = action.payload; // { code, discount }
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.coupon = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cartItems');
      }
    }
  }
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  applyCoupon,
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;
