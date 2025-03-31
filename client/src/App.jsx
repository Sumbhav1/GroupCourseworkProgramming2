import LoginPage from "./pages/LoginPage";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  const token = localStorage.getItem("token"); //get user token

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={token ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route exact path="/sign-up" element={<SignUp />} />
        <Route 
          path="/dashboard" 
          element={token ? <Dashboard /> : <Navigate to="/" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
