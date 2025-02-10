import "./tablaIngreso.scss";
import { GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import DataTableAll from "../../components/dataTable/DataTableAll";


const host_server = import.meta.env.VITE_SERVER_HOST;
const IDINST = localStorage.getItem("instalacionU") || "";
const columns: GridColDef[] = [
  {
    field: 'NombreP',
    headerName: 'Nombre',
    width: 170,
    editable: false,
    type: 'string',
    valueGetter: (params) => {
      return params.row.NombreP && params.row.ApellidoP 
        ? `${params.row.NombreP} ${params.row.ApellidoP}` 
        : '';
    },
  },
  {
    field: 'RutP',
    headerName: 'Rut / Patente',
    type: 'string',
    width: 150,
    editable: false,
    valueGetter: (params) => {
      return params.row.RutP
        ? `${params.row.RutP}`
        : params.row.Patente || "Sin Datos";
    },
  },
  {
    field: 'ActividadP',
    headerName: 'Cargo',
    width: 150,
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
    width: 220,
    editable: false,
    type: 'string',
  },
];

const TablaIngreso = () => {


  const { isLoading, data } = useQuery({
    queryKey: ['registro', IDINST],
    queryFn: () =>
      fetch(`${host_server}/TablaIngreso?IDINST=${IDINST}`).then((res) =>
        res.json(),
      ),
    enabled: !!IDINST,
  });

  return (
    <div className="Camiones">
      <div className="info">
        <h1 className="h1d">Marcar Salida</h1>
      </div>
      {isLoading ? (
        "Loading..."
      ) : (
        <DataTableAll slug="registro" columns={columns} rows={data} />
      )}
    </div>
  );
};

export default TablaIngreso;
