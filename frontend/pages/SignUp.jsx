import React, { useState } from 'react';
import stateDistricts from '../src/data/statedistricts.json'; // Import the state-district mapping
const Signup = () => {
  const [formData, setFormData] = useState({
    full_name: '', 
    email: '',
    password: '',
    phone_number: '', 
    role: '', 
    location: {
      state: '', 
      district: '', 
      village: '' 
    },
    user_id: '',
    mother_tongue: '' 
  });
  const [selectedState, setSelectedState] = useState(''); // For dynamic districts
  const [message, setMessage] = useState('');

  // 22 Official Languages of India (Schedule VIII)
  const officialLanguages = [
    'Assamese', 'Bengali', 'Bodo', 'Dogri', 'Gujarati', 'Hindi', 'Kannada', 'Kashmiri',
    'Konkani', 'Maithili', 'Malayalam', 'Manipuri', 'Marathi', 'Nepali', 'Odia',
    'Punjabi', 'Sanskrit', 'Santali', 'Sindhi', 'Tamil', 'Telugu', 'Urdu'
  ];

  // All 28 States and 8 Union Territories of India
  const allStatesUTs = [
    'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
    'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand',
    'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra',
    'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
    'Uttarakhand', 'West Bengal'
  ];



  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'location.state') {
      setSelectedState(value); // Update selected state for districts
      setFormData({
        ...formData,
        location: { ...formData.location, state: value, district: '' } // Reset district on state change
      });
    } else if (name.includes('location.')) {
      // Handle nested location fields (district, village)
      const [_, field] = name.split('.');
      setFormData({
        ...formData,
        location: { ...formData.location, [field]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://cattle-management-ptz0.onrender.com/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`Signup successful, ${data.user.full_name}! Now <a href="/login">login</a> to manage your cattle.`);
        setFormData({
          full_name: '',
          email: '',
          password: '',
          phone_number: '',
          role: 'farmer',
          location: { state: '', district: '', village: '' },
          mother_tongue: '',
          user_id:''
        }); // Clear form
        setSelectedState(''); // Reset state selection
      } else {
        setMessage(`Error: ${data.error || 'Signup failed'}`);
      }
    } catch (err) {
      setMessage('Server error—check backend console?');
    }
  };

  const isSuccess = message.includes('successful'); // Quick check for styling

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <p className="text-center text-lg font-medium text-gray-700">
          Signup for a new account
        </p>
        <form className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md" onSubmit={handleSignup}>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                name="full_name"
                placeholder="Full Name (e.g. John Robinson)"
                value={formData.full_name}
                onChange={handleChange}
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              />
            </div>
            <div>
              <input
                type="text"
                name="user_id"
                placeholder="AADHAR ID"
                value={formData.user_id}
                onChange={handleChange}
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              />
            </div>
            <div>
              <input
                type="tel"
                name="phone_number"
                placeholder="Phone Number (e.g. +91XXXXXXXXXX)"
                value={formData.phone_number}
                onChange={handleChange}
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              />
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email (e.g. johnrobinson@gnit.ac.in)"
                value={formData.email}
                onChange={handleChange}
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              />
            </div>
            <div>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm bg-white"
              >
                <option value="">Select User Type</option>
                <option value="farmer">Owner</option>
                <option value="vet">Vetenerian</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <select
                name="mother_tongue"
                value={formData.mother_tongue}
                onChange={handleChange}
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm bg-white"
              >
                <option value="">Select Mother Tongue</option>
                {officialLanguages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                name="location.state"
                value={formData.location.state}
                onChange={handleChange}
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm bg-white"
              >
                <option value="">Select State/UT</option>
                {allStatesUTs.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                name="location.district"
                value={formData.location.district}
                onChange={handleChange}
                required
                disabled={!selectedState}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select District</option>
                {selectedState && stateDistricts[selectedState] && stateDistricts[selectedState].map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>
            <div>
              <input
                type="text"
                name="location.village"
                placeholder="Village"
                value={formData.location.village}
                onChange={handleChange}
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={!selectedState || !formData.location.district} // Disable if state/district not selected
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Signup
            </button>
          </div>
        </form>

        {message && (
          <div className={`mt-4 p-4 rounded-md ${isSuccess ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
            <p dangerouslySetInnerHTML={{ __html: message }} />
          </div>
        )}

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already signed up?{' '}
            <a href="/login" className="font-md text-green-600 hover:text-green-500">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;