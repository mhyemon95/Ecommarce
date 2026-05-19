import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach Authorization header if token exists
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// ----------------------------------------------------
// MOCK DATA STORE (Client-side Fallback if API is offline)
// ----------------------------------------------------
let mockProducts = [
  {
    _id: 'prod1',
    name: 'Salicylic Acid Foaming Facewash',
    description: 'A deep-cleansing foaming face wash containing 2% Salicylic Acid to gently exfoliate, unclog pores, and remove acne-causing impurities while keeping the skin hydrated.',
    price: 499,
    category: 'Facewash',
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60',
    rating: 4.5,
    numReviews: 4,
    reviews: [
      { _id: 'r1', name: 'Tasnim Ahmed', rating: 5, comment: 'Amazing for acne! Reduced my breakouts in a week.', createdAt: '2026-05-10T12:00:00Z' },
      { _id: 'r2', name: 'Nabila Islam', rating: 4, comment: 'Cleanses deeply, slightly drying but works well.', createdAt: '2026-05-12T14:30:00Z' }
    ]
  },
  {
    _id: 'prod2',
    name: 'Hydrating Ceramide Cleanser',
    description: 'Formulated with three essential ceramides and hyaluronic acid to cleanse, hydrate, and restore the skin protective barrier without stripping away vital moisture.',
    price: 550,
    category: 'Facewash',
    stock: 30,
    imageUrl: 'https://images.unsplash.com/photo-1608248597481-496100c80836?w=500&auto=format&fit=crop&q=60',
    rating: 4.8,
    numReviews: 2,
    reviews: [
      { _id: 'r3', name: 'Sajid Khan', rating: 5, comment: 'Very gentle. Perfect for dry skin.', createdAt: '2026-05-14T09:00:00Z' }
    ]
  },
  {
    _id: 'prod3',
    name: '10% Niacinamide Glowing Serum',
    description: 'A lightweight concentrated serum with Niacinamide and Zinc PCA that significantly minimizes large pores, refines uneven texture, fades dark spots, and reduces redness.',
    price: 799,
    category: 'Serum',
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=60',
    rating: 4.7,
    numReviews: 3,
    reviews: [
      { _id: 'r4', name: 'Meherun Nesa', rating: 5, comment: 'My dark spots are fading. Will buy again!', createdAt: '2026-05-08T10:00:00Z' }
    ]
  },
  {
    _id: 'prod4',
    name: 'Pure Retinol Youthful Serum',
    description: 'An advanced anti-aging serum powered by encapsulated retinol to accelerate cellular turnover, fade fine lines and deep wrinkles, and restore radiant skin elasticity.',
    price: 950,
    category: 'Serum',
    stock: 8,
    imageUrl: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=500&auto=format&fit=crop&q=60',
    rating: 4.6,
    numReviews: 1,
    reviews: []
  },
  {
    _id: 'prod5',
    name: 'Ultra Hydrating Water Gel Cream',
    description: 'An oil-free, non-comedogenic water gel cream that delivers intense, 48-hour hydration to dry skin. Formulated with hyaluronic acid for a plump, dewy look.',
    price: 650,
    category: 'Cream',
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1617897903246-719242758050?w=500&auto=format&fit=crop&q=60',
    rating: 4.9,
    numReviews: 8,
    reviews: []
  },
  {
    _id: 'prod6',
    name: 'Centella Barrier Repair Cream',
    description: 'A soothing moisturizing cream enriched with 70% Centella Asiatica extract and panthenol to calm irritated skin, reduce inflammation, and rebuild damaged skin barrier.',
    price: 720,
    category: 'Cream',
    stock: 12,
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500&auto=format&fit=crop&q=60',
    rating: 4.7,
    numReviews: 1,
    reviews: []
  },
  {
    _id: 'prod7',
    name: 'Matte Finish Sunscreen SPF 50+',
    description: 'A lightweight, non-greasy, broad-spectrum sunscreen that provides strong UV protection with a smooth matte finish. Sweat-proof, waterproof, and leaves zero white cast.',
    price: 599,
    category: 'Sunscreen',
    stock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&auto=format&fit=crop&q=60',
    rating: 4.8,
    numReviews: 15,
    reviews: []
  },
  {
    _id: 'prod8',
    name: 'Hyaluronic Acid Airy Sun Stick',
    description: 'A highly portable broad-spectrum chemical sunscreen stick that applies invisibly over makeup. Glides smoothly with 8 types of hyaluronic acid to hydrate on the go.',
    price: 850,
    category: 'Sunscreen',
    stock: 18,
    imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500&auto=format&fit=crop&q=60',
    rating: 4.9,
    numReviews: 6,
    reviews: []
  }
];

