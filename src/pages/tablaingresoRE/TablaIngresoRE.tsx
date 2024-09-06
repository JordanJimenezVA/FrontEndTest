import "./tablaingresoRE.scss"
import { GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import DataTableRE from "../../components/dataTable/DataTableRE";
import useGuardiaID from "../../hooks/GuardiaID";
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
  }
];

const TablaIngresoRE = () => {
  const IDINST = useGuardiaID();


  const { isLoading, data } = useQuery({
    queryKey: ['registros', IDINST],
    queryFn: () =>
      fetch(`${host_server}/TablaIngresoRE?IDINST=${IDINST}`).then((res) =>
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
        <h1 className="h1d">MARCAR SALIDA PERSONAL</h1>
      </div>
      {isLoading ? (
        "Loading..."
      ) : (
        < DataTableRE slug="registros" columns={columns} rows={data} />
      )}

    </div>
  )
}

export default TablaIngresoRE