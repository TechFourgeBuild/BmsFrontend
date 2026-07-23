// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosConfig';
import API from '../../api/endpoints';

// ✅ Secret Key for Admin Registration (Frontend validation only)
const ADMIN_SECRET_KEY = import.meta.env.VITE_ADMIN_SECRET_KEY;

// ✅ Register User - Backend handles both registration + login
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(API.AUTH_REGISTER, {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        secretKey: userData.secretKey || null,
      });

      // console.log("userData :- ",userData);
      // console.log("secretKey :- ",userData.secretKey);

      // ✅ Backend sirf User return kar raha hai, token nahi
      // ✅ Hum manually token generate kar rahe hain (dummy)
      const user = response.data;
      
      return {
        user: user,
        token: `dummy-token-${Date.now()}`  // ✅ Temporary token
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Registration failed" }
      );
    }
  }
);

// ✅ Login User - Backend validates credentials
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(API.AUTH_LOGIN, {
        email: credentials.email,
        password: credentials.password,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Invalid email or password" }
      );
    }
  }
);

// ✅ Fetch all users (Admin only)
export const fetchUsers = createAsyncThunk(
  'auth/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API.USERS);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch users" }
      );
    }
  }
);

// ✅ Get current user from token
export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API.AUTH_ME);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch user" }
      );
    }
  }
);

// ✅ Helper: Check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));  // Decode JWT
    const exp = payload.exp * 1000;  // Convert to milliseconds
    return Date.now() >= exp;
  } catch (e) {
    return true;  // Invalid token = expired
  }
};

// ✅ Initial state - Check token expiry
const getUserFromStorage = () => {
  try {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    // ✅ If token expired, clear everything
    if (token && isTokenExpired(token)) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return null;
    }
    
    return userData ? JSON.parse(userData) : null;
  } catch (e) {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return null;
  }
};

const getTokenFromStorage = () => {
  const token = localStorage.getItem('token');
  if (token && isTokenExpired(token)) {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return null;
  }
  return token;
};

const initialState = {
  user: getUserFromStorage(),
  token: localStorage.getItem('token') || null,
  users: [],
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // ==================== REGISTER ====================
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Registration failed';
      })

      // ==================== LOGIN ====================
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Login failed';
      })

      // ==================== FETCH USERS ====================
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch users';
      })

      // ==================== FETCH CURRENT USER ====================
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch user';
        state.user = null;
        state.token = null;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      });
  },
});

export const { logout, clearError, setUser } = authSlice.actions;
export default authSlice.reducer;