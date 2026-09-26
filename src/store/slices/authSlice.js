// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosConfig";
import API from "../../api/endpoints";

// ✅ Secret Key for Admin Registration (Frontend validation only)
const ADMIN_SECRET_KEY = import.meta.env.VITE_ADMIN_SECRET_KEY;

// ✅ Register User - Backend handles both registration + login
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      //  Register
      await axiosInstance.post(API.AUTH_REGISTER, {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        secretKey: userData.secretKey || null,
      });

      //  Turant login karo — real JWT + cookie milegi
      const loginResponse = await axiosInstance.post(API.AUTH_LOGIN, {
        email: userData.email,
        password: userData.password,
      });

      return loginResponse.data; //  { token, user }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Registration failed" },
      );
    }
  },
);

// ✅ Login User - Backend validates credentials
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(API.AUTH_LOGIN, {
        email: credentials.email,
        password: credentials.password,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Invalid email or password" },
      );
    }
  },
);

// ✅ Fetch all users (Admin only)
export const fetchUsers = createAsyncThunk(
  "auth/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API.USERS);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch users" },
      );
    }
  },
);

// ✅ Get current user from token
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API.AUTH_ME);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch user" },
      );
    }
  },
);

// ✅ Logout - tell the server to clear the httpOnly refresh cookie, then clear local state
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  try {
    await axiosInstance.post(API.AUTH_LOGOUT); // '/users/logout'
  } catch (e) {
    // even if the server call fails (network blip, already-invalid cookie),
    // we still want to clear local state in .fulfilled below
  }
  return true;
});

// ✅ Bootstrap auth on app load. Runs once, before ProtectedRoute makes any
// redirect decision. If the stored access token looks expired, it doesn't
// immediately log the user out — it tries a silent refresh first, since the
// httpOnly refresh cookie may still be valid even though the short-lived
// access token has expired (e.g. after sitting on a page for a while, or a
// page reload). Only if that refresh attempt also fails do we actually clear
// the session.
export const bootstrapAuth = createAsyncThunk(
  "auth/bootstrap",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");

    if (!token) {
      return rejectWithValue(null);
    }

    if (!isTokenExpired(token)) {
      // Still valid, nothing to do.
      return { token };
    }

    // Access token looks expired — attempt a silent refresh using the
    // httpOnly refresh cookie before giving up.
    try {
      const res = await axiosInstance.post(
        "/users/refresh-token",
        {},
        { withCredentials: true },
      );
      const newToken = res.data.accessToken;
      localStorage.setItem("token", newToken);
      return { token: newToken };
    } catch (err) {
      // Refresh failed too (cookie expired/invalid/missing) — actually log out,
      // including clearing the refresh cookie server-side.
      try {
        await axiosInstance.post(API.AUTH_LOGOUT);
      } catch (e) {
        // ignore — we're clearing local state regardless
      }
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      return rejectWithValue(null);
    }
  },
);

// ✅ Helper: Check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp * 1000;
    // ✅ 5 seconds grace period
    const gracePeriod = 5000;
    return Date.now() >= exp + gracePeriod;
  } catch (e) {
    return true;
  }
};

// ✅ Initial state — read what's in storage as-is. We deliberately do NOT
// decide here whether the token is expired and wipe storage synchronously:
// that decision now happens in bootstrapAuth, which gets a chance to try a
// silent refresh first. Doing it eagerly here (before any refresh attempt)
// was what caused a valid session to be logged out on every page reload
// once the short-lived access token expired.
const getUserFromStorage = () => {
  try {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  } catch (e) {
    return null;
  }
};

const initialState = {
  user: getUserFromStorage(),
  token: localStorage.getItem("token") || null,
  users: [],
  isLoading: false,
  error: null,
  // Tracks whether bootstrapAuth has finished running. ProtectedRoute should
  // wait for this to be true (showing a spinner/blank state) before deciding
  // to redirect to /login, otherwise it'll redirect based on a stale token
  // before the silent-refresh attempt has had a chance to run.
  authChecked: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    tokenRefreshed: (state, action) => {
      state.token = action.payload;
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
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Registration failed";
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
        state.authChecked = true;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Login failed";
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
        state.error = action.payload?.message || "Failed to fetch users";
      })

      // ==================== FETCH CURRENT USER ====================
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to fetch user";
        state.user = null;
        state.token = null;
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      })

      // ==================== LOGOUT ====================
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      })

      // ==================== BOOTSTRAP (silent refresh on app load) ====================
      .addCase(bootstrapAuth.pending, (state) => {
        // authChecked stays false while this runs — ProtectedRoute should
        // show a loading state, not redirect, during this window.
      })
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.authChecked = true;
      })
      .addCase(bootstrapAuth.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.authChecked = true;
      });
  },
});

export const { clearError, setUser, tokenRefreshed  } = authSlice.actions;
export default authSlice.reducer;
