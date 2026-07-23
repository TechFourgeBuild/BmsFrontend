// src/store/slices/citySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosConfig';
import API from '../../api/endpoints';

// ─── Async Thunks ─────────────────────────────────────────────────────────────

// ✅ Fetch all cities
export const fetchCities = createAsyncThunk(
  'cities/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API.CITIES);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch cities' });
    }
  }
);

// ✅ Add a new city (Admin only)
export const addCity = createAsyncThunk(
  'cities/add',
  async (cityData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(API.CITIES, cityData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to add city' });
    }
  }
);

// ✅ Update a city (Admin only)
export const updateCity = createAsyncThunk( // --> Currently we don't have DELETE or UPDATE city functionality in backend 
  'cities/update',
  async ({ id, cityData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`${API.CITIES}/${id}`, cityData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update city' });
    }
  }
);

// ✅ Delete a city (Admin only)
export const deleteCity = createAsyncThunk( // --> Currently we don't have DELETE or UPDATE city functionality in backend 
  'cities/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${API.CITIES}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete city' });
    }
  }
);

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState = {
  cities: [],
  isLoading: false,
  error: null,
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const citySlice = createSlice({
  name: 'cities',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Fetch all cities ──
      .addCase(fetchCities.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cities = action.payload;
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch cities';
      })

      // ── Add city ──
      .addCase(addCity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addCity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cities.push(action.payload);
      })
      .addCase(addCity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to add city';
      })

      // ── Update city ──
      .addCase(updateCity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCity.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.cities.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.cities[index] = action.payload;
        }
      })
      .addCase(updateCity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to update city';
      })

      // ── Delete city ──
      .addCase(deleteCity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cities = state.cities.filter((c) => c.id !== action.payload);
      })
      .addCase(deleteCity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to delete city';
      });
  },
});

export const { clearError } = citySlice.actions;
export default citySlice.reducer;