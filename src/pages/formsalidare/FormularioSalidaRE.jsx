import './formularioSalidaRE.scss'
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


function FormularioSalidaRE() {
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
    VEHICULO: '',
    MODELO: '',
    COLOR: '',
  });

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
        const { PERSONAL, APELLIDO, RUT, PATENTE, ROL, OBSERVACIONES, GUIADESPACHO, SELLO, VEHICULO, MODELO, COLOR } = res.data[0];
        setFormValues({
          PERSONAL,
          APELLIDO,
          RUT,
          PATENTE,
          ROL,
          OBSERVACIONES,
          GUIADESPACHO,
          SELLO,
          VEHICULO,
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
      VEHICULO: '',
      MODELO: '',
      COLOR: '',
    });
  };

  const limpiarCampo = (campo) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [campo]: '',
    }));
  };
  
  const salidaCA = () => {
    Axios.post(`${host_server}/FormularioSalidaRE/${IDR}`, {
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
        navigate('/TablaIngresoRE');
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
        <header>Marcar Salida Personal</header>
        <div className='error-div'>
        </div>
        <br></br>
        <div className="form first" style={{ paddingRight: "30px" }}>
          <div className="details personal">
            <span className="title">Datos Personal</span>
            <div className="fields">

              <div className="input-field">
                <label>Rut</label>
                <div className="input-group">
                  <input required type="text" onChange={(event) => handleRutChange(event, { newValue: event.target.value })} value={formValues.RUT} placeholder='Ingreso Nombre' className='form-control' id="ruts-input" name={'RUT'} />
                  <IconButton color="primary" onClick={() => limpiarCampo('RUT')} aria-label="directions">
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>

              <div className="input-field">
                <label>Nombre</label>
                <div className="input-group">
                  <input required type="text" onChange={handleChange} value={formValues.PERSONAL} placeholder='Ingreso Nombre' className='form-control' id="personal-input" name={'PERSONAL'} />
                  <IconButton color="primary" onClick={() => limpiarCampo('PERSONAL')} aria-label="directions">
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>

              <div className="input-field">
                <label>Apellido</label>
                <div className="input-group">
                  <input required type="text" onChange={handleChange} value={formValues.APELLIDO} placeholder='Ingrese Apellido' className='form-control' id="apellidopi-input" name={'APELLIDO'} />
                  <IconButton color="primary" onClick={() => limpiarCampo('APELLIDO')} aria-label="directions">
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>


              <div className="input-field">
                <label>Rol</label>
                <div className="input-group">
                  <input required type="text" onChange={handleChange} value={formValues.ROL} placeholder='Ingrese Rol' className='form-control' id="rols-input" name={'ROL'} />
                  <IconButton color="primary" onClick={() => limpiarCampo('ROL')} aria-label="directions">
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
                <textarea type="text"
                  onChange={handleChange}
                  value={formValues.OBSERVACIONES}
                  placeholder='Ingrese Observaciones'
                  className='form-control'
                  id="obspi-input"
                  name={'OBSERVACIONES'}
                />
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
                  <input  type="text" className="form-control" onChange={handleChange} value={formValues.VEHICULO} placeholder='Ingrese Vehiculo' id="vehiculo-input" name={'VEHICULO'} ></input>
                  <IconButton color="primary" onClick={() => limpiarCampo('VEHICULO')} aria-label="directions">
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>

              <div className="input-field">
                <label>Modelo</label>
                <div className="input-group">
                  <input  type="text" className="form-control" onChange={handleChange} value={formValues.MODELO} placeholder='Ingrese Modelo' id="modelo-input" name={'MODELO'} ></input>
                  <IconButton color="primary" onClick={() => limpiarCampo('MODELO')} aria-label="directions">
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>

              <div className="input-field">
                <label>Patente</label>
                <div className="input-group">
                  <input  type="text" onChange={handleChange} value={formValues.PATENTE} placeholder='Ingrese Patente' className='form-control' id="patentepi-input" name={'PATENTE'} />
                  <IconButton color="primary" onClick={() => limpiarCampo('PATENTE')} aria-label="directions">
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>

              <div className="input-field">
                <label>Color</label>
                <div className="input-group">
                  <input  type="text" onChange={handleChange} value={formValues.COLOR} placeholder='Ingrese Color' className='form-control' id="colorpi-input" name={'COLOR'} />
                  <IconButton color="primary" onClick={() => limpiarCampo('COLOR')} aria-label="directions">
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>

              <div className="input-field">
                <label>Sello</label>
                <div className="input-group">
                  <input  type="text" onChange={handleChange} value={formValues.SELLO} placeholder='Ingrese Sello' className='form-control' id="sellopi-input" name={'SELLO'} />
                  <IconButton color="primary" onClick={() => limpiarCampo('SELLO')} aria-label="directions">
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>

              <div className="input-field">
                <label>Planilla Transporte</label>
                <div className="input-group">
                  <input  type="text" onChange={handleChange} value={formValues.GUIADESPACHO} placeholder='Ingrese Planilla Transporte' className='form-control' id="guiadespacho-input" name={'GUIADESPACHO'} />
                  <IconButton color="primary" onClick={() => limpiarCampo('GUIADESPACHO')} aria-label="directions">
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
            <span className="btnText">Marcar Salida</span>
            <i className="uil uil-navigator"></i>
          </button>
        </div>

      </div>
    </form>

  );
}

export default FormularioSalidaRE;
