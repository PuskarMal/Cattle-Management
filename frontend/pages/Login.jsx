import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { authActions } from '../src/store/auth';
import axios from 'axios';
const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://cattle-management-ptz0.onrender.com/api/users/login', formData);
      
      dispatch(authActions.login());
        dispatch(authActions.changeRole(res.data.role));
        localStorage.setItem("id", res.data.id);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        
      const data = res.data;
      if (data) {
        setMessage(`Welcome back! Redirecting to your cattle profile...`);
        setTimeout(() => {
          window.location.href = '/my-cattle';
        }, 2000);
        
        
      } else {
        setMessage(`Error: ${data.error || 'Login failed'}`);
      }
    } catch (err) {
      setMessage(err);
    }
  };

  //const isSuccess = message.includes('Welcome back'); // Quick check for styling

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <p className="text-center text-lg font-medium text-gray-700">
          Login to your account
        </p>
        <form className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email (E.g. johnrobinson@gnit.ac.in)"
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
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a href="/forgot-password" className="font-medium text-green-600 hover:text-green-500">
                Forgot password?
              </a>
            </div>
            <div className="text-sm">
              <a href="/signup" className="font-medium text-green-600 hover:text-green-500">
                New user? Signup
              </a>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200"
            >
              Login
            </button>
          </div>
        </form>

        {message && (
          <div className={`mt-4 p-4 rounded-md `}>
            <p dangerouslySetInnerHTML={{ __html: message }} />
          </div>
        )}

      </div>
    </div>
  );
};

export default Login;