let mockOrders = [];
let mockCoupons = [
  { code: 'WELCOME10', discount: 10 },
  { code: 'SKINCARE20', discount: 20 }
];

// Helper to determine if we should use mock fallbacks (if backend connection fails)
let isBackendConnected = false;

const checkBackendConnection = async () => {
  try {
    const res = await axios.get(`${API_URL}`);
    if (res.status === 200) {
      isBackendConnected = true;
    }
  } catch (error) {
    isBackendConnected = false;
  }
};

// Execute initial check
if (typeof window !== 'undefined') {
  checkBackendConnection();
}

// ----------------------------------------------------
// API EXPORTED METHODS
// ----------------------------------------------------
export const api = {
  // --- Products ---
  getProducts: async (params = {}) => {
    await checkBackendConnection();
    if (isBackendConnected) {
      const response = await axiosInstance.get('/products', { params });
      return response.data;
    } else {
      // Mock Filtering, Searching, and Sorting
      let filtered = [...mockProducts];
      if (params.category) {
        filtered = filtered.filter(p => p.category.toLowerCase() === params.category.toLowerCase());
      }
      if (params.keyword) {
        const query = params.keyword.toLowerCase();
        filtered = filtered.filter(p => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query));
      }
      
      if (params.sort === 'priceAsc') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (params.sort === 'priceDesc') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (params.sort === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
      } else {
        // default newest (reverse array mock)
      }

      const pageSize = params.pageSize || 8;
      const page = params.page || 1;
      const total = filtered.length;
      const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

      return {
        products: paginated,
        page,
        pages: Math.ceil(total / pageSize),
        totalProducts: total
      };
    }
  },

  getProductDetails: async (id) => {
    await checkBackendConnection();
    if (isBackendConnected) {
      const response = await axiosInstance.get(`/products/${id}`);
      return response.data;
    } else {
      const prod = mockProducts.find(p => p._id === id);
      if (!prod) throw new Error('Product not found');
      return prod;
    }
  },

  createReview: async (id, reviewData) => {
    await checkBackendConnection();
    if (isBackendConnected) {
      const response = await axiosInstance.post(`/products/${id}/reviews`, reviewData);
      return response.data;
    } else {
      const prodIndex = mockProducts.findIndex(p => p._id === id);
      if (prodIndex === -1) throw new Error('Product not found');
      
      const newReview = {
        _id: 'rev-' + Math.random().toString(36).substr(2, 9),
        name: reviewData.name || 'Anonymous User',
        rating: Number(reviewData.rating),
        comment: reviewData.comment,
        createdAt: new Date().toISOString()
      };
      
      mockProducts[prodIndex].reviews.push(newReview);
      mockProducts[prodIndex].numReviews = mockProducts[prodIndex].reviews.length;
      mockProducts[prodIndex].rating = Number(
        (mockProducts[prodIndex].reviews.reduce((acc, r) => acc + r.rating, 0) / mockProducts[prodIndex].reviews.length).toFixed(1)
      );

      return { message: 'Review added successfully' };
    }
  },

  // --- Auth & Users ---
  register: async (userData) => {
    await checkBackendConnection();
    if (isBackendConnected) {
      const response = await axiosInstance.post('/users/register', userData);
      return response.data;
    } else {
      // Mock registration: immediately verified for simplicity, or returns OTP needed
      const newUser = {
        _id: 'user-' + Math.random().toString(36).substr(2, 9),
        name: userData.name,
        email: userData.email,
        role: userData.email.includes('admin') ? 'admin' : 'customer',
        isVerified: false,
        token: 'mock-jwt-token-' + Math.random().toString(36).substr(2, 9)
      };
      console.log(`[MOCK OTP SYSTEM] Generated OTP: 123456`);
      return {
        ...newUser,
        message: 'Registration successful! Verification OTP (123456) sent.'
      };
    }
  },

  verifyOTP: async (email, otp) => {
    await checkBackendConnection();
    if (isBackendConnected) {
      const response = await axiosInstance.post('/users/verify-otp', { email, otp });
      return response.data;
    } else {
      if (otp === '123456') {
        return {
          _id: 'user-' + Math.random().toString(36).substr(2, 9),
          name: 'Verified User',
          email,
          role: email.includes('admin') ? 'admin' : 'customer',
          isVerified: true,
          token: 'mock-jwt-token-verified',
          message: 'OTP Verified successfully! Welcome aboard.'
        };
      } else {
        throw new Error('Invalid OTP code. Please enter 123456.');
      }
    }
  },

  login: async (credentials) => {
    await checkBackendConnection();
    if (isBackendConnected) {
      const response = await axiosInstance.post('/users/login', credentials);
      return response.data;
    } else {
      // Mock login: admin check
      const isAdmin = credentials.email === 'admin@ecommarce.com' || credentials.email.includes('admin');
      if (credentials.password === 'password123' || credentials.password) {
        return {
          _id: isAdmin ? 'admin1' : 'user1',
          name: isAdmin ? 'Admin User' : 'Test Customer',
          email: credentials.email,
          role: isAdmin ? 'admin' : 'customer',
          isVerified: true,
          token: 'mock-jwt-token-' + (isAdmin ? 'admin' : 'customer')
        };
      }
      throw new Error('Invalid credentials');
    }
  },

  updateProfile: async (profileData) => {
    await checkBackendConnection();
    if (isBackendConnected) {
      const response = await axiosInstance.put('/users/profile', profileData);
      return response.data;
    } else {
      return {
        _id: 'user1',
        name: profileData.name || 'Updated Customer',
        email: 'customer@ecommarce.com',
        role: 'customer',
        isVerified: true
      };
    }
  },

  // --- Coupon ---
  validateCoupon: async (code) => {
    await checkBackendConnection();
    if (isBackendConnected) {
      const response = await axiosInstance.post('/coupons/validate', { code });
      return response.data;
    } else {
      const found = mockCoupons.find(c => c.code.toUpperCase() === code.toUpperCase());
      if (!found) throw new Error('Invalid coupon code');
      return {
        code: found.code,
        discount: found.discount,
        message: `Coupon applied! You got ${found.discount}% off.`
      };
    }
  },

  // --- Orders ---
  createOrder: async (orderData) => {
    await checkBackendConnection();
    if (isBackendConnected) {
      const response = await axiosInstance.post('/orders', orderData);
      return response.data;
    } else {
      const newOrder = {
        _id: 'order-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        orderItems: orderData.orderItems,
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
        itemsPrice: orderData.itemsPrice,
        taxPrice: orderData.taxPrice,
        shippingPrice: orderData.shippingPrice,
        totalPrice: orderData.totalPrice,
        isPaid: orderData.paymentMethod === 'Cash on Delivery' ? false : true,
        paidAt: orderData.paymentMethod === 'Cash on Delivery' ? null : new Date().toISOString(),
        status: 'Pending',
        createdAt: new Date().toISOString()
      };
      
      // Deduct mock stocks
      newOrder.orderItems.forEach(item => {
        const prod = mockProducts.find(p => p._id === item.product);
        if (prod) prod.stock = Math.max(0, prod.stock - item.qty);
      });

      mockOrders.unshift(newOrder);
      return newOrder;
    }
  },

  getMyOrders: async () => {
    await checkBackendConnection();
    if (isBackendConnected) {
      const response = await axiosInstance.get('/orders/myorders');
      return response.data;
    } else {
      return mockOrders;
    }
  },

  getOrderDetails: async (id) => {
    await checkBackendConnection();
    if (isBackendConnected) {
      const response = await axiosInstance.get(`/orders/${id}`);
      return response.data;
    } else {
      const order = mockOrders.find(o => o._id === id);
      if (!order) throw new Error('Order not found');
      return order;
    }
  },

  payOrder: async (orderId, paymentPayload = {}) => {
    await checkBackendConnection();
    if (isBackendConnected) {
      const response = await axiosInstance.put(`/orders/${orderId}/pay`, paymentPayload);
      return response.data;
    } else {
      const index = mockOrders.findIndex(o => o._id === orderId);
      if (index === -1) throw new Error('Order not found');
      
      mockOrders[index].isPaid = true;
      mockOrders[index].paidAt = new Date().toISOString();
      mockOrders[index].status = 'Processing';
      mockOrders[index].paymentResult = {
        id: paymentPayload.id || 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        status: 'success',
        update_time: new Date().toISOString()
      };

      return mockOrders[index];
    }
  },

  // --- Admin Methods ---
  getAdminOrders: async () => {
    await checkBackendConnection();
    if (isBackendConnected) {
      const response = await axiosInstance.get('/orders');
      return response.data;
    } else {
      return mockOrders;
    }
  },

  updateOrderStatus: async (orderId, status) => {
    await checkBackendConnection();
    if (isBackendConnected) {
      const response = await axiosInstance.put(`/orders/${orderId}/status`, { status });
      return response.data;
    } else {
      const index = mockOrders.findIndex(o => o._id === orderId);
      if (index === -1) throw new Error('Order not found');
      mockOrders[index].status = status;
      if (status === 'Delivered') {
        mockOrders[index].isDelivered = true;
        mockOrders[index].deliveredAt = new Date().toISOString();
      }
      return mockOrders[index];
    }
  },

  createProduct: async (productData) => {
    await checkBackendConnection();
    if (isBackendConnected) {
      const response = await axiosInstance.post('/products', productData);
      return response.data;
    } else {
      const newProd = {
        _id: 'prod-' + Math.random().toString(36).substr(2, 9),
        name: productData.name,
        description: productData.description,
        price: Number(productData.price),
        category: productData.category,
        stock: Number(productData.stock),
        imageUrl: productData.imageUrl || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60',
        rating: 0,
        numReviews: 0,
        reviews: []
      };
      mockProducts.unshift(newProd);
      return newProd;
    }
  },

  updateProduct: async (id, productData) => {
    await checkBackendConnection();
    if (isBackendConnected) {
      const response = await axiosInstance.put(`/products/${id}`, productData);
      return response.data;
    } else {
      const index = mockProducts.findIndex(p => p._id === id);
      if (index === -1) throw new Error('Product not found');
      
      mockProducts[index] = {
        ...mockProducts[index],
        name: productData.name,
        description: productData.description,
        price: Number(productData.price),
        category: productData.category,
        stock: Number(productData.stock),
        imageUrl: productData.imageUrl
      };
      return mockProducts[index];
    }
  },

  deleteProduct: async (id) => {
    await checkBackendConnection();
    if (isBackendConnected) {
      const response = await axiosInstance.delete(`/products/${id}`);
      return response.data;
    } else {
      mockProducts = mockProducts.filter(p => p._id !== id);
      return { message: 'Product removed successfully' };
    }
  },

  getAdminAnalytics: async () => {
    await checkBackendConnection();
    if (isBackendConnected) {
      const response = await axiosInstance.get('/admin/dashboard');
      return response.data;
    } else {
      // Calculate mock metrics
      const totalSales = mockOrders.filter(o => o.isPaid).reduce((acc, o) => acc + o.totalPrice, 0);
      const lowStockProducts = mockProducts.filter(p => p.stock < 5);
      
      // Category Breakdown Mock
      const categorySalesMap = {};
      mockOrders.filter(o => o.isPaid).forEach(o => {
        o.orderItems.forEach(item => {
          const prod = mockProducts.find(p => p._id === item.product);
          const cat = prod ? prod.category : 'General';
          categorySalesMap[cat] = (categorySalesMap[cat] || 0) + (item.price * item.qty);
        });
      });

      const categorySales = Object.entries(categorySalesMap).map(([name, val]) => ({
        _id: name,
        totalRevenue: val
      }));

      return {
        summary: {
          totalSales,
          totalOrdersCount: mockOrders.length,
          paidOrdersCount: mockOrders.filter(o => o.isPaid).length,
          totalProductsCount: mockProducts.length,
          totalUsersCount: 3
        },
        lowStockProducts,
        categorySales,
        recentOrders: mockOrders.slice(0, 5)
      };
    }
  }
};
