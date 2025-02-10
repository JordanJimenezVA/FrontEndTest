import { DataGrid, GridColDef, GridToolbarContainer, GridToolbarQuickFilter } from "@mui/x-data-grid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';


import * as XLSX from "xlsx";
import "./dataTableL.scss";
import { Button } from "@mui/material";
const host_server = import.meta.env.VITE_SERVER_HOST;

interface Row {
    IDR: number;
    Rol: string;
    Fecha: string;
}

interface HistorialDetail {
    Patente: string | null;
    PatenteR: string | null;
    Tipo: string | null;
    Modelo: string | null;
    Marca: string | null;
    Color: string | null;

    RutP: string | null;
    NombreP: string | null;
    ApellidoP: string | null;
    TipoPersona: string | null;
    ComentarioP: string | null;
    ActividadP: string | null;
    EmpresaP: string | null;

    RutU: string | null;
    NombreU: string | null;
    FechaEntrada: string | null;
    FechaSalida: string | null;
    GuiaDE: string | null;
    GuiaDS: string | null;
    SelloEn: string | null;
    SelloSa: string | null;
    Instalacion: string | null;
    Estado: string | null;
    Ciclo: string | null;

}

type Props = {
    columns: GridColDef[],
    rows: Row[];
    slug: string;
}

