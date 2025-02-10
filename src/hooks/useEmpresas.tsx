import { useState, useEffect } from "react";
import Axios from "axios";

interface Empresa {
  IDE: number;
  Nombre: string;
}

interface UseEmpresasReturn {
  empresas: Empresa[];
  error: Error | null;
}

const useEmpresas = (host_server: string): UseEmpresasReturn => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    Axios.get(`${host_server}/Empresas`)
      .then((response) => {
        setEmpresas(response.data);
      })
      .catch((error) => {
        console.error("Error al cargar empresas:", error);
        setError(error);
      });
  }, [host_server]);

  return { empresas, error };
};

export default useEmpresas;