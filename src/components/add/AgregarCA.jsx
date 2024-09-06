
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import Axios from "axios";
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { IconButton } from '@mui/material';
const host_server = import.meta.env.VITE_SERVER_HOST;

function AgregarCA() {
    const [IDCA, setidCA] = useState(0);
    const [ChoferCA, setChoferCA] = useState("");
    const [ApellidoCA, setApellidoCA] = useState("");
    const [RutCA, setRutCA] = useState("");
    const [PatenteCA, setPatenteCA] = useState("");
    const [MarcaCA, setMarcaCA] = useState("");
    const [TipoCA, setTipoCA] = useState("");
    const [ModeloCA, setModeloCA] = useState("");
    const [ColorCA, setColorCA] = useState("");
    const [EmpresaCA, setEmpresaCA] = useState("");
    const [rutValido, setRutValido] = React.useState(true);


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

    const handleRutChange = (event, { newValue }) => {
        setRutCA(newValue);
        setRutValido(validarRut(newValue)); // Validar el RUT al cambiar
    }

    const ingresoformdCA = () => {
        if (!validarRut(RutCA)) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "RUT inválido. Por favor, ingrese un RUT válido.",
            });
            return;
        }
        Axios.post(`${host_server}/AgregarCamion`, {
            ChoferCA: ChoferCA,
            ApellidoCA: ApellidoCA,
            RutCA: RutCA,
            PatenteCA: PatenteCA,
            MarcaCA: MarcaCA,
            TipoCA: TipoCA,
            ModeloCA: ModeloCA,
            ColorCA: ColorCA,
            EmpresaCA: EmpresaCA,

        }).then(() => {

            limpiarCamposCA();
            Swal.fire({
                title: 'Ingreso Exitoso!',
                icon: 'success',
                text: 'Personal Camion ingresado con Exito',
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


    const limpiarCamposCA = () => {
        setRutCA("");
        setChoferCA("");
        setApellidoCA("");
        setPatenteCA("");
        setMarcaCA("");
        setTipoCA("");
        setModeloCA("");
        setColorCA("");
        setEmpresaCA("");

    }

    const limpiarCampo = (setState) => {
        setState("");
    };


    const handlePatenteChange = (event) => {
        const value = event.target.value.toUpperCase();
        setPatenteCA(value);
    };

    return (

        <form onSubmit={(e) => {
            e.preventDefault(); // Evita que se recargue la página
            ingresoformdCA();
        }}>
            <div className="container-form">
                <header>Registro Camión</header>
                <br></br>
                <div className="form first" style={{ paddingRight: "30px" }}>
                    <div className="details personal">
                        <span className="title">Datos Camión</span>
                        <div className="fields">

                            <div className="input-field">
                                <label>Patente</label>
                                <div className="input-group">
                                    <input required type="text" onChange={handlePatenteChange} value={PatenteCA} placeholder='INGRESE PATENTE' className='form-control' id="patenteca-input" name={PatenteCA} />
                                    <IconButton color="primary" onClick={() => limpiarCampo(setPatenteCA)} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Tipo</label>
                                <div className="input-group">
                                    <select required onChange={(event) => { setTipoCA(event.target.value); }} className='select-form-control' value={TipoCA} id="tipoca-input" name={TipoCA}>
                                        <option value="">Seleccionar una opción</option>
                                        <option value="SEMIREMOLQUE">SEMIREMOLQUE</option>
                                        <option value="CAMION">CAMION</option>
                                        <option value="TRACTOCAMION">TRACTOCAMION</option>
                                        <option value="CHASIS CABINADO">CHASIS CABINADO</option>
                                        <option value="REMOLQUE">REMOLQUE</option>
                                        <option value="OtrosCA">Otros</option>
                                    </select>
                                    <IconButton color="primary" onClick={() => limpiarCampo(setTipoCA)} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>



                            <div className="input-field">
                                <label>Modelo</label>
                                <div className="input-group">
                                    <input required type="text" onChange={(event) => { setModeloCA(event.target.value); }} value={ModeloCA} placeholder='INGRESE MODELO' className='form-control' id="modeloca-input" name={ModeloCA} />
                                    <IconButton color="primary" onClick={() => limpiarCampo(setModeloCA)} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Color</label>
                                <div className="input-group">
                                    <input required type="text" onChange={(event) => { setColorCA(event.target.value); }} value={ColorCA} placeholder='INGRESE COLOR' className='form-control' id="colorca-input" name={ColorCA} />
                                    <IconButton color="primary" onClick={() => limpiarCampo(setColorCA)} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Marca</label>
                                <div className="input-group">
                                    <input required type="text" onChange={(event) => { setMarcaCA(event.target.value); }} value={MarcaCA} placeholder='INGRESE MARCA' className='form-control' id="marcaca-input" name={MarcaCA} />
                                    <IconButton color="primary" onClick={() => limpiarCampo(setMarcaCA)} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>


                            <div className="input-field">
                                <label>Empresa</label>
                                <div className="input-group">
                                    <input required type="text" onChange={(event) => { setEmpresaCA(event.target.value); }} value={EmpresaCA} placeholder='INGRESE EMPRESA' className='form-control' id="empresape-input" name={EmpresaCA} />
                                    <IconButton color="primary" onClick={() => limpiarCampo(setEmpresaCA)} aria-label="directions">
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
                                        onChange={(event) => handleRutChange(event, { newValue: event.target.value })}
                                        value={RutCA}
                                        placeholder='INGRESE RUT'
                                        id="rutca-input"
                                        name={RutCA} >
                                    </input>

                                    <IconButton color="primary" onClick={() => limpiarCampo(setRutCA)} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Nombre Chofer</label>
                                <div className="input-group">
                                    <input required type="text" className="form-control" onChange={(event) => { setChoferCA(event.target.value); }} value={ChoferCA} placeholder='INGRESE NOMBRE' id="choferca-input" name={ChoferCA} ></input>
                                    <IconButton color="primary" onClick={() => limpiarCampo(setChoferCA)} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Apellido Chofer</label>
                                <div className="input-group">
                                    <input required type="text" onChange={(event) => { setApellidoCA(event.target.value); }} value={ApellidoCA} placeholder='INGRESE APELLIDO' className='form-control' id="apellidoca-input" name={ApellidoCA} />
                                    <IconButton color="primary" onClick={() => limpiarCampo(setApellidoCA)} aria-label="directions">
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
    )
}
export default AgregarCA;