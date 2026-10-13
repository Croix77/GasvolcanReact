export const cuentaDemo = {
  correo: "admin@example.com",
  clave: "VolcanDemo123!",
  nombre: "Administrador",
  rol: "administrador",
};
export const cuentaCliente = {
  correo: "cliente@example.com",
  clave: "ClienteDemo123!",
  nombre: "Cliente",
  rol: "cliente",
};
const cuentas = [cuentaDemo, cuentaCliente];
const claveSesion = "gas-volcan-sesion-demo";
const duracion = 30 * 60 * 1000;

export function iniciarSesionDemo(correo, clave) {
  const cuenta = cuentas.find(
    (item) =>
      item.correo === correo.trim().toLowerCase() && item.clave === clave,
  );
  if (!cuenta) throw new Error("Correo o contraseña incorrectos.");
  return {
    nombre: cuenta.nombre,
    rol: cuenta.rol,
    vence: Date.now() + duracion,
  };
}
export function recuperarSesionDemo() {
  try {
    const sesion = JSON.parse(sessionStorage.getItem(claveSesion));
    const cuenta = cuentas.find((item) => item.rol === sesion?.rol);
    if (!cuenta || !Number.isFinite(sesion.vence) || sesion.vence <= Date.now())
      return null;
    return { nombre: cuenta.nombre, rol: cuenta.rol, vence: sesion.vence };
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
