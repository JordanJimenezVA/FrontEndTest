import "./footer.scss";
import useNombreINST from '../../hooks/NombreINST';

const Footer = () => {
    const nombreINST = useNombreINST();
    return (
        <footer className="footer">
            <div>
                {nombreINST ? (
                    <p>Usted esta en la instalación: {nombreINST}</p>
                ) : (
                    <p>Cargando nombre de la instalación...</p>
                )}
            </div>
        </footer>
    );
};

export default Footer;