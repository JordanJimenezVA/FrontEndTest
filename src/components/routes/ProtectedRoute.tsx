import React from 'react';
import { Navigate } from 'react-router-dom';
import { JwtPayload, jwtDecode } from 'jwt-decode';

interface ProtectedRouteProps {
  component: React.ComponentType;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    console.log("protected rute" + token)
    return <Navigate to="/" />; // Redirige al login si no hay token
  }

  // Verificamos si el token ha expirado
  try {
    const decodedToken = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000; // En segundos

    // Solo verificamos la expiración si el campo exp existe
    if (decodedToken.exp && decodedToken.exp < currentTime) {
      console.log("protected rute 2")
      localStorage.removeItem('token'); // Opcional: limpiar el token si ha expirado
      return <Navigate to="/" />; // Redirige si el token ha expirado
    }
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    console.log("protected rute 3")
    return <Navigate to="/" />; // Si hay un error al decodificar, redirige al login
  }

  // Si el token es válido, renderiza el componente
  return <Component />;
};

export default ProtectedRoute;
