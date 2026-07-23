// src/api/endpoints.js
const API = {
  // ===== AUTH =====
  AUTH_REGISTER: '/users/register', // this is /users/register and not /auth
  AUTH_LOGIN: '/users/login',
//   AUTH_ME: '/api/use/me',
  
  // ===== USERS =====
  USERS: '/users',
  USER_BY_ID: (id) => `/users/${id}`,
  
  // ===== MOVIES =====
  MOVIES: '/movies',
  MOVIE_BY_ID: (id) => `/movies/${id}`,
  MOVIE_SEARCH: '/movies/search',
  MOVIE_BY_GENRE: (genre) => `/movies/genre/${genre}`,
  MOVIE_BY_LANGUAGE: (language) => `/movies/language/${language}`,
  
  // ===== THEATERS =====
  THEATERS: '/theaters',
  THEATER_BY_ID: (id) => `/theaters/${id}`,
  THEATERS_BY_CITY: (cityId) => `/theaters/city/${cityId}`,
  
  // ===== SCREENS =====
  SCREENS: '/screens',
  SCREEN_BY_ID: (id) => `/screens/${id}`,
  SCREENS_BY_THEATER: (theaterId) => `/screens/theater/${theaterId}`,
  
  // ===== SEATS =====
  SEATS: '/seats',
  SEAT_BY_ID: (id) => `/seats/${id}`,
  SEATS_BY_SCREEN: (screenId) => `/seats/screen/${screenId}`,
  
  // ===== SHOWS =====
  SHOWS: '/shows',
  SHOW_BY_ID: (id) => `/shows/${id}`,
  SHOWS_BY_MOVIE: (movieId) => `/shows/movie/${movieId}`,
  SHOWS_BY_MOVIE_AND_DATE: (movieId) => `/shows/movie/${movieId}/date`,
  SHOWS_BY_SCREEN: (screenId) => `/shows/screen/${screenId}`,
  
  // ===== BOOKINGS =====
  BOOKINGS: '/bookings',
  BOOKING_BY_ID: (id) => `/bookings/${id}`,
  BOOKINGS_BY_USER: (userId) => `/bookings/user/${userId}`,
  CANCEL_BOOKING: (id) => `/bookings/${id}/cancel`,
  AVAILABLE_SEATS: (showId) => `/bookings/show/${showId}/available-seats`,
  
  // ===== CITIES =====
  CITIES: '/cities',
  CITY_BY_ID: (id) => `/cities/${id}`,
};

export default API;