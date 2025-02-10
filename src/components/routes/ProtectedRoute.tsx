import React from 'react';
import { Navigate } from 'react-router-dom';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie'; // Importar la librería para manejar cookies

interface ProtectedRouteProps {
  component: React.ComponentType;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component }) => {
  const token = Cookies.get('token');  // Asegúrate de que el token esté disponible en las cookies
console.log("Token desde cookie:", token); // Depuración
  if (!token) {
    console.error('No token found in cookies');
    return <Navigate to="/" />;
  }

  try {
    const decodedToken = jwtDecode<JwtPayload>(token);
    console.log('Token decodificado:', decodedToken);

    const currentTime = Date.now() / 1000;
    if (decodedToken.exp && decodedToken.exp < currentTime) {
      console.error('Token expirado');
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
