import "./tablaIngreso.scss";
import { GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import DataTableAll from "../../components/dataTable/DataTableAll";
import GuardiaID from "../../hooks/GuardiaID";

const host_server = import.meta.env.VITE_SERVER_HOST;

const columns: GridColDef[] = [
  { field: 'IDR', headerName: 'ID', width: 40, type: 'number' },
  {
    field: 'FECHAINGRESO',
    headerName: 'Fecha Ingreso',
    width: 140,
    editable: false,
    type: 'DATE',
    valueFormatter: (params) => {
      const date = new Date(params.value as string);
      return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
    },
  },
  {
    field: 'PERSONAL',
    headerName: 'Nombre',
    width: 170,
    editable: false,
    type: 'string',
    valueGetter: (params) => `${params.row.PERSONAL} ${params.row.APELLIDO}`,
  },
  {
    field: 'RUT',
    headerName: 'Rut ',
    type: 'string',
    width: 150,
    editable: false,
  },
  {
    field: 'PATENTE',
    headerName: 'Patente',
    width: 110,
    editable: false,
    type: 'string',
  },
  {
    field: 'ROL',
    headerName: 'Rol',
    width: 150,
    editable: false,
    type: 'string',
  },
  {
    field: 'FECHAINGRESO',
    headerName: 'Fecha Ingreso',
    width: 220,
    editable: false,
    type: 'string',
  },
  {
    field: 'estadoRevision',
    headerName: 'Estado',
    width: 140,
    editable: false,
    type: 'string',
  }
];

const TablaIngreso = () => {
  const IDINST = GuardiaID();

  const { isLoading, data } = useQuery({
    queryKey: ['registros', IDINST],
    queryFn: () =>
      fetch(`${host_server}/TablaIngreso?IDINST=${IDINST}`).then((res) =>
        res.json(),
      ),
    enabled: !!IDINST, // Solo ejecuta la consulta si IDINST está disponible
  });

  return (
    <div className="Camiones">
      <div className="info">
        <h1 className="h1d">MARCAR SALIDA CAMIÓN</h1>
      </div>
      {isLoading ? (
        "Loading..."
      ) : (
        <DataTableAll slug="registros" columns={columns} rows={data} />
      )}
    </div>
  );
};

export default TablaIngreso;
