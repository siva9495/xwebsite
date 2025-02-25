import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLicenseGeneratorDashboard from '../AdminDashboard/AdminLicenseGeneratorDashboard';
import firebase from '../Firebase/firebase';

const AdminLoginActivity = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // On mount, check if user details exist in localStorage.
  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    const storedEmployeeId = localStorage.getItem('employeeId');
    if (storedEmail && storedEmployeeId) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
  
    try {
      const adminDoc = await firebase
        .firestore()
        .collection('purview-x-lic-gen-admins')
        .doc(employeeId)
        .get();
  
      if (adminDoc.exists) {
        const adminData = adminDoc.data();
        if (adminData.email === email) {
          // Notify App.js that we're in a loading state
          window.dispatchEvent(new CustomEvent('authChange', {
            detail: { loading: true }
          }));
  
          // Show loading animation for 2 seconds
          setTimeout(() => {
            // Save user details to localStorage
            localStorage.setItem('userEmail', email);
            localStorage.setItem('employeeId', employeeId);
            
            // Notify that loading is done
            window.dispatchEvent(new CustomEvent('authChange', {
              detail: { loading: false }
            }));
            
            setIsSubmitting(false);
            navigate('/license-dashboard');
          }, 2000);
          return;
        } else {
          setErrorMessage('Invalid email or employee ID. Please try again.');
        }
      } else {
        setErrorMessage('Invalid email or employee ID. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('An error occurred. Please try again later.');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-orange-900">
      {/* Speaker-like pattern background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute w-96 h-96 rounded-full border-8 border-orange-500 left-1/4 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute w-64 h-64 rounded-full border-4 border-orange-400 left-1/4 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute w-32 h-32 rounded-full border-2 border-orange-300 left-1/4 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="absolute w-96 h-96 rounded-full border-8 border-orange-500 right-1/4 bottom-1/4 transform translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute w-64 h-64 rounded-full border-4 border-orange-400 right-1/4 bottom-1/4 transform translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute w-32 h-32 rounded-full border-2 border-orange-300 right-1/4 bottom-1/4 transform translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        {isSubmitting ? (
          <SubmittingDialog />
        ) : (
          <div className="bg-black bg-opacity-50 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden border border-orange-500 border-opacity-20">
            <div className="px-8 py-6">
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 rounded-full bg-gradient-to-r from-orange-500 to-orange-300 flex items-center justify-center shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-center text-white mb-2">Welcome Back</h2>
              <p className="text-center text-orange-200 mb-8">Sign in to your account</p>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-5">
                  <div>
                    <label className="block text-orange-200 mb-2 font-medium" htmlFor="employeeId">
                      Employee ID
                    </label>
                    <input
                      id="employeeId"
                      type="text"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-black bg-opacity-50 border border-orange-500 border-opacity-30 focus:outline-none focus:ring-2 focus:ring-orange-400 text-white placeholder-orange-200 placeholder-opacity-50"
                      placeholder="Enter your employee ID"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-orange-200 mb-2 font-medium" htmlFor="email">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-black bg-opacity-50 border border-orange-500 border-opacity-30 focus:outline-none focus:ring-2 focus:ring-orange-400 text-white placeholder-orange-200 placeholder-opacity-50"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  
                  {errorMessage && (
                    <div className="text-red-500 text-sm text-center">{errorMessage}</div>
                  )}
                  
                  <div>
                    <button
                      type="submit"
                      className="w-full py-3 px-4 bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300 text-black font-bold rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400"
                    >
                      Sign In
                    </button>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="py-4 bg-gradient-to-r from-orange-800 to-orange-600 bg-opacity-30">
              <p className="text-center text-white text-sm">
                © 2025 PurviewX. All rights reserved.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SubmittingDialog = () => {
  return (
    <div className="bg-black bg-opacity-60 backdrop-blur-lg rounded-xl shadow-2xl p-8 text-center border border-orange-500 border-opacity-20">
      <div className="relative h-16 w-16 mx-auto mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-orange-300 border-opacity-25"></div>
        <div className="absolute inset-0 rounded-full border-t-4 border-orange-500 animate-spin"></div>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">Signing In</h3>
      <p className="text-orange-200">Please wait while we verify your credentials...</p>
    </div>
  );
};

export default AdminLoginActivity;