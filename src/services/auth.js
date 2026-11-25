import { apiFetch, getToken, setToken } from "./api";

const SESION_KEY = "gas-volcan-sesion";
const REFRESH_WINDOW_MS = 90000;

function normalizarRol(rol) {
  return rol === "ADMIN" ? "administrador" : "cliente";
}

function sesionDesdeRespuesta(res) {
  return {
    token: res.token,
    correo: res.correo,
    rol: normalizarRol(res.rol),
    rolReal: res.rol,
    nombre: res.nombre || res.correo,
    vence: Date.now() + 5 * 60 * 1000,
  };
}

export async function iniciarSesion(correo, clave) {
  const res = await apiFetch("/api/auth/login", {
    method: "POST",
    body: { correo: correo.trim().toLowerCase(), password: clave },
    auth: false,
  });
  const sesion = sesionDesdeRespuesta(res);
  setToken(sesion.token);
  guardarSesion(sesion);
  return sesion;
}

export async function recuperarSesion() {
  try {
    const raw = sessionStorage.getItem(SESION_KEY);
    const sesion = raw ? JSON.parse(raw) : null;
    const token = sesion?.token || getToken();
    if (!token) return null;
    setToken(token);
    const me = await apiFetch("/api/auth/me");
    const actual = {
      ...sesion,
      token,
      correo: me.correo,
      nombre: me.nombre || me.correo,
      rol: normalizarRol(me.rol),
      rolReal: me.rol,
      id: me.id,
      activo: me.activo,
      vence: sesion?.vence || Date.now() + 5 * 60 * 1000,
    };
    guardarSesion(actual);
    return actual;
  } catch {
    limpiarSesion();
    return null;
  }
}

export async function renovarSesion() {
  const res = await apiFetch("/api/auth/refresh", { method: "POST" });
  const sesion = sesionDesdeRespuesta(res);
  const actual = { ...leerSesion(), ...sesion };
  setToken(actual.token);
  guardarSesion(actual);
  return actual;
}

export function debeRenovar(sesion) {
  return sesion?.vence && sesion.vence - Date.now() <= REFRESH_WINDOW_MS;
}

export function leerSesion() {
  try {
    return JSON.parse(sessionStorage.getItem(SESION_KEY));
  } catch {
    return null;
  }
}

export function guardarSesion(sesion) {
  try {
    if (sesion) sessionStorage.setItem(SESION_KEY, JSON.stringify(sesion));
    else sessionStorage.removeItem(SESION_KEY);
  } catch {}
}

export function limpiarSesion() {
  setToken(null);
  guardarSesion(null);
}
