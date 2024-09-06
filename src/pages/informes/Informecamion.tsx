import { GridColDef } from "@mui/x-data-grid";
import DataTableInforme from "../../components/dataTable/DataTableInforme";
import "./informeCamion.scss"
import { useQuery } from "@tanstack/react-query";

const host_server = import.meta.env.VITE_SERVER_HOST;


const columns: GridColDef[] = [
  { field: 'IDR', headerName: 'ID', width: 40, type: 'number' },
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
  }
];


const InformeCamion = () => {

  const { isLoading, data } = useQuery({
    queryKey: ['revision'],
    queryFn: () =>
      fetch(`${host_server}/InformeCamion`).then((res) =>
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
        < DataTableInforme slug="revision" columns={columns} rows={data} />
      )}
    </div>
  )
}

export default InformeCamion