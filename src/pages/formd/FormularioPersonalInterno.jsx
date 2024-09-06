import './formularioPersonal.scss'
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import Axios from "axios";
import Autosuggest from 'react-autosuggest';
import useChileanTime from "../../hooks/UseChileanTime";
import { useAuth } from '../../hooks/Auth';
import { IconButton } from '@mui/material';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import GuardiaID from "../../hooks/GuardiaID";
const host_server = import.meta.env.VITE_SERVER_HOST;

function FormularioPersonalInterno() {
  const { nombreUsuario } = useAuth();
  const chileanTime = useChileanTime();
  const [suggestions, setSuggestions] = useState([]);
  const [RutPI, setRutPI] = useState("");
  const [NombrePI, setNombrePI] = useState("");
  const [ApellidoPI, setApellidoPI] = useState("");
  const [VehiculoPI, setVehiculoPI] = useState("");
  const [ModeloPI, setModeloPI] = useState("");
  const [ColorPI, setColorPI] = useState("");
  const [PatentePI, setPatentePI] = useState("");
  const [RolPI, setRolPI] = useState("");
  const [ObservacionesPI, setObservacionesPI] = useState("");
  const [mensajeEstado, setMensajeEstado] = useState('');
  const [rutValido, setRutValido] = React.useState(true);
  const IDINST = GuardiaID();
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

  const getSuggestions = async (value) => {
    try {
      const response = await fetch(`${host_server}/FormularioPersonalInterno/suggestions?query=${value}`);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const ruts = data.results[0].map(obj => obj.RUTPI);
        setSuggestions(ruts);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error al obtener sugerencias:', error);
    }
  };


  const onSuggestionSelected = async (_, { suggestion }) => {
    try {
      const response = await Axios.get(`${host_server}/FormularioPersonalInterno/suggestion/${suggestion}`);
      const data = response.data;

      let mensajeEstado = '';
      if (data.ESTADONG) {
        switch (data.ESTADONG) {
          case 'PERMS1':
            mensajeEstado = 'DEBE TENER PRECAUCIÓN PARA ENTRAR';
            break;
          case 'PERMS2':
            mensajeEstado = 'SOLICITAR PERMISO PARA ENTRAR';
            break;
          case 'NOACCESO':
            mensajeEstado = 'PROHIBIDO EL ACCESO';
            break;
          default:
            mensajeEstado = '';
        }
      }

      setMensajeEstado(mensajeEstado);
      setNombrePI(data.NOMBREPI);
      setApellidoPI(data.APELLIDOPI);
      setVehiculoPI(data.VEHICULOPI);
      setModeloPI(data.MODELOPI);
      setColorPI(data.COLORPI);
      setPatentePI(data.PATENTEPI);
      setRolPI(data.ROLPI);
    } catch (error) {
      console.error('Error al obtener sugerencias:', error);
    }
  };

  const ingresoformdPI = () => {

    if (!validarRut(RutPI)) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "RUT inválido. Por favor, ingrese un RUT válido.",
      });
      return;
    }
    Axios.post(`${host_server}/FormularioPersonalInterno`, {
      RUTPI: RutPI,
      NOMBREPI: NombrePI,
      APELLIDOPI: ApellidoPI,
      VEHICULOPI: VehiculoPI,
      MODELOPI: ModeloPI,
      COLORPI: ColorPI,
      PATENTEPI: PatentePI,
      OBSERVACIONESPI: ObservacionesPI,
      ROLPI: RolPI,
      fechaActualChile: chileanTime,
      NombreUsuarioI: nombreUsuario,
      idinst: IDINST,

    }).then(async (response) => {
        
      if (response.data.warning) {
        const result = await Swal.fire({
          title: "Advertencia",
          text: response.data.warning,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, continuar",
          cancelButtonText: "No, cancelar",
        });

        if (result.isConfirmed) {

          Axios.post(`${host_server}/FormularioPersonalInterno`, {
            RUTPI: RutPI,
            NOMBREPI: NombrePI,
            APELLIDOPI: ApellidoPI,
            VEHICULOPI: VehiculoPI,
            MODELOPI: ModeloPI,
            COLORPI: ColorPI,
            PATENTEPI: PatentePI,
            OBSERVACIONESPI: ObservacionesPI,
            ROLPI: RolPI,
            fechaActualChile: chileanTime,
            NombreUsuarioI: nombreUsuario,
            idinst: IDINST,
            ignoreWarning: true,  
          })
            .then(() => {
              limpiarcamposPI();
              Swal.fire({
                title: 'Ingreso Exitoso!',
                icon: 'success',
                text: 'Personal Interno ingresado con Exito',
                timer: 1500,
              });
            })
            .catch((error) => {
              console.error("Error al registrar ingreso:", error);
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Intente más tarde",
              });
            });
        } else {
          Swal.fire({
            title: "Operación cancelada",
            text: "No se realizó ningún registro.",
            icon: "info",
            timer: 1500,
          });
        }
      } else {
        limpiarcamposPI();
        Swal.fire({
          title: 'Ingreso Exitoso!',
          icon: 'success',
          text: 'Personal Interno ingresado con Exito',
          timer: 1500,
        });
      }
    })
    .catch((error) => {
      console.error("Error en la solicitud:", error);
      if (error.response && error.response.data && error.response.data.error) {
        Swal.fire({
          icon: "error",
          title: "Cuidado",
          text: error.response.data.error,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Intente más tarde",
        });
      }
    });
};


  const limpiarcamposPI = () => {
    setRutPI("");
    setNombrePI("");
    setApellidoPI("");
    setVehiculoPI("");
    setModeloPI("");
    setColorPI("");
    setPatentePI("");
    setObservacionesPI("");
    setRolPI("");
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
      if (mensajeEstado === 'PROHIBIDO EL ACCESO') {
        Swal.fire({
          icon: 'error',
          title: 'Prohibido el acceso',
          text: 'Este personal no tiene permitido el ingreso.',
        });
      } else {
        ingresoformdPI();
      }
    }}>
      <div className="container-form">
        <header>Marcar Entrada Personal Interno</header>
        <div className='error-div'>
          {mensajeEstado && (
            <span style={{ color: mensajeEstado === 'PROHIBIDO EL ACCESO' ? 'red' : 'orange', marginLeft: '10px' }}>
              {mensajeEstado}
            </span>
          )}
        </div>
        <br></br>
        <div className="form first" style={{ paddingRight: "30px" }}>
          <div className="details personal">
            <span className="title">Datos Personal Interno</span>
            <div className="fields">
              <div className="input-field">

                <label>Rut</label>
                <div className='input-group'>

                  <Autosuggest

                    suggestions={suggestions}
                    onSuggestionsFetchRequested={({ value }) => getSuggestions(value)}
                    onSuggestionsClearRequested={() => setSuggestions([])}
                    getSuggestionValue={(suggestion) => suggestion}
                    renderSuggestion={(suggestion) => <div>{suggestion}</div>}
                    inputProps={{
                      placeholder: "Ingrese Rut",
                      value: RutPI,
                      id: "rutpe-input",
                      onChange: handleRutChange,
                    }}
                    onSuggestionSelected={onSuggestionSelected}
                  />
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

              <div className="input-field-obs">
                <label>Observaciones</label>
                <textarea type="text" required={mensajeEstado !== ''}
                  onChange={(event) => { setObservacionesPI(event.target.value); }}
                  value={ObservacionesPI}
                  placeholder='Ingrese Observaciones'
                  className='form-control'
                  id="obspi-input"
                  name={ObservacionesPI}
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
                  <input  type="text" onChange={handlePatenteChange} value={PatentePI} placeholder='Ingrese Patente' className='form-control' id="patentepi-input" name={PatentePI} />
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
export default FormularioPersonalInterno;