const DataTableL = (props: Props) => {

    const [rows, setRows] = useState(props.rows);
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [, setSelectedRow] = useState<Row | null>(null);
    const [historialDetail, setHistorialDetail] = useState<HistorialDetail | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);



    const [paginationModel, setPaginationModel] = useState({
        pageSize: 10,
        page: 0,
    });


    const fetchHistorialDetail = async (IDR: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${host_server}/VerLog/${IDR}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            setIsLoading(false);
            return data;
        } catch (error) {
            setIsLoading(false);
            throw error;
        }
    };

    const fetchAllDetails = async (idrs: number[]) => {
        const detailPromises = idrs.map(idr =>
            fetch(`${host_server}/VerLog/${idr}`).then((response) => {
                if (!response.ok) {
                    throw new Error('Error al obtener los detalles');
                }
                return response.json();
            })
        );
        const allDetails = await Promise.all(detailPromises);
        return allDetails.map(details => details[0]);
    };

    const mutation = useMutation({
        mutationFn: fetchHistorialDetail,
        onSuccess: (data) => {
            const [detail] = data;
            setHistorialDetail(detail);
            setOpen(true);
            queryClient.invalidateQueries({ queryKey: [props.slug] });
        },
        onError: (error: Error) => {
            setError(error.message);
        }
    });

    const handleVerL = (row: Row) => {
        setSelectedRow(row);
        mutation.mutate(row.IDR);
    }

    const handleClose = () => {
        setOpen(false);
        setSelectedRow(null);
        setHistorialDetail(null);
    }

    useEffect(() => {
        const newRows = [...props.rows].sort((a, b) => b.IDR - a.IDR);
        setRows(newRows);
    }, [props.rows]);



    const handleExportExcel = async () => {
        try {
            const idrs = rows.map((row) => row.IDR);
            const details = await fetchAllDetails(idrs);

            // Combina y organiza los datos básicos y los detalles
            const exportData = rows.map((row) => {
          
                const detail = details.find((d) => d.IDR === row.IDR) || {};
                return {
                    "ID Registro": row.IDR,
                    "Nombre Completo": `${detail.NombreP || ""} ${detail.ApellidoP || ""}`,
                    "RUT": detail.RutP || "",
                    "Patente": detail.Patente || "",
                    "Actividad": detail.ActividadP || "",
                    "Fecha Entrada": detail.FechaEntrada || "",
                    "Fecha Salida": detail.FechaSalida || "",
                    "Sello Entrada": detail.SelloEn || "",
                    "Sello Salida": detail.SelloSa || "",
                    "Guía Transporte": detail.GuiaEn || "",
                    "Guía Despacho": detail.GuiaSa || "",
                };
            });


            const worksheet = XLSX.utils.json_to_sheet(exportData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Exported Data");

            const columnWidths = [
                { wch: 15 },
                { wch: 30 },
                { wch: 15 },
                { wch: 15 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 20 },
                { wch: 25 },
                { wch: 25 },
            ];
            worksheet['!cols'] = columnWidths;


            XLSX.writeFile(workbook, "Historial.xlsx");
        } catch (error) {
            console.error("Error al exportar a Excel:", error);
        }
    };

    const CustomToolbar = () => (
        <GridToolbarContainer>
            <GridToolbarQuickFilter showQuickFilter={true} />
            <Stack direction="row" spacing={2} alignItems="center" sx={{ marginLeft: "auto" }}>
                <Button variant="contained" color="success" onClick={handleExportExcel}>
                    Exportar a Excel
                </Button>
            </Stack>
        </GridToolbarContainer>
    );

    const actionColumn: GridColDef = {
        field: "acciones",
        headerName: "Acciones",
        sortable: false,
        width: 90,
        renderCell: (params) => (
            <VisibilityIcon style={{ cursor: "pointer" }} onClick={() => handleVerL(params.row)} />
        ),
    };

    const columns = [...props.columns, actionColumn];

    return (

        <div className="dataTable">
            <DataGrid className="dataGrid"
                rows={rows}
                columns={columns}
                getRowId={(row) => `${row.IDR}`}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 10,
                        },
                    },
                }}
                localeText={{
                    noRowsLabel: 'No hay registros',
                }}
                slots={{
                    toolbar: CustomToolbar, // Usamos la barra de herramientas personalizada
                }}
                slotProps={{
                    toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: { debounceMs: 500 },
                    }
                }}
                paginationModel={paginationModel}
                onPaginationModelChange={(newModel) => setPaginationModel(newModel)}
                pageSizeOptions={[5, 10, 20, 50]}
                disableColumnMenu
                disableRowSelectionOnClick
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
            />
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    Detalles del Historial
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    {isLoading ? (
                        <CircularProgress />
                    ) : error ? (
                        <Typography color="error">{error}</Typography>
                    ) : historialDetail ? (
                        <Stack spacing={2}>
                            <Typography variant="h6">Datos Personal</Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableBody>
                                        {historialDetail.NombreP && (
                                            <TableRow>
                                                <TableCell><strong>Personal</strong></TableCell>
                                                <TableCell>{historialDetail.NombreP}</TableCell>
                                            </TableRow>
                                        )}
                                        {historialDetail.ApellidoP && (
                                            <TableRow>
                                                <TableCell><strong>Apellido</strong></TableCell>
                                                <TableCell>{historialDetail.ApellidoP}</TableCell>
                                            </TableRow>
                                        )}
                                        {historialDetail.RutP && (
                                            <TableRow>
                                                <TableCell><strong>Rut</strong></TableCell>
                                                <TableCell>{historialDetail.RutP}</TableCell>
                                            </TableRow>
                                        )}
                                        {historialDetail.TipoPersona && (
                                            <TableRow>
                                                <TableCell><strong>Rol</strong></TableCell>
                                                <TableCell>{historialDetail.TipoPersona}</TableCell>
                                            </TableRow>
                                        )}
                                        {historialDetail.ActividadP && (
                                            <TableRow>
                                                <TableCell><strong>Rol</strong></TableCell>
                                                <TableCell>{historialDetail.ActividadP}</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            {historialDetail.Patente && (
                                <>
                                    <Typography variant="h6">Datos Vehiculo</Typography>
                                    <TableContainer component={Paper}>
                                        <Table>
                                            <TableBody>
                                                {historialDetail.Patente && (
                                                    <TableRow>
                                                        <TableCell><strong>Patente</strong></TableCell>
                                                        <TableCell>{historialDetail.Patente}</TableCell>
                                                    </TableRow>
                                                )}
                                                {historialDetail.Modelo && (
                                                    <TableRow>
                                                        <TableCell><strong>Modelo</strong></TableCell>
                                                        <TableCell>{historialDetail.Modelo}</TableCell>
                                                    </TableRow>
                                                )}
                                                {historialDetail.Color && (
                                                    <TableRow>
                                                        <TableCell><strong>Color</strong></TableCell>
                                                        <TableCell>{historialDetail.Color}</TableCell>
                                                    </TableRow>
                                                )}
                                                {historialDetail.Marca && (
                                                    <TableRow>
                                                        <TableCell><strong>Marca</strong></TableCell>
                                                        <TableCell>{historialDetail.Marca}</TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </>
                            )}
                            <Typography variant="h6">Datos Historial</Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableBody>
                                        {historialDetail.Estado && (
                                            <TableRow>
                                                <TableCell><strong>Estado</strong></TableCell>
                                                <TableCell>{historialDetail.Estado}</TableCell>
                                            </TableRow>
                                        )}
                                        {historialDetail.NombreU && (
                                            <TableRow>
                                                <TableCell><strong>Guardia</strong></TableCell>
                                                <TableCell>{historialDetail.NombreU}</TableCell>
                                            </TableRow>
                                        )}
                                        {historialDetail.SelloEn && (
                                            <TableRow>
                                                <TableCell><strong>Sello</strong></TableCell>
                                                <TableCell>{historialDetail.SelloEn}</TableCell>
                                            </TableRow>
                                        )}
                                        {historialDetail.PatenteR && (
                                            <TableRow>
                                                <TableCell><strong>Patente Rampa</strong></TableCell>
                                                <TableCell>{historialDetail.PatenteR}</TableCell>
                                            </TableRow>
                                        )}
                                        {historialDetail.GuiaDE && (
                                            <TableRow>
                                                <TableCell><strong>Planilla Transporte</strong></TableCell>
                                                <TableCell>{historialDetail.GuiaDE}</TableCell>
                                            </TableRow>
                                        )}
                                        {historialDetail.FechaEntrada && (
                                            <TableRow>
                                                <TableCell><strong>Fecha Ingreso</strong></TableCell>
                                                <TableCell>{historialDetail.FechaEntrada}</TableCell>
                                            </TableRow>
                                        )}
                                        {historialDetail.FechaSalida && (
                                            <TableRow>
                                                <TableCell><strong>Fecha Salida</strong></TableCell>
                                                <TableCell>{historialDetail.FechaSalida}</TableCell>
                                            </TableRow>
                                        )}
                                        {historialDetail.ComentarioP && (
                                            <TableRow>
                                                <TableCell><strong>Observaciones</strong></TableCell>
                                                <TableCell>{historialDetail.ComentarioP}</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Divider />
                        </Stack>
                    ) : (
                        <Typography>No details available</Typography>
                    )}
                </DialogContent>
            </Dialog>
        </div>

    );
}

export default DataTableL;
