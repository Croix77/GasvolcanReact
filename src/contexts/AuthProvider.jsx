import { useEffect, useRef, useState } from "react";
import { AuthContext } from "./AuthContext";
import { escucharSesionRechazada } from "../services/api";
import { etiquetasRol, guardarSesion, iniciarSesion, recuperarSesion, renovarSesion } from "../services/sesion";

function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(recuperarSesion);
  const [aviso, setAviso] = useState("");
  const cancelarRenovacion = useRef(null);

  useEffect(() => {
    if (!sesion) return;
    let vigente = true;
    cancelarRenovacion.current = () => { vigente = false; };
    const restante = sesion.vence - Date.now();
    const vencer = (mensaje) => {
      if (!vigente) return;
      vigente = false;
      guardarSesion(null);
      setSesion(null);
      setAviso(mensaje);
    };
    // Una respuesta atrasada de otro token no debe cerrar la sesión actual.
    const dejarDeEscuchar = escucharSesionRechazada((token) => {
      if (token === sesion.token) vencer("Tu sesión ya no está activa. Inicia sesión nuevamente.");
    });
    const temporizadorVencimiento = setTimeout(
      () => vencer("Tu sesión ha expirado. Inicia sesión nuevamente."),
      Math.max(0, restante),
    );
    async function intentarRenovar() {
      try {
        const nueva = await renovarSesion(sesion.token);
        if (!vigente) return;
        if (nueva.token !== sesion.token) {
          vigente = false;
          guardarSesion(nueva);
          setSesion(nueva);
          return;
        }
      } catch (error) {
        if (error.status === 403) vencer("No se pudo renovar tu sesión. Inicia sesión nuevamente.");
      }
      // Un reinicio de Auth puede interrumpir la renovación. Se reintenta mientras el JWT esté vigente.
      if (vigente && sesion.vence - Date.now() > 5000)
        temporizadorRenovacion = setTimeout(intentarRenovar, 5000);
    }

    let temporizadorRenovacion = setTimeout(
      intentarRenovar,
      Math.max(0, restante - Math.min(60_000, Math.max(1000, restante / 5))),
    );

    return () => {
      vigente = false;
      dejarDeEscuchar();
      clearTimeout(temporizadorVencimiento);
      clearTimeout(temporizadorRenovacion);
    };
  }, [sesion]);

  async function entrar(correo, clave) {
    const nueva = await iniciarSesion(correo, clave);
    guardarSesion(nueva);
    setSesion(nueva);
    setAviso(`Sesión iniciada como ${etiquetasRol[nueva.rol].toLowerCase()}.`);
    return nueva;
  }

  function salir() {
    cancelarRenovacion.current?.();
    guardarSesion(null);
    setSesion(null);
    setAviso("Sesión cerrada. Ahora estás fuera de tu cuenta.");
  }

  return (
    <AuthContext.Provider value={{ sesion, entrar, salir, aviso, cerrarAviso: () => setAviso("") }}>
      {children}
    </AuthContext.Provider>
  );
}
export default AuthProvider;
