import { apiFetch } from "./api";

export async function listarCategorias() {
  return apiFetch("/api/v1/categorias", { auth: false });
}
export async function crearCategoria(nombre, token) {
  return apiFetch("/api/v1/categorias", { method: "POST", body: { nombre }, auth: false, headers: token ? { Authorization: `Bearer ${token}` } : {} });
}
export async function actualizarCategoria(id, nombre, token) {
  return apiFetch(`/api/v1/categorias/${id}`, { method: "PUT", body: { nombre }, auth: false, headers: token ? { Authorization: `Bearer ${token}` } : {} });
}
export async function eliminarCategoria(id, token) {
  return apiFetch(`/api/v1/categorias/${id}`, { method: "DELETE", auth: false, headers: token ? { Authorization: `Bearer ${token}` } : {} });
}
