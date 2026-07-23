import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosConfig';
import API from '../../api/endpoints';

export const fetchSeatsByScreen = createAsyncThunk(
    'seats/fetchByScreen',
    async (screenId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(API.SEATS_BY_SCREEN(screenId));
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to fetch seats' });
        }
    }
);

export const fetchSeatById = createAsyncThunk(
    'seats/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(API.SEAT_BY_ID(id));
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Seat not found' });
        }
    }
);

export const fetchAvailableSeats = createAsyncThunk(
    'seats/fetchAvailable',
    async (showId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(API.AVAILABLE_SEATS(showId));
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to fetch available seats' });
        }
    }
);

export const addSeat = createAsyncThunk(
    'seats/add',
    async (seatData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(API.SEATS_BY_SCREEN(seatData.screenId), seatData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to add seat' });
        }
    }
);

export const updateSeat = createAsyncThunk(
    'seats/update',
    async ({ id, seatData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(API.SEAT_BY_ID(id), seatData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to update seat' });
        }
    }
);

export const deleteSeat = createAsyncThunk(
    'seats/delete',
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(API.SEAT_BY_ID(id));
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to delete seat' });
        }
    }
);

const initialState = {
    seats: [],
    availableSeats: [],
    selectedSeats: [],       // seats user has picked on the seat map
    selectedSeat: null,
    isLoading: false,
    error: null,
};

const seatSlice = createSlice({
    name: 'seats',
    initialState,
    reducers: {
        selectSeat: (state, action) => {
            const seat = action.payload;
            const alreadySelected = state.selectedSeats.find(s => s.id === seat.id);
            if (alreadySelected) {
                state.selectedSeats = state.selectedSeats.filter(s => s.id !== seat.id);
            } else {
                state.selectedSeats.push(seat);
            }
        },
        clearSelectedSeats: (state) => {
            state.selectedSeats = [];
        },
        clearAvailableSeats: (state) => {
            state.availableSeats = [];
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSeatsByScreen.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchSeatsByScreen.fulfilled, (state, action) => {
                state.isLoading = false;
                state.seats = action.payload;
            })
            .addCase(fetchSeatsByScreen.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || 'Failed to fetch seats';
            })

            .addCase(fetchSeatById.fulfilled, (state, action) => {
                state.selectedSeat = action.payload;
            })

            .addCase(fetchAvailableSeats.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAvailableSeats.fulfilled, (state, action) => {
                state.isLoading = false;
                state.availableSeats = action.payload;
            })
            .addCase(fetchAvailableSeats.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload?.message || 'Failed to fetch available seats';
            })

            .addCase(addSeat.fulfilled, (state, action) => {
                state.seats.push(action.payload);
            })

            .addCase(updateSeat.fulfilled, (state, action) => {
                const index = state.seats.findIndex(s => s.id === action.payload.id);
                if (index !== -1) state.seats[index] = action.payload;
            })

            .addCase(deleteSeat.fulfilled, (state, action) => {
                state.seats = state.seats.filter(s => s.id !== action.payload);
            });
    },
});

export const { selectSeat, clearSelectedSeats, clearAvailableSeats, clearError } = seatSlice.actions;
export default seatSlice.reducer;