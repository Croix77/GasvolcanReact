import { useEffect, useState } from "react";
import { guardarUsuario, recuperarUsuarios } from "../services/usuariosDemo";
export function useUsuariosDemo() {
  const [usuarios, setUsuarios] = useState(recuperarUsuarios);
  useEffect(() => {
    try {
      localStorage.setItem(
        "gas-volcan-usuarios-demo-v1",
        JSON.stringify(usuarios),
      );
    } catch {
      /* Funciona durante la sesión. */
    }
  }, [usuarios]);
  return {
    usuarios,
    guardar: (usuario, id) =>
      setUsuarios(guardarUsuario(usuarios, usuario, id)),
    alternar: (id) =>
      setUsuarios((lista) =>
        lista.map((usuario) =>
          usuario.id === id ? { ...usuario, activo: !usuario.activo } : usuario,
        ),
      ),
  };
}
