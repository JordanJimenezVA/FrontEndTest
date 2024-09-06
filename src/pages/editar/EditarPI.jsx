import Swal from 'sweetalert2';
import Axios from "axios";
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { IconButton } from '@mui/material';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
const host_server = import.meta.env.VITE_SERVER_HOST;




function EditarPI() {
    const { IDPI } = useParams();
    const [rutValido, setRutValido] = React.useState(true);

    const [formValues, setFormValues] = useState({
        RUTPI: '',
        NOMBREPI: '',
        APELLIDOPI: '',
        ROLPI: '',
        ESTADOPI: '',
        VEHICULOPI: '',
        MODELOPI: '',
        PATENTEPI: '',
        COLORPI: '',
    });

    useEffect(() => {
        getPersonalInterno(IDPI);
    }, [IDPI]);

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
            RUTPI: formattedValue,
        }));
        setRutValido(validarRut(formattedValue));
    };

    const handlePatenteChange = (event) => {
        const value = event.target.value.toUpperCase();
        setFormValues((prevValues) => ({
            ...prevValues,
            PATENTEPI: value,
        }));
    };

    const getPersonalInterno = (IDPI) => {
        Axios.get(`${host_server}/EditarPersonalInterno/${IDPI}`)
            .then((res) => {
                const { RUTPI, NOMBREPI, APELLIDOPI, ROLPI, ESTADOPI, VEHICULOPI, MODELOPI, PATENTEPI, COLORPI } = res.data[0];
                setFormValues({
                    RUTPI: RUTPI || '',
                    NOMBREPI: NOMBREPI || '',
                    APELLIDOPI: APELLIDOPI || '',
                    ROLPI: ROLPI || '',
                    ESTADOPI: ESTADOPI || '',
                    VEHICULOPI: VEHICULOPI || '',
                    MODELOPI: MODELOPI || '',
                    PATENTEPI: PATENTEPI || '',
                    COLORPI: COLORPI || '',
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
            RUTPI: '',
            NOMBREPI: '',
            APELLIDOPI: '',
            ROLPI: '',
            ESTADOPI: '',
            VEHICULOPI: '',
            MODELOPI: '',
            PATENTEPI: '',
            COLORPI: '',
        });
    };

    const limpiarCampo = (campo) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            [campo]: '',
        }));
    };

    const editarPI = () => {
        Axios.put(`${host_server}/EditarPersonalInterno/${IDPI}`, {
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
    }

    return (
        <form onSubmit={(e) => {
            e.preventDefault(); // Evita que se recargue la página
            editarPI();
        }}>
            
            <div className="container-form">
                <header>Editar Personal Interno</header>
                <div className='error-div'>

                </div>
                <br></br>
                <div className="form first" style={{ paddingRight: "30px" }}>
                    <div className="details personal">
                        <span className="title">Datos Personal Interno</span>
                        <div className="fields">

                            <div className="input-field">
                                <label>Rut</label>
                                <div className="input-group">

                                    <input required type="text" onChange={(event) => handleRutChange(event, { newValue: event.target.value })} value={formValues.RUTPI} placeholder='Ingreso Rut' className={`form-control ${rutValido ? '' : 'is-invalid'}`} id="rutpi-input" name={'RUTPI'} />
                                <IconButton color="primary" onClick={() => limpiarCampo('RUTPI')} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Nombre</label>
                                <div className="input-group">
                                    <input required type="text" onChange={handleChange} value={formValues.NOMBREPI} placeholder='Ingreso Nombre' className='form-control' id="nombrepi-input" name={'NOMBREPI'} />
                                    <IconButton color="primary" onClick={() => limpiarCampo('NOMBREPI')} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Apellido</label>
                                <div className="input-group">
                                    <input required type="text" onChange={handleChange} value={formValues.APELLIDOPI} placeholder='Ingrese Apellido' className='form-control' id="apellidopi-input" name={'APELLIDOPI'} />
                                    <IconButton color="primary" onClick={() => limpiarCampo('APELLIDOPI')} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>


                            <div className="input-field">
                                <label>Rol</label>
                                <div className="input-group">
                                    <select required onChange={handleChange} className='select-form-control' value={formValues.ROLPI} id="rolpi-input" name={'ROLPI'}>
                                        <option value="">Seleccionar una opción</option>
                                        <option value="Aseo">Aseo</option>
                                        <option value="Administrativo Existencias">Administrativo Existencias</option>
                                        <option value="Administrativo de Distribución">Administrativo de Distribución</option>
                                        <option value="Administrativo Congelados">Administrativo Congelados</option>
                                        <option value="Jefe de Sucursal">Jefe de Sucursal</option>
                                        <option value="Jefe Comercial">Jefe Comercial</option>
                                        <option value="Jefe de Distribución">Jefe de Distribución</option>
                                        <option value="Coordinador Trade Marketing">Coordinador Trade Marketing</option>
                                        <option value="Supervisor de Distribución">Supervisor de Distribución</option>
                                        <option value="Supevisor Ventas">Supevisor Ventas</option>
                                        <option value="Cajero">Cajero</option>
                                        <option value="Secretaria">Secretaria</option>
                                        <option value="Movilizador">Movilizador</option>
                                        <option value="Gruero">Gruero</option>
                                        <option value="Despachador">Despachador</option>
                                        <option value="Recepcionista">Recepcionista</option>
                                        <option value="Visita Carozzi">Visita Carozzi</option>
                                        <option value="Vendedor">Vendedor</option>
                                    </select>
                                    <IconButton color="primary" onClick={() => limpiarCampo('ROLPI')} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">

                                <div className="input-group">

                                </div>
                            </div>



                        </div>
                    </div>
                    <br></br>

                    <div className="details ID">
                        <span className="title">Datos Vehiculos</span>
                        <div className="fields">


                            <div className="input-field">
                                <label>Vehiculo</label>
                                <div className="input-group">
                                    <input  type="text" className="form-control" onChange={handleChange} value={formValues.VEHICULOPI} placeholder='Ingrese Vehiculo' id="vehiculopi-input" name={'VEHICULOPI'} ></input>
                                    <IconButton color="primary" onClick={() => limpiarCampo('VEHICULOPI')} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Modelo</label>
                                <div className="input-group">
                                    <input  type="text" className="form-control" onChange={handleChange} value={formValues.MODELOPI} placeholder='Ingrese Modelo' id="modelopi-input" name={'MODELOPI'} ></input>
                                    <IconButton color="primary" onClick={() => limpiarCampo('MODELOPI')} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Patente</label>
                                <div className="input-group">
                                    <input type="text" onChange={handlePatenteChange} value={formValues.PATENTEPI} placeholder='Ingrese Patente' className='form-control' id="patentepi-input" name={'PATENTEPI'}></input>
                                    <IconButton color="primary" onClick={() => limpiarCampo('PATENTEPI')} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Color</label>
                                <div className="input-group">
                                    <input type="text" onChange={handleChange} value={formValues.COLORPI} placeholder='Ingrese Color' className='form-control' id="colorpi-input" name={'COLORPI'} />
                                    <IconButton color="primary" onClick={() => limpiarCampo('COLORPI')} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                        </div>

                    </div>
                    <br></br>


                </div>

                <div className="buttons">
                    <button className="sumbit-entrada">
                        <span className="btnText">Marcar Entrada</span>
                        <i className="uil uil-navigator"></i>
                    </button>
                </div>

            </div>
        </form>

    );
}

export default EditarPI;
