import Swal from "sweetalert2";
import Axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { IconButton } from "@mui/material";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import useInstalacion from "../../hooks/useInstalacion";

const host_server = import.meta.env.VITE_SERVER_HOST;

function EditarUsuario() {
  const { RUTU } = useParams();
  const [rutValido, setRutValido] = React.useState(true);
  const { instalaciones, error } = UseInstalacion(host_server);

  const [formValues, setFormValues] = useState({
    RUTU: "",
    NombreU: "",
    TipoU: "",
    PasswordU: "",
    InstalacionU: "",
    EstadoU: "",
  });

  useEffect(() => {
    getUsuarios(RUTU);
}, [RUTU]);

  const getUsuarios = (RUTU) => {
    Axios.get(`${host_server}/EditarUsuarios/${RUTU}`)
      .then((res) => {
        const { RUTU, NombreU, TipoU, PasswordU, InstalacionU, EstadoU } =
          res.data[0];
        setFormValues({
          RUTU: RUTU || "",
          NombreU: NombreU || "",
          TipoU: TipoU || "",
          PasswordU: PasswordU || "",
          InstalacionU: InstalacionU || "",
          EstadoU: EstadoU || "",
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
      RUTU: "",
      NombreU: "",
      TipoU: "",
      PasswordU: "",
      InstalacionU: "",
      EstadoU: "",
    });
  };

  const limpiarCampo = (campo) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [campo]: "",
    }));
  };

  const editarUsuario = () => {
    Axios.put(`${host_server}/EditarUsuario/${RUTU}`, {
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
      className="form-ng"
      onSubmit={(e) => {
        e.preventDefault();
        editarUsuario();
      }}
    >
      <div className="container-form">
        <header>Editar Usuario</header>

        <div className="form first" style={{ paddingRight: "30px" }}>
          <div className="details personal">
            <span className="title">Datos Usuario</span>
            <div className="fields">
              <div className="input-field">
                <label>Rut</label>
                <div className="input-group">
                  <input
                    required
                    disabled
                    type="text"
                    onChange={handleChange}
                    value={formValues.RUTU}
                    placeholder="Ingreso Rut"
                    className={`form-control ${rutValido ? "" : "is-invalid"}`}
                    id="rutu-input"
                    name={"RUTU"}
                  />
                </div>
              </div>

              <div className="input-field">
                <label>Nombre Usuario</label>
                <div className="input-group">
                  <input
                    required
                    type="text"
                    className="form-control"
                    onChange={handleChange}
                    value={formValues.NombreU}
                    placeholder="Ingrese Nombre"
                    id="NombreU-input"
                    name={"NombreU"}
                  ></input>
                  <IconButton
                    color="primary"
                    onClick={() => limpiarCampo("NombreU")}
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
                    onChange={handleChange}
                    className="select-form-control"
                    value={formValues.TipoU}
                    id="TipoU-input"
                    name={"TipoU"}
                  >
                    <option value="">Seleccionar una opción</option>
                    <option value="Guardia">Guardia</option>
                    <option value="Supervisor">Supervisor</option>
                    <option value="Administrador">Administrador</option>
                  </select>
                  <IconButton
                    color="primary"
                    onClick={() => limpiarCampo("TipoU")}
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
                    onChange={handleChange}
                    value={formValues.PasswordU}
                    placeholder="Ingrese Password"
                    id="PasswordU-input"
                    name={"PasswordU"}
                  ></input>
                  <IconButton
                    color="primary"
                    onClick={() => limpiarCampo("PasswordU")}
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
                    onChange={handleChange}
                    className="select-form-control"
                    value={formValues.InstalacionU}
                    id="InstalacionU-input"
                    name={"InstalacionU"}
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
                    onClick={() => limpiarCampo("InstalacionU")}
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
                    onChange={handleChange}
                    className="select-form-control"
                    value={formValues.EstadoU}
                    id="EstadoU-input"
                    name={"EstadoU"}
                  >
                    <option value="ACTIVO">Activo</option>
                    <option value="NO ACTIVO">Dar de baja</option>
                  </select>
                  <IconButton
                    color="primary"
                    onClick={() => limpiarCampo("InstalacionU")}
                    aria-label="directions"
                  >
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
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

export default EditarUsuario;
