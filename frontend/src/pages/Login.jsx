import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext); //
  const navigate = useNavigate();

  // Use Vite environment variable
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? 'login' : 'register';
    try {
      // Connect to dynamic backend URL
      const res = await axios.post(`${API_URL}/api/auth/${endpoint}`, { email, password });
      
      if (isLogin) {
        // Save token and navigate
        login(res.data.token, res.data.user);
        navigate('/dashboard');
      } else {
        alert('Registration successful! Please login.');
        setIsLogin(true);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Authentication failed';
      alert(errorMsg);
    }
  };

  return (
    <div className="auth-page">
        <div className="content-card">
            <div className="login-wrapper">
                <div className="login-card">
                <h2>Welcome to ContactManager</h2>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit" className="btn-red" style={{width: '100%'}}>
                    {isLogin ? 'Log In / Sign In' : 'Register'}
                    </button>
                </form>
            <p onClick={() => setIsLogin(!isLogin)} style={{marginTop: '20px', cursor: 'pointer', color: 'var(--primary-red)'}}>
                {isLogin ? 'Switch to Register' : 'Switch to Login'}
            </p>
                </div>
            </div>
        </div>
    </div>
);
};

export default Login;
