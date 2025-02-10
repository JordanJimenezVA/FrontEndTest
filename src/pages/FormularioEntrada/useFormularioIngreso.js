import { useState } from "react";
import Axios from "axios";
import validarYFormatearRut from "../../utils/rutUtils.js";
import {
  actividadesPersonalExterno,
  actividadesPersonalInterno,
} from "../../utils/actividadesConfig.js";
import useEmpresas from "../../hooks/useEmpresas";
import useChileanTime from "../../hooks/useChileanTime";
import Swal from "sweetalert2";
import React from "react";

export default function useFormularioIngreso(host_server) {
  const  chileanTime  = useChileanTime();
  const [rutValido, setRutValido] = React.useState(true);
  const [mensajeEstado, setMensajeEstado] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsTrasnporte, setSuggestionsTransporte] = useState([]);
  const { empresas, error } = useEmpresas(host_server);
  const nombreUsuario = localStorage.getItem("nombreUsuario") || "";
  const instalacionU = localStorage.getItem("instalacionU") || "";
  const rutu = localStorage.getItem("rut") || "";

  const [formValues, setFormValues] = useState({
    RUTP: "",
    NombreP: "",
    ApellidoP: "",
    ActividadP: "",
    EmpresaP: "",
    ComentarioP: "",
    tipoPersona: "",
    EstadoP: "",
    PATENTE: "",
    PatenteR: "",
    Tipo: "",
    Modelo: "",
    Marca: "",
    Color: "",
    GuiaDE: "",
    SelloEn: "",
    instalacionU,
    rutu,
    fechaActualChile: chileanTime
  });


  const handlePatenteChange = (value) => {
    const uppercasedValue = value.toUpperCase();
    setFormValues((prevValues) => ({
      ...prevValues,
      PATENTE: uppercasedValue,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleRutChange = (event, { newValue }) => {
    const { esValido, rutFormateado } = validarYFormatearRut(newValue);
    setFormValues((prevValues) => ({
      ...prevValues,
      RUTP: rutFormateado,
    }));
    setRutValido(esValido);
  };

  const inputProps = {
    placeholder: "Ingrese Rut",
    value: formValues.RUTP,
    onChange: handleRutChange,
    className: `form-control ${rutValido ? "" : "is-invalid"}`,
  };

  const inputPropsTransporte = {
    placeholder: "Ingrese Patente",
    value: formValues.PATENTE,
    onChange: (event, { newValue }) => handlePatenteChange(newValue),
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const getSuggestionsTransporte = async (value) => {
    try {
      const response = await fetch(
        `${host_server}/PatenteSuggestion/suggestions?query=${value}`
      );
      const data = await response.json();
      const patentes = data.results?.[0].map((obj) => obj.PATENTE) || [];
      setSuggestionsTransporte(patentes);
    } catch (error) {
      console.error("Error obteniendo sugerencias:", error);
    }
  };

  const handleSuggestionSelectedTransporte = async (_, { suggestion }) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      PATENTE: suggestion,
    }));
    try {
      const response = await Axios.get(
        `${host_server}/PatenteSuggestion/suggestion/${suggestion}`
      );
      const data = response.data;

      setFormValues((prevValues) => ({
        ...prevValues,
        PatenteR: data.PatenteR || "",
        Tipo: data.Tipo || "",
        Modelo: data.Modelo || "",
        Marca: data.Marca || "",
        Color: data.Color || "",
      }));
    } catch (error) {
      console.error("Error al obtener datos de la Patente:", error);
    }
  };

  const getSuggestions = async (value) => {
    try {
      const response = await fetch(
        `${host_server}/RutSuggestion/suggestions?query=${value}`
      );
      const data = await response.json();
      const ruts = data.results?.[0].map((obj) => obj.RUTP) || [];
      setSuggestions(ruts);
    } catch (error) {
      console.error("Error obteniendo sugerencias:", error);
    }
  };

  const handleSuggestionSelected = async (_, { suggestion }) => {
    const { esValido, rutFormateado } = validarYFormatearRut(suggestion);
    setFormValues((prevValues) => ({
      ...prevValues,
      RUTP: rutFormateado,
    }));
    setRutValido(esValido);
    if (esValido) {
      try {
        const response = await Axios.get(
          `${host_server}/RutSuggestion/suggestion/${rutFormateado}`
        );
        const data = response.data;
        const tipoPersona = actividadesPersonalInterno.includes(data.ActividadP)
          ? "PersonalInterno"
          : actividadesPersonalExterno.includes(data.ActividadP)
          ? "PersonalExterno"
          : "";
        setFormValues((prevValues) => ({
          ...prevValues,
          NombreP: data.NombreP || "",
          ApellidoP: data.ApellidoP || "",
          ActividadP: data.ActividadP || "",
          EmpresaP: data.EmpresaP || "",
          ComentarioP: data.ComentarioP || "",
          EstadoP: data.EstadoP || "",
          tipoPersona: tipoPersona,
        }));
      } catch (error) {
        console.error("Error al obtener datos del RUT:", error);
      }
    }
  };

  const confirmIngreso = () => {
    if (mensajeEstado) {
      Swal.fire({
        title: "¿Estás seguro del ingreso de esta persona?",
        text: "Esta persona tiene el estado: " + mensajeEstado,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, ingresar",
        cancelButtonText: "No, cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          ingresoformdPE();
        }
      });
    } else {
      ingresoformdPE();
    }
  };

  const ingresoformdPE = (ignoreWarning = false) => {
    const { esValido } = validarYFormatearRut(formValues.RUTP);
  
    if (!esValido) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "RUT inválido. Por favor, ingrese un RUT válido.",
      });
      return;
    }
  
    Axios.post(`${host_server}/FormularioPersonalExterno`, {
      ...formValues,
      fechaActualChile: chileanTime,
      instalacionU,
      ignoreWarning, // Se envía el parámetro ignoreWarning
      NombreU: nombreUsuario,
      rutu,
    })
      .then(async (response) => {
        if (response.data.warning) {
          // Si el servidor devuelve una advertencia, muestra el mensaje y pregunta si se desea continuar
          const result = await Swal.fire({
            title: "Advertencia",
            text: response.data.warning,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, continuar",
            cancelButtonText: "No, cancelar",
          });
  
          // Si el usuario confirma, intenta de nuevo con ignoreWarning = true
          if (result.isConfirmed) {
            ingresoformdPE(true); // Llama a ingresoformdPE con ignoreWarning = true
          } else {
            Swal.fire({
              title: "Operación cancelada",
              text: "No se realizó ningún registro.",
              icon: "info",
              timer: 1500,
            });
          }
        } else {
          procesarIngreso(); // Si no hay advertencia, procede al ingreso exitoso
        }
      })
      .catch(handleError);
  };
  
  const procesarIngreso = () => {
    limpiarCampos();
    Swal.fire({
      title: "Ingreso Exitoso!",
      icon: "success",
      text: "Personal ingresado con Éxito",
      timer: 1500,
    });
  };

  const handleError = (error) => {
    console.error("Error en la solicitud:", error);
    const errorMessage =
      error.response && error.response.data && error.response.data.error
        ? error.response.data.error
        : "Intente más tarde";

    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: errorMessage,
    });
  };

  const limpiarCampos = () => {
    setFormValues({
      RUTP: "",
      NombreP: "",
      ApellidoP: "",
      ActividadP: "",
      EmpresaP: "",
      ComentarioP: "",
      tipoPersona: "",
      EstadoP: "",
      PATENTE: "",
      PatenteR: "",
      Tipo: "",
      Modelo: "",
      Marca: "",
      Color: "",
      GuiaDE: "",
      SelloEn: "",
      instalacionU,
    });
  };
  
  const limpiarCampo = (campo) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [campo]: "",
    }));
  };

  return {
    formValues,
    handleInputChange,
    handleRutChange,
    handleSuggestionSelected,
    getSuggestions,
    handleSuggestionSelectedTransporte,
    getSuggestionsTransporte,
    setSuggestionsTransporte,
    confirmIngreso,
    limpiarCampos,
    limpiarCampo,
    inputProps,
    empresas,
    error,
    rutValido,
    suggestions,
    handleChange,
    actividadesPersonalExterno,
    actividadesPersonalInterno,
    setSuggestions,
    inputPropsTransporte,
    suggestionsTrasnporte,
  };
}
