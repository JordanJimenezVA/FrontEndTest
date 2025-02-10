import { DataGrid, GridColDef, GridToolbarQuickFilter  } from "@mui/x-data-grid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Row {
    IDR: number;
    Rol: string;
    estadoRevision: string;
}

type Props = {
    columns: GridColDef[],
    rows: object[];
    slug: string;
}

const DataTableRE = (props: Props) => {
    const navigate = useNavigate();
    const [rows, setRows] = useState(props.rows);

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (IDR: number) => {

            return new Promise((resolve) => {
                navigate(`/FormularioSalidaRE/${IDR}`);
                resolve(IDR);
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [props.slug]
            });
        }
    });

    const handleMarcarSalida = (IDR: number) => {
        mutation.mutate(IDR);
    }

    useEffect(() => {
        setRows(props.rows);
    }, [props.rows]);

    const actionColumn: GridColDef = {
        field: 'acciones',
        headerName: 'Marcar Salida',
        sortable: false,
        width: 130,
        renderCell: (params) => {
            const row = params.row as Row; // Castear params.row como Row
           
            return (
                <div className="action">
                    <div className={`marcar-salida}`} onClick={() => handleMarcarSalida(row.IDR)}>
                        <button type="button" className="btn-salida-datatable">
                            SALIDA
                        </button>
                    </div>
                </div>
            );
        }
    }
    return (
        <div className="dataTable">
            <DataGrid className="dataGrid"
                rows={rows}
                columns={[props.columns[0], actionColumn, ...props.columns.slice(2)]}
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

export default DataTableRE;