import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Spinner, Container } from "reactstrap";
import { useAuth } from "../contexts/AuthContext";

export const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log("Protected Route - Auth State:", {
      user,
      loading,
      path: location.pathname,
    });
  }, [user, loading, location]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner />
      </Container>
    );
  }

  if (!user) {
    // Redirect to signin while preserving the attempted URL
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
