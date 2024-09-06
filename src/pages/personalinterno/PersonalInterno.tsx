import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/dataTable/DataTable"
import "./personalinterno.scss"
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const host_server = import.meta.env.VITE_SERVER_HOST;

const columns: GridColDef[] = [
  { field: 'IDPI', headerName: 'ID', width: 70, type: 'number' },
  { field: 'RUTPI', headerName: 'Rut', type: 'string', width: 150, editable: false },
  {field: 'NOMBREPI',headerName: 'Nombre',width: 170,editable: false,type: 'string',valueGetter: (params) => `${params.row.NOMBREPI} ${params.row.APELLIDOPI}`,},
  { field: 'VEHICULOPI', headerName: 'Vehiculo', width: 120, type: 'string' },
  { field: 'COLORPI', headerName: 'Color', width: 160, type: 'string' },
  { field: 'PATENTEPI', headerName: 'Patente', width: 160, type: 'string' },
  { field: 'ROLPI', headerName: 'Rol', width: 200, editable: false, type: 'string' },
  { field: 'ESTADOPI', headerName: 'Estado', width: 140, editable: false, type: 'string' },
];



const PersonalInterno = () => {
  
  const navigate = useNavigate();

  const { isLoading, data } = useQuery({
    queryKey: ['Personal Interno'],
    queryFn: () =>
      fetch(`${host_server}/Personal%20Interno`).then((res) =>
        res.json(),
      ),
  })

  const handleIngresarPI = () => {
    navigate(`/AgregarPersonalInterno`);
  }
  return (
    <div className="PI">
      <div className="info">
        <h1 className="h1d">Personal Interno</h1>
        <Button onClick={handleIngresarPI} variant="contained" endIcon={<PersonAddIcon />} >Ingresar Personal </Button>
     
      </div>
      {isLoading ? (
        "Loading..."
      ) : (
        < DataTable slug="Personal Interno" columns={columns} rows={data} />
      )}
    </div>
  )
}

export default PersonalInterno