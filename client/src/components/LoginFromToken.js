import React, { useState } from 'react';
import axios from 'axios';

function LoginFromToken() {
  const [email, setEmail] = useState('');

  const requestLoginLink = async () => {
    try {
      const response = await axios.post('/api/request-login-link', { email });
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
        <button
          onClick={requestLoginLink}
          className="btn btn-primary w-full"
        >
          Sign in with Email
        </button>
      </div>
    </div>
  );
}

export default LoginFromToken;
