import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import { Container, Row, Col, Spinner } from "reactstrap";
import { useAuth } from "./hooks/useAuth";
import LeetrbooApp from "./LeetrbooApp";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import ResetPassword from "./ResetPassword";
import SetNewPassword from "./SetNewPassword";
import { AuthRedirect } from "./AuthRedirect";

    <Routes>
      <Route path="/auth/callback" element={<AuthRedirect />} />;
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/set-new-password" element={<SetNewPassword />} />
    </Routes>;
    
const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner />
      </Container>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};

// Auth Layout wrapper
const AuthLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner />
      </Container>
    );
  }

  // Modify this check to allow access to set-new-password route even with a session
  const isPasswordResetRoute = window.location.pathname === "/set-new-password";
  if (user && !isPasswordResetRoute) {
    return <Navigate to="/" replace />;
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Outlet />
        </Col>
      </Row>
    </Container>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <LeetrbooApp />,
      },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "signin",
        element: <SignIn />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "set-new-password",
        element: <SetNewPassword />,
      },
    ],
  },
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
