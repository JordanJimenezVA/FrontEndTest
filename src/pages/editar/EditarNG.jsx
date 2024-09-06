import Swal from 'sweetalert2';
import Axios from "axios";
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { IconButton } from '@mui/material';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
const host_server = import.meta.env.VITE_SERVER_HOST;




function EditarNG() {
    const { IDNG } = useParams();
    const [rutValido, setRutValido] = React.useState(true);

    const [formValues, setFormValues] = useState({
        RUTNG: '',
        ESTADONG: '',
    });

    useEffect(() => {
        getPersonaReportada(IDNG);
    }, [IDNG]);

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
            RUTNG: formattedValue,
        }));
        setRutValido(validarRut(formattedValue));
    };

    const getPersonaReportada = (IDNG) => {
        Axios.get(`${host_server}/EditarPersonasReportadas/${IDNG}`)
            .then((res) => {
                const { RUTNG, ESTADONG } = res.data[0];
                setFormValues({
                    RUTNG: RUTNG || '',
                    ESTADONG: ESTADONG || '',
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
            RUTNG: '',
            ESTADONG: ''
        });
    };

    const limpiarCampo = (campo) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            [campo]: '',
        }));
    };

    const editarNG = () => {
        Axios.put(`${host_server}/EditarPersonasReportadas/${IDNG}`, {
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
        <form className='form-ng' onSubmit={(e) => {
            e.preventDefault(); // Evita que se recargue la página
            editarNG();
        }}>
           
            <div className="container-form">
                <header>Editar Persona</header>

                <div className="form first" style={{ paddingRight: "30px" }}>
                    <div className="details personal">
                        <span className="title">Datos Personal</span>
                        <div className="fields">

                            <div className="input-field">
                                <label>Rut</label>
                                <div className="input-group">
                                    <input required type="text" onChange={(event) => handleRutChange(event, { newValue: event.target.value })} value={formValues.RUTNG} placeholder='Ingreso Rut' className={`form-control ${rutValido ? '' : 'is-invalid'}`} id="rutng-input" name={'RUTNG'} />
                                    <IconButton color="primary" onClick={() => limpiarCampo('RUTNG')} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Estado</label>
                                <div className="input-group">
                                    <select required onChange={handleChange} className='select-form-control' value={formValues.ESTADONG} id="rolpi-input" name={'ESTADONG'}>
                                        <option value="">Seleccionar una opción</option>
                                        <option value="PERMS1">Permiso con precaución</option>
                                        <option value="PERMS2">Solicitar permiso</option>
                                        <option value="NOACCESO">Prohibido el acceso</option>
                                    </select>
                                    <IconButton color="primary" onClick={() => limpiarCampo('ESTADONG')} aria-label="directions">
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

                    <div className="buttons">
                        <button className="sumbit-entrada">
                            <span className="btnText">Reportar Persona</span>
                            <i className="uil uil-navigator"></i>
                        </button>
                    </div>
                </div>
            </div>
        </form>

    );
}

export default EditarNG;
