import { createSlice } from '@reduxjs/toolkit';

// Safe local storage fetcher
const getInitialUserInfo = () => {
  if (typeof window !== 'undefined') {
    const item = localStorage.getItem('userInfo');
    return item ? JSON.parse(item) : null;
  }
  return null;
};

const initialState = {
  userInfo: getInitialUserInfo(),
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    loginSuccess: (state, action) => {
      state.userInfo = action.payload;
      state.loading = false;
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.setItem('userInfo', JSON.stringify(action.payload));
      }
    },
    logout: (state) => {
      state.userInfo = null;
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('cartItems');
        localStorage.removeItem('shippingAddress');
        localStorage.removeItem('paymentMethod');
      }
    },
    updateUserSuccess: (state, action) => {
      state.userInfo = { ...state.userInfo, ...action.payload };
      if (typeof window !== 'undefined') {
        localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
      }
    }
  }
});

export const { setLoading, setError, loginSuccess, logout, updateUserSuccess } = authSlice.actions;

export default authSlice.reducer;
