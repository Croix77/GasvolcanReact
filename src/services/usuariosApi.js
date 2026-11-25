import { useAuth } from "../hooks/useAuth";
import { apiFetch } from "../services/api";

export async function listarUsuarios() {
  return apiFetch("/api/auth/usuarios");
}
export async function crearUsuario(payload) {
  return apiFetch("/api/auth/usuarios", { method: "POST", body: payload });
}
export async function actualizarUsuario(id, payload) {
  return apiFetch(`/api/auth/usuarios/${id}`, { method: "PUT", body: payload });
}
export async function cambiarEstadoUsuario(id, activo) {
  return apiFetch(`/api/auth/usuarios/${id}/estado`, { method: "PATCH", body: { activo } });
}

export function useUsuariosApi() {
  const { asegurarToken } = useAuth();
  async function run(fn) {
    const token = await asegurarToken();
    if (!token) throw new Error("Sesión inválida.");
    return fn();
  }
  return {
    listar: () => run(listarUsuarios),
    crear: (p) => run(() => crearUsuario(p)),
    actualizar: (id, p) => run(() => actualizarUsuario(id, p)),
    cambiarEstado: (id, a) => run(() => cambiarEstadoUsuario(id, a)),
  };
}
