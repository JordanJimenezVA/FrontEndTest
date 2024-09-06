
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import Axios from "axios";
import { IconButton } from '@mui/material';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
const host_server = import.meta.env.VITE_SERVER_HOST;


function AgregarU() {
    const [RutU, setRutU] = useState("");
    const [NombreU, setNombreU] = useState("");
    const [TipoU, setTipoU] = useState("");
    const [PasswordU, setPasswordU] = useState("");
    const [IDINST, setIDINST] = useState("");
    const [rutValido, setRutValido] = React.useState(true);
    const [showPassword, setShowPassword] = useState(false);

    const handleRutChange = (event) => {
        const value = event.target.value.replace(/[^0-9kK]/g, '');
        const formattedValue = formatRut(value);
        setRutU(formattedValue);
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


    const ingresoformdU = () => {
        if (!validarRut(RutU)) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "RUT inválido. Por favor, ingrese un RUT válido.",
            });
            return;
        }
        Axios.post(`${host_server}/AgregarU`, {
            RutU: RutU,
            NombreU: NombreU,
            TipoU: TipoU,
            PasswordU: PasswordU,
            IDINST: IDINST,
        }).then((response) => {
            limpiarcamposU();
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

    const limpiarcamposU = () => {
        setRutU("");
        setNombreU("");
        setTipoU("");
        setPasswordU("");
        setIDINST("");

    }

    const limpiarCampo = (setState) => {
        setState("");
    };




    return (

        <form className='form-ng' onSubmit={(e) => {
            e.preventDefault(); // Evita que se recargue la página
            ingresoformdU();
        }}>
            
            <div className="container-form">
                <header>Registrar Usuario</header>

                <div className="form first" style={{ paddingRight: "30px" }}>
                    <div className="details personal">
                        <span className="title">Datos Usuario</span>
                        <div className="fields">

                            <div className="input-field">
                                <label>Rut</label>
                                <div className="input-group">
                                    <input required type="text" onChange={(event) => handleRutChange(event, { newValue: event.target.value })} value={RutU} placeholder='Ingreso Rut' className={`form-control ${rutValido ? '' : 'is-invalid'}`} id="rutu-input" name={RutU} />
                                    <IconButton color="primary" onClick={() => limpiarCampo(setRutU)} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Nombre Usuario</label>
                                <div className="input-group">
                                    <input required type="text" className="form-control" onChange={(event) => { setNombreU(event.target.value); }} value={NombreU} placeholder='Ingrese Nombre' id="nombreu-input" name={NombreU} ></input>
                                    <IconButton color="primary" onClick={() => limpiarCampo(setNombreU)} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Tipo Usuario</label>
                                <div className="input-group">
                                    <select required onChange={(event) => { setTipoU(event.target.value); }} className='select-form-control' value={TipoU} id="tipou-input" name={TipoU}>
                                        <option value="">Seleccionar una opción</option>
                                        <option value="Guardia">Guardia</option>
                                        <option value="Supervisor">Supervisor</option>
                                        <option value="Administrador">Administrador</option>
                                    </select>
                                    <IconButton color="primary" onClick={() => limpiarCampo(setTipoU)} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Password</label>
                                <div className="input-group">
                                    <input required type="text" className="form-control" onChange={(event) => { setPasswordU(event.target.value); }} value={PasswordU} placeholder='Ingrese Password' id="passwordu-input" name={PasswordU} ></input>
                                    <IconButton color="primary" onClick={() => limpiarCampo(setPasswordU)} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>


                            <div className="input-field">
                                <label>Instalacion</label>
                                <div className="input-group">
                                    <select required  onChange={(event) => { setIDINST(event.target.value); }} className='select-form-control' value={IDINST} id="idinst-input" name={IDINST}>
                                        <option value="">Seleccionar una opción</option>
                                        <option value="1">Instalacion 1</option>
                                        <option value="2">Instalacion 2</option>
                                    </select>
                                    <IconButton color="primary" onClick={() => limpiarCampo(setIDINST)} aria-label="directions">
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
                            <span className="btnText">Registrar Usuario</span>
                            <i className="uil uil-navigator"></i>
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}
export default AgregarU;