
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import Axios from "axios";
import { IconButton } from '@mui/material';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';

const host_server = import.meta.env.VITE_SERVER_HOST;

function AgregarPE() {
    const [RutPE, setRutPE] = useState("");
    const [NombrePE, setNombrePE] = useState("");
    const [ApellidoPE, setApellidoPE] = useState("");
    const [VehiculoPE, setVehiculoPE] = useState("");
    const [ModeloPE, setModeloPE] = useState("");
    const [ColorPE, setColorPE] = useState("");
    const [PatentePE, setPatentePE] = useState("");
    const [RolPE, setRolPE] = useState("");
    const [EmpresaPE, setEmpresaPE] = useState("");
    const [rutValido, setRutValido] = React.useState(true);

    const handleRutChange = (event) => {
        const value = event.target.value.replace(/[^0-9kK]/g, '');
        const formattedValue = formatRut(value);
        setRutPE(formattedValue);
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


    const ingresoformdPE = () => {
        if (!validarRut(RutPE)) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "RUT inválido. Por favor, ingrese un RUT válido.",
            });
            return;
        }
        Axios.post(`${host_server}/AgregarPersonalExterno`, {
            rutPE: RutPE,
            NombrePE: NombrePE,
            ApellidoPE: ApellidoPE,
            VehiculoPE: VehiculoPE,
            ModeloPE: ModeloPE,
            ColorPE: ColorPE,
            PatentePE: PatentePE,
            RolPE: RolPE,
            EmpresaPE: EmpresaPE
        }).then(() => {

            limpiarCamposPE();
            Swal.fire({
                title: 'Ingreso Exitoso!',
                icon: 'success',
                text: 'Personal Externo ingresado con Exito',
                timer: 1500
            })
        }).catch(function (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: JSON.parse(JSON.stringify(error)).message === "Network Error" ? "Intente mas tarde" : JSON.parse(JSON.stringify(error))
            });
        });
    }


    const limpiarCamposPE = () => {
        setRutPE("");
        setNombrePE("");
        setApellidoPE("");
        setVehiculoPE("");
        setModeloPE("");
        setColorPE("");
        setPatentePE("");
        setRolPE("");
        setEmpresaPE("");
    }

    const limpiarCampo = (setState) => {
        setState("");
    };


    const handlePatenteChange = (event) => {
        const value = event.target.value.toUpperCase();
        setPatentePE(value);
    };

    return (

        <form onSubmit={(e) => {
            e.preventDefault(); // Evita que se recargue la página
            ingresoformdPE();
        }}>
            <div className="container-form">
                <header>Registrar Personal Externo</header>
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
                                    <input required type="text" onChange={(event) => handleRutChange(event, { newValue: event.target.value })} value={RutPE} placeholder='Ingreso Rut' className={`form-control ${rutValido ? '' : 'is-invalid'}`} id="Rutpe-input" name={RutPE} />
                                    <IconButton color="primary" onClick={() => limpiarCampo(setRutPE)} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Nombre</label>
                                <div className="input-group">
                                    <input required type="text" onChange={(event) => { setNombrePE(event.target.value); }} value={NombrePE} placeholder='Ingreso Nombre' className='form-control' id="nombrepe-input" name={NombrePE} />
                                    <IconButton color="primary" onClick={() => limpiarCampo(setNombrePE)} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Apellido</label>
                                <div className="input-group">
                                    <input required type="text" onChange={(event) => { setApellidoPE(event.target.value); }} value={ApellidoPE} placeholder='Ingrese Apellido' className='form-control' id="apellidope-input" name={ApellidoPE} />
                                    <IconButton color="primary" onClick={() => limpiarCampo(setApellidoPE)} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>


                            <div className="input-field">
                                <label>Empresa</label>
                                <div className="input-group">
                                    <input required type="text" onChange={(event) => { setEmpresaPE(event.target.value); }} value={EmpresaPE} placeholder='Ingrese Empresa' className='form-control' id="empresape-input" name={EmpresaPE} />
                                    <IconButton color="primary" onClick={() => limpiarCampo(setEmpresaPE)} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Rol</label>
                                <div className="input-group">
                                    <select required onChange={(event) => { setRolPE(event.target.value); }} className='select-form-control' value={RolPE} id="rolpe-input" name={RolPE}>
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
                                    <IconButton color="primary" onClick={() => limpiarCampo(setRolPE)} aria-label="directions">
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
                                    <input  type="text" className="form-control" onChange={(event) => { setVehiculoPE(event.target.value); }} value={VehiculoPE} placeholder='Ingrese Vehiculo' id="vehiculope-input" name={VehiculoPE} ></input>
                                    <IconButton color="primary" onClick={() => limpiarCampo(setVehiculoPE)} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Modelo</label>
                                <div className="input-group">
                                    <input  type="text" onChange={(event) => { setModeloPE(event.target.value); }} value={ModeloPE} placeholder='Ingrese Modelo' className='form-control' id="modelope-input" name={ModeloPE} />
                                    <IconButton color="primary" onClick={() => limpiarCampo(setModeloPE)} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Patente</label>
                                <div className="input-group">
                                    <input  type="text" onChange={handlePatenteChange} value={PatentePE} placeholder='Ingrese Patente' className='form-control' id="patentepe-input" name={PatentePE} />
                                    <IconButton color="primary" onClick={() => limpiarCampo(setPatentePE)} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Color</label>
                                <div className="input-group">
                                    <input  type="text" onChange={(event) => { setColorPE(event.target.value); }} value={ColorPE} placeholder='Ingrese Color' className='form-control' id="colorpe-input" name={ColorPE} />
                                    <IconButton color="primary" onClick={() => limpiarCampo(setColorPE)} aria-label="directions">
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
    )
}
export default AgregarPE;