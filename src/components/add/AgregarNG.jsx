
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import Axios from "axios";
import { IconButton } from '@mui/material';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
const host_server = import.meta.env.VITE_SERVER_HOST;


function AgregarNG() {
    const [RutNG, setRutNG] = useState("");
    const [EstadoNG, setEstadoNG] = useState("");
    const [rutValido, setRutValido] = React.useState(true);

    const handleRutChange = (event) => {
        const value = event.target.value.replace(/[^0-9kK]/g, '');
        const formattedValue = formatRut(value);
        setRutNG(formattedValue);
        if (formattedValue.length > 1) {
            setRutValido(validarRut(formattedValue));
        } else {
            setRutValido(true);
        }
    };
    const formatRut = (rut) => {
        if (rut.length <= 1) {
            return rut;
        }
        const body = rut.slice(0, -1);
        const dv = rut.slice(-1).toUpperCase();
        return `${body}-${dv}`;
    };
    const validarRut = (rut) => {
        if (!/^[0-9]+[-|‐]{1}[0-9kK]{1}$/.test(rut)) return false;
        let tmp = rut.split('-');
        let digv = tmp[1];
        rut = tmp[0];
        if (digv == 'K') digv = 'k';
        return (dv(rut) == digv);
    }

    const dv = (T) => {
        let M = 0, S = 1;
        for (; T; T = Math.floor(T / 10)) {
            S = (S + T % 10 * (9 - M++ % 6)) % 11;
        }
        return S ? S - 1 : 'k';
    }


    const ingresoformdNG = () => {
        if (!validarRut(RutNG)) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "RUT inválido. Por favor, ingrese un RUT válido.",
            });
            return;
        }
        Axios.post(`${host_server}/AgregarPersonaNG`, {
            RutNG: RutNG,
            EstadoNG: EstadoNG
        }).then((response) => {
            limpiarcamposNG();
            Swal.fire({
                title: 'Ingreso Exitoso!',
                icon: 'success',
                text: 'Personal Reportado ingresado con Exito',
                timer: 1500
            })
        }).catch((error) => {
            console.error('Error:', error); // Agrega este log para ver el error en detalle
            const errorMessage = error.response && error.response.data && error.response.data.message
                ? error.response.data.message
                : 'Error desconocido';
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: errorMessage,
            });
        });
    }

    const limpiarcamposNG = () => {
        setRutNG("");
        setEstadoNG("");

    }

    const limpiarCampo = (setState) => {
        setState("");
    };




    return (

        <form className='form-ng' onSubmit={(e) => {
            e.preventDefault(); // Evita que se recargue la página
            ingresoformdNG();
        }}>
            
            <div className="container-form">
                <header>Reportar Persona</header>

                <div className="form first" style={{ paddingRight: "30px" }}>
                    <div className="details personal">
                        <span className="title">Datos Personal</span>
                        <div className="fields">

                            <div className="input-field">
                                <label>Rut</label>
                                <div className="input-group">
                                    <input required type="text" onChange={(event) => handleRutChange(event, { newValue: event.target.value })} value={RutNG} placeholder='Ingreso Rut' className={`form-control ${rutValido ? '' : 'is-invalid'}`} id="rutng-input" name={RutNG} />
                                    <IconButton color="primary" onClick={() => limpiarCampo(setRutNG)} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Estado</label>
                                <div className="input-group">
                                    <select required onChange={(event) => { setEstadoNG(event.target.value); }} className='select-form-control' value={EstadoNG} id="rolpi-input" name={EstadoNG}>
                                        <option value="">Seleccionar una opción</option>
                                        <option value="PERMS1">Permiso con precaución</option>
                                        <option value="PERMS2">Solicitar permiso</option>
                                        <option value="NOACCESO">Prohibido el acceso</option>
                                    </select>
                                    <IconButton color="primary" onClick={() => limpiarCampo(setRolPI)} aria-label="directions">
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
    )
}
export default AgregarNG;