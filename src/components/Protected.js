import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Protected = ({ tokens, setTokens }) => {
  const [message, setMessage] = useState('');

  const fetchProtectedData = async () => {
    try {
      const response = await axios.get('https://test-deploy-refresh-token-9f044819a6a4.herokuapp.com/api/private', {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`
        }
      });
      setMessage(response.data.message);
    } catch (error) {
      if (error.response.status === 401) {
        try {
          const refreshResponse = await axios.post('https://test-deploy-refresh-token-9f044819a6a4.herokuapp.com/api/auth/refresh-token', {
            token: tokens.refreshToken
          });
          const { accessToken } = refreshResponse.data;
          setTokens({ ...tokens, accessToken });
        } catch (refreshError) {
          console.error('Error al refrescar el token', refreshError);
        }
      } else {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchProtectedData();
  }, [tokens]);

  const handleLogout = () => {
    // Eliminar tokens de localStorage y actualizar el estado de tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setTokens(null);
  };

  return (
    <div>
      <h2>Protected</h2>
      <p>{message}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Protected;
 