import { useParams } from "react-router-dom";
import useChileanTime from "../../hooks/useChileanTime";
import { useAuth } from "../../hooks/Auth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Axios from "axios";
import useEmpresas from "../../hooks/useEmpresas";
import validarYFormatearRut from "../../utils/rutUtils.js";
import {
  actividadesPersonalExterno,
  actividadesPersonalInterno,
} from "../../utils/actividadesConfig.js";
import React, { useState, useEffect } from "react";

export default function useFormularioSalida(host_server) {
  const { IDR } = useParams();
  const [rutValido, setRutValido] = React.useState(true);
  const { empresas, error } = useEmpresas(host_server);
  const [showTransporte, setShowTransporte] = useState(false);

  const chileanTime = useChileanTime();
  const navigate = useNavigate();

  const nombreUsuario = localStorage.getItem("nombreUsuario") || "";
  const instalacionU = localStorage.getItem("instalacionU") || "";
  const rutu = localStorage.getItem("rut") || "";

  const [suggestions, setSuggestions] = useState([]);

  const [formValues, setFormValues] = useState({
    RutP: "",
    NombreP: "",
    ApellidoP: "",
    ActividadP: "",
    EmpresaP: "",
    ComentarioP: "",
    TipoPersona: "",
    Patente: "",
    PatenteR: "",
    Tipo: "",
    Modelo: "",
    Marca: "",
    Color: "",
    GuiaDS: "",
    SelloSa: "",
    instalacionU,
    rutu,
    fechaActualChile: chileanTime,
  });

  useEffect(() => {
    getRegistros(IDR);
  }, [IDR]);

  const getRegistros = (IDR) => {
    Axios.get(`${host_server}/FormularioSalida/${IDR}`)
      .then((res) => {
        const {
          RutP,
          NombreP,
          ApellidoP,
          ActividadP,
          EmpresaP,
          ComentarioP,
          TipoPersona,
          Patente,
          PatenteR,
          Tipo,
          Modelo,
          Marca,
          Color,
          GuiaDE,
          SelloEn,
        } = res.data[0];
        setFormValues({
          RutP,
          NombreP,
          ApellidoP,
          ActividadP,
          EmpresaP,
          ComentarioP,
          TipoPersona,
          Patente,
          PatenteR,
          Tipo,
          Modelo,
          Marca,
          Color,
          GuiaDE,
          SelloEn,
        });
        setShowTransporte(!!Patente);
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
  
  // const handleRutChange = (newValue) => {
  //   setFormValues((prevValues) => ({
  //     ...prevValues,
  //     RutP: newValue.trim(),  // Actualizamos el valor del RUT sin espacios
  //   }));
  
  //   // Solo buscar sugerencias si el campo no está vacío
  //   if (newValue.trim()) {
  //     getSuggestions(newValue.trim());
  //   } else {
  //     setSuggestions([]);  // Limpiar sugerencias si el campo está vacío
  //   }
  // };
  const handleRutChange = (newValue) => {
    const trimmedValue = newValue?.trim() || ""; // Manejar valores vacíos o null
    setFormValues((prevValues) => ({
      ...prevValues,
      RutP: trimmedValue, // Permitir que sea vacío
    }));
  
    // Buscar sugerencias solo si hay un valor
    if (trimmedValue) {
      getSuggestions(trimmedValue);
    } else {
      setSuggestions([]); // Limpiar sugerencias si el campo está vacío
    }
  };

  const handlePatenteChange = (value) => {
    const uppercasedValue = value.toUpperCase();
    setFormValues((prevValues) => ({
      ...prevValues,
      Patente: uppercasedValue,
    }));
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
      RutP: "",
      NombreP: "",
      ApellidoP: "",
      ActividadP: "",
      EmpresaP: "",
      ComentarioP: "",
      TipoPersona: "",
      Patente: "",
      PatenteR: "",
      Tipo: "",
      Modelo: "",
      Marca: "",
      Color: "",
      GuiaDS: "",
      SelloSa: "",
      instalacionU,
    });
  };

  const limpiarCampo = (campo) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [campo]: "",
    }));
  };


  const Salida = () => {
    Axios.post(`${host_server}/FormularioSalida/${IDR}`, {
      ...formValues,
      fechaActualChile: chileanTime,
      instalacionU,
      NombreU: nombreUsuario,
      rutu,
    })
      .then(() => {
        limpiarCampos();
        Swal.fire({
          title: "Salida Exitosa!",
          icon: "success",
          text: "Salida registrada correctamente",
          timer: 1500,
        }).then(() => {
          navigate("/TablaIngreso");
        });
      })
      .catch((error) => {
        console.error("Error al marcar salida:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error al marcar salida, intente nuevamente más tarde",
        });
      });
  };

  const SalidaSinCamion = () => {
    Axios.post(`${host_server}/FormularioSalidaSinCamion/${IDR}`, {
      ...formValues,
      fechaActualChile: chileanTime,
      instalacionU,
      NombreU: nombreUsuario,
      rutu,
    })
      .then(() => {
        limpiarCampos();
        Swal.fire({
          title: "Salida Personal sin el Camión!",
          icon: "success",
          text: "Salida registrada correctamente",
          timer: 1500,
        }).then(() => {
          navigate("/TablaIngreso");
        });
      })
      .catch((error) => {
        console.error("Error al marcar salida:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error al marcar salida, intente nuevamente más tarde",
        });
      });
  };

  const inputProps = {
    placeholder: "Ingrese Rut",
    value: formValues.RutP,
    onChange: (event, { newValue }) => handleRutChange(newValue),
  };

const getSuggestions = async (value) => {
  if (!value) return; // Evitar llamadas innecesarias si el valor está vacío
  try {
    const response = await fetch(
      `${host_server}/RutSalida/suggestions?query=${value}`
    );
    const data = await response.json();
    const ruts = data.results?.[0].map((obj) => obj.RutP) || [];
    setSuggestions(ruts);
  } catch (error) {
    console.error("Error obteniendo sugerencias:", error);
  }
};


const handleSuggestionSelected = async (_, { suggestion }) => {
  if (!suggestion) return; // No hacer nada si no hay sugerencia seleccionada

  try {
    const response = await Axios.get(
      `${host_server}/RutSalida/suggestion/${suggestion}`
    );
    const data = response.data;

    setFormValues((prevValues) => ({
      ...prevValues,
      NombreP: data.NombreP || "",
      ApellidoP: data.ApellidoP || "",
      ActividadP: data.ActividadP || "",
      EmpresaP: data.EmpresaP || "",
      ComentarioP: data.ComentarioP || "",
      TipoPersona: data.TipoPersona || "",
    }));
  } catch (error) {
    console.error("Error al obtener datos del RUT:", error);
  }
};

  
  


  return {
    formValues,
    empresas,
    Salida,
    limpiarCampo,
    handleChange,
    handleRutChange,
    rutValido,
    actividadesPersonalExterno,
    actividadesPersonalInterno,
    inputProps,
    suggestions,
    setSuggestions,
    handlePatenteChange,
    showTransporte,
    setShowTransporte,
    inputProps,
    SalidaSinCamion,
    handleSuggestionSelected,
    getSuggestions,
    setFormValues,
  };
}
