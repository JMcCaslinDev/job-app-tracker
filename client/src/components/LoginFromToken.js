import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function LoginFromToken() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    const emailParam = searchParams.get('email');

    if (token && emailParam) {
      verifyToken(token, emailParam);
    }
  }, [location]);

  const verifyToken = async (token, email) => {
    try {
      const response = await axios.post('/api/verify-token', { token, email });
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error:', error);
      alert('Invalid or expired login link.');
    }
  };

  const requestLoginLink = async () => {
    try {
      const response = await axios.post('/api/request-login-link', { email: email.toLowerCase() });
      alert(response.data.message);
    } catch (error) {
      alert('Failed to send login link.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign in to Your Account</h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input input-bordered w-full max-w-xs mb-4"
          placeholder="Enter your email"
        />
        <button onClick={requestLoginLink} className="btn btn-primary w-full">
          Sign in with Email
        </button>
      </div>
    </div>
  );
}

export default LoginFromToken;
