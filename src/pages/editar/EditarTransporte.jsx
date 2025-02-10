import Swal from 'sweetalert2';
import Axios from "axios";
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { IconButton } from '@mui/material';
import useEmpresas from "../../hooks/useEmpresas";
const host_server = import.meta.env.VITE_SERVER_HOST;

function EditarTransporte() {
    const { PATENTE } = useParams();
    const { empresas, error } = useEmpresas(host_server);

    const [formValues, setFormValues] = useState({
        PATENTE: '',
        Tipo: '',
        Modelo: '',
        Marca: '',
        Color: '',
        Empresa: '',
    });

    useEffect(() => {
        getTransporte(PATENTE);
    }, [PATENTE]);

    const getTransporte = (PATENTE) => {
        Axios.get(`${host_server}/EditarTransporte/${PATENTE}`)
            .then((res) => {
                if (res.data && res.data.length > 0) {
                    const { PATENTE, Tipo, Modelo, Marca, Color, Empresa } = res.data[0];
                    setFormValues({
                        PATENTE: PATENTE,
                        Tipo: Tipo || '',
                        Modelo: Modelo || '',
                        Marca: Marca || '',
                        Color: Color || '',
                        Empresa: Empresa || '',
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Registro no encontrado",
                        text: "No se encontró ningún transporte con la patente proporcionada.",
                    });
                }
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
            PATENTE: '',
            Tipo: '',
            Modelo: '',
            Marca: '',
            Color: '',
            Empresa: '',
        });
    };

    const limpiarCampo = (campo) => {
        setFormValues((prevValues) => ({
            ...prevValues,
            [campo]: '',
        }));
    };

    const editarTransporte = () => {
        Axios.put(`${host_server}/EditarTransporte/${PATENTE}`, {
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
    };

    const handlePatenteChange = (event) => {
        const value = event.target.value.toUpperCase();
        setFormValues((prevValues) => ({
            ...prevValues,
            PATENTE: value,
        }));
    };

    return (
        <form onSubmit={(e) => {
            e.preventDefault(); 
                editarTransporte();
        }}>
            <div className="container-form">
                <header>Editar Transporte</header>
                <br></br>
                <div className="form first" style={{ paddingRight: "30px" }}>
                <div className="details personal">
            <span className="title">Datos Transporte</span>
            <div className="fields">
              <div className="input-field">
                <label>Patente</label>
                <div className="input-group">
                  <input
                    required
                    type="text"
                    onChange={handlePatenteChange}
                    value={formValues.PATENTE}
                    placeholder="INGRESE PATENTE"
                    className="form-control"
                    id="patenteca-input"
                    name={'PATENTE'}
                  />
                  <IconButton
                    color="primary"
                    onClick={() => limpiarCampo(setPATENTE)}
                    aria-label="directions"
                  >
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>
              <div className="input-field">
                <label>Tipo Transporte</label>
                <div className="input-group">
                  <select
                    required
                    onChange={handleChange}
                    className="select-form-control"
                    value={formValues.Tipo}
                    id="tipoca-input"
                    name={'Tipo'}
                  >
                    <option value="">Seleccionar una opción</option>
                    <option value="Vehiculo">Vehiculo</option>
                    <option value="Camion">Camion</option>
                  </select>
                  <IconButton
                    color="primary"
                    onClick={() => limpiarCampo(setTipo)}
                    aria-label="directions"
                  >
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>
              {formValues.Tipo === "Camion" && (
                <div className="input-field">
                  <label>Tipo Camion</label>
                  <div className="input-group">
                    <select
                      required
                      onChange={handleChange}
                      className="select-form-control"
                      value={formValues.Modelo}
                      id="tipoca-input"
                      name={'Modelo'}
                    >
                      <option value="">Seleccionar una opción</option>
                      <option value="SEMIREMOLQUE">SEMIREMOLQUE</option>
                      <option value="CAMION">CAMION</option>
                      <option value="TRACTOCAMION">TRACTOCAMION</option>
                      <option value="CHASIS CABINADO">CHASIS CABINADO</option>
                      <option value="REMOLQUE">REMOLQUE</option>
                      <option value="OtrosCA">Otros</option>
                    </select>
                    <IconButton
                      color="primary"
                      onClick={() => limpiarCampo(setModelo)}
                      aria-label="directions"
                    >
                      <ClearOutlinedIcon />
                    </IconButton>
                  </div>
                </div>
              )}
              {formValues.Tipo === "Vehiculo" && (
                <div className="input-field">
                  <label>Modelo</label>
                  <div className="input-group">
                    <input
                      required
                      type="text"
                      onChange={handleChange}
                      value={formValues.Modelo}
                      placeholder="INGRESE MODELO"
                      className="form-control"
                      id="modeloca-input"
                      name={'Modelo'}
                    />
                    <IconButton
                      color="primary"
                      onClick={() => limpiarCampo(setModelo)}
                      aria-label="directions"
                    >
                      <ClearOutlinedIcon />
                    </IconButton>
                  </div>
                </div>
              )}

                    <div className="input-field">
                <label>Marca</label>
                <div className="input-group">
                  <input
                    required
                    type="text"
                    onChange={handleChange}
                    value={formValues.Marca}
                    placeholder="INGRESE MARCA"
                    className="form-control"
                    id="marcaca-input"
                    name={'Marca'}
                  />
                  <IconButton
                    color="primary"
                    onClick={() => limpiarCampo(setMarca)}
                    aria-label="directions"
                  >
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>

              
              <div className="input-field">
                <label>Color</label>
                <div className="input-group">
                  <input
                    required
                    type="text"
                    onChange={handleChange}
                    value={formValues.Color}
                    placeholder="INGRESE COLOR"
                    className="form-control"
                    id="colorca-input"
                    name={'Color'}
                  />
                  <IconButton
                    color="primary"
                    onClick={() => limpiarCampo(setColor)}
                    aria-label="directions"
                  >
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>

        

              <div className="input-field">
                <label>Empresa</label>
                <div className="input-group">
                  <select
                    required
                    className="select-form-control"
                    onChange={handleChange}
                    value={formValues.Empresa}
                  >
                    <option value="">Seleccionar una opción</option>
                    {empresas.map((empresa) => (
                      <option key={empresa.IDE} value={empresa.IDE}>
                        {empresa.Nombre}
                      </option>
                    ))}
                  </select>
                  <IconButton
                    color="primary"
                    onClick={() => limpiarCampo(setEmpresaP)}
                    aria-label="directions"
                  >
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>
              <div className="input-field"></div>
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
    );
}

export default EditarTransporte;
