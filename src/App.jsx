import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { store } from "./store";

// Pages
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetailPage from "./pages/MovieDetailPage";
import BookingPage from "./pages/BookingPage";
import BookingConfirmation from "./pages/BookingConfirmation";
import MyBookings from "./pages/MyBookings";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminPage from "./pages/AdminPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./components/admin/AdminDashboard";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import PrivacyPolicay from "./pages/PrivacyPolicay";
import TermsAndCondition from "./pages/TermsAndCondition";
import AdminMovies from "./components/admin/AdminMovies";
import ManageTheaters from "./components/admin/ManageTheaters";
import ManageShows from "./components/admin/ManageShows";
import ManageBookings from "./components/admin/ManageBookings";
import AdminUsers from "./components/admin/AdminUsers";

// ✅ Periodic token check (optional)
// In App.jsx or main.jsx
setInterval(() => {
  const token = localStorage.getItem('token');
  if (token && isTokenExpired(token)) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
}, 60000);  // Check every minute

// Components
// import Navbar from "./components/common/Navbar";
// import Footer from "./components/common/Footer";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Styles
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

function App() {
  return (
    <Provider store={store}>
      <Router>
        {/* <div className="min-h-screen flex flex-col bg-gray-100"> */}
        {/* <Navbar /> */}
        {/* <main className="flex-grow container mx-auto px-4 py-8"> */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movies/:id" element={<MovieDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<PrivacyPolicay />} />
          <Route path="/terms" element={<TermsAndCondition />} />
          
          {/* Protected Routes (User) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/bookings" element={<MyBookings />} />
            <Route path="/booking/movie/:movieId" element={<BookingPage />} />
            <Route
              path="/booking/confirmation/:bookingId"
              element={<BookingConfirmation />}
            />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Protected Routes (Admin) */}
          <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
            <Route path="/admin" element={<AdminPage />}>
              <Route index element={<AdminDashboard />} />
              <Route path="movies" element={<AdminMovies />} />
              <Route path="theaters" element={<ManageTheaters />} />
              <Route path="shows" element={<ManageShows />} />
              <Route path="bookings" element={<ManageBookings />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        {/* </main> */}
        {/* <Footer /> */}
        <ToastContainer position="top-right" autoClose={3000} />
        {/* </div> */}
      </Router>
    </Provider>
  );
}

export default App;
