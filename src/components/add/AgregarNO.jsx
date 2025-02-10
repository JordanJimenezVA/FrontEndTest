import React, { useState } from 'react';
import Swal from 'sweetalert2';
import Axios from "axios";
import "./addNO.scss";

import { useAuth } from '../../hooks/Auth';
import { Button } from '@mui/material';
import useChileanTime from '../../hooks/useChileanTime';
const host_server = import.meta.env.VITE_SERVER_HOST;


function AgregarNO() {
    const nombreUsuario = localStorage.getItem("nombreUsuario") || "";
    const IDINST = localStorage.getItem("instalacionU") || "";
    const  chileanTime  = useChileanTime();
    const [NotaNO, setNotaNO] = useState('');
    const [HoraNO, setHoraNO] = useState("");
    const [FOTOSNO, setFOTOSNO] = useState([]);


    const ingresoformdNO = () => {
        const formData = new FormData();
        formData.append("NotaNO", NotaNO);
        formData.append("GuardiaNO", nombreUsuario);
        formData.append("HoraNO", chileanTime);
        formData.append("IDINST", IDINST);

        FOTOSNO.forEach((file, index) => {
            formData.append(`FOTOSNO`, file);
        });

        Axios.post(`${host_server}/AgregarNO`, formData, {
        
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((response) => {
            limpiarcamposNO();
            Swal.fire({
                title: 'Ingreso Exitoso!',
                icon: 'success',
                text: 'Novedad ingresada con Exito',
                timer: 1500
            });
        }).catch((error) => {
            console.error('Error:', error);
            const errorMessage = error.response && error.response.data && error.response.data.message
                ? error.response.data.message
                : 'Error desconocido';
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: errorMessage,
            });
        });
    };

    const limpiarcamposNO = () => {
        setNotaNO("");
        setFOTOSNO([]);
    };

    const handleFileChange = (event) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        const newPhotos = Array.from(files).filter(file => allowedTypes.includes(file.type));

        setFOTOSNO(newPhotos);  
    };

    return (
        <form className='form-novedad' onSubmit={(e) => {
            e.preventDefault();
            ingresoformdNO();
        }}>
           
            <div className="container-form">
                <header>Reportar Novedad</header>
                <br></br>
                <div className="form first" style={{ paddingRight: "30px" }}>
                    <div className="details personal">

                        <div className="details ID">
                            <span className="title">Datos Novedad</span>
                            <div className="fields">

                                 <div className="input-field" style={{ width: "100%" }}>
                                    <label>Fotos</label>
                                    <div className="input-group">
                                        <input type="file" onChange={handleFileChange} placeholder='INGRESE FOTOS' style={{ alignContent: "center" }} multiple accept=".jpg, .jpeg, .png" className='form-control' id="fotos-input" name={'FOTOS'} />
                                    </div>
                                </div> 

                                <div className="input-field-obs">
                                    <label>Descripcion Novedad</label>
                                    <textarea type="text" required
                                        onChange={(event) => { setNotaNO(event.target.value); }}
                                        value={NotaNO}
                                        placeholder='Descripcion Novedad'
                                        className='form-control'
                                        id="ob-input"
                                   
                                        name={NotaNO}
                                    />
                                </div>

                            </div>


                        </div>

                    </div>
                </div>
                <br></br>
                <div className="buttons-container">

                    <div className="buttons-left">
                        <Button variant="contained" type='submit'>Reportar Novedad</Button>


                    </div>

                </div>

            </div>
        </form>
    );
}
export default AgregarNO;
