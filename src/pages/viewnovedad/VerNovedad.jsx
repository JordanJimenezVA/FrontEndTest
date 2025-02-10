import Swal from 'sweetalert2';
import './verNovedad.scss'
import Axios from "axios";
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';

const host_server = import.meta.env.VITE_SERVER_HOST;


function VerNovedad() {
    const { IDNO } = useParams();
    const [formValues, setFormValues] = useState({
        Descripcion: '',
        Guardia: '',
        Fecha: '',
        Foto: [],  
    });

    useEffect(() => {
        getNovedad(IDNO);
    }, [IDNO]);


    const getNovedad = (IDNO) => {
        Axios.get(`${host_server}/VerNO/${IDNO}`)
            .then((res) => {
                const { Fecha, Guardia, Descripcion, Foto } = res.data[0];
                const fotosArray = Foto.split(', ').map(filename => `${host_server}/imagenes/${filename}`);
                setFormValues({
                    Fecha,
                    Guardia,
                    Descripcion,
                    Foto: fotosArray,
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
            <div className="detalle-accion">
                <h2 className='title-h2'>Detalle de la Novedad</h2>
                <hr />

                <div className="descripcion">
                    <h3>Descripción</h3>
                    <p>{formValues.Descripcion}</p>
                </div><br></br>
                <Swiper
                    spaceBetween={10}
                    slidesPerView={5}
                    navigation
                    className="mySwiper"
                >
                    {formValues.Foto && formValues.Foto.length > 0 ? (
                        formValues.Foto.map((foto, index) => (
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
                <div className="accion-observable-container">
                    <div className="accion-observable">
                        <h4 className='guardia-h3'>Guardia</h4>
                        <p>{formValues.Guardia}</p>
                    </div>
                    <div className="accion-observable">
                        <h4 className='fecha-h3'>Fecha</h4>
                        <p>{formValues.Fecha}</p>
                    </div>
                </div>
                <div className="accion-observable">

                </div>
            </div>
        </form>
    );

}

export default VerNovedad;
