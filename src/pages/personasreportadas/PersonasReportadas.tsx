import { GridColDef } from "@mui/x-data-grid";
import DataTableNG from "../../components/dataTable/DataTableNG"
import "./personasreportadas.scss"
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
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
    navigate(`/ReportarPersona`);
  }


  return (
    <div className="NG">
      <div className="info">
        <h1 className="h1d">Personas Reportadas</h1>

        <Button onClick={handleIngresarNG} variant="contained" endIcon={<PersonAddIcon />} >Reportar Persona </Button>
      </div>
      {isLoading ? (
        "Loading..."
      ) : (
        < DataTableNG slug="Personas Reportadas" columns={columns} rows={data} />
      )}

    </div>
  )
}

export default PersonasReportadas