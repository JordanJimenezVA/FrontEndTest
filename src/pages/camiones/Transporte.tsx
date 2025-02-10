import "./camiones.scss"
import DataTableCA from "../../components/dataTable/DataTableCA"
import { useNavigate } from "react-router-dom";
import { GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Button } from "@mui/material";
const host_server = import.meta.env.VITE_SERVER_HOST;

const columns: GridColDef[] = [
  {
    field: 'PATENTE',
    headerName: 'Patente',
    width: 130,
    editable: false,
    type: 'string',
  },
  {
    field: 'Tipo',
    headerName: 'Tipo',
    width: 170,
    editable: false,
    type: 'string',
  },
  {
    field: 'Modelo',
    headerName: 'Modelo ',
    type: 'string',
    width: 130,
    editable: false,
  },
  {
    field: 'Marca',
    headerName: 'Marca',
    width: 140,
    editable: false,
    type: 'string',
  },
  {
    field: 'Color',
    headerName: 'Color',
    width: 200,
    editable: false,
    type: 'string',
  },
  {
    field: 'Empresa',
    headerName: 'Empresa',
    width: 140,
    type: 'string',
  }
];

const Transporte = () => {
  const navigate = useNavigate();

  const { isLoading, data } = useQuery({
    queryKey: ['transporte'],
    queryFn: () =>
    fetch(`${host_server}/Transporte`).then((res) =>
        res.json(),
      ),
  })

  const handleIngresarCA = () => {
    navigate(`/AgregarTransporte`);
  }
  return (
    <div className="transporte">
      <div className="info">
          <h1 className="h1d">Listado Transporte</h1>
          <Button onClick={handleIngresarCA} variant="contained" endIcon={<PersonAddIcon />} >Ingresar Transporte </Button>
      </div>
      {isLoading ? (
        "Loading..."
      ) : (
        <DataTableCA slug="transporte" columns={columns} rows={data}/>
      )}

    </div>
  )
}

export default Transporte
