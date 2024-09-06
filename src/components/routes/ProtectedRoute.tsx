import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  component: React.ComponentType; // Indicamos que 'component' es un tipo de componente de React
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/" />; // Redirige al login si no hay token
  }

  // Si el token existe, renderiza el componente
  return <Component />;
};

export default ProtectedRoute;
