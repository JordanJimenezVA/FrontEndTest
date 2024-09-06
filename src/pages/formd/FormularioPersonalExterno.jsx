import './formularioPersonal.scss';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import Axios, { } from "axios";
import Autosuggest from "react-autosuggest";
import useChileanTime from "../../hooks/UseChileanTime";
import { useAuth } from '../../hooks/Auth';
import { IconButton } from '@mui/material';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import GuardiaID from "../../hooks/GuardiaID";

function FormularioPersonalExterno() {
  const { nombreUsuario } = useAuth();
  const chileanTime = useChileanTime();
  const [suggestions, setSuggestions] = useState([]);
  const [RutPE, setRutPE] = useState("");
  const [NombrePE, setNombrePE] = useState("");
  const [ApellidoPE, setApellidoPE] = useState("");
  const [VehiculoPE, setVehiculoPE] = useState("");
  const [ModeloPE, setModeloPE] = useState("");
  const [ColorPE, setColorPE] = useState("");
  const [PatentePE, setPatentePE] = useState("");
  const [EmpresaPE, setEmpresaPE] = useState("");
  const [RolPE, setRolPE] = useState("");
  const [ObservacionesPE, setObservacionesPE] = useState("");
  const [GuiaDespachoPE, setGuiaDespachoPE] = useState("");
  const [SelloPE, setSelloPE] = useState("");
  const [rutValido, setRutValido] = React.useState(true);
  const [mensajeEstado, setMensajeEstado] = useState('');
  const host_server = import.meta.env.VITE_SERVER_HOST;
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
    setRutPE(newValue);
    setRutValido(validarRut(newValue));
  }

  const getSuggestions = async (value) => {
    try {
      const response = await fetch(`${host_server}/FormularioPersonalExterno/suggestions?query=${value}`);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const ruts = data.results[0].map(obj => obj.RUTPE);
        setSuggestions(ruts);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
    }
  };

  const onSuggestionSelected = async (_, { suggestion }) => {
    try {
      const response = await Axios.get(`${host_server}/FormularioPersonalExterno/suggestion/${suggestion}`);
      const data = response.data;

      let mensajeEstado = '';
      if (data.ESTADONG) {
        switch (data.ESTADONG) {
          case 'PERMS1':
            mensajeEstado = 'ENTRAR CON PRECAUCIÓN';
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
      setNombrePE(data.NOMBREPE || '');
      setApellidoPE(data.APELLIDOPE || '');
      setVehiculoPE(data.VEHICULOPE || '');
      setModeloPE(data.MODELOPE || '');
      setColorPE(data.COLORPE || '');
      setPatentePE(data.PATENTEPE || '');
      setEmpresaPE(data.EMPRESAPE || '');
      setRolPE(data.ROLPE || '');
    } catch (error) {
      console.error('Error al obtener sugerencias:', error);
    }
  };


  const inputProps = {
    placeholder: "Ingrese RUT",
    value: RutPE,
    onChange: (_, { newValue }) => setRutPE(newValue),
  };

  const confirmIngreso = () => {
    if (mensajeEstado) {
      Swal.fire({
        title: '¿Estás seguro del ingreso de esta persona?',
        text: 'Esta persona tiene el estado: ' + mensajeEstado,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, ingresar',
        cancelButtonText: 'No, cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          ingresoformdPE();
        }
      });
    } else {
      ingresoformdPE();
    }
  };

  const ingresoformdPE = () => {
    if (!validarRut(RutPE)) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "RUT inválido. Por favor, ingrese un RUT válido.",
      });
      return;
    }
  
    Axios.post(`${host_server}/FormularioPersonalExterno`, {
      rutPE: RutPE,
      NombrePE: NombrePE,
      ApellidoPE: ApellidoPE,
      VehiculoPE: VehiculoPE,
      ModeloPE: ModeloPE,
      ColorPE: ColorPE,
      PatentePE: PatentePE,
      EmpresaPE: EmpresaPE,
      RolPE: RolPE,
      ObservacionesPE: ObservacionesPE,
      fechaActualChile: chileanTime,
      NombreUsuarioEX: nombreUsuario,
      SelloPE: SelloPE,
      GuiaDespachoPE: GuiaDespachoPE,
      idinst: IDINST,
    })
      .then(async (response) => {
        
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
            // Enviar todos los datos de nuevo junto con `ignoreWarning`
            Axios.post(`${host_server}/FormularioPersonalExterno`, {
              rutPE: RutPE,
              NombrePE: NombrePE,
              ApellidoPE: ApellidoPE,
              VehiculoPE: VehiculoPE,
              ModeloPE: ModeloPE,
              ColorPE: ColorPE,
              PatentePE: PatentePE,
              EmpresaPE: EmpresaPE,
              RolPE: RolPE,
              ObservacionesPE: ObservacionesPE,
              fechaActualChile: chileanTime,
              NombreUsuarioEX: nombreUsuario,
              SelloPE: SelloPE,
              GuiaDespachoPE: GuiaDespachoPE,
              idinst: IDINST,
              ignoreWarning: true,  // Aquí el parámetro que permite ignorar la advertencia
            })
              .then(() => {
                limpiarcamposPE();
                Swal.fire({
                  title: 'Ingreso Exitoso!',
                  icon: 'success',
                  text: 'Personal Externo ingresado con Exito',
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
          limpiarcamposPE();
          Swal.fire({
            title: 'Ingreso Exitoso!',
            icon: 'success',
            text: 'Personal Externo ingresado con Exito',
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
    
  

  const limpiarcamposPE = () => {
    setRutPE("");
    setNombrePE("");
    setApellidoPE("");
    setVehiculoPE("");
    setModeloPE("");
    setColorPE("");
    setPatentePE("");
    setEmpresaPE("");
    setRolPE("");
    setObservacionesPE("");
    setGuiaDespachoPE("");
    setSelloPE("");
  }
  const limpiarCampo = (setState) => {
    setState("");
  };

  const handlePatenteChange = (event) => {
    const value = event.target.value.toUpperCase();
    setPatentePE(value);
  };


  return (
    <form onSubmit={(e) => {
      e.preventDefault(); // Evita que se recargue la página
      confirmIngreso();
    }}>
      <div className="container-form">
        <header>Marcar Entrada Personal Externo</header>
        <div className='error-div'>
          {mensajeEstado && (
            <span style={{ color: mensajeEstado === 'PROHIBIDO EL ACCESO' ? 'red' : 'orange', marginLeft: '10px', display: 'flex' }}>
              {mensajeEstado}
            </span>
          )}
        </div>
        <br></br>
        <div className="form first" style={{ paddingRight: "30px" }}>
          <div className="details personal">
            <span className="title">Datos Personal Externo</span>
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
                      value: RutPE,
                      id: "rutpe-input",
                      onChange: handleRutChange,
                    }}
                    onSuggestionSelected={onSuggestionSelected}
                  />
                  <IconButton color="primary" onClick={() => limpiarCampo(setRutPE)} aria-label="directions">
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>

              <div className="input-field">
                <label>Nombre</label>
                <div className="input-group">
                  <input required type="text" onChange={(event) => { setNombrePE(event.target.value); }} value={NombrePE} placeholder='Ingreso Nombre' className='form-control' id="nombrepe-input" name={NombrePE} />
                  <IconButton color="primary" onClick={() => limpiarCampo(setNombrePE)} aria-label="directions">
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>

              <div className="input-field">
                <label>Apellido</label>
                <div className="input-group">
                  <input required type="text" onChange={(event) => { setApellidoPE(event.target.value); }} value={ApellidoPE} placeholder='Ingrese Apellido' className='form-control' id="apellidope-input" name={ApellidoPE} />
                  <IconButton color="primary" onClick={() => limpiarCampo(setApellidoPE)} aria-label="directions">
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>


              <div className="input-field">
                <label>Empresa</label>
                <div className="input-group">
                  <input required type="text" onChange={(event) => { setEmpresaPE(event.target.value); }} value={EmpresaPE} placeholder='Ingrese Empresa' className='form-control' id="empresape-input" name={EmpresaPE} />
                  <IconButton color="primary" onClick={() => limpiarCampo(setEmpresaPE)} aria-label="directions">
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>

              <div className="input-field">
                <label>Rol</label>
                <div className="input-group">
                  <select required onChange={(event) => { setRolPE(event.target.value); }} className='select-form-control' value={RolPE} id="rolpe-input" name={RolPE}>
                    <option value="">Seleccionar una opción</option>
                    <option value="Especialista Trade">Especialista Trade</option>
                    <option value="Chofer Camión">Chofer Camión</option>
                    <option value="Peoneta">Peoneta</option>
                    <option value="Gestor Trade">Gestor Trade</option>
                    <option value="Mantencion Cctv">Mantencion Cctv</option>
                    <option value="Mantencion Gruas">Mantención Gruas</option>
                    <option value="Mantencion Jardines">Mantención Jardines</option>
                    <option value="Mantencion General">Mantencion General</option>
                    <option value="Mantencion Bresler">Mantencion Bresler</option>
                    <option value="Tecnico Fumigación">Tecnico Fumigación</option>
                    <option value="OtrosEx">Otros</option>
                  </select>
                  <IconButton color="primary" onClick={() => limpiarCampo(setRolPE)} aria-label="directions">
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
                  onChange={(event) => { setObservacionesPE(event.target.value); }}
                  value={ObservacionesPE}
                  placeholder='Ingrese Observaciones'
                  className='form-control'
                  id="obspe-input"
                  name={ObservacionesPE}
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
                  <input  type="text" className="form-control" onChange={(event) => { setVehiculoPE(event.target.value); }} value={VehiculoPE} placeholder='Ingrese Vehiculo' id="vehiculope-input" name={VehiculoPE} ></input>
                  <IconButton color="primary" onClick={() => limpiarCampo(setVehiculoPE)} aria-label="directions">
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>

              <div className="input-field">
                <label>Modelo</label>
                <div className="input-group">
                  <input  type="text" className="form-control" onChange={(event) => { setModeloPE(event.target.value); }} value={ModeloPE} placeholder='Ingrese Modelo' id="modelope-input" name={ModeloPE} ></input>
                  <IconButton color="primary" onClick={() => limpiarCampo(setModeloPE)} aria-label="directions">
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>

              <div className="input-field">
                <label>Patente</label>
                <div className="input-group">
                  <input  type="text" onChange={handlePatenteChange} value={PatentePE} placeholder='Ingrese Patente' className='form-control' id="patentepe-input" name={PatentePE} />
                  <IconButton color="primary" onClick={() => limpiarCampo(setPatentePE)} aria-label="directions">
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>

              <div className="input-field">
                <label>Color</label>
                <div className="input-group">
                  <input  type="text" onChange={(event) => { setColorPE(event.target.value); }} value={ColorPE} placeholder='Ingrese Color' className='form-control' id="colorpe-input" name={ColorPE} />
                  <IconButton color="primary" onClick={() => limpiarCampo(setColorPE)} aria-label="directions">
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>

              <div className="input-field">
                <label>Planilla Transporte</label>
                <div className="input-group">
                  <input type="text" onChange={(event) => { setGuiaDespachoPE(event.target.value); }} value={GuiaDespachoPE} placeholder='Ingrese Planilla Transporte' className='form-control' id="guiape-input" name={GuiaDespachoPE} />
                  <IconButton color="primary" onClick={() => limpiarCampo(setGuiaDespachoPE)} aria-label="directions">
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>

              <div className="input-field">
                <label>Sello</label>
                <div className="input-group">
                  <input type="text" onChange={(event) => { setSelloPE(event.target.value); }} value={SelloPE} placeholder='Ingrese Sello' className='form-control' id="selloca-input" name={SelloPE} />
                  <IconButton color="primary" onClick={() => limpiarCampo(setSelloPE)} aria-label="directions">
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
export default FormularioPersonalExterno;