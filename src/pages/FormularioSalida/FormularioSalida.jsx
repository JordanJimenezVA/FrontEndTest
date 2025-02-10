import "./formularioSalida.scss";
import React, { useState } from "react";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import { IconButton } from "@mui/material";
import useFormularioSalida from "./useFormularioSalida";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import Autosuggest from "react-autosuggest";
function FormularioSalida() {
  const host_server = import.meta.env.VITE_SERVER_HOST;

  const {
    formValues,
    handleInputChange,
    handleRutChange,
    limpiarCampo,
    rutValido,
    handleChange,
    empresas,
    suggestions,
    inputProps,
    mensajeEstado,
    actividadesPersonalExterno,
    actividadesPersonalInterno,
    handlePatenteChange,
    Salida,
    showTransporte,
    setShowTransporte,
    SalidaSinCamion,
    handleSuggestionSelected,
    getSuggestions,
    setSuggestions,
    setFormValues,
  } = useFormularioSalida(host_server);

  const toggleTransporte = () => {
    setShowTransporte((prevShow) => !prevShow);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        Salida();
      }}
    >
      <div className="container-form">
        <header>Marcar Salida Personal</header>
        <div className="error-div">
          {mensajeEstado && (
            <span
              style={{
                color:
                  mensajeEstado === "PROHIBIDO EL ACCESO" ? "red" : "orange",
                marginLeft: "10px",
                display: "flex",
              }}
            >
              {mensajeEstado}
            </span>
          )}
        </div>
        <br></br>
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
                    inputProps={{
                      placeholder: "Ingrese Rut",
                      value: formValues.RutP || "", 
                      onChange: (event, { newValue }) =>
                        handleRutChange(newValue),
                    }}
                    onSuggestionSelected={handleSuggestionSelected} // Lógica al seleccionar una sugerencia
                  />
                  <IconButton
                    color="primary"
                    onClick={() => limpiarCampo("RutP")}
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
                    onChange={handleInputChange}
                    value={formValues.NombreP}
                    placeholder="Ingreso Nombre"
                    className="form-control"
                    id="NombreP-input"
                    name={"NombreP"}
                  />
                  <IconButton
                    color="primary"
                    onClick={() => limpiarCampo("NombreP")}
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
                    onChange={handleInputChange}
                    value={formValues.ApellidoP}
                    placeholder="Ingrese Apellido"
                    className="form-control"
                    id="ApellidoP-input"
                    name={"ApellidoP"}
                  />
                  <IconButton
                    color="primary"
                    onClick={() => limpiarCampo("ApellidoP")}
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
                    name={"EmpresaP"}
                    className="select-form-control"
                    onChange={handleInputChange}
                    value={formValues.EmpresaP}
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
                    onClick={() => limpiarCampo("EmpresaP")}
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
                    onChange={handleChange}
                    className="select-form-control"
                    value={formValues.TipoPersona}
                    id="tipoPersona-input"
                    name={"tipoPersona"}
                  >
                    <option value="">Seleccionar</option>
                    <option value="PersonalInterno">Personal Interno</option>
                    <option value="PersonalExterno">Personal Externo</option>
                  </select>
                  <IconButton
                    color="primary"
                    onClick={() => limpiarCampo("tipoPersona")}
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
                    {(formValues.TipoPersona === "PersonalInterno"
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
                    onClick={() => limpiarCampo("ActividadP")}
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

              <div className="input-field">
                <div className="input-group"></div>
              </div>
            </div>
          </div>

          <div className="header-transporte">
            <div
              className="toggle-icon"
              onClick={(e) => {
                e.stopPropagation();
                toggleTransporte();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <span className="title-transporte">Datos Transporte </span>
              {showTransporte ? <BsChevronUp /> : <BsChevronDown />}
            </div>
            {showTransporte && (
              <>
                <div className="form first" style={{ paddingRight: "30px" }}>
                  <div className="fields">
                    <div className="input-field">
                      <label>Patente</label>
                      <div className="input-group">
                        <input
                          required={!!formValues.Tipo}
                          type="text"
                          onChange={(event) =>
                            handlePatenteChange(event, {
                              newValue: event.target.value,
                            })
                          }
                          value={formValues.Patente}
                          placeholder="Ingreso Patente"
                          className="form-control"
                          id="Patente-input"
                          name={"Patente"}
                        />
                        <IconButton
                          color="primary"
                          onClick={() => limpiarCampo("Patente")}
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
                          
                          onChange={handleChange}
                          className="select-form-control"
                          value={formValues.Tipo}
                          id="tipoca-input"
                          name="Tipo"
                        >
                          <option value="">Seleccionar una opción</option>
                          <option value="Vehiculo">Vehiculo</option>
                          <option value="Camion">Camion</option>
                        </select>
                        <IconButton
                          color="primary"
                          onClick={() => limpiarCampo("Tipo")}
                          aria-label="directions"
                        >
                          <ClearOutlinedIcon />
                        </IconButton>
                      </div>
                    </div>

                    {formValues.Tipo === "Camion" && (
                      <div className="input-field">
                        <label>Tipo Camion</label>
                        <div className="input-group">
                          <select
                            required
                            onChange={handleChange}
                            className="select-form-control"
                            value={formValues.Modelo}
                            id="tipoca-input"
                            name="Modelo"
                          >
                            <option value="">Seleccionar una opción</option>
                            <option value="SEMIREMOLQUE">SEMIREMOLQUE</option>
                            <option value="CAMION">CAMION</option>
                            <option value="TRACTOCAMION">TRACTOCAMION</option>
                            <option value="CHASIS CABINADO">
                              CHASIS CABINADO
                            </option>
                            <option value="REMOLQUE">REMOLQUE</option>
                            <option value="OtrosCA">Otros</option>
                          </select>
                          <IconButton
                            color="primary"
                            onClick={() => limpiarCampo("Modelo")}
                            aria-label="directions"
                          >
                            <ClearOutlinedIcon />
                          </IconButton>
                        </div>
                      </div>
                    )}

                    {formValues.Tipo === "Vehiculo" && (
                      <div className="input-field">
                        <label>Modelo</label>
                        <div className="input-group">
                          <input
                            required
                            type="text"
                            onChange={handleChange}
                            value={formValues.Modelo}
                            placeholder="Ingrese Modelo"
                            className="form-control"
                            id="modeloca-input"
                            name="Modelo"
                          />
                          <IconButton
                            color="primary"
                            onClick={() => limpiarCampo("Modelo")}
                            aria-label="directions"
                          >
                            <ClearOutlinedIcon />
                          </IconButton>
                        </div>
                      </div>
                    )}

                    <div className="input-field">
                      <label>Marca</label>
                      <div className="input-group">
                        <input
                          required
                          type="text"
                          onChange={handleChange}
                          value={formValues.Marca}
                          placeholder="Ingrese Marca"
                          className="form-control"
                          id="marcaca-input"
                          name="Marca"
                        />
                        <IconButton
                          color="primary"
                          onClick={() => limpiarCampo("Marca")}
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
                          onChange={handleChange}
                          value={formValues.Color}
                          placeholder="Ingrese Color"
                          className="form-control"
                          id="colorca-input"
                          name="Color"
                        />
                        <IconButton
                          color="primary"
                          onClick={() => limpiarCampo("Color")}
                          aria-label="directions"
                        >
                          <ClearOutlinedIcon />
                        </IconButton>
                      </div>
                    </div>

                    <div className="input-field">
                      <label>Guia Despacho</label>
                      <div className="input-group">
                        <input
                          required
                          type="text"
                          onChange={handleChange}
                          value={formValues.GuiaDS}
                          placeholder="Ingrese Guia Despacho"
                          className="form-control"
                          id="GuiaDS-input"
                          name="GuiaDS"
                        />
                        <IconButton
                          color="primary"
                          onClick={() => limpiarCampo("GuiaDS")}
                          aria-label="directions"
                        >
                          <ClearOutlinedIcon />
                        </IconButton>
                      </div>
                    </div>

                    <div className="input-field">
                      <label>Sello Salida</label>
                      <div className="input-group">
                        <input
                          required
                          type="text"
                          onChange={handleChange}
                          value={formValues.SelloSa}
                          placeholder="Ingrese Sello"
                          className="form-control"
                          id="SelloSa-input"
                          name="SelloSa"
                        />
                        <IconButton
                          color="primary"
                          onClick={() => limpiarCampo("SelloSa")}
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
              </>
            )}
          </div>

          <br></br>
        </div>

        <div className="buttons">
          <button className="sumbit-entrada">
            <span className="btnText">Marcar Salida</span>
            <i className="uil uil-navigator"></i>
          </button>
          {formValues.Patente && (
            <button
              type="button"
              className="sumbit-btncamion"
              onClick={SalidaSinCamion}
            >
              <span className="btnText">Marcar Salida sin Camion</span>
              <i className="uil uil-navigator"></i>
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
export default FormularioSalida;
