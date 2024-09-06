import { useEffect, useState } from 'react';
import Axios from 'axios';
const host_server = import.meta.env.VITE_SERVER_HOST;

interface Usuario {
  nombre: string;
  apellido: string;
}

const useNombreApellidoUsuario = (): Usuario | null => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    const obtenerDatosUsuario = async () => {
      try {
        const response = await Axios.get(`${host_server}/NombreUser`);
        const { nombre, apellido } = response.data;
        setUsuario({ nombre, apellido });
      } catch (error) {
        console.error('Error al obtener usuario:', error);
        setUsuario(null);
      }
    };

    obtenerDatosUsuario();
  }, []); // Solo se ejecuta una vez al montar el componente

  return usuario;
};

export default useNombreApellidoUsuario;