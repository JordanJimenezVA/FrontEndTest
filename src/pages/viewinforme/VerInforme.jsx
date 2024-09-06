import './verinforme.scss'
import Swal from 'sweetalert2';
import Axios from "axios";
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import Button from '@mui/material/Button';

import { IconButton } from '@mui/material';
const host_server = import.meta.env.VITE_SERVER_HOST;

function VerInforme() {
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
        ENRE: '',
        JEFET: '',
        FOTOS: [],
        FECHAINICIO: '',
        FECHAFIN: ''
    });

    useEffect(() => {
        getRegistros(IDR);
    }, [IDR]);

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        const pad = (num) => (num < 10 ? `0${num}` : num);

        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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

    const handleRutChange = (event, { newValue }) => {
        setRutPI(newValue);
        setRutValido(validarRut(newValue)); // Validar el RUT al cambiar
    }

    const getRegistros = (IDR) => {
        Axios.get(`${host_server}/VerInforme/${IDR}`)
            .then((res) => {
                const { PERSONAL, APELLIDO, RUT, PATENTE, ROL, OBSERVACIONES, GUIADESPACHO, SELLO, ANDEN, KILOS, PALLETS, SUPERVISOR, ENRE, JEFET, FOTOS, FECHAINICIO, FECHAFIN } = res.data[0];

                const fotosArray = FOTOS.split(', ').map(filename => `${host_server}/imagenes/${filename}`);
                setFormValues({
                    PERSONAL,
                    APELLIDO,
                    RUT,
                    PATENTE,
                    ROL,
                    OBSERVACIONES,
                    GUIADESPACHO,
                    SELLO,
                    ANDEN,
                    KILOS,
                    PALLETS,
                    SUPERVISOR,
                    ENRE,
                    JEFET,
                    FOTOS: fotosArray,
                    FECHAINICIO: (FECHAINICIO),
                    FECHAFIN: (FECHAFIN)
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
    const showImageModal = (foto) => {
        const modalImage = document.getElementById('modalImage');
        modalImage.src = foto;
        const imageModal = new bootstrap.Modal(document.getElementById('imageModal'));
        imageModal.show();
    }
    return (
        <form onSubmit={(e) => {
            e.preventDefault(); // Evita que se recargue la página
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
                                    <input required type="text" onChange={handleChange} value={formValues.PATENTE} placeholder='INGRESE PATENTE' className='form-control' id="patenteca-input" name={'PATENTE'} />

                                </div>
                            </div>

                            <div className="input-field">
                                <label>Tipo</label>
                                <div className="input-group">
                                    <select required onChange={handleChange} className='select-form-control' value={formValues.ROL} id="tipoca-input" name={'ROL'}>
                                        <option value="">Seleccionar una opción</option>
                                        <option value="SEMIREMOLQUE">SEMIREMOLQUE</option>
                                        <option value="CAMION">CAMION</option>
                                        <option value="TRACTOCAMION">TRACTOCAMION</option>
                                        <option value="CHASIS CABINADO">CHASIS CABINADO</option>
                                        <option value="REMOLQUE">REMOLQUE</option>
                                        <option value="OtrosCA">Otros</option>
                                    </select>

                                </div>
                            </div>



                            <div className="input-field">
                                <label>Modelo</label>
                                <div className="input-group">
                                    <input required type="text" onChange={handleChange} value={formValues.MODELO} placeholder='INGRESE MODELO' className='form-control' id="modeloca-input" name={'MODELO'} />

                                </div>
                            </div>

                            <div className="input-field">
                                <label>Color</label>
                                <div className="input-group">
                                    <input required type="text" onChange={handleChange} value={formValues.COLOR} placeholder='INGRESE COLOR' className='form-control' id="colorca-input" name={'COLOR'} />

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
                                        placeholder='INGRESE RUT'
                                        id="rut-input"
                                        name={'RUT'} >
                                    </input>


                                </div>
                            </div>

                            <div className="input-field">
                                <label>Nombre Chofer</label>
                                <div className="input-group">
                                    <input required type="text" className="form-control" onChange={handleChange} value={formValues.PERSONAL} placeholder='INGRESE NOMBRE' id="personal-input" name={'PERSONAL'} ></input>

                                </div>
                            </div>

                            <div className="input-field">
                                <label>Apellido Chofer</label>
                                <div className="input-group">
                                    <input required type="text" onChange={handleChange} value={formValues.APELLIDO} placeholder='INGRESE APELLIDO' className='form-control' id="apellidoca-input" name={'APELLIDO'} />

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
                                    <input required type="text" onChange={handleChange} value={formValues.GUIADESPACHO} placeholder='PLANILLA TRANSPORTE' className='form-control' id="guiaca-input" name={'GUIADESPACHO'} />

                                </div>
                            </div>

                            <div className="input-field">
                                <label>Sello</label>
                                <div className="input-group">
                                    <input type="text" onChange={handleChange} value={formValues.SELLO} placeholder='INGRESE SELLO' className='form-control' id="sello-input" name={'SELLO'} />

                                </div>
                            </div>

                            <div className="input-field">
                                <label>N° Anden</label>
                                <div className="input-group">
                                    <input type="text" onChange={handleChange} value={formValues.ANDEN} placeholder='INGRESE ANDEN' className='form-control' id="anden-input" name={'ANDEN'} />

                                </div>
                            </div>

                            <div className="input-field">
                                <label>Total Kilos</label>
                                <div className="input-group">
                                    <input type="text" onChange={handleChange} value={formValues.KILOS} placeholder='INGRESE KILOS' className='form-control' id="kilos-input" name={'KILOS'} />

                                </div>
                            </div>

                            <div className="input-field">
                                <label>Cantidad Pallets</label>
                                <div className="input-group">
                                    <input type="text" onChange={handleChange} value={formValues.PALLETS} placeholder='INGRESE PALLETS' className='form-control' id="pallets-input" name={'PALLETS'} />

                                </div>
                            </div>

                            <div className="input-field">
                                <label>Supervisor</label>
                                <div className="input-group">
                                    <input type="text" onChange={handleChange} value={formValues.SUPERVISOR} placeholder='INGRESE SUPERVISOR' className='form-control' id="supervisor-input" name={'SUPERVISOR'} />

                                </div>
                            </div>

                            <div className="input-field">
                                <label>Jefe Turno CD</label>
                                <div className="input-group">
                                    <input type="text" onChange={handleChange} value={formValues.JEFET} placeholder='INGRESE JEFET' className='form-control' id="jefet-input" name={'JEFET'} />

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
                                    name={'OBSERVACIONES'}
                                />
                            </div>

                            

                           


                        </div>

                        <Swiper
                                spaceBetween={10}
                                slidesPerView={5}
                                navigation
                                className="mySwiper"
                            >
                                {formValues.FOTOS && formValues.FOTOS.length > 0 ? (
                                    formValues.FOTOS.map((foto, index) => (
                                        <SwiperSlide key={index}>
                                            <img src={foto} className="img-thumbnail" alt={`Foto ${index + 1}`} style={{ maxWidth: '100px', cursor: 'pointer' }} onClick={() => showImageModal(foto)} />
                                        </SwiperSlide>
                                    ))
                                ) : (
                                    <SwiperSlide>
                                        <p>No hay fotos disponibles</p>
                                    </SwiperSlide>
                                )}
                            </Swiper>
                            <div className="modal fade" id="imageModal" tabIndex="-1" aria-labelledby="imageModalLabel" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="imageModalLabel">Imagen</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <img id="modalImage" src="" className="img-fluid" alt="Imagen grande" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                    </div>

                </div>

            </div>
        </form >
    );
}

export default VerInforme;
