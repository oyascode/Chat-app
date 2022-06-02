import React from 'react';
import { Navigate } from "react-router-dom";
import { AppAuthState } from '../../context/AuthContext';



const PrivateRoute = ({ component: Component }) => {
  const { user } = AppAuthState();
  return (
    user ? <Component /> : <Navigate to="/login"/>
  )
}

export default PrivateRoute