import { useEffect, useState } from "react";
import { pedirAuth } from "../services/api";

const vacio = { token: null, usuarios: [], error: "" };

export function useUsuarios(token) {
  const [estado, setEstado] = useState(vacio);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    if (!token) return;
    const control = new AbortController();
    pedirAuth("/usuarios", { token, signal: control.signal })
      .then((usuarios) => {
        if (!control.signal.aborted) setEstado({ token, usuarios, error: "" });
      })
      .catch((fallo) => {
        if (!control.signal.aborted) {
          setEstado((anterior) => ({
            ...(anterior.token === token ? anterior : vacio), token, error: fallo.message,
          }));
        }
      });
    return () => control.abort();
  }, [token, revision]);

  function actualizarLista(usuario) {
    setEstado((anterior) => {
      if (anterior.token !== token) return anterior;
      const existe = anterior.usuarios.some((item) => item.id === usuario.id);
      const usuarios = existe
        ? anterior.usuarios.map((item) => item.id === usuario.id ? usuario : item)
        : [...anterior.usuarios, usuario];
      return { ...anterior, usuarios };
    });
  }

  async function guardar(datos, id) {
    const { nombre, correo, rol, password } = datos;
    const payload = { nombre: nombre.trim(), rol };
    // Una cuenta conserva el correo que la identifica en sus pedidos.
    if (!id) payload.correo = correo.trim().toLowerCase();
    if (!id || password) payload.password = password;
    const usuario = await pedirAuth(id ? `/usuarios/${id}` : "/usuarios", {
      token, metodo: id ? "PUT" : "POST", datos: payload,
    });
    actualizarLista(usuario);
  }

  async function alternar(id, activo) {
    const usuario = await pedirAuth(`/usuarios/${id}/estado`, {
      token, metodo: "PATCH", datos: { activo },
    });
    actualizarLista(usuario);
  }

  const actual = token && estado.token === token ? estado : vacio;
  return {
    usuarios: actual.usuarios,
    error: actual.error,
    cargando: Boolean(token && estado.token !== token),
    recargar: () => setRevision((valor) => valor + 1),
    guardar,
    alternar,
  };
}
