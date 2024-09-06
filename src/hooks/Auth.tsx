import React, { createContext, useContext, useState, useEffect } from 'react';

type UserType = 'Administrador' | 'Guardia' | 'Supervisor';

interface AuthContextType {
  userType: UserType | null;
  nombreUsuario: string | null;
  isAuthenticated: boolean;
  setUserType: (userType: UserType | null) => void;
  setNombreUsuario: (nombreUsuario: string | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userType, setUserType] = useState<UserType | null>(
    () => localStorage.getItem('userType') as UserType | null
  );
  const [nombreUsuario, setNombreUsuario] = useState<string | null>(
    () => localStorage.getItem('nombreUsuario')
  );
  
  // Nueva propiedad que indica si el usuario está autenticado
  const isAuthenticated = Boolean(userType); // Verifica si existe un tipo de usuario

  useEffect(() => {
    localStorage.setItem('userType', userType || '');
    localStorage.setItem('nombreUsuario', nombreUsuario || '');
  }, [userType, nombreUsuario]);

  return (
    <AuthContext.Provider value={{ userType, nombreUsuario, isAuthenticated, setUserType, setNombreUsuario }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
