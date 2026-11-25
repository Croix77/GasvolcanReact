const sesiones = new EventTarget();

export function escucharSesionRechazada(alRechazar) {
  const escuchar = (evento) => alRechazar(evento.detail);
  sesiones.addEventListener("sesion-rechazada", escuchar);
  return () => sesiones.removeEventListener("sesion-rechazada", escuchar);
}

async function pedir(ruta, { token, metodo = "GET", datos, signal } = {}) {
  let respuesta;
  try {
    respuesta = await fetch(ruta, {
      method: metodo,
      signal,
      headers: {
        Accept: "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(datos !== undefined && { "Content-Type": "application/json" }),
      },
      body: datos === undefined ? undefined : JSON.stringify(datos),
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new Error("No se pudo conectar al servidor. Revisa tu conexión y vuelve a intentar.", { cause: error });
  }
  if (respuesta.status === 204) return null;
  const contenido = await respuesta.json().catch(() => null);
  if (!respuesta.ok) {
    if (token && respuesta.status === 401 && !signal?.aborted) {
      sesiones.dispatchEvent(new CustomEvent("sesion-rechazada", { detail: token }));
    }
    const mensaje = respuesta.status === 403
      ? "Tu cuenta no tiene permiso para esta operación."
      : contenido?.mensaje ?? contenido?.error ?? "El servidor no pudo completar la solicitud.";
    const error = new Error(mensaje);
    error.status = respuesta.status;
    error.campos = contenido?.campos ?? contenido?.errores;
    throw error;
  }
  if (contenido === null) throw new Error("El servidor envió una respuesta inesperada.");
  return contenido;
}

export const pedirAuth = (ruta, opciones) => pedir("/api/auth" + ruta, opciones);
export const pedirApi = (ruta, opciones) => pedir("/api/v1" + ruta, opciones);
