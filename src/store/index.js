import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import movieReducer from './slices/movieSlice';
import theaterReducer from './slices/theaterSlice';
import showReducer from './slices/showSlice';
import bookingReducer from './slices/bookingSlice';
import seatReducer from './slices/seatSlice';
import screenReducer from './slices/screenSlice';  
import cityReducer from './slices/citySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    movies: movieReducer,
    theaters: theaterReducer,
    shows: showReducer,
    bookings: bookingReducer,
    seats: seatReducer,
    screens: screenReducer,  
    cities: cityReducer,
  },
});

export default store;