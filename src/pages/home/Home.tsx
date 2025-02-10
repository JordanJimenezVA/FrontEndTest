// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import "./home.scss";
import TopBox from "../../components/topBox/TopBox";
import ChartBox from "../../components/chartbox/ChartBox";
import { chartBoxConversion, chartBoxProduct, chartBoxRevenue, chartBoxUser } from "../../data";
import { useQuery } from "@tanstack/react-query";


const host_server = import.meta.env.VITE_SERVER_HOST;

const Home = () => {
  const idInst = localStorage.getItem("instalacionU") || "";

  const fetchChartData = async () => {
  
    const response = await fetch(`${host_server}/ChartBox?idinst=${idInst}`, {
      credentials: 'include',
    });
  
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  
    return response.json();
  };

  const { isLoading, data, error } = useQuery({
    queryKey: ["ChartBox", idInst],
    queryFn: fetchChartData,
    enabled: !!idInst, 
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const dataArray = Array.isArray(data) ? data : [];


  // Contar los tipos de personas
  const cantidadExterno = dataArray.filter(
    (item: any) => item.TipoPersona === "PersonalExterno"
  ).length;
  const cantidadInterno = dataArray.filter(
    (item: any) => item.TipoPersona === "PersonalInterno"
  ).length;
  const cantidadCamion = dataArray.filter(
    (item: any) => item.Tipo === "Camion"
  ).length;

  const total = cantidadExterno + cantidadInterno + cantidadCamion;

  return (
    <div className="home">
      <div className="box box1">
        <TopBox />
      </div>
      <div className="box box2">
        <ChartBox {...chartBoxUser} cantidad={total} />
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
