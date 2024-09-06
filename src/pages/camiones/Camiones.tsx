import "./camiones.scss"
import DataTableCA from "../../components/dataTable/DataTableCA"
import { useNavigate } from "react-router-dom";
import { GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Button } from "@mui/material";
const host_server = import.meta.env.VITE_SERVER_HOST;

const columns: GridColDef[] = [
  { field: 'IDCA', headerName: 'ID', width: 50, type: 'number'},
  {
    field: 'RUTCA',
    headerName: 'Rut Chofer',
    width: 130,
    editable: false,
    type: 'string',
  },
  {
    field: 'CHOFERCA',
    headerName: 'Nombre',
    width: 170,
    editable: false,
    type: 'string',
    valueGetter: (params) => `${params.row.CHOFERCA} ${params.row.APELLIDOCHOFERCA}`,
  },
  {
    field: 'PATENTECA',
    headerName: 'Patente ',
    type: 'string',
    width: 150,
    editable: false,
  },
  {
    field: 'MARCACA',
    headerName: 'Marca',
    width: 140,
    editable: false,
    type: 'string',
  },
  {
    field: 'TIPOCA',
    headerName: 'Tipo',
    width: 200,
    editable: false,
    type: 'string',
  },
  {
    field: 'MODELOCA',
    headerName: 'Modelo',
    width: 140,
    type: 'string',
  },
  {
    field: 'COLORCA',
    headerName: 'Color',
    width: 120,
    type: 'string',
  },
  {
    field: 'EMPRESACA',
    headerName: 'Empresa',
    width: 160,
    type: 'string',
  },
  {
    field: 'ESTADOCA',
    headerName: 'Estado',
    width: 100,
    type: 'string',
  }
];

const Camiones = () => {
  const navigate = useNavigate();

  const { isLoading, data } = useQuery({
    queryKey: ['camiones'],
    queryFn: () =>
    fetch(`${host_server}/camiones`).then((res) =>
        res.json(),
      ),
  })

  const handleIngresarCA = () => {
    navigate(`/AgregarCamion`);
  }
  return (
    <div className="Camiones">
      <div className="info">
          <h1 className="h1d">Camiones</h1>
          <Button onClick={handleIngresarCA} variant="contained" endIcon={<PersonAddIcon />} >Ingresar Camión </Button>
      </div>
      {isLoading ? (
        "Loading..."
      ) : (
        <DataTableCA slug="camiones" columns={columns} rows={data}/>
      )}

    </div>
  )
}

export default Camiones
