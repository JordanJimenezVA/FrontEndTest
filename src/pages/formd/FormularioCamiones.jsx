import './formularioD.scss';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import Axios, { } from "axios";
import Autosuggest from 'react-autosuggest';
import useChileanTime from "../../hooks/UseChileanTime";
import { useAuth } from '../../hooks/Auth';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { IconButton } from '@mui/material';
import GuardiaID from "../../hooks/GuardiaID";
const host_server = import.meta.env.VITE_SERVER_HOST;

function FormularioCamiones() {
  const { nombreUsuario } = useAuth();
  const chileanTime = useChileanTime();
  const [suggestions, setSuggestions] = useState([]);
  const [IDCA, setIDCA] = useState(0);
  const [ChoferCA, setChoferCA] = useState("");
  const [ApellidoChoferCA, setApellidoChoferCA] = useState("");
  const [RutCA, setRutCA] = useState("");
  const [PatenteCA, setPatenteCA] = useState("");
  const [PatenteRACA, setPatenteRACA] = useState("");
  const [MarcaCA, setMarcaCA] = useState("");
  const [TipoCA, setTipoCA] = useState("");
  const [ModeloCA, setModeloCA] = useState("");
  const [ColorCA, setColorCA] = useState("");
  const [EmpresaCA, setEmpresaCA] = useState("");
  const [ObservacionesCA, setObservacionesCA] = useState("");
  const [GuiaDespachoCA, setGuiaDespachoCA] = useState("");
  const [SelloCA, setSelloCA] = useState("");
  const [mensajeEstado, setMensajeEstado] = useState('');
  const [rutValido, setRutValido] = useState(true);
  const IDINST = GuardiaID();


  const handleRutChange = (event) => {
    const value = event.target.value.replace(/[^0-9kK]/g, '');
    const formattedValue = formatRut(value);
    setRutCA(formattedValue);
    if (formattedValue.length > 1) {
      setRutValido(validarRut(formattedValue));
    } else {
      setRutValido(true);
    }
  };

  const formatRut = (rut) => {
    if (rut.length <= 1) {
      return rut;
    }
    const body = rut.slice(0, -1);
    const dv = rut.slice(-1).toUpperCase();
    return `${body}-${dv}`;
  };

  const validarRut = (rut) => {
    if (!/^[0-9]+[-|‐][0-9kK]$/.test(rut)) return false;
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

  const getSuggestions = async (value) => {
    try {
      const response = await fetch(`${host_server}/FormularioCamiones/suggestions?query=${value}`);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const patente = data.results[0].map(obj => obj.PATENTECA);
        setSuggestions(patente);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error al obtener sugerencias:', error);
    }
  };


  const onSuggestionSelected = async (_, { suggestion }) => {
    try {
      const response = await Axios.get(`${host_server}/FormularioCamiones/suggestion/${suggestion}`);
      const data = response.data;

      setRutCA(data.RUTCA || ""),
        setChoferCA(data.CHOFERCA || ""),
        setApellidoChoferCA(data.APELLIDOCHOFERCA || ""),
        setPatenteCA(data.PATENTECA || ""),
        setPatenteRACA(data.PATENTERACA || ""),
        setMarcaCA(data.MARCACA || ""),
        setTipoCA(data.TIPOCA || ""),
        setModeloCA(data.MODELOCA || ""),
        setColorCA(data.COLORCA || ""),
        setEmpresaCA(data.EMPRESACA || ""),
        setObservacionesCA(data.OBSERVACIONESCA || ""),
        setGuiaDespachoCA(data.GUIADESPACHOCA || "")
      setSelloCA(data.SELLOCA || "")
    } catch (error) {
      console.error('Error al obtener sugerencias:', error);
    }
  };

  const inputProps = {
    placeholder: "INGRESE PATENTE",
    value: PatenteCA,
    onChange: (_, { newValue }) => setPatenteCA(newValue),
  };

  const ingresoformdCA = () => {
    if (!validarRut(RutCA)) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "RUT inválido. Por favor, ingrese un RUT válido.",
      });
      return;
    }
    Axios.post(`${host_server}/FormularioCamiones`, {
      ChoferCA: ChoferCA,
      ApellidoChoferCA: ApellidoChoferCA,
      RutCA: RutCA,
      PatenteCA: PatenteCA,
      PatenteRACA: PatenteRACA,
      MarcaCA: MarcaCA,
      TipoCA: TipoCA,
      ModeloCA: ModeloCA,
      ColorCA: ColorCA,
      EmpresaCA: EmpresaCA,
      ObservacionesCA: ObservacionesCA,
      GuiaDespachoCA: GuiaDespachoCA,
      SelloCA: SelloCA,
      fechaActualChile: chileanTime,
      NombreUsuarioCA: nombreUsuario,
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
          Axios.post(`${host_server}/FormularioCamiones`, {
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
            ignoreWarning: true, 
          })
            .then(() => {
              limpiarcamposCA();
              Swal.fire({
                title: 'Ingreso Exitoso!',
                icon: 'success',
                text: 'Camion ingresado con Exito',
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
        limpiarcamposCA();
        Swal.fire({
          title: 'Ingreso Exitoso!',
          icon: 'success',
          text: 'Camion ingresado con Exito',
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


  const limpiarcamposCA = () => {
    setChoferCA("");
    setApellidoChoferCA("");
    setRutCA("");
    setPatenteCA("");
    setPatenteRACA("");
    setMarcaCA("");
    setTipoCA("");
    setModeloCA("");
    setColorCA("");
    setEmpresaCA("");
    setObservacionesCA("");
    setGuiaDespachoCA("");
    setSelloCA("");
  }
  const limpiarCampo = (setState) => {
    setState("");
  };

  const handlePatenteChange = (event, { newValue }) => {
    if (newValue !== undefined) {
      setPatenteCA(newValue.toUpperCase());
    }
  };

  return (


    <form onSubmit={(e) => {
      e.preventDefault();
      if (mensajeEstado === 'PROHIBIDO EL ACCESO') {
        Swal.fire({
          icon: 'error',
          title: 'Prohibido el acceso',
          text: 'Este personal no tiene permitido el ingreso.',
        });
      } else {
        ingresoformdCA();
      }
    }}>

      <div className="container-form">
        <header>Marcar Entrada Camión</header>
        <br></br>
        <div className="form first" style={{ paddingRight: "30px" }}>
          <div className="details personal">
            <span className="title">Datos Camión</span>
            <div className="fields">
              <div className="input-field">

                <label>Patente</label>
                <div className='input-group'>

                  <Autosuggest

                    suggestions={suggestions}
                    onSuggestionsFetchRequested={({ value }) => getSuggestions(value)}
                    onSuggestionsClearRequested={() => setSuggestions([])}
                    getSuggestionValue={(suggestion) => suggestion}
                    renderSuggestion={(suggestion) => <div>{suggestion}</div>}
                    inputProps={{
                      placeholder: "INGRESE PATENTE",
                      value: PatenteCA,
                      id: "patenteca-input",
                      onChange: handlePatenteChange,
                    }}
                    onSuggestionSelected={onSuggestionSelected}
                  />
                  <IconButton color="primary" onClick={() => limpiarCampo(setPatenteCA)} aria-label="directions">
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>

              <div className="input-field">
                <label>Tipo</label>
                <div className="input-group">
                  <select required onChange={(event) => { setTipoCA(event.target.value); }} className='select-form-control' value={TipoCA} id="tipoca-input" name={TipoCA}>
                    <option value="">Seleccionar una opción</option>
                    <option value="SEMIREMOLQUE">SEMIREMOLQUE</option>
                    <option value="CAMION">CAMION</option>
                    <option value="TRACTOCAMION">TRACTOCAMION</option>
                    <option value="CHASIS CABINADO">CHASIS CABINADO</option>
                    <option value="REMOLQUE">REMOLQUE</option>
                    <option value="OtrosCA">Otros</option>
                  </select>
                  <IconButton color="primary" onClick={() => limpiarCampo(setTipoCA)} aria-label="directions">
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>



              <div className="input-field">
                <label>Modelo</label>
                <div className="input-group">
                  <input required type="text" onChange={(event) => { setModeloCA(event.target.value); }} value={ModeloCA} placeholder='INGRESE MODELO' className='form-control' id="modeloca-input" name={ModeloCA} />
                  <IconButton color="primary" onClick={() => limpiarCampo(setModeloCA)} aria-label="directions">
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>

              <div className="input-field">
                <label>Color</label>
                <div className="input-group">
                  <input required type="text" onChange={(event) => { setColorCA(event.target.value); }} value={ColorCA} placeholder='INGRESE COLOR' className='form-control' id="colorca-input" name={ColorCA} />
                  <IconButton color="primary" onClick={() => limpiarCampo(setColorCA)} aria-label="directions">
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>

              <div className="input-field">
                <label>Marca</label>
                <div className="input-group">
                  <input required type="text" onChange={(event) => { setMarcaCA(event.target.value); }} value={MarcaCA} placeholder='INGRESE MARCA' className='form-control' id="marcaca-input" name={MarcaCA} />
                  <IconButton color="primary" onClick={() => limpiarCampo(setMarcaCA)} aria-label="directions">
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>


              <div className="input-field">
                <label>Empresa</label>
                <div className="input-group">
                  <input required type="text" onChange={(event) => { setEmpresaCA(event.target.value); }} value={EmpresaCA} placeholder='INGRESE EMPRESA' className='form-control' id="empresape-input" name={EmpresaCA} />
                  <IconButton color="primary" onClick={() => limpiarCampo(setEmpresaCA)} aria-label="directions">
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
                    value={RutCA}
                    placeholder='INGRESE RUT'
                    id="rutca-input"
                    name={RutCA} >
                  </input>

                  <IconButton color="primary" onClick={() => limpiarCampo(setRutCA)} aria-label="directions">
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>

              <div className="input-field">
                <label>Nombre Chofer</label>
                <div className="input-group">
                  <input required type="text" className="form-control" onChange={(event) => { setChoferCA(event.target.value); }} value={ChoferCA} placeholder='INGRESE NOMBRE' id="choferca-input" name={ChoferCA} ></input>
                  <IconButton color="primary" onClick={() => limpiarCampo(setChoferCA)} aria-label="directions">
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>

              <div className="input-field">
                <label>Apellido Chofer</label>
                <div className="input-group">
                  <input required type="text" onChange={(event) => { setApellidoChoferCA(event.target.value); }} value={ApellidoChoferCA} placeholder='INGRESE APELLIDO' className='form-control' id="apellidoca-input" name={ApellidoChoferCA} />
                  <IconButton color="primary" onClick={() => limpiarCampo(setApellidoChoferCA)} aria-label="directions">
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
                  <input required type="text" onChange={(event) => { setGuiaDespachoCA(event.target.value); }} value={GuiaDespachoCA} placeholder='PLANILLA TRANSPORTE' className='form-control' id="guiaca-input" name={GuiaDespachoCA} />
                  <IconButton color="primary" onClick={() => limpiarCampo(setGuiaDespachoCA)} aria-label="directions">
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>

              <div className="input-field">
                <label>Sello</label>
                <div className="input-group">
                  <input type="text" onChange={(event) => { setSelloCA(event.target.value); }} value={SelloCA} placeholder='INGRESE SELLO' className='form-control' id="selloca-input" name={SelloCA} />
                  <IconButton color="primary" onClick={() => limpiarCampo(setSelloCA)} aria-label="directions">
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>

              <div className="input-field">
                <label>Patente Rampa</label>
                <div className="input-group">
                  <input required type="text"
                    onChange={(event) => { setPatenteRACA(event.target.value); }}
                    value={PatenteRACA}
                    placeholder='Ingrese RAMPA'
                    className='form-control'
                    id="patenteraca-input"
                    name={PatenteRACA}
                    style={{ textTransform: 'uppercase' }}
                  />
                  <IconButton color="primary" onClick={() => limpiarCampo(setPatenteRACA)} aria-label="directions">
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>

              <div className="input-field-obs">
                <label>Observaciones</label>
                <textarea type="text" required={mensajeEstado !== ''}
                  onChange={(event) => { setObservacionesCA(event.target.value); }}
                  value={ObservacionesCA}
                  placeholder='INGRESE OBSERVACIONES'
                  className='form-control'
                  id="obsca-input"
                  name={ObservacionesCA}
                />
              </div>

            </div>


          </div>

        </div>

        <div className="buttons">
          <button className="sumbit-entrada">
            <span className="btnText">Marcar Entrada</span>
            <i className="uil uil-navigator"></i>
          </button>
        </div>

      </div>



    </form >


  )
}
export default FormularioCamiones;