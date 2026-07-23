import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosConfig';
import API from '../../api/endpoints';

// ✅ Fetch all movies
export const fetchMovies = createAsyncThunk(
    'movies/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(API.MOVIES);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to fetch movies' });
        }
    }
);

// ✅ Fetch movie by ID
export const fetchMovieById = createAsyncThunk(
    'movies/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(API.MOVIE_BY_ID(id));
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Movie not found' });
        }
    }
);

// ✅ Search movies
export const searchMovies = createAsyncThunk(
    'movies/search',
    async (title, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`${API.MOVIE_SEARCH}?title=${title}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Search failed' });
        }
    }
);

// ✅ Add movie (Admin only)
export const addMovie = createAsyncThunk(
    'movies/add',
    async (movieData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(API.MOVIES, movieData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to add movie' });
        }
    }
);

// ✅ Update movie (Admin only)
export const updateMovie = createAsyncThunk(  // --> Currently we don't have DELETE or UPDATE movie functionality in backend 
    'movies/update',
    async ({ id, movieData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(API.MOVIE_BY_ID(id), movieData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to update movie' });
        }
    }
);

// ✅ Delete movie (Admin only)
export const deleteMovie = createAsyncThunk(  // --> Currently we don't have DELETE or UPDATE movie functionality in backend 
    'movies/delete',
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(API.MOVIE_BY_ID(id));
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to delete movie' });
        }
    }
);

const initialState = {
    movies: [],
    selectedMovie: null,
    isLoading: false,
    error: null,
};

const movieSlice = createSlice({
    name: 'movies',
    initialState,
    reducers: {
        clearSelectedMovie: (state) => {
            state.selectedMovie = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // 📋 Fetch all movies
            .addCase(fetchMovies.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchMovies.fulfilled, (state, action) => {
                state.isLoading = false;
                state.movies = action.payload;
            })
            .addCase(fetchMovies.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || 'Failed to fetch movies';
            })
            
            // 🎬 Fetch movie by ID
            .addCase(fetchMovieById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchMovieById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selectedMovie = action.payload;
            })
            .addCase(fetchMovieById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || 'Movie not found';
            })
            
            // ➕ Add movie
            .addCase(addMovie.fulfilled, (state, action) => {
                state.movies.push(action.payload);
            })
            
            // ✏️ Update movie
            .addCase(updateMovie.fulfilled, (state, action) => {
                const index = state.movies.findIndex(m => m.id === action.payload.id);
                if (index !== -1) {
                    state.movies[index] = action.payload;
                }
                state.selectedMovie = action.payload;
            })
            
            // 🗑️ Delete movie
            .addCase(deleteMovie.fulfilled, (state, action) => {
                state.movies = state.movies.filter(m => m.id !== action.payload);
            });
    },
});

export const { clearSelectedMovie, clearError } = movieSlice.actions;
export default movieSlice.reducer;