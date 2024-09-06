import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
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
import "./dataTable.scss";
const host_server = import.meta.env.VITE_SERVER_HOST;

interface Row {
    IDL: number;
    Rol: string;
}

interface HistorialDetail {
    PERSONAL: string | null;
    APELLIDO: string | null;
    RUT: string | null;
    PATENTE: string | null;
    ROL: string | null;
    OBSERVACIONES: string | null;
    GUIADESPACHO: string | null;
    SELLO: string | null;
    FECHAINGRESO: string | null;
    FECHASALIDA: string | null;
    ESTADO: string | null;
    GUARDIA: string | null;
    PATENTERACA: string | null;
    VEHICULO: string | null;
    MODELO: string | null;
    COLOR: string | null;
    MARCA: string | null;
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


    const fetchHistorialDetail = async (IDL: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${host_server}/VerLog/${IDL}`);
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
        mutation.mutate(row.IDL);
    }

    const handleClose = () => {
        setOpen(false);
        setSelectedRow(null);
        setHistorialDetail(null);
    }

    useEffect(() => {
        const newRows = [...props.rows].sort((a, b) => b.IDL - a.IDL);
        setRows(newRows);
    }, [props.rows]);

    const actionColumn: GridColDef = {
        field: 'acciones',
        headerName: 'Acciones',
        sortable: false,
        width: 90,
        renderCell: (params) => {
            const row = params.row as Row;
            return (
                <div className="action">
                    <div className="marcar-salida" onClick={() => handleVerL(row)}>
                        <VisibilityIcon style={{ cursor: 'pointer' }} />
                    </div>
                </div>
            );
        },
        cellClassName: 'centered-cell'
    }
    const columns = [...props.columns, actionColumn];

    return (
        <div className="dataTable">
            <DataGrid className="dataGrid"
                rows={rows}
                columns={columns}
                getRowId={(row) => `${row.IDL}`}
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
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                    toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: { debounceMs: 500 },
                    }
                }}
                pageSizeOptions={[10]}
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
                                        {historialDetail.PERSONAL && (
                                            <TableRow>
                                                <TableCell><strong>Personal</strong></TableCell>
                                                <TableCell>{historialDetail.PERSONAL}</TableCell>
                                            </TableRow>
                                        )}
                                        {historialDetail.APELLIDO && (
                                            <TableRow>
                                                <TableCell><strong>Apellido</strong></TableCell>
                                                <TableCell>{historialDetail.APELLIDO}</TableCell>
                                            </TableRow>
                                        )}
                                        {historialDetail.RUT && (
                                            <TableRow>
                                                <TableCell><strong>Rut</strong></TableCell>
                                                <TableCell>{historialDetail.RUT}</TableCell>
                                            </TableRow>
                                        )}
                                        {historialDetail.ROL && (
                                            <TableRow>
                                                <TableCell><strong>Rol</strong></TableCell>
                                                <TableCell>{historialDetail.ROL}</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Typography variant="h6">Datos Vehiculo</Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableBody>
                                        {historialDetail.VEHICULO && (
                                            <TableRow>
                                                <TableCell><strong>Vehiculo</strong></TableCell>
                                                <TableCell>{historialDetail.VEHICULO}</TableCell>
                                            </TableRow>
                                        )}
                                        {historialDetail.PATENTE && (
                                            <TableRow>
                                                <TableCell><strong>Patente</strong></TableCell>
                                                <TableCell>{historialDetail.PATENTE}</TableCell>
                                            </TableRow>
                                        )}
                                        {historialDetail.MODELO && (
                                            <TableRow>
                                                <TableCell><strong>Modelo</strong></TableCell>
                                                <TableCell>{historialDetail.MODELO}</TableCell>
                                            </TableRow>
                                        )}
                                        {historialDetail.COLOR && (
                                            <TableRow>
                                                <TableCell><strong>Color</strong></TableCell>
                                                <TableCell>{historialDetail.COLOR}</TableCell>
                                            </TableRow>
                                        )}
                                        {historialDetail.MARCA && (
                                            <TableRow>
                                                <TableCell><strong>Marca</strong></TableCell>
                                                <TableCell>{historialDetail.MARCA}</TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Typography variant="h6">Datos Historial</Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableBody>
                                        {historialDetail.ESTADO && (
                                            <TableRow>
                                                <TableCell><strong>Estado</strong></TableCell>
                                                <TableCell>{historialDetail.ESTADO}</TableCell>
                                            </TableRow>
                                        )}
                                        {historialDetail.GUARDIA && (
                                            <TableRow>
                                                <TableCell><strong>Guardia</strong></TableCell>
                                                <TableCell>{historialDetail.GUARDIA}</TableCell>
                                            </TableRow>
                                        )}
                                        {historialDetail.SELLO && (
                                            <TableRow>
                                                <TableCell><strong>Sello</strong></TableCell>
                                                <TableCell>{historialDetail.SELLO}</TableCell>
                                            </TableRow>
                                        )}
                                        {historialDetail.PATENTERACA && (
                                            <TableRow>
                                                <TableCell><strong>Patente Rampa</strong></TableCell>
                                                <TableCell>{historialDetail.PATENTERACA}</TableCell>
                                            </TableRow>
                                        )}
                                        {historialDetail.GUIADESPACHO && (
                                            <TableRow>
                                                <TableCell><strong>Planilla Transporte</strong></TableCell>
                                                <TableCell>{historialDetail.GUIADESPACHO}</TableCell>
                                            </TableRow>
                                        )}
                                        {historialDetail.FECHAINGRESO && (
                                            <TableRow>
                                                <TableCell><strong>Fecha Ingreso</strong></TableCell>
                                                <TableCell>{historialDetail.FECHAINGRESO}</TableCell>
                                            </TableRow>
                                        )}
                                        {historialDetail.FECHASALIDA && (
                                            <TableRow>
                                                <TableCell><strong>Fecha Salida</strong></TableCell>
                                                <TableCell>{historialDetail.FECHASALIDA}</TableCell>
                                            </TableRow>
                                        )}
                                        {historialDetail.OBSERVACIONES && (
                                            <TableRow>
                                                <TableCell><strong>Observaciones</strong></TableCell>
                                                <TableCell>{historialDetail.OBSERVACIONES}</TableCell>
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
