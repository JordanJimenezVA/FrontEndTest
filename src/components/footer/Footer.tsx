import { useEffect, useState } from 'react';
import './footer.scss';

const Footer = () => {
    const [instalacionU, setInstalacionU] = useState('');

    useEffect(() => {
        const storedInstalacionU = localStorage.getItem('instalacionUsuario');
        if (storedInstalacionU) {
            setInstalacionU(storedInstalacionU);
        }
    }, []);

    return (
        <footer className="footer">
            <div>
                {instalacionU ? (
                    <p>Usted está en la instalación: {instalacionU}</p>
                ) : (
                    <p>Cargando nombre de la instalación...</p>
                )}
            </div>
        </footer>
    );
};

export default Footer;
