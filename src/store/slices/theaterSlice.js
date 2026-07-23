import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosConfig';
import API from '../../api/endpoints';

export const fetchTheaters = createAsyncThunk(
    'theaters/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(API.THEATERS);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to fetch theaters' });
        }
    }
);

export const fetchTheaterById = createAsyncThunk(
    'theaters/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(API.THEATER_BY_ID(id));
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Theater not found' });
        }
    }
);

export const fetchTheatersByCity = createAsyncThunk(
    'theaters/fetchByCity',
    async (cityId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(API.THEATERS_BY_CITY(cityId));
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to fetch theaters by city' });
        }
    }
);

export const addTheater = createAsyncThunk(
    'theaters/add',
    async (theaterData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(API.THEATERS, theaterData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to add theater' });
        }
    }
);

export const updateTheater = createAsyncThunk( // --> Currently we don't have DELETE or UPDATE theaters functionality in backend 
    'theaters/update',
    async ({ id, theaterData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(API.THEATER_BY_ID(id), theaterData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to update theater' });
        }
    }
);

export const deleteTheater = createAsyncThunk( // --> Currently we don't have DELETE or UPDATE theaters functionality in backend 
    'theaters/delete',
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(API.THEATER_BY_ID(id));
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to delete theater' });
        }
    }
);

const initialState = {
    theaters: [],
    selectedTheater: null,
    isLoading: false,
    error: null,
};

const theaterSlice = createSlice({
    name: 'theaters',
    initialState,
    reducers: {
        clearSelectedTheater: (state) => {
            state.selectedTheater = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTheaters.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchTheaters.fulfilled, (state, action) => {
                state.isLoading = false;
                state.theaters = action.payload;
            })
            .addCase(fetchTheaters.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || 'Failed to fetch theaters';
            })

            .addCase(fetchTheaterById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchTheaterById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selectedTheater = action.payload;
            })
            .addCase(fetchTheaterById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || 'Theater not found';
            })

            .addCase(fetchTheatersByCity.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchTheatersByCity.fulfilled, (state, action) => {
                state.isLoading = false;
                state.theaters = action.payload;
            })
            .addCase(fetchTheatersByCity.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || 'Failed to fetch theaters by city';
            })

            .addCase(addTheater.fulfilled, (state, action) => {
                state.theaters.push(action.payload);
            })

            .addCase(updateTheater.fulfilled, (state, action) => {
                const index = state.theaters.findIndex(t => t.id === action.payload.id);
                if (index !== -1) state.theaters[index] = action.payload;
                state.selectedTheater = action.payload;
            })

            .addCase(deleteTheater.fulfilled, (state, action) => {
                state.theaters = state.theaters.filter(t => t.id !== action.payload);
            });
    },
});

export const { clearSelectedTheater, clearError } = theaterSlice.actions;
export default theaterSlice.reducer;