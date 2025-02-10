import "./tablaNovedad.scss";
import { GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import DataTableNO from "../../components/dataTable/DataTableNO";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
const host_server = import.meta.env.VITE_SERVER_HOST;

const IDINST = localStorage.getItem("instalacionU") || "";
const columns: GridColDef[] = [
  { field: 'IDNO', headerName: 'ID', width: 40, type: 'number' },
  {
    field: 'Fecha',
    headerName: 'Fecha Ingreso',
    width: 180,
    editable: false,
    type: 'string',
  },
  {
    field: 'Guardia',
    headerName: 'Guardia',
    width: 170,
    editable: false,
    type: 'string',
  }
];

const TablaNovedad = () => {


  const { isLoading, data, error } = useQuery({
    queryKey: ['Novedades', IDINST],
    queryFn: () =>
      fetch(`${host_server}/TablaNovedad?IDINST=${IDINST}`).then((res) => {
        if (!res.ok) {
          throw new Error('Error en la consulta');
        }
        return res.json();
      }),
    enabled: !!IDINST,
  });

  const navigate = useNavigate();
  
  const handleIngresarNO = () => {
    navigate("/AgregarNo");
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Asegurarse de que `data` es un array y verificar si está vacío
  const rows = Array.isArray(data) ? data : [];

  return (
    <div className="Camiones">
      <div className="info">
        <h1 className="h1d">NOVEDADES</h1>
        <Button onClick={handleIngresarNO} variant="contained" endIcon={<PersonAddIcon />} >Reportar Novedad </Button>
      </div>
      {isLoading ? (
        "Loading..."
      ) : (
        < DataTableNO slug="Novedades" columns={columns} rows={rows} />
      )}
    </div>
  )
}

export default TablaNovedad