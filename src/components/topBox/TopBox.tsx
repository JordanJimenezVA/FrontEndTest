import "./topbox.scss";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import GuardiaID from "../../hooks/GuardiaID";
interface Log {
  IDL: number;
  PERSONAL: string;
  APELLIDO: string;
  PATENTE: string;
  ESTADO: string;
  ROL: string;
}

const TopBox = () => {
  const idInst = GuardiaID(); 
  const [logs, setLogs] = useState<Log[]>([]);
  const host_server = import.meta.env.VITE_SERVER_HOST;


  const { data } = useQuery({
    queryKey: ['logs', idInst],
    queryFn: () =>
      fetch(`${host_server}/TopBox?idInst=${idInst}`, {
        method: 'GET',
        credentials: 'include' // Asegúrate de enviar cookies con la solicitud
      }).then((res) => res.json()),
    enabled: !!idInst,
  });
  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      setLogs(data[0]); // Utilizar el primer array de datos
    }
  }, [data]);

  return (
    <div className="topBox">
      <div className="h1d">
        <h1>Actividades Recientes</h1>
      </div>

      <div className="list">
        {Array.isArray(logs) && logs.slice(0, 7).map((log, index) => (
          <div className="listItem" key={`${log.IDL}-${index}`}>
            <div className="user">
              <div className="userTexts">
                <span className="username">{log.PERSONAL} {log.APELLIDO}</span>
                <span className="type">{log.ROL}</span>
              </div>
            </div>
            <span className={`action ${log.ESTADO === 'SALIDA' ? 'redText' : 'greenText'}`}>
              {log.ESTADO}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopBox;
