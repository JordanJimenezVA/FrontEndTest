import { useState, useEffect } from 'react';
import Axios from 'axios';
import GuardiaID from './GuardiaID';

const host_server = import.meta.env.VITE_SERVER_HOST;

const useNombreINST = (): string | null => {
    const [nombreINST, setNombreINST] = useState<string | null>(null);
    const instalacion = GuardiaID(); // Obtenemos el IDINST usando el hook existente

    useEffect(() => {
        const obtenerNombreInstalacion = async () => {
            if (instalacion) {
                try {
                    const response = await Axios.get(`${host_server}/NombreInstalacion`, {
                        params: { IDINST: instalacion },
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Ajusta según tu mecanismo de autenticación
                        },
                    });
                    setNombreINST(response.data.nombreINST);
                } catch (error) {
                    console.error('Error al obtener el nombre de la instalación:', error);
                    setNombreINST(null);
                }
            }
        };
        

        obtenerNombreInstalacion();
    }, [instalacion]); // Se ejecuta cuando cambia el IDINST

    return nombreINST;
};

export default useNombreINST;
