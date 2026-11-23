import { pedirAuth } from "./api";

const clave = "gas-volcan-sesion-fullstack";
const roles = {
  ADMIN: "administrador",
  VENDEDOR: "vendedor",
  CLIENTE: "cliente",
  OPERADORA: "operadora",
  REPARTIDOR: "repartidor",
};

export const etiquetasRol = {
  administrador: "Administrador",
  vendedor: "Vendedor",
  cliente: "Cliente",
  operadora: "Operadora",
  repartidor: "Repartidor",
};

// React solo lee la fecha para gestionar la sesión. Los servicios validan la firma.
function preparar({ token, correo, rol, nombre }) {
  const cuerpo = token.split(".")[1].replaceAll("-", "+").replaceAll("_", "/");
  const { exp } = JSON.parse(atob(cuerpo));
  const vence = exp * 1000;
  if (!roles[rol] || !correo || !Number.isFinite(vence) || vence <= Date.now())
    throw new Error("El servidor devolvió una sesión inválida.");
  return { token, correo, rol: roles[rol], nombre: nombre || correo, vence };
}

export async function iniciarSesion(correo, password) {
  const respuesta = await pedirAuth("/login", {
    metodo: "POST",
    datos: { correo: correo.trim().toLowerCase(), password },
  });
  return preparar(respuesta);
}

export async function renovarSesion(token) {
  return preparar(await pedirAuth("/refresh", { metodo: "POST", token }));
}

export function recuperarSesion() {
  try {
    const sesion = JSON.parse(sessionStorage.getItem(clave));
    if (!sesion?.token || !etiquetasRol[sesion.rol] || !(sesion.vence > Date.now()))
      return null;
    return sesion;
  } catch {
    return null;
  }
}

export function guardarSesion(sesion) {
  try {
    if (sesion) sessionStorage.setItem(clave, JSON.stringify(sesion));
    else sessionStorage.removeItem(clave);
  } catch {
    // La sesión sigue disponible en memoria si el navegador bloquea el almacenamiento.
  }
}
