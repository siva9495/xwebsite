import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import firebase from '../Firebase/firebase'

const Navbar = ({userEmail}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const profileRef = useRef(null);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setShowProfileMenu(false);
  
    // Notify App.js that we're in a loading state
    window.dispatchEvent(new CustomEvent('authChange', {
      detail: { loading: true }
    }));
    
    // Show logout animation for 2 seconds before actual logout
    setTimeout(() => {
      // Remove user details from localStorage
      localStorage.removeItem('userEmail');
      localStorage.removeItem('employeeId');
      
      // Notify that loading is done
      window.dispatchEvent(new CustomEvent('authChange', {
        detail: { loading: false }
      }));
      
      setIsLoggingOut(false);
      navigate('/');
    }, 2000);
  };  

  return (
    <>
      <nav className="bg-black bg-opacity-50 backdrop-blur-lg border-b border-orange-500 border-opacity-20 py-4 px-6 sticky top-0 z-20">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-500 to-orange-300 flex items-center justify-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white hidden md:block">PurviewX</h1>
          </div>

          {/* User Profile Icon and Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-600 to-orange-400 flex items-center justify-center shadow-lg hover:from-orange-500 hover:to-orange-300 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-black bg-opacity-80 backdrop-blur-lg rounded-xl shadow-2xl p-4 border border-orange-500 border-opacity-20 animate-fadeIn">
                <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-orange-500 border-opacity-20">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-600 to-orange-400 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1 truncate">
                    <div className="text-orange-200 font-medium truncate">{userEmail}</div>
                    <div className="text-orange-300 text-sm opacity-70">Administrator</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-orange-200 hover:bg-orange-500 hover:bg-opacity-10 rounded-lg transition-colors duration-200 text-left"
                  >
                    <div className="flex items-center space-x-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                      </svg>
                      <span>Log Out</span>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Logout Loading Dialog */}
      {isLoggingOut && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="bg-black bg-opacity-60 backdrop-blur-lg rounded-xl shadow-2xl p-8 text-center border border-orange-500 border-opacity-20">
            <div className="relative h-16 w-16 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-orange-300 border-opacity-25"></div>
              <div className="absolute inset-0 rounded-full border-t-4 border-orange-500 animate-spin"></div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Logging Out</h3>
            <p className="text-orange-200">Please wait while we securely log you out...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
