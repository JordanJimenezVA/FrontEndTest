import { GridColDef } from "@mui/x-data-grid";
import DataTableNG from "../../components/dataTable/DataTableNG"
import "./personasreportadas.scss"
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
const host_server = import.meta.env.VITE_SERVER_HOST;

const columns: GridColDef[] = [
  { field: 'IDNG', headerName: 'ID', width: 70, type: 'number' },
  { field: 'RUTNG', headerName: 'Rut', type: 'string', width: 150 },
  { field: 'ESTADONG', headerName: 'Estado', type: 'string', width: 250 },
];
const mapEstado = (estado: string) => {
    switch (estado) {
      case 'PERMS1':
        return 'Permiso con precaución';
      case 'PERMS2':
        return 'Solicitar permiso';
      case 'NOACCESO':
        return 'Prohibido el acceso';
      default:
        return estado;
    }
  };
const PersonasReportadas = () => {

  const navigate = useNavigate();

  const { isLoading, data } = useQuery({
    queryKey: ['Personas Reportadas'],
    queryFn: () =>
      fetch(`${host_server}/PersonasReportadas`).then((res) =>
        res.json(),
      ),
  })


  const handleIngresarNG = () => {
    navigate(`/AgregarPersonaNG`);
  }
  const rows = data?.map((row: any) => ({
    ...row,
    ESTADONG: mapEstado(row.ESTADONG),
  })) || [];

  return (
    <div className="NG">
      <div className="info">
        <h1 className="h1d">Personas Reportadas</h1>

        <Button onClick={handleIngresarNG} variant="contained" endIcon={<PersonAddIcon />} >Reportar Persona </Button>
      </div>
      {isLoading ? (
        "Loading..."
      ) : (
        < DataTableNG slug="Personas Reportadas" columns={columns} rows={rows} />
      )}

    </div>
  )
}

export default PersonasReportadas