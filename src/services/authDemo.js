export const cuentaDemo = {
  correo: "admin@example.com",
  clave: "VolcanDemo123!",
};
const claveSesion = "gas-volcan-sesion-demo";
const duracion = 30 * 60 * 1000;

export function iniciarSesionDemo(correo, clave) {
  if (
    correo.trim().toLowerCase() !== cuentaDemo.correo ||
    clave !== cuentaDemo.clave
  ) {
    throw new Error("Correo o contraseña incorrectos.");
  }
  return {
    nombre: "Administrador de demostración",
    rol: "administrador",
    vence: Date.now() + duracion,
  };
}

export function recuperarSesionDemo() {
  try {
    const sesion = JSON.parse(sessionStorage.getItem(claveSesion));
    if (
      sesion?.rol !== "administrador" ||
      !Number.isFinite(sesion.vence) ||
      sesion.vence <= Date.now()
    )
      return null;
    return {
      nombre: "Administrador de demostración",
      rol: "administrador",
      vence: sesion.vence,
    };
  } catch {
    return null;
  }
}

export function guardarSesionDemo(sesion) {
  try {
    if (sesion) sessionStorage.setItem(claveSesion, JSON.stringify(sesion));
    else sessionStorage.removeItem(claveSesion);
  } catch {
    // Si el almacenamiento está bloqueado, la sesión funciona en memoria.
  }
}
