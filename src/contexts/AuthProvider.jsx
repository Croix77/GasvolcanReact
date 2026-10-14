import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  guardarSesionDemo,
  iniciarSesionDemo,
  recuperarSesionDemo,
} from "../services/authDemo";

function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(recuperarSesionDemo);
  const [aviso, setAviso] = useState("");
  useEffect(() => {
    if (!sesion) return;
    const tiempo = Math.max(0, sesion.vence - Date.now());
    const temporizador = setTimeout(() => {
      guardarSesionDemo(null);
      setSesion(null);
      setAviso("Tu sesión ha expirado. Inicia sesión nuevamente.");
    }, tiempo);
    return () => clearTimeout(temporizador);
  }, [sesion]);
  function entrar(correo, clave) {
    const nueva = iniciarSesionDemo(correo, clave);
    guardarSesionDemo(nueva);
    setSesion(nueva);
    setAviso(`Sesión iniciada como ${nueva.rol === "administrador" ? "administrador" : "cliente"}.`);
    return nueva;
  }
  function salir() {
    guardarSesionDemo(null);
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
