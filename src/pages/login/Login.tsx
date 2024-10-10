import React, { useState } from 'react';
import './login.scss';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/Auth';

const host_server = import.meta.env.VITE_SERVER_HOST;

export default function Login() {
  const [values, setValues] = useState({
    rut: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState(''); // Estado para manejar mensajes de error
  const navigate = useNavigate();
  const { setUserType, setNombreUsuario } = useAuth();

  // Configura Axios para enviar cookies con solicitudes
  axios.defaults.withCredentials = true;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const isRUT = values.rut;
      const res = await axios.post(`${host_server}/Login`, 
        { rutU: isRUT, passwordU: values.password },
        { withCredentials: true }  // Asegúrate de que se envíen las cookies
    );

      if (res.data.Status === 'Success') {
        const userTypeRes = await axios.get(`${host_server}/UserType`, {
          params: {
            RUTU: isRUT,
          },
          withCredentials: true, 
        });

        const userType = userTypeRes.data.userType;
        const nombreUsuario = userTypeRes.data.nombreUsuario;

        setNombreUsuario(nombreUsuario);
        setUserType(userType);

        localStorage.setItem('nombreUsuario', nombreUsuario);
        localStorage.setItem('userType', userType);

        navigate('/Home');  
      } else {
        setErrorMessage('Error al ingresar/Verificar datos');
      }
    } catch (err) {
      console.error('Error during login:', err);
      setErrorMessage('Ocurrió un error al intentar iniciar sesión. Por favor, inténtelo de nuevo más tarde.');
    }
  };

  const formatRUT = (rut: string) => {
    const cleanedRut = rut.replace(/[^\dkK]/g, '');
  
    if (cleanedRut.length <= 1) return cleanedRut;
    if (cleanedRut.length <= 4) return cleanedRut.replace(/^(\d{1,3})(\d{0,3})$/, '$1.$2');
    if (cleanedRut.length <= 7) return cleanedRut.replace(/^(\d{1,3})(\d{3})(\d{0,3})$/, '$1.$2.$3');
    return cleanedRut.replace(/^(\d{1,2})(\d{3})(\d{3})([\dkK])$/, '$1.$2.$3-$4');
  };

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const isDeleting = values.rut.length > inputValue.length;
    const isRUT = /^[0-9kK]*$/.test(inputValue.replace(/\./g, '').replace(/-/g, ''));

    if (isDeleting || !isRUT) {
      setValues({ ...values, rut: inputValue });
    } else {
      setValues({ ...values, rut: formatRUT(inputValue) });
    }
  };

  return (
    <div className="login-page">
      <div className="formlogin">
        <form onSubmit={handleSubmit} className="login-form">
          <input
            onChange={handleRutChange}
            type="text"
            name="rut"
            value={values.rut}
            placeholder="Rut o Usuario"
            autoComplete="rut"
          />
          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValues({ ...values, password: e.target.value })}
            type="password"
            name="password"
            placeholder="Contraseña"
            autoComplete="password"
          />
          <button type="submit">Ingresar</button>

          {/* Mostrar mensaje de error en el cuadro de login */}
          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </form>
      </div>
    </div>
  );
}
