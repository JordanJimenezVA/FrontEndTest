import Swal from 'sweetalert2';
import Axios from "axios";
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { IconButton } from '@mui/material';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';

const host_server = import.meta.env.VITE_SERVER_HOST;




function EditarPE() {
    const { IDPE } = useParams();
    const [rutValido, setRutValido] = React.useState(true);

    const [formValues, setFormValues] = useState({
        RUTPE: '',
        NOMBREPE: '',
        APELLIDOPE: '',
        ROLPE: '',
        EMPRESAPE: '',
        ESTADOPE: '',
        VEHICULOPE: '',
        MODELOPE: '',
        PATENTEPE: '',
        COLORPE: '',
    });

    useEffect(() => {
        getPersonalExterno(IDPE);
    }, [IDPE]);

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
            RUTPE   : formattedValue,
        }));
        setRutValido(validarRut(formattedValue));
    };

    const handlePatenteChange = (event) => {
        const value = event.target.value.toUpperCase();
        setFormValues((prevValues) => ({
            ...prevValues,
            PATENTEPE: value,
        }));
    };

    const getPersonalExterno = (IDPE) => {
        Axios.get(`${host_server}/EditarPersonalExterno/${IDPE}`)
            .then((res) => {
                const { RUTPE, NOMBREPE, APELLIDOPE, VEHICULOPE, MODELOPE, COLORPE, PATENTEPE, ROLPE, EMPRESAPE, ESTADOPE } = res.data[0];
                setFormValues({
                    RUTPE: RUTPE || '',
                    NOMBREPE: NOMBREPE || '',
                    APELLIDOPE: APELLIDOPE || '',
                    VEHICULOPE: VEHICULOPE || '',
                    MODELOPE: MODELOPE || '',
                    COLORPE: COLORPE || '',
                    PATENTEPE: PATENTEPE || '',
                    ROLPE: ROLPE || '',
                    EMPRESAPE: EMPRESAPE || '',
                    ESTADOPE: ESTADOPE || '',
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
            RUTPE: '',
            NOMBREPE: '',
            APELLIDOPE: '',
            ROLPE: '',
            EMPRESAPE: '',
            ESTADOPE: '',
            VEHICULOPE: '',
            MODELOPE: '',
            PATENTEPE: '',
            COLORPE: '',
        });
    };

    const limpiarCampo = (campo) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            [campo]: '',
        }));
    };

    const editarPE = () => {
        Axios.put(`${host_server}/EditarPersonalExterno/${IDPE}`, {
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
            editarPE();
        }}>
            
            <div className="container-form">
                <header>Editar Personal Externo</header>
                <div className='error-div'>

                </div>
                <br></br>
                <div className="form first" style={{ paddingRight: "30px" }}>
                    <div className="details personal">
                        <span className="title">Datos Personal Externo</span>
                        <div className="fields">
                            <div className="input-field">

                                <label htmlFor='rutpe-input'>Rut</label>
                                <div className='input-group'>
                                    <input required type="text" onChange={(event) => handleRutChange(event, { newValue: event.target.value })} value={formValues.RUTPE} placeholder='Ingreso Rut' className={`form-control ${rutValido ? '' : 'is-invalid'}`} id="Rutpe-input" name={'RUTPE'} />
                                    <IconButton color="primary" onClick={() => limpiarCampo('RUTPE')} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Nombre</label>
                                <div className="input-group">
                                    <input required type="text" onChange={handleChange} value={formValues.NOMBREPE} placeholder='Ingreso Nombre' className='form-control' id="nombrepe-input" name={'NOMBREPE'} />
                                    <IconButton color="primary" onClick={() => limpiarCampo('NOMBREPE')} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Apellido</label>
                                <div className="input-group">
                                    <input required type="text" onChange={handleChange} value={formValues.APELLIDOPE} placeholder='Ingrese Apellido' className='form-control' id="apellidope-input" name={'APELLIDOPE'} />
                                    <IconButton color="primary" onClick={() => limpiarCampo(setApellidoPE)} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>


                            <div className="input-field">
                                <label>Empresa</label>
                                <div className="input-group">
                                    <input required type="text" onChange={handleChange} value={formValues.EMPRESAPE} placeholder='Ingrese Empresa' className='form-control' id="empresape-input" name={'EMPRESAPE'} />
                                    <IconButton color="primary" onClick={() => limpiarCampo('EMPRESAPE')} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Rol</label>
                                <div className="input-group">
                                    <select required onChange={handleChange} className='select-form-control' value={formValues.ROLPE} id="rolpe-input" name={'ROLPE'}>
                                        <option value="">Seleccionar una opción</option>
                                        <option value="Especialista Trade">Especialista Trade</option>
                                        <option value="Chofer Camión">Chofer Camión</option>
                                        <option value="Peoneta">Peoneta</option>
                                        <option value="Gestor Trade">Gestor Trade</option>
                                        <option value="Mantencion Cctv">Mantencion Cctv</option>
                                        <option value="Mantencion Gruas">Mantención Gruas</option>
                                        <option value="Mantencion Jardines">Mantención Jardines</option>
                                        <option value="Mantencion General">Mantencion General</option>
                                        <option value="Mantencion Bresler">Mantencion Bresler</option>
                                        <option value="Tecnico Fumigación">Tecnico Fumigación</option>
                                        <option value="OtrosEx">Otros</option>
                                    </select>
                                    <IconButton color="primary" onClick={() => limpiarCampo('ROLPE')} aria-label="directions">
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
                                    <input  type="text" className="form-control" onChange={handleChange} value={formValues.VEHICULOPE} placeholder='Ingrese Vehiculo' id="vehiculope-input" name={'VEHICULOPE'} ></input>
                                    <IconButton color="primary" onClick={() => limpiarCampo('VEHICULOPE')} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Modelo</label>
                                <div className="input-group">
                                    <input  type="text" className="form-control" onChange={handleChange} value={formValues.MODELOPE} placeholder='Ingrese Modelo' id="modelope-input" name={'MODELOPE'} ></input>
                                    <IconButton color="primary" onClick={() => limpiarCampo('MODELOPE')} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Patente</label>
                                <div className="input-group">
                                    <input  type="text" onChange={handlePatenteChange} value={formValues.PATENTEPE} placeholder='Ingrese Patente' className='form-control' id="patentepe-input" name={'PATENTEPE'} />
                                    <IconButton color="primary" onClick={() => limpiarCampo('PATENTEPE')} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Color</label>
                                <div className="input-group">
                                    <input  type="text" onChange={handleChange} value={formValues.COLORPE} placeholder='Ingrese Color' className='form-control' id="colorpe-input" name={'COLORPE'} />
                                    <IconButton color="primary" onClick={() => limpiarCampo('COLORPE')} aria-label="directions">
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
                        <span className="btnText">Confirmar Registro</span>
                        <i className="uil uil-navigator"></i>
                    </button>
                </div>

            </div>
        </form>

    );
}

export default EditarPE;
