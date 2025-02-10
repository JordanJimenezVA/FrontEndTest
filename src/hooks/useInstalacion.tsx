import { useState, useEffect } from "react";
import Axios from "axios";

interface Instalacion {
  IDI: number;
  Nombre: string;
}

interface UseInstalacionesReturn {
  instalaciones: Instalacion[];
  error: Error | null;
}

const useInstalacion = (host_server: string): UseInstalacionesReturn => {
  const [instalaciones, setInstalaciones] = useState<Instalacion[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    Axios.get(`${host_server}/Instalaciones`)
      .then((response) => {
        setInstalaciones(response.data);
      })
      .catch((error) => {
        console.error("Error al cargar instalaciones:", error);
        setError(error);
      });
  }, [host_server]);

  return { instalaciones, error };
};

export default useInstalacion;