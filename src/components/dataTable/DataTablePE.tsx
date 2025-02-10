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

const DataTablePE = (props: Props) => {

    const [rows, setRows] = useState<object[]>(props.rows);
    const navigate = useNavigate();
    const queryClient = useQueryClient();


    const deleteMutationa = useMutation({

        mutationFn: (RUTP: number) => {
            return axios.delete(`${host_server}/${props.slug}/${RUTP}`);
        },
        onSuccess: (RUTP) => {
            Swal.fire('Borrado!', 'El registro ha sido borrado.', 'success');
            queryClient.invalidateQueries({
                queryKey: [props.slug]
            });
            setRows(rows.filter((row: any) => row.RUTP !== RUTP));
        },
        onError: () => {
            Swal.fire('Error!', 'No se pudo borrar el registro.', 'error');
        }
    });


    const handleDelete = (RUTP: number) => {
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
                deleteMutationa.mutate(RUTP);
            }
        });
    };

    const handleEditClick = (RUTP: number) => {
        navigate(`/EditarPersonal/${RUTP}`);
    }


    const actionColumn: GridColDef = {
        field: 'acciones',
        headerName: 'Acciones',
        sortable: false,
        width: 160,
        renderCell: (params) => {
            return (
                <div className="action">
                    <IconButton
                        onClick={() => handleEditClick(params.row.RUTP)}
                        color="primary"
                        aria-label="Editar"
                    >
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => handleDelete(params.row.RUTP)}
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

                getRowId={(row) => `${row.RUTP}`}
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

export default DataTablePE