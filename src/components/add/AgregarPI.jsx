
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import Axios from "axios";
import { IconButton } from '@mui/material';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
const host_server = import.meta.env.VITE_SERVER_HOST;


function AgregarPI() {
    const [RutPI, setRutPI] = useState("");
    const [NombrePI, setNombrePI] = useState("");
    const [ApellidoPI, setApellidoPI] = useState("");
    const [VehiculoPI, setVehiculoPI] = useState("");
    const [ModeloPI, setModeloPI] = useState("");
    const [ColorPI, setColorPI] = useState("");
    const [PatentePI, setPatentePI] = useState("");
    const [RolPI, setRolPI] = useState("");
    const [rutValido, setRutValido] = React.useState(true);

    const handleRutChange = (event) => {
        const value = event.target.value.replace(/[^0-9kK]/g, '');
        const formattedValue = formatRut(value);
        setRutPI(formattedValue);
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


    const ingresoformdPI = () => {
        if (!validarRut(RutPI)) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "RUT inválido. Por favor, ingrese un RUT válido.",
            });
            return;
        }
        Axios.post(`${host_server}/AgregarPersonalInterno`, {
            rutPI: RutPI,
            NombrePI: NombrePI,
            ApellidoPI: ApellidoPI,
            VehiculoPI: VehiculoPI,
            ModeloPI: ModeloPI,
            ColorPI: ColorPI,
            PatentePI: PatentePI,
            RolPI: RolPI
        }).then((response) => {
            limpiarcamposPI();
            Swal.fire({
                title: 'Ingreso Exitoso!',
                icon: 'success',
                text: 'Personal Interno ingresado con Exito',
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

    const limpiarcamposPI = () => {
        setRutPI("");
        setNombrePI("");
        setApellidoPI("");
        setVehiculoPI("");
        setModeloPI("");
        setColorPI("");
        setRolPI("");
        setPatentePI("");

    }

    const limpiarCampo = (setState) => {
        setState("");
    };


    const handlePatenteChange = (event) => {
        const value = event.target.value.toUpperCase();
        setPatentePI(value);
    };


    return (

        <form onSubmit={(e) => {
            e.preventDefault(); // Evita que se recargue la página
            ingresoformdPI();
        }}>
            
            <div className="container-form">
                <header>Registro Personal Interno</header>
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
                                    
                                    <input required type="text" onChange={(event) => handleRutChange(event, { newValue: event.target.value })} value={RutPI} placeholder='Ingreso Rut' className={`form-control ${rutValido ? '' : 'is-invalid'}`} id="rutpi-input" name={RutPI} />
                                    <IconButton color="primary" onClick={() => limpiarCampo(setRutPI)} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Nombre</label>
                                <div className="input-group">
                                    <input required type="text" onChange={(event) => { setNombrePI(event.target.value); }} value={NombrePI} placeholder='Ingreso Nombre' className='form-control' id="nombrepi-input" name={NombrePI} />
                                    <IconButton color="primary" onClick={() => limpiarCampo(setNombrePI)} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Apellido</label>
                                <div className="input-group">
                                    <input required type="text" onChange={(event) => { setApellidoPI(event.target.value); }} value={ApellidoPI} placeholder='Ingrese Apellido' className='form-control' id="apellidopi-input" name={ApellidoPI} />
                                    <IconButton color="primary" onClick={() => limpiarCampo(setApellidoPI)} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>


                            <div className="input-field">
                                <label>Rol</label>
                                <div className="input-group">
                                    <select required onChange={(event) => { setRolPI(event.target.value); }} className='select-form-control' value={RolPI} id="rolpi-input" name={RolPI}>
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
                    <br></br>

                    <div className="details ID">
                        <span className="title">Datos Vehiculos</span>
                        <div className="fields">


                            <div className="input-field">
                                <label>Vehiculo</label>
                                <div className="input-group">
                                    <input  type="text" className="form-control" onChange={(event) => { setVehiculoPI(event.target.value); }} value={VehiculoPI} placeholder='Ingrese Vehiculo' id="vehiculopi-input" name={VehiculoPI} ></input>
                                    <IconButton color="primary" onClick={() => limpiarCampo(setVehiculoPI)} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Modelo</label>
                                <div className="input-group">
                                    <input  type="text" className="form-control" onChange={(event) => { setModeloPI(event.target.value); }} value={ModeloPI} placeholder='Ingrese Modelo' id="modelopi-input" name={ModeloPI} ></input>
                                    <IconButton color="primary" onClick={() => limpiarCampo(setModeloPI)} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Patente</label>
                                <div className="input-group">
                                    <input type="text" onChange={handlePatenteChange} value={PatentePI} placeholder='Ingrese Patente' className='form-control' id="patentepi-input" name={PatentePI}></input>
                                    <IconButton color="primary" onClick={() => limpiarCampo(setPatentePI)} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Color</label>
                                <div className="input-group">
                                    <input  type="text" onChange={(event) => { setColorPI(event.target.value); }} value={ColorPI} placeholder='Ingrese Color' className='form-control' id="colorpi-input" name={ColorPI} />
                                    <IconButton color="primary" onClick={() => limpiarCampo(setColorPI)} aria-label="directions">
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
    )
}
export default AgregarPI;