import React from 'react';
import { Navigate } from 'react-router-dom';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie'; // Importar la librería para manejar cookies

interface ProtectedRouteProps {
  component: React.ComponentType;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component }) => {
  const token = Cookies.get('token');  // Asegúrate de que el token esté disponible en las cookies
  console.log("Inicio de ProtectedRoute");  // Agregar al inicio del componente
  console.log("Token leído:", token);  // Justo después de leer el token
  alert("Token leído: " + token);
  if (!token) {
    console.log("No se encontró el token, redirigiendo al login");
    return <Navigate to="/" />;
  }

  try {
    const decodedToken = jwtDecode<JwtPayload>(token);
    console.log("Token decodificado:", decodedToken);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp && decodedToken.exp < currentTime) {
      console.log("El token ha expirado, eliminando la cookie y redirigiendo al login");
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
