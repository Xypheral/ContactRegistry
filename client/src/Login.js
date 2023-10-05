import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkMetaMask() {
      if (typeof window.ethereum !== 'undefined') {
        setIsMetamaskInstalled(true);
      }
    }

    checkMetaMask();
  }, []);

  const handleLogin = async () => {
    if (isMetamaskInstalled) {
      try {
        await window.ethereum.enable(); // Request account access if needed
        setIsLoggedIn(true);
        navigate('/contact-app');
      } catch (error) {
        console.error('Error logging in with MetaMask:', error);
      }
    } else {
      console.error('MetaMask is not installed.');
    }
  };

  return (
    <div className="app">
      <h1>Your App</h1>
      {isLoggedIn ? (
        <p>Redirecting...</p>
      ) : (
        <button onClick={handleLogin}>Login with MetaMask</button>
      )}
    </div>
  );
}

export default Login;
