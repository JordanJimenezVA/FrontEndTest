import Swal from 'sweetalert2';
import Axios from "axios";
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { IconButton } from '@mui/material';
const host_server = import.meta.env.VITE_SERVER_HOST;

function EditarCA() {
    const { IDCA } = useParams();
    const [rutValido, setRutValido] = useState(true);

    const [formValues, setFormValues] = useState({
        RUTCA: '',
        CHOFERCA: '',
        APELLIDOCHOFERCA: '',
        PATENTECA: '',
        MARCACA: '',
        TIPOCA: '',
        MODELOCA: '',
        COLORCA: '',
        EMPRESACA: '',
        ESTADOCA: '',
    });

    useEffect(() => {
        getCamiones(IDCA);
    }, [IDCA]);

    const formatRut = (rut) => {
        rut = rut.replace(/[^0-9kK]/g, '');
        if (rut.length <= 1) {
            return rut;
        }
        const body = rut.slice(0, -1);
        const dv = rut.slice(-1).toUpperCase();
        return `${body}-${dv}`;
    };

    const validarRut = (rut) => {
        if (!/^\d{1,8}-[\dkK]$/.test(rut)) return false;
        const [body, dv] = rut.split('-');
        return dv.toUpperCase() === calculateDV(body);
    };

    const calculateDV = (rut) => {
        let sum = 0;
        let multiplier = 2;
        for (let i = rut.length - 1; i >= 0; i--) {
            sum += rut[i] * multiplier;
            multiplier = multiplier === 7 ? 2 : multiplier + 1;
        }
        const remainder = sum % 11;
        if (remainder === 1) {
            return 'K';
        } else if (remainder === 0) {
            return '0';
        } else {
            return String(11 - remainder);
        }
    };

    const handleRutChange = (event) => {
        const value = event.target.value;
        const formattedValue = formatRut(value);
        setFormValues((prevValues) => ({
            ...prevValues,
            RUTCA: formattedValue,
        }));
        setRutValido(validarRut(formattedValue));
    };

    const getCamiones = (IDCA) => {
        Axios.get(`${host_server}/EditarCamiones/${IDCA}`)
            .then((res) => {
                const { RUTCA, CHOFERCA, APELLIDOCHOFERCA, PATENTECA, MARCACA, TIPOCA, MODELOCA, COLORCA, EMPRESACA, ESTADOCA } = res.data[0];
                setFormValues({
                    RUTCA: formatRut(RUTCA), // Asegúrate de aplicar el formato al recibir los datos
                    CHOFERCA: CHOFERCA || '',
                    APELLIDOCHOFERCA: APELLIDOCHOFERCA || '',
                    PATENTECA: PATENTECA || '',
                    MARCACA: MARCACA || '',
                    TIPOCA: TIPOCA || '',
                    MODELOCA: MODELOCA || '',
                    COLORCA: COLORCA || '',
                    EMPRESACA: EMPRESACA || '',
                    ESTADOCA: ESTADOCA || '',
                });
            })
            .catch((error) => {
                console.error("Error al obtener registros:", error);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Error al obtener registros, intente nuevamente más tarde",
                });
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const limpiarCampos = () => {
        setFormValues({
            RUTCA: '',
            CHOFERCA: '',
            APELLIDOCHOFERCA: '',
            PATENTECA: '',
            MARCACA: '',
            TIPOCA: '',
            MODELOCA: '',
            COLORCA: '',
            EMPRESACA: '',
            ESTADOCA: '',
        });
    };

    const limpiarCampo = (campo) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            [campo]: '',
        }));
    };

    const editarCA = () => {
        Axios.put(`${host_server}/EditarCamiones/${IDCA}`, {
            ...formValues
        }).then(() => {
            limpiarCampos();
            Swal.fire({
                title: 'Modificación Exitosa!',
                icon: 'success',
                text: 'Modificación realizada correctamente',
                timer: 1500
            });
        }).catch((error) => {
            console.error("Error al modificar:", error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Error al modificar, intente nuevamente más tarde",
            });
        });
    };

    const handlePatenteChange = (event) => {
        const value = event.target.value.toUpperCase();
        setFormValues((prevValues) => ({
            ...prevValues,
            PATENTECA: value,
        }));
    };

    return (
        <form onSubmit={(e) => {
            e.preventDefault(); // Evita que se recargue la página
            if (rutValido) {
                editarCA();
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "RUT no válido",
                });
            }
        }}>
            <div className="container-form">
                <header>Editar Camión</header>
                <br></br>
                <div className="form first" style={{ paddingRight: "30px" }}>
                    <div className="details personal">
                        <span className="title">Datos Camión</span>
                        <div className="fields">
                            <div className="input-field">
                                <label>Patente</label>
                                <div className="input-group">
                                    <input
                                        required
                                        type="text"
                                        onChange={handlePatenteChange}
                                        value={formValues.PATENTECA}
                                        placeholder='INGRESE PATENTE'
                                        className='form-control'
                                        id="patenteca-input"
                                        name='PATENTECA'
                                    />
                                    <IconButton color="primary" onClick={() => limpiarCampo('PATENTECA')} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>
                            <div className="input-field">
                                <label>Tipo</label>
                                <div className="input-group">
                                    <select
                                        required
                                        onChange={handleChange}
                                        className='select-form-control'
                                        value={formValues.TIPOCA}
                                        id="tipoca-input"
                                        name='TIPOCA'
                                    >
                                        <option value="">Seleccionar una opción</option>
                                        <option value="SEMIREMOLQUE">SEMIREMOLQUE</option>
                                        <option value="CAMION">CAMION</option>
                                        <option value="TRACTOCAMION">TRACTOCAMION</option>
                                        <option value="CHASIS CABINADO">CHASIS CABINADO</option>
                                        <option value="REMOLQUE">REMOLQUE</option>
                                        <option value="OtrosCA">Otros</option>
                                    </select>
                                    <IconButton color="primary" onClick={() => limpiarCampo('TIPOCA')} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>
                            <div className="input-field">
                                <label>Modelo</label>
                                <div className="input-group">
                                    <input
                                        required
                                        type="text"
                                        onChange={handleChange}
                                        value={formValues.MODELOCA}
                                        placeholder='INGRESE MODELO'
                                        className='form-control'
                                        id="modeloca-input"
                                        name='MODELOCA'
                                    />
                                    <IconButton color="primary" onClick={() => limpiarCampo('MODELOCA')} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>
                            <div className="input-field">
                                <label>Color</label>
                                <div className="input-group">
                                    <input
                                        required
                                        type="text"
                                        onChange={handleChange}
                                        value={formValues.COLORCA}
                                        placeholder='INGRESE COLOR'
                                        className='form-control'
                                        id="colorca-input"
                                        name='COLORCA'
                                    />
                                    <IconButton color="primary" onClick={() => limpiarCampo('COLORCA')} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>
                            <div className="input-field">
                                <label>Marca</label>
                                <div className="input-group">
                                    <input
                                        required
                                        type="text"
                                        onChange={handleChange}
                                        value={formValues.MARCACA}
                                        placeholder='INGRESE MARCA'
                                        className='form-control'
                                        id="marcaca-input"
                                        name='MARCACA'
                                    />
                                    <IconButton color="primary" onClick={() => limpiarCampo('MARCACA')} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>
                            <div className="input-field">
                                <label>Empresa</label>
                                <div className="input-group">
                                    <input
                                        required
                                        type="text"
                                        onChange={handleChange}
                                        value={formValues.EMPRESACA}
                                        placeholder='INGRESE EMPRESA'
                                        className='form-control'
                                        id="empresape-input"
                                        name='EMPRESACA'
                                    />
                                    <IconButton color="primary" onClick={() => limpiarCampo('EMPRESACA')} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br></br>
                    <div className="details ID">
                        <span className="title">Datos Chofer</span>
                        <div className="fields">
                            <div className="input-field">
                                <label>Rut Chofer</label>
                                <div className="input-group">
                                    <input
                                        required
                                        type="text"
                                        className={`form-control ${rutValido ? '' : 'is-invalid'}`}
                                        onChange={handleRutChange}
                                        value={formValues.RUTCA}
                                        placeholder='INGRESE RUT'
                                        id="rutca-input"
                                        name='RUTCA'
                                    />
                                    <IconButton color="primary" onClick={() => limpiarCampo('RUTCA')} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                                {!rutValido && (
                                    <div className="invalid-feedback">RUT no válido</div>
                                )}
                            </div>
                            <div className="input-field">
                                <label>Nombre Chofer</label>
                                <div className="input-group">
                                    <input
                                        required
                                        type="text"
                                        className="form-control"
                                        onChange={handleChange}
                                        value={formValues.CHOFERCA}
                                        placeholder='INGRESE NOMBRE'
                                        id="choferca-input"
                                        name='CHOFERCA'
                                    />
                                    <IconButton color="primary" onClick={() => limpiarCampo('CHOFERCA')} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>
                            <div className="input-field">
                                <label>Apellido Chofer</label>
                                <div className="input-group">
                                    <input
                                        required
                                        type="text"
                                        onChange={handleChange}
                                        value={formValues.APELLIDOCHOFERCA}
                                        placeholder='INGRESE APELLIDO'
                                        className='form-control'
                                        id="apellidoca-input"
                                        name='APELLIDOCHOFERCA'
                                    />
                                    <IconButton color="primary" onClick={() => limpiarCampo('APELLIDOCHOFERCA')} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="buttons">
                    <button className="sumbit-entrada">
                        <span className="btnText">Confirmar Registro</span>
                        <i className="uil uil-navigator"></i>
                    </button>
                </div>
            </div>
        </form>
    );
}

export default EditarCA;
