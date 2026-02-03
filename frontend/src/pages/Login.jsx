import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // 1. Get the URL from Vite environment
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? 'login' : 'register';
    
    try {
      // 2. Use the dynamic API_URL
      const res = await axios.post(`${API_URL}/api/auth/${endpoint}`, { email, password });
      
      if (isLogin) {
        login(res.data.token, res.data.user);
        navigate('/dashboard');
      } else {
        alert('Registration successful! Please login.');
        setIsLogin(true);
      }
    } catch (err) {
      // 3. IMPROVED ERROR LOGIC: 
      // It checks for the 'message' field (e.g., "Password must be 8 chars...") 
      // then the 'error' field, then defaults to the fallback.
      const backendError = err.response?.data?.message || err.response?.data?.error || 'Authentication failed';
      
      alert(backendError);
      console.error("Connection Error Object:", err); 
    }
  };

  return (
    <div className="auth-page">
      <div className="content-card">
        <h2>Welcome to ContactManager</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-red" style={{ width: '100%' }}>
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>
        <p className="toggle-text" onClick={() => setIsLogin(!isLogin)} style={{ marginTop: '20px', cursor: 'pointer' }}>
          {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
        </p>
      </div>
    </div>
  );
};

export default Login;
