import React, { useState } from "react";
import Swal from "sweetalert2";
import Axios from "axios";
import { IconButton } from "@mui/material";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import validarYFormatearRut from "../../utils/rutUtils";
import Autosuggest from "react-autosuggest";
const host_server = import.meta.env.VITE_SERVER_HOST;

function AgregarPersonaReportada() {
  const [RUTP, setRUTP] = useState("");
  const [EstadoP, setEstadoP] = useState("");
  const [rutValido, setRutValido] = React.useState(true);
  const [suggestions, setSuggestions] = useState([]);

  const handleRutChange = (event, { newValue }) => {
    const { esValido, rutFormateado } = validarYFormatearRut(newValue);
    setRUTP(rutFormateado);
    setRutValido(esValido);
  };
  
  const handleSuggestionSelected = (_, { suggestion }) => {
    const { esValido, rutFormateado } = validarYFormatearRut(suggestion);
    setRUTP(rutFormateado);
    setRutValido(esValido);
  };

  const inputProps = {
    placeholder: "Ingrese Rut",
    value: RUTP,
    onChange: handleRutChange,
    className: `form-control ${rutValido ? '' : 'is-invalid'}`,
  };

  const getSuggestions = async (value) => {
    try {
      const response = await fetch(
        `${host_server}/RutSuggestion/suggestions?query=${value}`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const ruts = data.results[0].map((obj) => obj.RUTP);
        setSuggestions(ruts);
      } else {
        setSuggestions([]);
      }
    } catch (error) {}
  };

  const ingresoformdNG = () => {
    const { esValido } = validarYFormatearRut(RUTP);
    if (!esValido) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "RUT inválido. Por favor, ingrese un RUT válido.",
      });
      return;
    }
    Axios.put(`${host_server}/ReportarPersona`, {
      RUTP: RUTP,
      EstadoP: EstadoP,
    })
      .then((response) => {
        limpiarcamposNG();
        Swal.fire({
          title: "Reporte Exitoso!",
          icon: "success",
          text: "Persona Reportada con Exito",
          timer: 1500,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        const errorMessage =
          error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : "Error desconocido";
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: errorMessage,
        });
      });
  };

  const limpiarcamposNG = () => {
    setRUTP("");
    setEstadoP("");
  };

  const limpiarCampo = (setState) => {
    setState("");
  };

  return (
    <form
      className="form-ng"
      onSubmit={(e) => {
        e.preventDefault();
        ingresoformdNG();
      }}
    >
      <div className="container-form">
        <header>Reportar Persona</header>

        <div className="form first" style={{ paddingRight: "30px" }}>
          <div className="details personal">
            <span className="title">Datos Personal</span>
            <div className="fields">
              <div className="input-field">
                <label>Rut</label>
                <div className="input-group">
                  <Autosuggest
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={({ value }) =>
                      getSuggestions(value)
                    }
                    onSuggestionsClearRequested={() => setSuggestions([])}
                    getSuggestionValue={(suggestion) => suggestion}
                    renderSuggestion={(suggestion) => <div>{suggestion}</div>}
                    inputProps={inputProps}
                    onSuggestionSelected={handleSuggestionSelected}
                  />
                  <IconButton
                    color="primary"
                    onClick={() => limpiarCampo(setRUTP)}
                    aria-label="directions"
                  >
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>

              <div className="input-field">
                <label>Estado</label>
                <div className="input-group">
                  <select
                    required
                    onChange={(event) => {
                      setEstadoP(event.target.value);
                    }}
                    className="select-form-control"
                    value={EstadoP}
                    id="rolpi-input"
                    name={EstadoP}
                  >
                    <option value="">Seleccionar una opción</option>
                    <option value="PERMS1">Permiso con precaución</option>
                    <option value="PERMS2">Solicitar permiso</option>
                    <option value="NOACCESO">Prohibido el acceso</option>
                  </select>
                  <IconButton
                    color="primary"
                    onClick={() => limpiarCampo(setRolPI)}
                    aria-label="directions"
                  >
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>

              <div className="input-field">
                <div className="input-group"></div>
              </div>
            </div>
          </div>

          <div className="buttons">
            <button className="sumbit-entrada">
              <span className="btnText">Reportar Persona</span>
              <i className="uil uil-navigator"></i>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
export default AgregarPersonaReportada;
