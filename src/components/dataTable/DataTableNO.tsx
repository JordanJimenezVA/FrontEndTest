import { DataGrid, GridColDef, GridToolbarQuickFilter  } from "@mui/x-data-grid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Row {
    IDNO: number;
}

type Props = {
    columns: GridColDef[],
    rows: object[];
    slug: string;
}

const DataTableNO = (props: Props) => {
    const navigate = useNavigate();
    const [rows, setRows] = useState(props.rows);

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (IDNO: number) => {

            return new Promise((resolve) => {
                navigate(`/VerNO/${IDNO}`);
                resolve(IDNO);
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [props.slug]
            });
        }
    });

    const handleVerNO = (IDNO: number) => {
        mutation.mutate(IDNO);
    }

    useEffect(() => {
        setRows(props.rows);
    }, [props.rows]);

    const actionColumn: GridColDef = {
        field: 'acciones',
        headerName: 'Acciones',
        sortable: false,
        width: 130,
        renderCell: (params) => {
            const row = params.row as Row; // Castear params.row como Row

            return (
                <div className="action">
                    <div className={`marcar-salida`} onClick={() =>  handleVerNO(row.IDNO)}>
                        <button type="button" className="btn-salida-datatable">
                            Ver
                        </button>
                    </div>
                </div>
            );
        }
    }
    const columns = [...props.columns, actionColumn];
    return (
        <div className="dataTable">
            <DataGrid className="dataGrid"
                rows={rows}
                columns={columns}
                getRowId={(row) => `${row.IDNO}`}
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

export default DataTableNO;