import React, { useState } from "react";
import Swal from "sweetalert2";
import Axios from "axios";
import { IconButton } from "@mui/material";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import validarYFormatearRut from "../../utils/rutUtils.js";
import UseInstalacion from "../../hooks/useInstalacion.tsx";
const host_server = import.meta.env.VITE_SERVER_HOST;

function AgregarUsuario() {
  const [RUTU, setRUTU] = useState("");
  const [NombreU, setNombreU] = useState("");
  const [TipoU, setTipoU] = useState("");
  const [PasswordU, setPasswordU] = useState("");
  const [InstalacionU, setInstalacionU] = useState("");
  const [EstadoU, setEstadoU] = useState("");
  const [rutValido, setRutValido] = React.useState(true);
  const { instalaciones, error } = UseInstalacion(host_server);
  const [showPassword, setShowPassword] = useState(false);

  const handleRutChange = (event) => {
    const rutInput = event.target.value;
    const { esValido, rutFormateado } = validarYFormatearRut(rutInput);
    setRUTU(rutFormateado);
    setRutValido(esValido);
  };

  const ingresoformdU = () => {
    if (!rutValido) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "RUT inválido. Por favor, ingrese un RUT válido.",
      });
      return;
    }
    Axios.post(`${host_server}/AgregarUsuario`, {
      RUTU: RUTU,
      NombreU: NombreU,
      TipoU: TipoU,
      PasswordU: PasswordU,
      InstalacionU: InstalacionU,
      EstadoU: EstadoU,
    })
      .then((response) => {
        limpiarcamposU();
        Swal.fire({
          title: "Ingreso Exitoso!",
          icon: "success",
          text: "Usuario ingresado con Exito",
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

  const limpiarcamposU = () => {
    setRUTU(""),
      setNombreU(""),
      setTipoU(""),
      setPasswordU(""),
      setInstalacionU(""),
      setEstadoU("");
  };

  const limpiarCampo = (setState) => {
    setState("");
  };

  return (
    <form
      className="form-ng"
      onSubmit={(e) => {
        e.preventDefault();
        ingresoformdU();
      }}
    >
      <div className="container-form">
        <header>Registrar Usuario</header>

        <div className="form first" style={{ paddingRight: "30px" }}>
          <div className="details personal">
            <span className="title">Datos Usuario</span>
            <div className="fields">
              <div className="input-field">
                <label>Rut</label>
                <div className="input-group">
                  <input
                    required
                    type="text"
                    onChange={(event) =>
                      handleRutChange(event, { newValue: event.target.value })
                    }
                    value={RUTU}
                    placeholder="Ingreso Rut"
                    className={`form-control ${rutValido ? "" : "is-invalid"}`}
                    id="RUTU-input"
                    name={RUTU}
                  />
                  <IconButton
                    color="primary"
                    onClick={() => limpiarCampo(setRUTU)}
                    aria-label="directions"
                  >
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>

              <div className="input-field">
                <label>Nombre Usuario</label>
                <div className="input-group">
                  <input
                    required
                    type="text"
                    className="form-control"
                    onChange={(event) => {
                      setNombreU(event.target.value);
                    }}
                    value={NombreU}
                    placeholder="Ingrese Nombre"
                    id="nombreu-input"
                    name={NombreU}
                  ></input>
                  <IconButton
                    color="primary"
                    onClick={() => limpiarCampo(setNombreU)}
                    aria-label="directions"
                  >
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>

              <div className="input-field">
                <label>Tipo Usuario</label>
                <div className="input-group">
                  <select
                    required
                    onChange={(event) => {
                      setTipoU(event.target.value);
                    }}
                    className="select-form-control"
                    value={TipoU}
                    id="tipou-input"
                    name={TipoU}
                  >
                    <option value="">Seleccionar una opción</option>
                    <option value="Guardia">Guardia</option>
                    <option value="Supervisor">Supervisor</option>
                    <option value="Administrador">Administrador</option>
                  </select>
                  <IconButton
                    color="primary"
                    onClick={() => limpiarCampo(setTipoU)}
                    aria-label="directions"
                  >
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>

              <div className="input-field">
                <label>Password</label>
                <div className="input-group">
                  <input
                    required
                    type="text"
                    className="form-control"
                    onChange={(event) => {
                      setPasswordU(event.target.value);
                    }}
                    value={PasswordU}
                    placeholder="Ingrese Password"
                    id="passwordu-input"
                    name={PasswordU}
                  ></input>
                  <IconButton
                    color="primary"
                    onClick={() => limpiarCampo(setPasswordU)}
                    aria-label="directions"
                  >
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>

              <div className="input-field">
                <label>Instalacion</label>
                <div className="input-group">
                  <select
                    required
                    onChange={(event) => {
                      setInstalacionU(event.target.value);
                    }}
                    className="select-form-control"
                    value={InstalacionU}
                    id="idinst-input"
                    name={InstalacionU}
                  >
                    <option value="">Seleccionar una opción</option>
                    {instalaciones.map((instalacion) => (
                      <option key={instalacion.IDI} value={instalacion.IDI}>
                        {instalacion.Nombre}
                      </option>
                    ))}
                  </select>
                  <IconButton
                    color="primary"
                    onClick={() => limpiarCampo(setInstalacionU)}
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
              <span className="btnText">Registrar Usuario</span>
              <i className="uil uil-navigator"></i>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
export default AgregarUsuario;
