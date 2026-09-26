// src/components/auth/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

// NOTE: this component used to decode the JWT and check `exp` itself, on
// every render, and would immediately wipe localStorage + redirect the
// moment it looked expired — with no attempt to refresh first. That ran
// independently of bootstrapAuth and the axios interceptor, so even when
// those correctly refreshed the token, this component could still yank you
// to /login in the meantime. Token-freshness decisions now live in one
// place only: the bootstrapAuth thunk (see authSlice.js). This component's
// only job is to wait for that check to finish (authChecked) and then trust
// whatever Redux currently says about `user`/`token`.

const ProtectedRoute = ({ requiredRole }) => {
  const { user, token, authChecked } = useSelector((s) => s.auth);

  // Bootstrap (including a possible silent refresh) hasn't finished yet —
  // don't make a redirect decision on stale/incomplete info. Render nothing
  // (or swap this for a spinner/skeleton) until it resolves.
  if (!authChecked) {
    return null;
  }

  // Bootstrap finished and there's no valid session.
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  // Role check for admin-only routes.
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;