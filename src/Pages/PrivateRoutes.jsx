import React from 'react';
import { Navigate } from 'react-router-dom';


const isLoggedIn = () => {
  return Boolean(localStorage.getItem('token')); 
};

console.log(isLoggedIn);

const PrivateRoutes = ({ children }) => {
  if (!isLoggedIn()) {
    // Redirect to home or login page if not logged in
    return <Navigate to="/" replace />;
  }
  return children;
};

export default PrivateRoutes;
