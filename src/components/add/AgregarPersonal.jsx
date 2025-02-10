import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Axios from "axios";
import { IconButton } from "@mui/material";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import validarYFormatearRut from  "../../utils/rutUtils.js"
import {
  actividadesPersonalExterno,
  actividadesPersonalInterno,
} from "../../utils/actividadesConfig.js";
import useEmpresas from "../../hooks/useEmpresas";
const host_server = import.meta.env.VITE_SERVER_HOST;

function AgregarPersonal() {
  const [RUTP, setRUTP] = useState("");
  const [NombreP, setNombreP] = useState("");
  const [ApellidoP, setApellidoP] = useState("");
  const [ActividadP, setActividadP] = useState("");
  const [ComentarioP, setComentarioP] = useState("");
  const [rutValido, setRutValido] = React.useState(true);
  const [tipoPersona, setTipoPersona] = useState("");
  const [EmpresaP, setEmpresaP] = useState("");
  const { empresas, error } = useEmpresas(host_server);

  const handleRutChange = (event) => {
    const rutInput = event.target.value; 
    const { esValido, rutFormateado } = validarYFormatearRut(rutInput); 
    setRUTP(rutFormateado); 
    setRutValido(esValido); 
  };
  
  const ingresoformP = () => {

    if (!rutValido) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "RUT inválido. Por favor, ingrese un RUT válido.",
      });
      return;
    }
    Axios.post(`${host_server}/AgregarPersonal`, {
      RUTP: RUTP,
      NombreP: NombreP,
      ApellidoP: ApellidoP,
      ActividadP: ActividadP,
      EmpresaP: EmpresaP,
      ComentarioP: ComentarioP,
    })
      .then(() => {
        limpiarCampos();
        Swal.fire({
          title: "Ingreso Exitoso!",
          icon: "success",
          text: "Persona Ingresada con Exito",
          timer: 1500,
        });
      })
      .catch(function (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text:
            JSON.parse(JSON.stringify(error)).message === "Network Error"
              ? "Intente mas tarde"
              : JSON.parse(JSON.stringify(error)),
        });
      });
  };

  const limpiarCampos = () => {
    setRUTP("");
    setNombreP("");
    setApellidoP("");
    setActividadP("");
    setEmpresaP("");
    setComentarioP("");
    setTipoPersona("");
  };

  const limpiarCampo = (setState) => {
    setState("");
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        ingresoformP();
      }}
    >
      <div className="container-form">
        <header>Registrar Personal</header>
        <div className="error-div"></div>
        <br></br>
        <div className="form first" style={{ paddingRight: "30px" }}>
          <div className="details personal">
            <span className="title">Datos Personal</span>
            <div className="fields">
              <div className="input-field">
                <label htmlFor="RUTP-input">Rut</label>
                <div className="input-group">
                  <input
                    required
                    type="text"
                    onChange={(event) =>
                      handleRutChange(event, { newValue: event.target.value })
                    }
                    value={RUTP}
                    placeholder="Ingreso Rut"
                    className={`form-control ${rutValido ? "" : "is-invalid"}`}
                    id="RUTP-input"
                    name={RUTP}
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
                <label>Nombre</label>
                <div className="input-group">
                  <input
                    required
                    type="text"
                    onChange={(event) => {
                      setNombreP(event.target.value);
                    }}
                    value={NombreP}
                    placeholder="Ingreso Nombre"
                    className="form-control"
                    id="NombreP-input"
                    name={NombreP}
                  />
                  <IconButton
                    color="primary"
                    onClick={() => limpiarCampo(setNombreP)}
                    aria-label="directions"
                  >
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>

              <div className="input-field">
                <label>Apellido</label>
                <div className="input-group">
                  <input
                    required
                    type="text"
                    onChange={(event) => {
                      setApellidoP(event.target.value);
                    }}
                    value={ApellidoP}
                    placeholder="Ingrese Apellido"
                    className="form-control"
                    id="ApellidoP-input"
                    name={ApellidoP}
                  />
                  <IconButton
                    color="primary"
                    onClick={() => limpiarCampo(setApellidoP)}
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
                    onChange={(event) => {
                      setEmpresaP(event.target.value);
                    }}
                    value={EmpresaP}
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

              <div className="input-field">
                <label>Rol</label>
                <div className="input-group">
                  <select
                    required
                    onChange={(event) => {
                      setTipoPersona(event.target.value);
                    }}
                    className="select-form-control"
                    value={tipoPersona}
                    id="tipoPersona-input"
                    name={tipoPersona}
                  >
                    <option value="">Seleccionar</option>
                    <option value="PersonalInterno">Personal Interno</option>
                    <option value="PersonalExterno">Personal Externo</option>
                  </select>
                  <IconButton
                    color="primary"
                    onClick={() => limpiarCampo(setTipoPersona)}
                    aria-label="directions"
                  >
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>

              <div className="input-field">
                <label>Actividad</label>
                <div className="input-group">
                  <select
                    required
                    className="select-form-control"
                    onChange={(e) => setActividadP(e.target.value)}
                    value={ActividadP}
                  >
                    <option value="">Seleccionar una actividad</option>
                    {(tipoPersona === "PersonalInterno"
                      ? actividadesPersonalInterno
                      : actividadesPersonalExterno
                    ).map((actividad) => (
                      <option key={actividad} value={actividad}>
                        {actividad}
                      </option>
                    ))}
                  </select>
                  <IconButton
                    color="primary"
                    onClick={() => limpiarCampo(setActividadP)}
                    aria-label="directions"
                  >
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>
            </div>

            <div className="input-field">
              <div className="input-field-obs">
                <label>Comentario</label>
                <textarea
                  type="text"
                  required
                  onChange={(event) => {
                    setComentarioP(event.target.value);
                  }}
                  value={ComentarioP}
                  placeholder=""
                  className="form-control"
                  id="ob-input"
                  name={ComentarioP}
                />
              </div>
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
export default AgregarPersonal;
