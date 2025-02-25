import React, { useState, useRef, useEffect } from 'react';
import firebase from '../Firebase/firebase'
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/NavbarActivity'

const AdminLicenseGeneratorDashboard = () => {
  const [companyName, setCompanyName] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [licenseCount, setLicenseCount] = useState(1);
  const [countries, setCountries] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [generatedLicenses, setGeneratedLicenses] = useState([]);
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail'));
  const navigate = useNavigate();
  
  // Form validation states
  const [formErrors, setFormErrors] = useState({
    companyName: '',
    selectedRegion: ''
  });
  
  // Form touched states to only show errors after user interaction
  const [touched, setTouched] = useState({
    companyName: false,
    selectedRegion: false
  });
  
  useEffect(() => {
    // Simulating API call to fetch countries
    setTimeout(() => {
      const mockCountries = [
        "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Australia", 
        "Austria", "Bangladesh", "Belgium", "Brazil", "Canada", "China", "Colombia", 
        "Denmark", "Egypt", "Finland", "France", "Germany", "Greece", "India", "Indonesia", 
        "Italy", "Japan", "Kenya", "Malaysia", "Mexico", "Netherlands", "New Zealand", 
        "Nigeria", "Norway", "Pakistan", "Philippines", "Poland", "Portugal", "Russia", 
        "Saudi Arabia", "Singapore", "South Africa", "South Korea", "Spain", "Sweden", 
        "Switzerland", "Thailand", "Turkey", "Ukraine", "United Arab Emirates", 
        "United Kingdom", "United States", "Vietnam"
      ].sort();
      setCountries(mockCountries);
    }, 500);
  }, []);
  
  // Validate form fields on change
  useEffect(() => {
    validateField('companyName', companyName);
  }, [companyName]);
  
  useEffect(() => {
    validateField('selectedRegion', selectedRegion);
  }, [selectedRegion]);
  
  const validateField = (fieldName, value) => {
    let errorMessage = '';
    
    switch (fieldName) {
      case 'companyName':
        errorMessage = value.trim() === '' ? 'Company name is required' : '';
        break;
      case 'selectedRegion':
        errorMessage = value === '' ? 'Please select a region' : '';
        break;
      default:
        break;
    }
    
    setFormErrors(prev => ({
      ...prev,
      [fieldName]: errorMessage
    }));
    
    return errorMessage === '';
  };
  
  const handleBlur = (fieldName) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));
  };
  
  const validateForm = () => {
    const companyNameValid = validateField('companyName', companyName);
    const regionValid = validateField('selectedRegion', selectedRegion);
    
    // Mark all fields as touched to show all errors
    setTouched({
      companyName: true,
      selectedRegion: true
    });
    
    return companyNameValid && regionValid;
  };
  
  const handleGenerateLicenses = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsGenerating(true);
    // Simulate license generation delay
    setTimeout(async () => {
      const licenses = [];
      for (let i = 0; i < licenseCount; i++) {
        const randomDigits = Math.floor(1000 + Math.random() * 9000);
        licenses.push(`ID${randomDigits}`);
      }
      setGeneratedLicenses(licenses);
      setIsGenerating(false);
      setShowLicenseModal(true);

      // Save each generated license to Firestore in two collections:
      const timestamp = new Date();
      const db = firebase.firestore();
      // Save in "testing-license-ids" (each license as a separate document)
      licenses.forEach(async (license) => {
        await db.collection('testing-license-ids').doc(license).set({
          license,
          createdAt: timestamp
        });
      });
      // Save details under "testing-license-ids-details" (using company as document ID)
      // Here, we store each license under a subcollection "licenses" for the company
      const detailsRef = db
        .collection('testing-license-ids-details')
        .doc(companyName)
        .collection('licenses');
      licenses.forEach(async (license) => {
        await detailsRef.doc(license).set({
          region: selectedRegion,
          generatedAt: timestamp,
          generatedBy: userEmail
        });
      });

      // Reset form fields
      setCompanyName('');
      setSelectedRegion('');
      setLicenseCount(1);
      setTouched({ companyName: false, selectedRegion: false });
    }, 2000);
  };
  
  const handleCopyLicenses = () => {
    navigator.clipboard.writeText(generatedLicenses.join('\n'));
  };
  
  const handleDownloadLicenses = () => {
    const licenseText = generatedLicenses.join('\n');
    const blob = new Blob([licenseText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${companyName.replace(/\s+/g, '_')}_licenses.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  useEffect(() => {
    if (!localStorage.getItem('userEmail')) {
      // Redirect to login page if the user is not logged in
      navigate('/');
    }
  }, [navigate]);

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-orange-900 relative overflow-hidden">
      {/* Speaker-like pattern background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute w-96 h-96 rounded-full border-8 border-orange-500 left-1/4 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute w-64 h-64 rounded-full border-4 border-orange-400 left-1/4 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute w-32 h-32 rounded-full border-2 border-orange-300 left-1/4 top-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="absolute w-96 h-96 rounded-full border-8 border-orange-500 right-1/4 bottom-1/4 transform translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute w-64 h-64 rounded-full border-4 border-orange-400 right-1/4 bottom-1/4 transform translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute w-32 h-32 rounded-full border-2 border-orange-300 right-1/4 bottom-1/4 transform translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      {/* Added Navbar at the top */}
      <Navbar userEmail={userEmail} />
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="bg-black bg-opacity-50 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-orange-500 border-opacity-20 max-w-3xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-orange-500 to-orange-300 flex items-center justify-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-black" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-center text-white mb-8">License Generator</h1>
          
          {isGenerating ? (
            <GeneratingDialog />
          ) : (
            <form onSubmit={handleGenerateLicenses}>
              <div className="space-y-6">
                <div>
                  <label className="block text-orange-200 mb-2 font-medium" htmlFor="companyName">
                    Company / Customer Name
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    onBlur={() => handleBlur('companyName')}
                    className={`w-full px-4 py-3 rounded-lg bg-black bg-opacity-50 border ${touched.companyName && formErrors.companyName ? 'border-red-500' : 'border-orange-500 border-opacity-30'} focus:outline-none focus:ring-2 ${touched.companyName && formErrors.companyName ? 'focus:ring-red-400' : 'focus:ring-orange-400'} text-white placeholder-orange-200 placeholder-opacity-50`}
                    placeholder="Enter company or customer name"
                  />
                  {touched.companyName && formErrors.companyName && (
                    <div className="mt-2 text-red-400 text-sm flex items-center space-x-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>{formErrors.companyName}</span>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-orange-200 mb-2 font-medium" htmlFor="region">
                    Region
                  </label>
                  <select
                    id="region"
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    onBlur={() => handleBlur('selectedRegion')}
                    className={`w-full px-4 py-3 rounded-lg bg-black bg-opacity-50 border ${touched.selectedRegion && formErrors.selectedRegion ? 'border-red-500' : 'border-orange-500 border-opacity-30'} focus:outline-none focus:ring-2 ${touched.selectedRegion && formErrors.selectedRegion ? 'focus:ring-red-400' : 'focus:ring-orange-400'} text-white`}
                  >
                    <option value="" disabled>Select a region</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                  {touched.selectedRegion && formErrors.selectedRegion && (
                    <div className="mt-2 text-red-400 text-sm flex items-center space-x-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>{formErrors.selectedRegion}</span>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-orange-200 mb-2 font-medium" htmlFor="licenseCount">
                    License Count
                  </label>
                  <select
                    id="licenseCount"
                    value={licenseCount}
                    onChange={(e) => setLicenseCount(parseInt(e.target.value))}
                    className="w-full px-4 py-3 rounded-lg bg-black bg-opacity-50 border border-orange-500 border-opacity-30 focus:outline-none focus:ring-2 focus:ring-orange-400 text-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300 text-black font-bold rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400"
                  >
                    Generate Licenses
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
      
      {showLicenseModal && (
        <LicenseModal 
          licenses={generatedLicenses} 
          onClose={() => setShowLicenseModal(false)}
          onCopy={handleCopyLicenses}
          onDownload={handleDownloadLicenses}
        />
      )}
    </div>
  );
};

// Enhanced GeneratingDialog component (unchanged)
const GeneratingDialog = () => {
  return (
    <div className="bg-black bg-opacity-60 backdrop-blur-lg rounded-xl shadow-2xl p-8 text-center border border-orange-500 border-opacity-20">
      <div className="relative h-16 w-16 mx-auto mb-6">
        <div className="absolute inset-0 rounded-full border-4 border-orange-300 border-opacity-25"></div>
        <div className="absolute inset-0 rounded-full border-t-4 border-orange-500 animate-spin"></div>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">Generating Licenses</h3>
      <p className="text-orange-200">Please wait while we generate your license keys...</p>
    </div>
  );
};

// Enhanced LicenseModal with copy confirmation
const LicenseModal = ({ licenses, onClose, onCopy, onDownload }) => {
  const [copyConfirmation, setCopyConfirmation] = useState(false);
  
  const handleCopy = () => {
    onCopy();
    setCopyConfirmation(true);
    
    // Hide the confirmation after 2 seconds
    setTimeout(() => {
      setCopyConfirmation(false);
    }, 2000);
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
      <div className="bg-black bg-opacity-80 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-orange-500 border-opacity-20 max-w-lg w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">Generated Licenses</h3>
          <button 
            onClick={onClose}
            className="text-orange-300 hover:text-orange-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-4 mb-6 max-h-60 overflow-y-auto">
          <ul className="space-y-2">
            {licenses.map((license, index) => (
              <li key={index} className="text-orange-200 font-mono">{license}</li>
            ))}
          </ul>
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={handleCopy}
            className="relative flex-1 py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg flex items-center justify-center space-x-2 transition-colors duration-300"
          >
            {copyConfirmation ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Copied!</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                <span>Copy</span>
              </>
            )}
            
            {/* Success indicator bubble */}
            {copyConfirmation && (
              <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-green-500 animate-pulse"></div>
            )}
          </button>
          
          <button
            onClick={onDownload}
            className="flex-1 py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg flex items-center justify-center space-x-2 transition-colors duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download</span>
          </button>
          
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300 text-black font-medium rounded-lg flex items-center justify-center space-x-2 transition-colors duration-300"
          >
            <span>Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLicenseGeneratorDashboard;