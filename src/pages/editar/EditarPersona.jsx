import Swal from "sweetalert2";
import Axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { IconButton } from "@mui/material";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import useEmpresas from "../../hooks/useEmpresas";
import {
  actividadesPersonalExterno,
  actividadesPersonalInterno,
} from "../../utils/actividadesConfig.js";
const host_server = import.meta.env.VITE_SERVER_HOST;

function EditarPE() {
  const { RUTP } = useParams();
  const [rutValido, setRutValido] = React.useState(true);
  const { empresas, error } = useEmpresas(host_server);
  const [tipoPersona, setTipoPersona] = useState("");
  const [formValues, setFormValues] = useState({
    RUTP: "",
    NombreP: "",
    ApellidoP: "",
    ActividadP: "",
    EmpresaP: "",
    ComentarioP: "",
    tipoPersona: "",
    EstadoP: "",
  });

  useEffect(() => {
    Axios.get(`${host_server}/EditarPersonal/${RUTP}`)
      .then((res) => {
        const {
          RUTP,
          NombreP,
          ApellidoP,
          ActividadP,
          EmpresaP,
          ComentarioP,
          EstadoP,
        } = res.data[0];
        const tipoPersona = actividadesPersonalInterno.includes(ActividadP)
        ? "PersonalInterno"
        : actividadesPersonalExterno.includes(ActividadP)
        ? "PersonalExterno"
        : ""; // Puedes establecer un valor por defecto aquí si es necesario

        setFormValues({
          RUTP: RUTP || "",
          NombreP: NombreP || "",
          ApellidoP: ApellidoP || "",
          ActividadP: ActividadP || "",
          EmpresaP: EmpresaP || "",
          ComentarioP: ComentarioP || "",
          tipoPersona: tipoPersona, // Asignar el tipo de persona calculado
          EstadoP: EstadoP || "",
        });
        setTipoPersona(tipoPersona);
      })
      .catch((error) => {
        console.error("Error al obtener registros:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error al obtener registros, intente nuevamente más tarde",
        });
      });
  }, [RUTP]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const limpiarCampos = () => {
    setFormValues({
      RUTP: "",
      NombreP: "",
      ApellidoP: "",
      ActividadP: "",
      EmpresaP: "",
      ComentarioP: "",
      EstadoP: "",
    });
  };

  const limpiarCampo = (campo) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [campo]: "",
    }));
  };

  const editarPE = () => {
    Axios.put(`${host_server}/EditarPersonal/${RUTP}`, {
      ...formValues,
    })
      .then(() => {
        limpiarCampos();
        Swal.fire({
          title: "Modificación Exitosa!",
          icon: "success",
          text: "Modificación realizada correctamente",
          timer: 1500,
        });
      })
      .catch((error) => {
        console.error("Error al modificar:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error al modificar, intente nuevamente más tarde",
        });
      });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        editarPE();
      }}
    >
      <div className="container-form">
        <header>Editar Persona</header>
        <div className="error-div"></div>
        <br></br>
        <div className="form first" style={{ paddingRight: "30px" }}>
          <div className="details personal">
            <span className="title">Datos Persona</span>
            <div className="fields">
              <div className="input-field">
                <label htmlFor="RUTP-input">Rut</label>
                <div className="input-group">
                  <input
                    disabled
                    type="text"
                    onChange={handleChange}
                    value={formValues.RUTP}
                    placeholder="Ingreso Rut"
                    className={`form-control ${rutValido ? "" : "is-invalid"}`}
                    id="RUTP-input"
                    name={"RUTP"}
                  />
                </div>
              </div>

              <div className="input-field">
                <label>Nombre</label>
                <div className="input-group">
                  <input
                    required
                    type="text"
                    onChange={handleChange}
                    value={formValues.NombreP}
                    placeholder="Ingreso Nombre"
                    className="form-control"
                    id="NombreP-input"
                    name={"NombreP"}
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
                    onChange={handleChange}
                    value={formValues.ApellidoP}
                    placeholder="Ingrese Apellido"
                    className="form-control"
                    id="ApellidoP-input"
                    name={"ApellidoP"}
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
                    name="EmpresaP"
                    value={formValues.EmpresaP}
                    onChange={handleChange}
                    className="select-form-control"
                    required
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
                    onClick={() => limpiarCampo()}
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
                    className="select-form-control"
                    onChange={handleChange}
                    value={formValues.tipoPersona}
                    id="tipoPersona-input"
                    name={"tipoPersona"}
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
                    name="ActividadP"
                    className="select-form-control"
                    value={formValues.ActividadP}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccionar una actividad</option>
                    {(formValues.tipoPersona === "PersonalInterno"
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
                  onChange={handleChange}
                  value={formValues.ComentarioP}
                  placeholder=""
                  className="form-control"
                  id="ob-input"
                  name={"ComentarioP"}
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

export default EditarPE;
