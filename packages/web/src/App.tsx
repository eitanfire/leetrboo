import React from "react";
    import { MantineProvider } from "@mantine/core";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthRedirect } from "./AuthRedirect";
import LeetrbooApp from "./LeetrbooApp";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import ResetPassword from "./ResetPassword";
import SetNewPassword from "./SetNewPassword";
import './App.css';

const App: React.FC = () => {
  return (
    <MantineProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
              <Route path="/auth/callback" element={<AuthRedirect />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/set-new-password" element={<SetNewPassword />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<LeetrbooApp />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </MantineProvider>
  );
};

export default App;
