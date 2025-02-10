const validarYFormatearRut = (rut) => {
  if (!rut || rut.trim() === '') return { esValido: false, rutFormateado: '' };

  const rutLimpio = rut.replace(/[^0-9kK]/g, '');

  if (rutLimpio.length < 2) return { esValido: false, rutFormateado: rut };

  const cuerpo = rutLimpio.slice(0, -1);
  const dvIngresado = rutLimpio.slice(-1).toUpperCase();

  let M = 0, S = 1;
  for (let T = parseInt(cuerpo, 10); T; T = Math.floor(T / 10)) {
    S = (S + (T % 10) * (9 - (M++ % 6))) % 11;
  }
  const dvEsperado = S ? String(S - 1) : 'K';

  const esValido = dvIngresado === dvEsperado;
  const rutFormateado = `${cuerpo}-${dvIngresado}`;

  return {
    esValido,
    rutFormateado,
  };
};

export default validarYFormatearRut;
