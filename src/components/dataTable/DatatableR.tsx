import { DataGrid, GridColDef, GridToolbarQuickFilter  } from "@mui/x-data-grid";
import "./dataTable.scss";
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';


type Props = {
    columns: GridColDef[],
    rows: object[]
    slug: string;
}

const DataTableR = (props: Props) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();



    const mutation = useMutation({
        mutationFn: (IDR: number) => {
           
            return new Promise((resolve) => {
                navigate(`/RevisionCamion/${IDR}`);
                resolve(IDR);
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [props.slug]
            });
        }
    });

    const handleRevison = (IDR: number) => {
        mutation.mutate(IDR);
    }

    const actionColumn: GridColDef = {
        field: 'acciones',
        headerName: 'Acciones',
        sortable: false,
        width: 120,
        renderCell: (params) => {
            return (
                <div className="action">
                    <div className="marcar-salida" onClick={() => handleRevison(params.row.IDR)}>
                        <button type="button" className="btn-revision-datatable">Revision</button>
                    </div>
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

export default DataTableR