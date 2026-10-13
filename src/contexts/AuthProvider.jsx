import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  guardarSesionDemo,
  iniciarSesionDemo,
  recuperarSesionDemo,
} from "../services/authDemo";

function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(recuperarSesionDemo);
  useEffect(() => {
    if (!sesion) return;
    const tiempo = Math.max(0, sesion.vence - Date.now());
    const temporizador = setTimeout(() => {
      guardarSesionDemo(null);
      setSesion(null);
    }, tiempo);
    return () => clearTimeout(temporizador);
  }, [sesion]);
  function entrar(correo, clave) {
    const nueva = iniciarSesionDemo(correo, clave);
    guardarSesionDemo(nueva);
    setSesion(nueva);
  }
  function salir() {
    guardarSesionDemo(null);
    setSesion(null);
  }
  return (
    <AuthContext.Provider value={{ sesion, entrar, salir }}>
      {children}
    </AuthContext.Provider>
  );
}
export default AuthProvider;
