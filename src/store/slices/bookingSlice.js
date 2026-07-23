// src/store/slices/bookingSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosConfig";
import API from "../../api/endpoints";

export const createBooking = createAsyncThunk(
  "bookings/create",
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(API.BOOKINGS, bookingData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to create booking" },
      );
    }
  },
);

export const fetchBookingById = createAsyncThunk(
  "bookings/fetchById",
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API.BOOKING_BY_ID(bookingId));
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Booking not found" },
      );
    }
  },
);

export const fetchBookingsByUser = createAsyncThunk(
  "bookings/fetchByUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API.BOOKINGS_BY_USER(userId));
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch bookings" },
      );
    }
  },
);

// ✅ fetchAllBookings
export const fetchAllBookings = createAsyncThunk(
  "bookings/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API.BOOKINGS);
      const data = Array.isArray(response.data) ? response.data : [];
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch all bookings" },
      );
    }
  },
);

export const cancelBooking = createAsyncThunk(
  "bookings/cancel",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(API.CANCEL_BOOKING(id));
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to cancel booking" },
      );
    }
  },
);

const initialState = {
  bookings: [],
  selectedBooking: null,
  isLoading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    clearSelectedBooking: (state) => {
      state.selectedBooking = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedBooking = action.payload;
        state.bookings.push(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to create booking";
      })

      .addCase(fetchBookingById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedBooking = action.payload;
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Booking not found";
      })

      .addCase(fetchBookingsByUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBookingsByUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookingsByUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to fetch bookings";
      })

      // ✅ fetchAllBookings
      .addCase(fetchAllBookings.pending, (state) => {
        console.log("🟢 fetchAllBookings PENDING");
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        console.log("🟢 fetchAllBookings FULFILLED");
        console.log("🟢 Action Payload:", action.payload);
        console.log("🟢 Is array?", Array.isArray(action.payload));
        
        state.isLoading = false;
        state.bookings = Array.isArray(action.payload) ? action.payload : [];
        
        console.log("🟢 New state.bookings.length:", state.bookings.length);
      })
      .addCase(fetchAllBookings.rejected, (state, action) => {
        console.log("🔴 fetchAllBookings REJECTED");
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to fetch bookings";
      })

      .addCase(cancelBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.bookings.findIndex(
          (b) => b.id === action.payload.id,
        );
        if (index !== -1) state.bookings[index] = action.payload;
        state.selectedBooking = action.payload;
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to cancel booking";
      });
  },
});

export const { clearSelectedBooking, clearError } = bookingSlice.actions;
export default bookingSlice.reducer;