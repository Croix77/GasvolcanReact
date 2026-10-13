export function validarContacto(datos) {
  const errores = {};
  if (datos.nombre.trim().length < 2)
    errores.nombre = "Escribe un nombre de al menos 2 caracteres.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo.trim()))
    errores.correo = "Escribe un correo válido.";
  if (datos.mensaje.trim().length < 10)
    errores.mensaje = "Escribe un mensaje de al menos 10 caracteres.";
  return errores;
}

export function validarEntrega(datos) {
  const errores = {};
  if (datos.nombre.trim().length < 2)
    errores.nombre = "Escribe el nombre de quien recibe.";
  if (!/^\+?\d{9,12}$/.test(datos.telefono.replace(/[\s()-]/g, "")))
    errores.telefono = "Escribe un teléfono válido de 9 a 12 dígitos.";
  if (datos.direccion.trim().length < 5)
    errores.direccion = "Escribe la dirección de entrega.";
  if (
    ![
      "Chillán",
      "Chillán Viejo",
      "El Carmen",
      "Pinto",
      "San Ignacio",
      "Bulnes",
      "Quillón",
    ].includes(datos.comuna)
  )
    errores.comuna = "Selecciona una comuna de cobertura.";
  return errores;
}
