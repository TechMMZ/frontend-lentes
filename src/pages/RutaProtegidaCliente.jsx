// components/RutaProtegidaCliente.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../pages/UserContext';

function RutaProtegidaCliente({ children }) {
  const { user } = useContext(UserContext);

  if (!user || user.rol !== 'cliente') {
    return <Navigate to="/login?role=cliente" replace />;
  }

  return children;
}

export default RutaProtegidaCliente;
