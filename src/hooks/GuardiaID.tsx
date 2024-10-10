import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Axios from 'axios';

const host_server = import.meta.env.VITE_SERVER_HOST;

const GuardiaID = (): string | null => {
    const [IDINST, setIDINST] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const obtenerDatosUsuario = async () => {
            try {
                const response = await Axios.get(`${host_server}/IDINST`, {
                    withCredentials: true,
                });
                setIDINST(response.data.IDINST);
            } catch (error: unknown) {
                if (Axios.isAxiosError(error)) {
                    if (error.response?.status === 401) {
                        navigate('/'); // Redirige si es un error de autenticación
                    } else {
                        console.error('Otro error ocurrió:', error.response?.status); // Si es otro tipo de error
                    }
                }
            }
        };
    
        obtenerDatosUsuario();
    }, [navigate]);

    return IDINST;
};

export default GuardiaID;