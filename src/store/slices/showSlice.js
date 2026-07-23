import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosConfig';
import API from '../../api/endpoints';

// ─── Fetch all shows ───
export const fetchShows = createAsyncThunk(
  'shows/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API.SHOWS);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch shows' });
    }
  }
);

// ─── Fetch shows by movie ───
export const fetchShowsByMovie = createAsyncThunk(
  'shows/fetchByMovie',
  async (movieId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API.SHOWS_BY_MOVIE(movieId));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to fetch shows' });
    }
  }
);

// ─── Add show ───
export const addShow = createAsyncThunk(
  'shows/add',
  async (showData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(API.SHOWS, showData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to add show' });
    }
  }
);

// ─── Update show ───
export const updateShow = createAsyncThunk( // --> Currently we don't have DELETE or UPDATE shows functionality in backend 
  'shows/update',
  async ({ id, showData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`${API.SHOWS}/${id}`, showData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update show' });
    }
  }
);

// ─── Delete show ───
export const deleteShow = createAsyncThunk( // --> Currently we don't have DELETE or UPDATE shows functionality in backend 
  'shows/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${API.SHOWS}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Failed to delete show' });
    }
  }
);

const initialState = {
  shows: [],           // ✅ Main array for ALL shows
  showsByMovie: [],    // ✅ For movie-specific shows (optional)
  selectedShow: null,
  isLoading: false,
  error: null,
};

const showSlice = createSlice({
  name: 'shows',
  initialState,
  reducers: {
    clearSelectedShow: (state) => {
      state.selectedShow = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Fetch all shows ──
      .addCase(fetchShows.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchShows.fulfilled, (state, action) => {
        state.isLoading = false;
        state.shows = action.payload;  // ✅ Store in 'shows'
      })
      .addCase(fetchShows.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch shows';
      })

      // ── Fetch shows by movie ──
      .addCase(fetchShowsByMovie.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchShowsByMovie.fulfilled, (state, action) => {
        state.isLoading = false;
        state.showsByMovie = action.payload;  // ✅ Store in 'showsByMovie'
      })
      .addCase(fetchShowsByMovie.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch shows';
      });
  },
});

export const { clearSelectedShow, clearError } = showSlice.actions;
export default showSlice.reducer;