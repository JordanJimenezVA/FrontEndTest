import React from 'react';
import { Navigate } from 'react-router-dom';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie'; // Importar la librería para manejar cookies

interface ProtectedRouteProps {
  component: React.ComponentType;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component }) => {
  const token = Cookies.get('token');  // Asegúrate de que el token esté disponible en las cookies

  if (!token) {
    return <Navigate to="/" />;
  }

  try {
    const decodedToken = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp && decodedToken.exp < currentTime) {
      Cookies.remove('token');
      return <Navigate to="/" />;
    }
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return <Navigate to="/" />;
  }

  return <Component />;
};


export default ProtectedRoute;
