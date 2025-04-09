
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ requireSettingsComplete = true }) => {
    const { user } = useAuth();
    
    // Delay redirection until user state is checked
    if (user === null) {
      return <div>Loading...</div>;  // Show loading screen until the user state is set
    }
  
    if (!user) {
      return <Navigate to="/login" replace />;
    }
  
    if (requireSettingsComplete && !user.settings_finished) {
      return <Navigate to="/settings" replace />;
    }
  
    if (!requireSettingsComplete && user.settings_finished) {
      return <Navigate to="/dashboard" replace />;
    }
  
    return <Outlet />;
  };
  

export default ProtectedRoute;
