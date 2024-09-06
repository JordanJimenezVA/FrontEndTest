import './formularioSalida.scss'
import Swal from 'sweetalert2';
import Axios from "axios";
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useChileanTime from '../../hooks/UseChileanTime';
import { useAuth } from '../../hooks/Auth';
import { useNavigate } from 'react-router-dom';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { IconButton } from '@mui/material';
import GuardiaID from "../../hooks/GuardiaID";
const host_server = import.meta.env.VITE_SERVER_HOST;


function FormularioSalida() {
  const { IDR } = useParams();
  const { nombreUsuario } = useAuth();
  const [rutValido, setRutValido] = React.useState(true);
  const chileanTime = useChileanTime();
  const navigate = useNavigate();
  const IDINST = GuardiaID();
  const [formValues, setFormValues] = useState({
    PERSONAL: '',
    APELLIDO: '',
    RUT: '',
    PATENTE: '',
    ROL: '',
    OBSERVACIONES: '',
    GUIADESPACHO: '',
    SELLO: '',
    PATENTERACA: '',
    MODELO: '',
    COLOR: '',
    MARCA: '',

  });
  console.log("id salida" + IDINST);
  useEffect(() => {
    getRegistros(IDR);
  }, [IDR]);

  const formatRut = (rut) => {
    rut = rut.replace(/[^0-9kK]/g, '');
    if (rut.length <= 1) {
      return rut;
    }
    const body = rut.slice(0, -1);
    const dv = rut.slice(-1).toUpperCase();
    return `${body}-${dv}`;
  };

  const validarRut = (rut) => {
    if (!/^\d{1,8}-[\dkK]$/.test(rut)) return false;
    const [body, dv] = rut.split('-');
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
    const formattedValue = formatRut(value);
    setFormValues((prevValues) => ({
      ...prevValues,
      RUT: formattedValue,
    }));
    setRutValido(validarRut(formattedValue));
  };
  const getRegistros = (IDR) => {
    Axios.get(`${host_server}/FormularioSalida/${IDR}`)
      .then((res) => {
        const { PERSONAL, APELLIDO, RUT, PATENTE, ROL, OBSERVACIONES, GUIADESPACHO, SELLO, PATENTERACA, MODELO, COLOR, MARCA } = res.data[0];
        setFormValues({
          PERSONAL,
          APELLIDO,
          RUT,
          PATENTE,
          ROL,
          OBSERVACIONES,
          GUIADESPACHO,
          SELLO,
          PATENTERACA,
          MODELO,
          COLOR,
          MARCA,
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
      PERSONAL: '',
      APELLIDO: '',
      RUT: '',
      PATENTE: '',
      ROL: '',
      OBSERVACIONES: '',
      GUIADESPACHO: '',
      SELLO: '',
      PATENTERACA: '',
      MODELO: '',
      COLOR: '',
      MARCA: '',
    });
  };

  const limpiarCampo = (campo) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [campo]: '',
    }));
  };
  const salidaCA = () => {
    Axios.post(`${host_server}/FormularioSalida/${IDR}`, {
      ...formValues,
      FECHASALIDA: chileanTime,
      NombreUsuario: nombreUsuario,
      IDINST: IDINST
    }).then(() => {
      limpiarCampos();
      Swal.fire({
        title: 'Salida Exitosa!',
        icon: 'success',
        text: 'Salida registrada correctamente',
        timer: 1500
      }).then(() => {
        navigate('/TablaIngreso');
      });
    }).catch((error) => {
      console.error("Error al marcar salida:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error al marcar salida, intente nuevamente más tarde",
      });
    });
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault(); // Evita que se recargue la página
      salidaCA();
    }}>

      <div className="container-form">
        <header>Marcar Salida Camión</header>
        <br></br>
        <div className="form first" style={{ paddingRight: "30px" }}>
          <div className="details personal">
            <span className="title">Datos Camión</span>
            <div className="fields">
              <div className="input-field">

                <label>Patente</label>
                <div className="input-group">
                  <input required type="text" onChange={handleChange} value={formValues.PATENTE} placeholder='INGRESE PATENTE' className='form-control' id="patente-input" name={'PATENTE'} />
                  <IconButton color="primary" onClick={() => limpiarCampo('PATENTE')} aria-label="directions">
                    <ClearOutlinedIcon />
                  </IconButton>
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
                  <IconButton color="primary" onClick={() => limpiarCampo('ROL')} aria-label="directions">
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>



              <div className="input-field">
                <label>Modelo</label>
                <div className="input-group">
                  <input required type="text" onChange={handleChange} value={formValues.MODELO} placeholder='INGRESE MODELO' className='form-control' id="modeloca-input" name={'MODELO'} />
                  <IconButton color="primary" onClick={() => limpiarCampo('MODELO')} aria-label="directions">
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>

              <div className="input-field">
                <label>Color</label>
                <div className="input-group">
                  <input required type="text" onChange={handleChange} value={formValues.COLOR} placeholder='INGRESE COLOR' className='form-control' id="colorca-input" name={'COLOR'} />
                  <IconButton color="primary" onClick={() => limpiarCampo('COLOR')} aria-label="directions">
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>

              <div className="input-field">
                <label>Marca</label>
                <div className="input-group">
                  <input required type="text" onChange={handleChange} value={formValues.MARCA} placeholder='INGRESE MARCA' className='form-control' id="marcaca-input" name={'MARCA'} />
                  <IconButton color="primary" onClick={() => limpiarCampo('MARCA')} aria-label="directions">
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
                    value={formValues.RUT}
                    placeholder='INGRESE RUT'
                    id="rut-input"
                    name={'RIT'} >
                  </input>

                  <IconButton color="primary" onClick={() => limpiarCampo('RUT')} aria-label="directions">
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>

              <div className="input-field">
                <label>Nombre Chofer</label>
                <div className="input-group">
                  <input required type="text" className="form-control" onChange={handleChange} value={formValues.PERSONAL} placeholder='INGRESE NOMBRE' id="choferca-input" name={'PERSONAL'} ></input>
                  <IconButton color="primary" onClick={() => limpiarCampo('PERSONAL')} aria-label="directions">
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>

              <div className="input-field">
                <label>Apellido Chofer</label>
                <div className="input-group">
                  <input required type="text" onChange={handleChange} value={formValues.APELLIDO} placeholder='INGRESE APELLIDO' className='form-control' id="apellidoca-input" name={'APELLIDO'} />
                  <IconButton color="primary" onClick={() => limpiarCampo('APELLIDO')} aria-label="directions">
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>

            </div>

          </div>
          <br></br>
          <div className="details ID">
            <span className="title">Datos Extras</span>
            <div className="fields">

              <div className="input-field">
                <label>Planilla Transporte</label>
                <div className="input-group">
                  <input required type="text" onChange={handleChange} value={formValues.GUIADESPACHO} placeholder='PLANILLA TRANSPORTE' className='form-control' id="guiaca-input" name={'GUIADESPACHO'} />
                  <IconButton color="primary" onClick={() => limpiarCampo('GUIADESPACHO')} aria-label="directions">
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>

              <div className="input-field">
                <label>Sello</label>
                <div className="input-group">
                  <input type="text" onChange={handleChange} value={formValues.SELLO} placeholder='INGRESE SELLO' className='form-control' id="selloca-input" name={'SELLO'} />
                  <IconButton color="primary" onClick={() => limpiarCampo('SELLO')} aria-label="directions">
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>

              <div className="input-field">
                <label>Patente Rampa</label>
                <div className="input-group">
                  <input required type="text"
                    onChange={handleChange}
                    value={formValues.PATENTERACA}
                    placeholder='Ingrese RAMPA'
                    className='form-control'
                    id="patenteraca-input"
                    name={'PATENTERACA'}
                    style={{ textTransform: 'uppercase' }}
                  />
                  <IconButton color="primary" onClick={() => limpiarCampo('PATENTERACA')} aria-label="directions">
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>

              <div className="input-field-obs">
                <label>Observaciones</label>
                <textarea type="text"
                  onChange={handleChange}
                  value={formValues.OBSERVACIONES}
                  placeholder='INGRESE OBSERVACIONES'
                  className='form-control'
                  id="obsca-input"
                  name={'OBSERVACIONES'}
                />
              </div>

            </div>


          </div>

        </div>

        <div className="buttons">
          <button className="sumbit-entrada">
            <span className="btnText">Marcar Salida</span>
            <i className="uil uil-navigator"></i>
          </button>
        </div>

      </div>

    </form>

  );
}

export default FormularioSalida;
