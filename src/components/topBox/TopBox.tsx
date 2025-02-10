import { useEffect } from "react";
import "./topbox.scss";
import { useQuery } from "@tanstack/react-query";

interface Log {
  IDR: number;
  NombreP: string;
  ApellidoP: string;
  Patente: string;
  Estado: string;
  TipoPersona: string;
  FechaSalida: string;
  Modelo: string;
}

const TopBox = () => {
  const idInst = localStorage.getItem("instalacionU") || "";
  const host_server = import.meta.env.VITE_SERVER_HOST;

  const { data: logs = [] } = useQuery<Log[]>({
    queryKey: ['logs', idInst],
    queryFn: async () => {
      const response = await fetch(`${host_server}/TopBox?idInst=${idInst}`, {
        method: 'GET',
        credentials: 'include',
      });
      const result = await response.json();


      return Array.isArray(result) && result[0]
        ? result[0].sort((a: Log, b: Log) => b.IDR - a.IDR)
        : [];
    },
    enabled: !!idInst,
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (logs.length > 0) {
    }
  }, [logs]);

  return (
    <div className="topBox">
      <div className="h1d" style={{ color: "black" }}>
        <h1>Actividades Recientes</h1>
      </div>

      <div className="list">
        {logs
          .slice(0, 7)
          .map((log, index) => (
            <div className="listItem" key={`${log.IDR}-${index}`}>
              <div className="user">
                <div className="userTexts">
                  <span className="username">
                    {log.NombreP || log.ApellidoP
                      ? `${log.NombreP || ''} ${log.ApellidoP || ''}`.trim()
                      : log.Patente}
                  </span>
                  <span className="type">
                    {log.TipoPersona ? "" : log.Modelo?.trim()}
                  </span>
                  <span className="type">{log.TipoPersona}</span>
                </div>
              </div>
              <span className={`action ${log.Estado === 'Salida' ? 'redText' : 'greenText'}`}>
                {log.Estado}
              </span>

            </div>


          ))}
      </div>
    </div>
  );
};

export default TopBox;
