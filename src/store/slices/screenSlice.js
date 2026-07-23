// src/store/slices/screenSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosConfig';
import API from '../../api/endpoints';

// ─── Async Thunks ─────────────────────────────────────────────────────────────

// ✅ Fetch all screens
export const fetchScreens = createAsyncThunk(
  'screens/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API.SCREENS);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch screens' });
    }
  }
);

// ✅ Fetch screens by theater
export const fetchScreensByTheater = createAsyncThunk(
  'screens/fetchByTheater',
  async (theaterId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API.SCREENS_BY_THEATER(theaterId));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch screens' });
    }
  }
);

// ✅ Fetch screen by ID
export const fetchScreenById = createAsyncThunk(
  'screens/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API.SCREEN_BY_ID(id));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Screen not found' });
    }
  }
);

// ✅ Add a new screen (Admin only)
export const addScreen = createAsyncThunk(
  'screens/add',
  async (screenData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(API.SCREENS, screenData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to add screen' });
    }
  }
);

// ✅ Update a screen (Admin only)
export const updateScreen = createAsyncThunk( // --> Currently we don't have DELETE or UPDATE screens functionality in backend 
  'screens/update',
  async ({ id, screenData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`${API.SCREENS}/${id}`, screenData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update screen' });
    }
  }
);

// ✅ Delete a screen (Admin only)
export const deleteScreen = createAsyncThunk( // --> Currently we don't have DELETE or UPDATE screens functionality in backend 
  'screens/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${API.SCREENS}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete screen' });
    }
  }
);

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState = {
  screens: [],
  selectedScreen: null,
  isLoading: false,
  error: null,
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const screenSlice = createSlice({
  name: 'screens',
  initialState,
  reducers: {
    clearSelectedScreen: (state) => {
      state.selectedScreen = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Fetch all screens ──
      .addCase(fetchScreens.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchScreens.fulfilled, (state, action) => {
        state.isLoading = false;
        state.screens = action.payload;
      })
      .addCase(fetchScreens.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch screens';
      })

      // ── Fetch screens by theater ──
      .addCase(fetchScreensByTheater.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchScreensByTheater.fulfilled, (state, action) => {
        state.isLoading = false;
        state.screens = action.payload;
      })
      .addCase(fetchScreensByTheater.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch screens';
      })

      // ── Fetch screen by ID ──
      .addCase(fetchScreenById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchScreenById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedScreen = action.payload;
      })
      .addCase(fetchScreenById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Screen not found';
      })

      // ── Add screen ──
      .addCase(addScreen.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addScreen.fulfilled, (state, action) => {
        state.isLoading = false;
        state.screens.push(action.payload);
      })
      .addCase(addScreen.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to add screen';
      })

      // ── Update screen ──
      .addCase(updateScreen.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateScreen.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.screens.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.screens[index] = action.payload;
        }
        state.selectedScreen = action.payload;
      })
      .addCase(updateScreen.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to update screen';
      })

      // ── Delete screen ──
      .addCase(deleteScreen.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteScreen.fulfilled, (state, action) => {
        state.isLoading = false;
        state.screens = state.screens.filter((s) => s.id !== action.payload);
      })
      .addCase(deleteScreen.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to delete screen';
      });
  },
});

export const { clearSelectedScreen, clearError } = screenSlice.actions;
export default screenSlice.reducer;