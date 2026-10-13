export function validarContacto(datos) {
  const errores = {};
  if (!nombreValido(datos.nombre))
    errores.nombre = "Escribe un nombre de al menos 2 caracteres.";
  if (!correoValido(datos.correo)) errores.correo = "Escribe un correo válido.";
  if (
    typeof datos.mensaje !== "string" ||
    datos.mensaje.trim().length < 10 ||
    datos.mensaje.trim().length > 1000
  )
    errores.mensaje = "Escribe un mensaje de al menos 10 caracteres.";
  return errores;
}

export function validarEntrega(datos) {
  const errores = {};
  if (!nombreValido(datos.nombre))
    errores.nombre = "Escribe el nombre de quien recibe.";
  if (
    typeof datos.telefono !== "string" ||
    !/^(?:\+?56)?[2-9]\d{8}$/.test(datos.telefono.replace(/[\s()-]/g, ""))
  )
    errores.telefono =
      "Escribe un teléfono chileno válido, por ejemplo +56 9 1234 5678.";
  if (
    typeof datos.direccion !== "string" ||
    datos.direccion.trim().length < 5 ||
    datos.direccion.trim().length > 200 ||
    !/[\p{L}\p{N}]/u.test(datos.direccion)
  )
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

function nombreValido(nombre) {
  return (
    typeof nombre === "string" &&
    nombre.trim().length >= 2 &&
    nombre.trim().length <= 100 &&
    /^[\p{L}\p{M}\s.'’-]+$/u.test(nombre.trim()) &&
    /\p{L}/u.test(nombre)
  );
}
function correoValido(correo) {
  return (
    typeof correo === "string" &&
    correo.trim().length <= 150 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())
  );
}
export function validarLogin(datos) {
  const errores = {};
  if (!correoValido(datos.correo)) errores.correo = "Escribe un correo válido.";
  if (
    typeof datos.clave !== "string" ||
    datos.clave.length < 8 ||
    datos.clave.length > 128
  )
    errores.clave = "La contraseña debe tener entre 8 y 128 caracteres.";
  return errores;
}

export function enfocarPrimerError(errores, nombres = {}) {
  const primerCampo = Object.keys(errores)[0];
  if (!primerCampo) return;
  const nombre = nombres[primerCampo] || primerCampo;
  document.getElementsByName(nombre)[0]?.focus();
}
