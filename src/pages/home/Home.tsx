import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./home.scss";
import TopBox from "../../components/topBox/TopBox";
import ChartBox from "../../components/chartbox/ChartBox";
import { chartBoxConversion, chartBoxProduct, chartBoxRevenue, chartBoxUser } from "../../data";
import { useQuery } from "@tanstack/react-query";
import GuardiaID from "../../hooks/GuardiaID";

const host_server = import.meta.env.VITE_SERVER_HOST;

const Home = () => {
  const idInst = GuardiaID();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("token home use effect "+token)
    if (!token) {
      // Si no hay token, redirige al login
      navigate("/");
    }
  }, [navigate]);

  const fetchChartData = async () => {
    const token = localStorage.getItem("token"); // Esto debería ser opcional si usas cookies
    console.log("token home " + token);
  
    const response = await fetch(`${host_server}/ChartBox?idinst=${idInst}`, {
      headers: {
        'Authorization': `Bearer ${token}` // Si usas cookies, esta línea puede ser opcional
      },
      credentials: 'include' // Asegúrate de enviar las cookies
    });
  
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  
    return response.json();
  };

  const { isLoading, data, error } = useQuery({
    queryKey: ["ChartBox", idInst],
    queryFn: fetchChartData,
    enabled: !!idInst, // Solo ejecuta la consulta si IDINST está disponible
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const dataArray = Array.isArray(data) ? data : [];

  const rolesExternos = [
    "Especialista Trade",
    "Chofer Camión",
    "Peoneta",
    "Gestor Trade",
    "Mantencion Cctv",
    "Mantencion Gruas",
    "Mantencion Jardines",
    "Mantencion General",
    "Mantencion Bresler",
    "Tecnico Fumigación",
    "OtrosEx",
  ];

  const rolesInternos = [
    "Aseo",
    "Administrativo Existencias",
    "Administrativo de Distribución",
    "Administrativo Congelados",
    "Jefe de Sucursal",
    "Jefe Comercial",
    "Jefe de Distribución",
    "Coordinador Trade Marketing",
    "Supervisor de Distribución",
    "Supervisor Ventas",
    "Cajero",
    "Secretaria",
    "Movilizador",
    "Gruero",
    "Despachador",
    "Recepcionista",
    "Visita Carozzi",
    "Vendedor",
  ];

  const rolesCamiones = [
    "CAMION",
    "SEMIREMOLQUE",
    "TRACTOCAMION",
    "CHASIS CABINADO",
    "REMOLQUE",
    "OtrosCA",
  ];

  const cantidadExterno = dataArray.filter((item: any) =>
    rolesExternos.includes(item.ROL)
  ).length;
  const cantidadInterno = dataArray.filter((item: any) =>
    rolesInternos.includes(item.ROL)
  ).length;
  const cantidadCamion = dataArray.filter((item: any) =>
    rolesCamiones.includes(item.ROL)
  ).length;

  const total = cantidadInterno + cantidadExterno + cantidadCamion;

  return (
    <div className="home">
      <div className="box box1">
        <TopBox />
      </div>
      <div className="box box2">
        <ChartBox url={""} {...chartBoxUser} cantidad={total} />
      </div>
      <div className="box box3">
        <ChartBox {...chartBoxProduct} cantidad={cantidadInterno} />
      </div>
      <div className="box box4">
        <ChartBox {...chartBoxRevenue} cantidad={cantidadExterno} />
      </div>
      <div className="box box5">
        <ChartBox {...chartBoxConversion} cantidad={cantidadCamion} />
      </div>
    </div>
  );
};

export default Home;
