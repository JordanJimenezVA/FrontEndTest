import { useState, useEffect } from 'react';
import { format, toZonedTime } from 'date-fns-tz';

const useChileanTime = () => {
  const [chileanTime, setChileanTime] = useState<string>('Cargando...');

  const updateChileanTime = () => {
    const localDate = new Date();
    const timeZone = 'America/Santiago';
    const zonedTime = toZonedTime(localDate, timeZone);
    const formattedDate = format(zonedTime, 'dd-MM-yyyy HH:mm', { timeZone });
    setChileanTime(formattedDate);
  };

  useEffect(() => {
    // Actualiza la hora inicialmente
    updateChileanTime();
    // Configura un intervalo para actualizar la hora cada minuto
    const interval = setInterval(updateChileanTime, 60000);
    // Limpia el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, []);

  return chileanTime;
};

export default useChileanTime;
