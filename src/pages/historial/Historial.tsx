import DataTableL from "../../components/dataTable/DataTableL";
import "./logs.scss"
import { GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
const host_server = import.meta.env.VITE_SERVER_HOST;
const IDINST = localStorage.getItem("instalacionU") || "";





const columns: GridColDef[] = [
  {
    field: 'IDR',
    headerName: 'ID',
    type: 'string',
    width: 50,
    editable: false,
  },
  {
    field: 'NombreP',
    headerName: 'Nombre',
    width: 200,
    editable: false,
    type: 'string',
    valueGetter: (params) => {
      const nombreCompleto = `${params.row.NombreP || ''} ${params.row.ApellidoP || ''}`.trim();
      return nombreCompleto 
        ? nombreCompleto 
        : params.row.Patente || "Sin Datos";
    },
  },
  {
    field: 'RutP',
    headerName: 'Rut ',
    type: 'string',
    width: 140,
    editable: false,
  },
  {
    field: 'ActividadP',
    headerName: 'Rol',
    width: 180,
    editable: false,
    type: 'string',
    valueGetter: (params) => {
      return params.row.ActividadP
        ? params.row.ActividadP || "Sin Cargo"
        : params.row.Modelo || "Tipo no especificado";
    },
  },
  {
    field: 'FechaEntrada',
    headerName: 'Fecha Ingreso',
    width: 180,
    editable: false,
    type: 'string',
  },
  {
    field: 'FechaSalida',
    headerName: 'Fecha Salida',
    width: 180,
    editable: false,
    type: 'string',
  }
];
const Historial = () => {

  const { isLoading, data } = useQuery({
    queryKey: ['historial', IDINST],
    queryFn: () =>
      fetch(`${host_server}/logs?IDINST=${IDINST}`).then((res) =>
        res.json(),
      ),
    enabled: !!IDINST,
  });

  if (IDINST === null) {
    return <div>Loading IDINST...</div>; 
  }

  return (
    <div className="Camiones">
      <div className="info">
        <h1 className="h1d">HISTORIAL</h1>
      </div>
      {isLoading ? (
        "Loading..."
      ) : (
        < DataTableL slug="historial" columns={columns} rows={data} />
      )}
    </div>
  )
}

export default Historial