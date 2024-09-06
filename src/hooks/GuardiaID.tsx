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
                console.log('IDINST recibido:', response.data.IDINST); // Agrega esta línea para verificar el IDINST
                setIDINST(response.data.IDINST);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.error('Error al obtener usuario:', error.message);
                } else {
                    console.error('Error desconocido:', error);
                }
                if (Axios.isAxiosError(error) && error.response?.status === 401) {
                    navigate('/'); // Redirige al login si el token es inválido o ha expirado
                }
            }
        };
    
        obtenerDatosUsuario();
    }, [navigate]);

    return IDINST;
};

export default GuardiaID;
