import './revisarcamion.scss'
import Swal from 'sweetalert2';
import Axios from "axios";
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useChileanTime from '../../hooks/useChileanTime';

import { useAuth } from '../../hooks/Auth';
import { IconButton } from '@mui/material';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import Button from '@mui/material/Button';
const host_server = import.meta.env.VITE_SERVER_HOST;


function RevisarCamion() {
    const { IDR } = useParams();
    const [rutValido, setRutValido] = React.useState(true);
    const [formValues, setFormValues] = useState({
        PERSONAL: '',
        APELLIDO: '',
        RUT: '',
        PATENTE: '',
        ROL: '',
        OBSERVACIONES: '',
        GUIADESPACHO: '',
        SELLO: '',
        ANDEN: '',
        KILOS: '',
        PALLETS: '',
        SUPERVISOR: '',
        JEFET: '',
        FOTOS: [],
        FECHAINICIO: '',
        FECHAFIN: '',
        MODELO: '',
        COLOR: '',
    });
    const { nombreUsuario } = useAuth();
    const [fechaInicio, setFechaInicio] = useState(null);
    const [fechaFin, setFechaFin] = useState(null);
    const [estado, setEstado] = useState("inicio");
    const [formDisabled, setFormDisabled] = useState(true);
    const [confirmDisabled, setConfirmDisabled] = useState(true);
    const [GuardarProgresoDisabled, setGuardarProgresoDisabled] = useState(true);
    const [isFirstOpen, setIsFirstOpen] = useState(true);
    const chileanTime = useChileanTime();


    useEffect(() => {
        if (isFirstOpen) {
            getRegistros(IDR);
            setIsFirstOpen(false);
            getProgresoRevision(IDR);
        }
    }, [IDR, isFirstOpen]);

    // const handleFechaInicio = async () => {
    //     const horaInicio = await useCamionTime();
    //     setFechaInicio(horaInicio);

    //     setFormValues(prevValues => ({
    //         ...prevValues,
    //         FECHAINICIO: horaInicio,
    //     }));
    //     setEstado('fin');
    //     setFormDisabled(false);
    //     setGuardarProgresoDisabled(false);
    //     setConfirmDisabled(true);
    // };

    // const handleFechaFin = async () => {
    //     const horaFin = await useCamionTime();
    //     setFechaFin(horaFin);
    //     setFormValues(prevValues => ({
    //         ...prevValues,
    //         FECHAFIN: horaFin,
    //     }));

    //     setConfirmDisabled(false);
    // };

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
        setRutPI(newValue);
        setRutValido(validarRut(newValue));
    }

    const getProgresoRevision = (IDR) => {
        Axios.get(`${host_server}/ProgresoRevision/${IDR}`)
            .then((res) => {
                if (res.data.length > 0) {
                    const progreso = res.data[0];
                    setFormValues({
                        PERSONAL: progreso.PERSONAL,
                        APELLIDO: progreso.APELLIDO,
                        RUT: progreso.RUT,
                        PATENTE: progreso.PATENTE,
                        ROL: progreso.ROL,
                        OBSERVACIONES: progreso.OBSERVACIONES,
                        GUIADESPACHO: progreso.GUIADESPACHO,
                        SELLO: progreso.SELLO,
                        ANDEN: progreso.ANDEN,
                        KILOS: progreso.KILOS,
                        PALLETS: progreso.PALLETS,
                        SUPERVISOR: progreso.SUPERVISOR,
                        JEFET: progreso.JEFET,
                        FOTOS: Array.isArray(progreso.FOTOS) ? progreso.FOTOS : [],
                        FECHAINICIO: progreso.FECHAINICIO,
                        MODELO: progreso.MODELO,
                        COLOR: progreso.COLOR
                    });
                    setFechaInicio(progreso.FECHAINICIO);
                    setEstado("fin");
                    setFormDisabled(false);
                    setGuardarProgresoDisabled(false);
                } else {
                    setFormDisabled(true);
                    setConfirmDisabled(true);
                    setGuardarProgresoDisabled(true);
                }
            })
            .catch((error) => {
                console.error("Error al obtener progreso de revisión:", error);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Error al obtener progreso de revisión, intente nuevamente más tarde",
                });
            });
    };


    const getRegistros = (IDR) => {
        Axios.get(`${host_server}/FormularioSalida/${IDR}`)
            .then((res) => {
                const { PERSONAL, APELLIDO, RUT, PATENTE, ROL, OBSERVACIONES, GUIADESPACHO, SELLO, MODELO, COLOR } = res.data[0];
                setFormValues({
                    PERSONAL,
                    APELLIDO,
                    RUT,
                    PATENTE,
                    ROL,
                    OBSERVACIONES,
                    GUIADESPACHO,
                    SELLO,
                    FOTOS: [],
                    MODELO,
                    COLOR
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


    const handleFileChange = (event) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const allowedTypes = ["image/jpeg", "image/png"];
        const newPhotos = Array.from(files).filter(file => allowedTypes.includes(file.type));

        setFormValues(prevState => ({
            ...prevState,
            FOTOS: [...prevState.FOTOS, ...newPhotos]
        }));
    };


    const limpiarCampos = () => {
        setFormValues({
            PERSONAL: '',
            APELLIDO: '',
            RUT: '',
            PATENTE: '',
            ROL: '',
            OBSERVACIONES: '',
            GUIADESPACHO: '',
            SELLO: '',
            ANDEN: '',
            KILOS: '',
            PALLETS: '',
            SUPERVISOR: '',
            JEFET: '',
            FOTOS: [],
            MODELO: '',
            COLOR: ''
        });
        setFechaInicio(null);
        setFechaFin(null);
        setEstado("inicio");
        setFormDisabled(true);
        setConfirmDisabled(true);
    };

    const limpiarCampo = (campo) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            [campo]: '',
        }));
    };


    const revisionCA = () => {
        const formData = new FormData();
        Object.keys(formValues).forEach(key => {
            if (key === 'FOTOS') {
                if (Array.isArray(formValues[key])) {
                    formValues[key].forEach(photo => {
                        formData.append('FOTOS', photo);
                    });
                }
            } else {
                formData.append(key, formValues[key]);
            }
        });
        formData.append('fechaInicio', fechaInicio);
        formData.append('fechaFin', fechaFin);
        formData.append('NombreUsuario', nombreUsuario)

        Axios.post(`${host_server}/RevisionCamion/${IDR}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(() => {
            Swal.fire({
                title: 'Revision Exitosa!',
                icon: 'success',
                text: 'Revision Realizada Correctamente',
                timer: 1500
            });
        }).catch((error) => {
            console.error("Error al confirmar la revisión:", error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Error al confirmar la revisión, intente nuevamente más tarde",
            });
        });
    }

    const guardarProgreso = () => {
        const formData = new FormData();
        Object.keys(formValues).forEach(key => {
            if (key === 'FOTOS') {
                if (Array.isArray(formValues[key])) {
                    formValues[key].forEach(photo => {
                        formData.append('FOTOS', photo);
                    });
                }
            } else {
                formData.append(key, formValues[key]);
            }
        });
        formData.append('fechaInicio', fechaInicio);

        Axios.post(`${host_server}/GuardarProgreso/${IDR}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(() => {
            Swal.fire({
                title: 'Progreso Guardado!',
                icon: 'success',
                text: 'El progreso ha sido guardado correctamente',
                timer: 1500
            });
        }).catch((error) => {
            console.error("Error al guardar el progreso:", error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Error al guardar el progreso, intente nuevamente más tarde",
            });
        });
    };

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            revisionCA();
        }}>

            <div className="container-form">
                <header>Revisión Camión</header>
                <br></br>
                <div className="form first" style={{ paddingRight: "30px" }}>
                    <div className="details personal">
                        <span className="title">Datos Camión</span>
                        <div className="fields">

                            <div className="input-field">
                                <label>Patente</label>
                                <div className="input-group">
                                    <input required type="text" onChange={handleChange} value={formValues.PATENTE} disabled={formDisabled} placeholder='INGRESE PATENTE' className='form-control' id="patenteca-input" name={'PATENTE'} />
                                    <IconButton color="primary" onClick={() => limpiarCampo('PATENTE')} disabled={formDisabled} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Tipo</label>
                                <div className="input-group">
                                    <select required onChange={handleChange} className='select-form-control' disabled={formDisabled} value={formValues.ROL} id="tipoca-input" name={'ROL'}>
                                        <option value="">Seleccionar una opción</option>
                                        <option value="SEMIREMOLQUE">SEMIREMOLQUE</option>
                                        <option value="CAMION">CAMION</option>
                                        <option value="TRACTOCAMION">TRACTOCAMION</option>
                                        <option value="CHASIS CABINADO">CHASIS CABINADO</option>
                                        <option value="REMOLQUE">REMOLQUE</option>
                                        <option value="OtrosCA">Otros</option>
                                    </select>
                                    <IconButton color="primary" onClick={() => limpiarCampo('ROL')} disabled={formDisabled} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>



                            <div className="input-field">
                                <label>Modelo</label>
                                <div className="input-group">
                                    <input required type="text" onChange={handleChange} disabled={formDisabled} value={formValues.MODELO} placeholder='INGRESE MODELO' className='form-control' id="modeloca-input" name={'MODELO'} />
                                    <IconButton color="primary" onClick={() => limpiarCampo('MODELO')} disabled={formDisabled} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Color</label>
                                <div className="input-group">
                                    <input required type="text" onChange={handleChange} disabled={formDisabled} value={formValues.COLOR} placeholder='INGRESE COLOR' className='form-control' id="colorca-input" name={'COLOR'} />
                                    <IconButton color="primary" onClick={() => limpiarCampo('COLOR')} disabled={formDisabled} aria-label="directions">
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
                                        value={formValues.RUT}
                                        disabled={formDisabled}
                                        placeholder='INGRESE RUT'
                                        id="rut-input"
                                        name={'RUT'} >
                                    </input>

                                    <IconButton color="primary" onClick={() => limpiarCampo('RUT')} disabled={formDisabled} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Nombre Chofer</label>
                                <div className="input-group">
                                    <input required type="text" className="form-control" disabled={formDisabled} onChange={handleChange} value={formValues.PERSONAL} placeholder='INGRESE NOMBRE' id="personal-input" name={'PERSONAL'} ></input>
                                    <IconButton color="primary" onClick={() => limpiarCampo('PERSONAL')} disabled={formDisabled} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Apellido Chofer</label>
                                <div className="input-group">
                                    <input required type="text" onChange={handleChange} disabled={formDisabled} value={formValues.APELLIDO} placeholder='INGRESE APELLIDO' className='form-control' id="apellidoca-input" name={'APELLIDO'} />
                                    <IconButton color="primary" onClick={() => limpiarCampo('APELLIDO')} disabled={formDisabled} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                        </div>

                    </div>
                    <br></br>
                    <div className="details ID">
                        <span className="title">Datos Revisión</span>
                        <div className="fields">

                            <div className="input-field">
                                <label>Planilla Transporte</label>
                                <div className="input-group">
                                    <input required type="text" onChange={handleChange} disabled={formDisabled} value={formValues.GUIADESPACHO} placeholder='PLANILLA TRANSPORTE' className='form-control' id="guiaca-input" name={'GUIADESPACHO'} />
                                    <IconButton color="primary" onClick={() => limpiarCampo('GUIADESPACHO')} disabled={formDisabled} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Sello</label>
                                <div className="input-group">
                                    <input type="text" onChange={handleChange} disabled={formDisabled} value={formValues.SELLO} placeholder='INGRESE SELLO' className='form-control' id="sello-input" name={'SELLO'} />
                                    <IconButton color="primary" onClick={() => limpiarCampo('SELLO')} disabled={formDisabled} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>N° Anden</label>
                                <div className="input-group">
                                    <input type="text" onChange={handleChange} disabled={formDisabled} value={formValues.ANDEN} placeholder='INGRESE ANDEN' className='form-control' id="anden-input" name={'ANDEN'} />
                                    <IconButton color="primary" onClick={() => limpiarCampo('ANDEN')} disabled={formDisabled} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Total Kilos</label>
                                <div className="input-group">
                                    <input type="text" onChange={handleChange} disabled={formDisabled} value={formValues.KILOS} placeholder='INGRESE KILOS' className='form-control' id="kilos-input" name={'KILOS'} />
                                    <IconButton color="primary" onClick={() => limpiarCampo('KILOS')} disabled={formDisabled} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Cantidad Pallets</label>
                                <div className="input-group">
                                    <input type="text" onChange={handleChange} disabled={formDisabled} value={formValues.PALLETS} placeholder='INGRESE PALLETS' className='form-control' id="pallets-input" name={'PALLETS'} />
                                    <IconButton color="primary" onClick={() => limpiarCampo('PALLETS')} disabled={formDisabled} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Supervisor</label>
                                <div className="input-group">
                                    <input type="text" onChange={handleChange} disabled={formDisabled} value={formValues.SUPERVISOR} placeholder='INGRESE SUPERVISOR' className='form-control' id="supervisor-input" name={'SUPERVISOR'} />
                                    <IconButton color="primary" onClick={() => limpiarCampo('SUPERVISOR')} disabled={formDisabled} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Jefe Turno CD</label>
                                <div className="input-group">
                                    <input type="text" onChange={handleChange} disabled={formDisabled} value={formValues.JEFET} placeholder='INGRESE JEFET' className='form-control' id="jefet-input" name={'JEFET'} />
                                    <IconButton color="primary" onClick={() => limpiarCampo('JEFET')} disabled={formDisabled} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Fotos</label>
                                <div className="input-group">
                                    <input type="file" onChange={handleFileChange} disabled={formDisabled} placeholder='INGRESE FOTOS' style={{ alignContent: "center" }} multiple accept=".jpg, .jpeg, .png" className='form-control' id="fotos-input" name={'FOTOS'} />
                                    <IconButton color="primary" onClick={() => limpiarCampo('FOTOS')} disabled={formDisabled} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">

                                <div className="input-group">

                                </div>
                            </div>



                            <div className="input-field-obs">
                                <label>Observaciones</label>
                                <textarea type="text" required
                                    onChange={handleChange}
                                    value={formValues.OBSERVACIONES}
                                    placeholder='INGRESE OBSERVACIONES'
                                    className='form-control'
                                    id="ob-input"
                                    disabled={formDisabled}
                                    name={'OBSERVACIONES'}
                                />
                            </div>

                        </div>


                    </div>

                </div>
                <br></br>
                <div className="buttons-container">

                    <div className="buttons-left">
                        <Button variant="contained" onClick={handleFechaInicio} >Dar Inicio</Button>
                        <Button variant="contained" disabled={GuardarProgresoDisabled} onClick={guardarProgreso} color="success">Guardar Progreso</Button>

                    </div>
                    <div className="buttons-right">
                        <Button variant="contained" onClick={handleFechaFin} >Dar Fin</Button>
                        <Button variant="contained" disabled={confirmDisabled} color="success">Confirmar Revisión</Button>
                    </div>
                </div>

            </div>
        </form>

    );
}

export default RevisarCamion;
