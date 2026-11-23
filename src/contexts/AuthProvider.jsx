import { useEffect, useRef, useState } from "react";
import { AuthContext } from "./AuthContext";
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
    const vencer = () => {
      if (!vigente) return;
      vigente = false;
      guardarSesion(null);
      setSesion(null);
      setAviso("Tu sesión ha expirado. Inicia sesión nuevamente.");
    };
    const temporizadorVencimiento = setTimeout(vencer, Math.max(0, restante));
    const temporizadorRenovacion = setTimeout(async () => {
      try {
        const nueva = await renovarSesion(sesion.token);
        if (!vigente) return;
        guardarSesion(nueva);
        setSesion(nueva);
      } catch (error) {
        if ([401, 403].includes(error.status)) vencer();
        // Si se pierde la conexión, el token sigue vigente hasta su vencimiento.
      }
    }, Math.max(0, restante - Math.min(60_000, Math.max(1000, restante / 5))));

    return () => {
      vigente = false;
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
