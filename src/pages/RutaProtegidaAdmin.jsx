// components/RutaProtegidaAdmin.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../pages/UserContext';

function RutaProtegidaAdmin({ children }) {
  const { user } = useContext(UserContext);

  if (!user || user.rol !== 'admin') {
    return <Navigate to="/login?role=admin" replace />;
  }

  return children;
}

export default RutaProtegidaAdmin;
