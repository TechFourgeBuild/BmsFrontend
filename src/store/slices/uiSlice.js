import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoading: false,
    notification: null,   // { type: 'success' | 'error' | 'info', message: string }
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        showLoading: (state) => {
            state.isLoading = true;
        },
        hideLoading: (state) => {
            state.isLoading = false;
        },
        setNotification: (state, action) => {
            state.notification = action.payload;
        },
        clearNotification: (state) => {
            state.notification = null;
        },
    },
});

export const { showLoading, hideLoading, setNotification, clearNotification } = uiSlice.actions;
export default uiSlice.reducer;