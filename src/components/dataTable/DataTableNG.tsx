import { useState } from 'react';
import { DataGrid, GridColDef, GridToolbarQuickFilter  } from "@mui/x-data-grid";
import "./dataTable.scss";
import axios from "axios";
import Swal from 'sweetalert2';
const host_server = import.meta.env.VITE_SERVER_HOST;
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type Props = {
    columns: GridColDef[],
    rows: object[]
    slug: string;
}

const DataTableNG = (props: Props) => {

    const [rows, setRows] = useState<object[]>(props.rows);
    const queryClient = useQueryClient();


    const editMutation = useMutation({

        mutationFn: (RUTP: string) => {
            return axios.put(`${host_server}/${props.slug}/${RUTP}`);
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


    const handleEdit = (RUTP: string) => {
        Swal.fire({
            title: '¿Eliminar de la lista?',
            text: "Esta persona se removera de la lista",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, Confirmo!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                editMutation.mutate(RUTP);
            }
        });
    };

    const actionColumn: GridColDef = {
        field: 'acciones',
        headerName: 'Acciones',
        sortable: false,
        width: 200,
        renderCell: (params) => {
            return (
                <div className="action">
                    <IconButton
                        onClick={() => handleEdit(params.row.RUTP)}
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

                getRowId={(row) => `${row.IDNG}`}
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

export default DataTableNG