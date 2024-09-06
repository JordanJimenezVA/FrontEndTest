import { GridColDef } from "@mui/x-data-grid";
import DataTableR from "../../components/dataTable/DatatableR";
import "./revision.scss"
import { useQuery } from "@tanstack/react-query";

const host_server = import.meta.env.VITE_SERVER_HOST;

const columns: GridColDef[] = [
  { field: 'IDR', headerName: 'ID', width: 40, type: 'number' },
  {
    field: 'PERSONAL',
    headerName: 'Nombre',
    width: 150,
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
    width: 190,
    editable: false,
    type: 'string',
  }
];


const Revision = () => {


  const { isLoading, data } = useQuery({
    queryKey: ['registros'],
    queryFn: () =>
      fetch(`${host_server}/Revision`).then((res) =>
        res.json(),
      ),
  })


  return (
    <div className="PI">
      <div className="info">
        <h1 className="h1d">Revision Camiones</h1>
      </div>
      {isLoading ? (
        "Loading..."
      ) : (
        <DataTableR slug="registros" columns={columns} rows={data} />
      )}
    </div>
  )
}

export default Revision