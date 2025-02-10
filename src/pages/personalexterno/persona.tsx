import "./personalExterno.scss";
import DataTablePE from "../../components/dataTable/DataTablePE";
import { useNavigate } from "react-router-dom";
import { GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
const host_server = import.meta.env.VITE_SERVER_HOST;

const columns: GridColDef[] = [
  {
    field: 'RUTP',
    headerName: 'Rut',
    type: 'string',
    width: 150,
    editable: false,
  },
  {
    field: 'NombreP',
    headerName: 'Nombre',
    width: 170,
    editable: false,
    type: 'string',
    valueGetter: (params) => `${params.row.NombreP} ${params.row.ApellidoP}`,
  },
  {
    field: 'ActividadP',
    headerName: 'Actividad',
    width: 170,
    editable: false,
    type: 'string',
  },
];

const persona = () => {

  const navigate = useNavigate();

  const { isLoading, data } = useQuery({
    queryKey: ['persona'],
    queryFn: () =>
      fetch(`${host_server}/Personal`).then((res) =>
        res.json(),
      ),
  })


  const handleIngresarPE = () => {
    navigate(`/AgregarPersonal`);
  }
  return (
    <div className="PE">
      <div className="info">
        <h1 className="h1d">Listado Personas</h1>
        <Button onClick={handleIngresarPE} variant="contained" endIcon={<PersonAddIcon />} >Ingresar Personal </Button>
      </div>
      {isLoading ? (
        "Loading..."
      ) : (
        < DataTablePE slug="persona" columns={columns} rows={data} />
      )}
    </div>
  )
}

export default persona