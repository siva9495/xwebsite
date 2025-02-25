import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLoginActivity from './AdminLogin/AdminLoginActivity';
import AdminLicenseGeneratorDashboard from './AdminDashboard/AdminLicenseGeneratorDashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  
  // Check authentication status on mount and whenever localStorage changes
  useEffect(() => {
    const checkAuth = () => {
      const userEmail = localStorage.getItem('userEmail');
      const employeeId = localStorage.getItem('employeeId');
      setIsAuthenticated(!!(userEmail && employeeId));
      setIsLoading(false); // Authentication check complete
    };
    
    // Check immediately
    checkAuth();
    
    // Set up event listener for storage changes
    window.addEventListener('storage', checkAuth);
    
    // Create a custom event listener for auth changes within the same window
    window.addEventListener('authChange', (event) => {
      // If event includes loading property, update loading state
      if (event.detail && event.detail.loading !== undefined) {
        setIsLoading(event.detail.loading);
      }
      checkAuth();
    });
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);

  // If we're in a loading state, don't redirect yet
  if (isLoading) {
    return null; // Or render a global loading indicator if preferred
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/license-dashboard" /> : <AdminLoginActivity />}
        />
        <Route
          path="/license-dashboard"
          element={isAuthenticated ? <AdminLicenseGeneratorDashboard /> : <Navigate to="/" />}
        />
        {/* Add a catch-all route for any undefined routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;