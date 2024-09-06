import Swal from 'sweetalert2';
import Axios from "axios";
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { IconButton } from '@mui/material';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
const host_server = import.meta.env.VITE_SERVER_HOST;




function EditarU() {
    const { IDU } = useParams();
    const [rutValido, setRutValido] = React.useState(true);

    const [formValues, setFormValues] = useState({
        RUTU: '',
        NOMBREU: '',
        TIPOU: '',
        PASSWORDU: '',
        IDINST: '',
    });

    useEffect(() => {
        getUsuarios(IDU);
    }, [IDU]);

    const formatRut = (rut) => {
        rut = rut.replace(/[^0-9kK]/g, ''); // Eliminar caracteres no válidos
        if (rut.length <= 1) {
            return rut;
        }
    
        // Dividir el RUT en cuerpo y dígito verificador
        const body = rut.slice(0, -1);
        const dv = rut.slice(-1).toUpperCase();
    
        // Aplicar formato de puntos
        const formattedBody = body.split('').reverse().join('').match(/.{1,3}/g).join('.').split('').reverse().join('');
        
        return `${formattedBody}-${dv}`;
    };
    const validarRut = (rut) => {
        // Eliminar puntos y guion para validar
        const cleanRut = rut.replace(/[^0-9kK]/g, ''); // Eliminar puntos y guion
        
        // Verificar el formato del RUT limpio
        if (!/^\d{1,8}[\dkK]$/.test(cleanRut)) return false;
        
        // Separar el cuerpo del dígito verificador
        const body = cleanRut.slice(0, -1);
        const dv = cleanRut.slice(-1);
        
        // Comparar el dígito verificador calculado con el proporcionado
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
        const formattedValue = formatRut(value); // Formatear el valor del RUT
        setFormValues((prevValues) => ({
            ...prevValues,
            RUTU: formattedValue,
        }));
        setRutValido(validarRut(formattedValue)); // Validar el RUT formateado
    };


    const getUsuarios = (IDU) => {
        Axios.get(`${host_server}/EditarUsuarios/${IDU}`)
            .then((res) => {
                const { RUTU, NOMBREU, TIPOU, PASSWORDU, IDINST } = res.data[0];
                setFormValues({
                    RUTU: RUTU || '',
                    NOMBREU: NOMBREU || '',
                    TIPOU: TIPOU || '',
                    PASSWORDU: PASSWORDU || '',
                    IDINST: IDINST || '',
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
            RUTU: '',
            NOMBREU: '',
            TIPOU: '',
            PASSWORDU: '',
            IDINST: '',
        });
    };

    const limpiarCampo = (campo) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            [campo]: '',
        }));
    };

    const editarU = () => {
        Axios.put(`${host_server}/EditarU/${IDU}`, {
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
            editarU();
        }}>

            <div className="container-form">
                <header>Editar Usuario</header>

                <div className="form first" style={{ paddingRight: "30px" }}>
                    <div className="details personal">
                        <span className="title">Datos Usuario</span>
                        <div className="fields">

                            <div className="input-field">
                                <label>Rut</label>
                                <div className="input-group">
                                    <input required type="text" onChange={(event) => handleRutChange(event, { newValue: event.target.value })} value={formValues.RUTU} placeholder='Ingreso Rut' className={`form-control ${rutValido ? '' : 'is-invalid'}`} id="rutu-input" name={'RUTU'} />
                                    <IconButton color="primary" onClick={() => limpiarCampo('RUTU')} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Nombre Usuario</label>
                                <div className="input-group">
                                    <input required type="text" className="form-control" onChange={handleChange} value={formValues.NOMBREU} placeholder='Ingrese Nombre' id="nombreu-input" name={'NOMBREU'} ></input>
                                    <IconButton color="primary" onClick={() => limpiarCampo('NOMBREU')} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Tipo Usuario</label>
                                <div className="input-group">
                                    <select required onChange={handleChange} className='select-form-control' value={formValues.TIPOU} id="tipou-input" name={'TIPOU'}>
                                        <option value="">Seleccionar una opción</option>
                                        <option value="Guardia">Guardia</option>
                                        <option value="Supervisor">Supervisor</option>
                                        <option value="Administrador">Administrador</option>
                                    </select>
                                    <IconButton color="primary" onClick={() => limpiarCampo('TIPOU')} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Password</label>
                                <div className="input-group">
                                    <input required type="text" className="form-control" onChange={handleChange} value={formValues.PASSWORDU} placeholder='Ingrese Password' id="passwordu-input" name={'PASSWORDU'} ></input>
                                    <IconButton color="primary" onClick={() => limpiarCampo('PASSWORDU')} aria-label="directions">
                                        <ClearOutlinedIcon />
                                    </IconButton>
                                </div>
                            </div>

                            <div className="input-field">
                                <label>Instalacion</label>
                                <div className="input-group">
                                    <select required onChange={handleChange} className='select-form-control' value={formValues.IDINST} id="idinst-input" name={'IDINST'}>
                                        <option value="">Seleccionar una opción</option>
                                        <option value="1">La Cantera</option>
                                        <option value="2">Tierras Blancas</option>
                                    </select>
                                    <IconButton color="primary" onClick={() => limpiarCampo('IDINST')} aria-label="directions">
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

    );
}

export default EditarU;
