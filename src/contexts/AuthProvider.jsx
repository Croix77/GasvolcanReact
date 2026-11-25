import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  guardarSesion,
  iniciarSesion,
  limpiarSesion,
  recuperarSesion,
  renovarSesion,
  debeRenovar,
} from "../services/auth";

function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    let activo = true;
    recuperarSesion().then((s) => {
      if (!activo) return;
      setSesion(s);
      setCargando(false);
    });
    return () => { activo = false; };
  }, []);

  useEffect(() => {
    if (!sesion?.token) return;
    const restante = Math.max(0, sesion.vence - Date.now());
    const timer = setTimeout(async () => {
      if (debeRenovar(sesion)) {
        try {
          const renovada = await renovarSesion();
          setSesion(renovada);
          return;
        } catch {}
      }
      limpiarSesion();
      setSesion(null);
      setAviso("Tu sesión ha expirado. Inicia sesión nuevamente.");
    }, restante);
    return () => clearTimeout(timer);
  }, [sesion]);

  async function entrar(correo, clave) {
    const nueva = await iniciarSesion(correo, clave);
    setSesion(nueva);
    setAviso(`Sesión iniciada como ${nueva.nombre}.`);
    return nueva;
  }

  function salir() {
    limpiarSesion();
    setSesion(null);
    setAviso("Sesión cerrada. Ahora estás fuera de tu cuenta.");
  }

  async function asegurarToken() {
    if (!sesion) return null;
    if (debeRenovar(sesion)) {
      try {
        const renovada = await renovarSesion();
        setSesion(renovada);
        return renovada.token;
      } catch {
        limpiarSesion();
        setSesion(null);
        return null;
      }
    }
    return sesion.token;
  }

  return (
    <AuthContext.Provider value={{ sesion, cargando, entrar, salir, aviso, cerrarAviso: () => setAviso(""), asegurarToken, setSesion: (s) => { guardarSesion(s); setSesion(s); } }}>
      {children}
    </AuthContext.Provider>
  );
}
export default AuthProvider;
