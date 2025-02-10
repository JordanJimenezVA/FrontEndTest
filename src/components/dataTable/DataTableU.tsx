import { useState } from 'react';
import { DataGrid, GridColDef, GridToolbarQuickFilter  } from "@mui/x-data-grid";
import "./dataTable.scss";
import axios from "axios";
import Swal from 'sweetalert2';
const host_server = import.meta.env.VITE_SERVER_HOST;
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type Props = {
    columns: GridColDef[],
    rows: object[]
    slug: string;
}

const DataTableU = (props: Props) => {

    const [rows, setRows] = useState<object[]>(props.rows);
    const navigate = useNavigate();
    const queryClient = useQueryClient();


    const deleteMutationa = useMutation({

        mutationFn: (RUTU: number) => {
            return axios.delete(`${host_server}/${props.slug}/${RUTU}`);
        },
        onSuccess: (RUTU) => {
            Swal.fire('Borrado!', 'El registro ha sido borrado.', 'success');
            queryClient.invalidateQueries({
                queryKey: [props.slug]
            });
            setRows(rows.filter((row: any) => row.RUTU !== RUTU));
        },
        onError: () => {
            Swal.fire('Error!', 'No se pudo borrar el registro.', 'error');
        }
    });


    const handleDelete = (RUTU: number) => {
        Swal.fire({
            title: '¿Estás seguro de borrar?',
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, bórralo!'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutationa.mutate(RUTU);
            }
        });
    };

    const handleEditClick = (RUTU: number) => {
        navigate(`/EditarUsuario/${RUTU}`);
    }


    const actionColumn: GridColDef = {
        field: 'acciones',
        headerName: 'Acciones',
        sortable: false,
        width: 200,
        renderCell: (params) => {
            return (
                <div className="action">
                    <IconButton
                        onClick={() => handleEditClick(params.row.RUTU)}
                        color="primary"
                        aria-label="Editar"
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => handleDelete(params.row.RUTU)}
                        color="secondary"
                        aria-label="Eliminar"
                    >
                        <DeleteIcon />
                    </IconButton>
                </div>
            );
        },
    };

    return (
        <div className="dataTable">
            <DataGrid className="dataGrid"
                rows={props.rows}
                editMode="row"
                columns={[...props.columns, actionColumn]}

                getRowId={(row) => `${row.RUTU}`}
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
                slots={{ toolbar: GridToolbarQuickFilter  }}
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
        </div>
    )
}

export default DataTableU