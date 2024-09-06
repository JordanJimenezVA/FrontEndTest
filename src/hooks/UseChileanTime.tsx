import { useState, useEffect } from 'react';

const useChileanTime = () => {
  const [chileanTime, setChileanTime] = useState<string>();

  const fetchChileanTime = async () => {
    try {
      const response = await fetch('https://timeapi.io/api/Time/current/zone?timeZone=America/Santiago');
      const data = await response.json();
      const date = new Date(data.dateTime); // La propiedad es 'dateTime' en lugar de 'datetime'
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}`; // Formato sin segundos
      setChileanTime(formattedDate);
    } catch (error) {
      console.error('Error fetching Chilean time:', error);
    }
  };

  useEffect(() => {
    fetchChileanTime();
  }, []);

  return chileanTime; // Devolver directamente la cadena de fecha formateada sin segundos
};

export default useChileanTime;
