import React, { useState } from "react";
import Swal from "sweetalert2";
import Axios from "axios";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import { IconButton } from "@mui/material";
import useEmpresas from "../../hooks/useEmpresas";
const host_server = import.meta.env.VITE_SERVER_HOST;

function AgregarTransporte() {
  const [PATENTE, setPATENTE] = useState("");
  const [PatenteR, setPatenteR] = useState("");
  const [Tipo, setTipo] = useState("");
  const [Modelo, setModelo] = useState("");
  const [Marca, setMarca] = useState("");
  const [Color, setColor] = useState("");
  const [Empresa, setEmpresa] = useState("");
  const { empresas, error } = useEmpresas(host_server);

  const ingresoformdCA = () => {
    Axios.post(`${host_server}/AgregarTransporte`, {
      PATENTE: PATENTE,
      PatenteR: PatenteR,
      Tipo: Tipo,
      Modelo: Modelo,
      Marca: Marca,
      Color: Color,
      Empresa: Empresa,
    })
      .then(() => {
        limpiarCamposCA();
        Swal.fire({
          title: "Ingreso Exitoso!",
          icon: "success",
          text: "Transporte ingresado con Exito",
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

  const limpiarCamposCA = () => {
    setPATENTE("");
    setPatenteR("");
    setTipo("");
    setModelo("");
    setMarca("");
    setColor("");
    setEmpresa("");
  };

  const limpiarCampo = (setState) => {
    setState("");
  };

  const handlePatenteChange = (event) => {
    const value = event.target.value.toUpperCase();
    setPATENTE(value);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        ingresoformdCA();
      }}
    >
      <div className="container-form">
        <header>Registro Transporte</header>
        <br></br>
        <div className="form first" style={{ paddingRight: "30px" }}>
          <div className="details personal">
            <span className="title">Datos Transporte</span>
            <div className="fields">
              <div className="input-field">
                <label>Patente</label>
                <div className="input-group">
                  <input
                    required
                    type="text"
                    onChange={handlePatenteChange}
                    value={PATENTE}
                    placeholder="Ingrese Patente"
                    className="form-control"
                    id="patenteca-input"
                    name={PATENTE}
                  />
                  <IconButton
                    color="primary"
                    onClick={() => limpiarCampo(setPATENTE)}
                    aria-label="directions"
                  >
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>
              <div className="input-field">
                <label>Tipo Transporte</label>
                <div className="input-group">
                  <select
                    required
                    onChange={(event) => setTipo(event.target.value)}
                    className="select-form-control"
                    value={Tipo}
                    id="tipoca-input"
                    name={Tipo}
                  >
                    <option value="">Seleccionar una opción</option>
                    <option value="Vehiculo">Vehiculo</option>
                    <option value="Camion">Camion</option>
                  </select>
                  <IconButton
                    color="primary"
                    onClick={() => limpiarCampo(setTipo)}
                    aria-label="directions"
                  >
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>
              {Tipo === "Camion" && (
                <div className="input-field">
                  <label>Tipo Camion</label>
                  <div className="input-group">
                    <select
                      required
                      onChange={(event) => {
                        setModelo(event.target.value);
                      }}
                      className="select-form-control"
                      value={Modelo}
                      id="tipoca-input"
                      name={Modelo}
                    >
                      <option value="">Seleccionar una opción</option>
                      <option value="SEMIREMOLQUE">SEMIREMOLQUE</option>
                      <option value="CAMION">CAMION</option>
                      <option value="TRACTOCAMION">TRACTOCAMION</option>
                      <option value="CHASIS CABINADO">CHASIS CABINADO</option>
                      <option value="REMOLQUE">REMOLQUE</option>
                      <option value="OtrosCA">Otros</option>
                    </select>
                    <IconButton
                      color="primary"
                      onClick={() => limpiarCampo(setModelo)}
                      aria-label="directions"
                    >
                      <ClearOutlinedIcon />
                    </IconButton>
                  </div>
                </div>
              )}
              {Tipo === "Vehiculo" && (
                <div className="input-field">
                  <label>Modelo</label>
                  <div className="input-group">
                    <input
                      required
                      type="text"
                      onChange={(event) => {
                        setModelo(event.target.value);
                      }}
                      value={Modelo}
                      placeholder="Ingrese Modelo"
                      className="form-control"
                      id="modeloca-input"
                      name={Modelo}
                    />
                    <IconButton
                      color="primary"
                      onClick={() => limpiarCampo(setModelo)}
                      aria-label="directions"
                    >
                      <ClearOutlinedIcon />
                    </IconButton>
                  </div>
                </div>
              )}

              <div className="input-field">
                <label>Patente Rampa</label>
                <div className="input-group">
                  <input
                    required
                    type="text"
                    onChange={(event) => {
                      setPatenteR(event.target.value);
                    }}
                    value={PatenteR}
                    placeholder="Ingrese Patente Rampa"
                    className="form-control"
                    id="PatenteR-input"
                    name={PatenteR}
                  />
                  <IconButton
                    color="primary"
                    onClick={() => limpiarCampo(setPatenteR)}
                    aria-label="directions"
                  >
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>

              <div className="input-field">
                <label>Marca</label>
                <div className="input-group">
                  <input
                    required
                    type="text"
                    onChange={(event) => {
                      setMarca(event.target.value);
                    }}
                    value={Marca}
                    placeholder="Ingrese Marca"
                    className="form-control"
                    id="marcaca-input"
                    name={Marca}
                  />
                  <IconButton
                    color="primary"
                    onClick={() => limpiarCampo(setMarca)}
                    aria-label="directions"
                  >
                    <ClearOutlinedIcon />
                  </IconButton>
                </div>
              </div>

              <div className="input-field">
                <label>Color</label>
                <div className="input-group">
                  <input
                    required
                    type="text"
                    onChange={(event) => {
                      setColor(event.target.value);
                    }}
                    value={Color}
                    placeholder="Ingrese Color"
                    className="form-control"
                    id="colorca-input"
                    name={Color}
                  />
                  <IconButton
                    color="primary"
                    onClick={() => limpiarCampo(setColor)}
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
                      setEmpresa(event.target.value);
                    }}
                    value={Empresa}
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
              <div className="input-field"></div>
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
export default AgregarTransporte;
