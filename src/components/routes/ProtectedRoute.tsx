import React from 'react';
import { Navigate } from 'react-router-dom';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie'; // Importar la librería para manejar cookies

interface ProtectedRouteProps {
  component: React.ComponentType;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component }) => {
  // Obtener el token desde la cookie
  const token = Cookies.get('token');

  if (!token) {
    return <Navigate to="/" />; // Redirige al login si no hay token
  }

  // Verificamos si el token ha expirado
  try {
    const decodedToken = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000; // En segundos

    // Solo verificamos la expiración si el campo exp existe
    if (decodedToken.exp && decodedToken.exp < currentTime) {
      Cookies.remove('token'); // Eliminar la cookie si ha expirado
      return <Navigate to="/" />; // Redirige si el token ha expirado
    }
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return <Navigate to="/" />; // Si hay un error al decodificar, redirige al login
  }

  // Si el token es válido, renderiza el componente
  return <Component />;
};

export default ProtectedRoute;
