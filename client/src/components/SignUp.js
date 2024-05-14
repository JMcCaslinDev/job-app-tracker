import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/signUp.css';

const SignUp = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/signup', {
        email,
      });
      console.log(response.data);
      // Handle the response as needed
      if (response.data.success) {
        // Signup successful, redirect to the dashboard

        
          try {
            const response = await axios.post('/api/request-login-link', { email: email.toLowerCase() });
            alert(response.data.message);
          } catch (error) {
            alert('Failed to send login link.');
            console.error('Error:', error);
          }
     




        navigate('/login');
      } else {
        // Handle signup error, e.g., display an error message
        console.log("Signup failed with backend error");
      }
      // Reset form fields
      setEmail('');
    } catch (error) {
      console.error('Error during signup:', error);
      // Handle signup error, e.g., display an error message
    }
  };

  //  login route button action
  const handleLoginClick = () => {
  navigate('/login');
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <p>Create a new account.</p>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="signup-button">Sign Up</button>
      </form>
      
      <br></br>

      <button type="button" onClick={handleLoginClick}>
      Already have an account? Login here
      </button>

    </div>

    

  );
};

export default SignUp;