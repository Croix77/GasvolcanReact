import { apiFetch } from "./api";

export async function listarProductos() {
  return apiFetch("/api/v1/productos", { auth: false });
}
export async function crearProducto(payload, token) {
  return apiFetch("/api/v1/productos", { method: "POST", body: payload, headers: { Authorization: `Bearer ${token}` } });
}
export async function actualizarProducto(id, payload, token) {
  return apiFetch(`/api/v1/productos/${id}`, { method: "PUT", body: payload, headers: { Authorization: `Bearer ${token}` } });
}
export async function eliminarProducto(id, token) {
  return apiFetch(`/api/v1/productos/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
}
export async function listarStock() {
  return apiFetch("/api/v1/stock", { auth: false });
}
export async function guardarStock(id, stock, token, version) {
  return apiFetch(`/api/v1/stock/${id}`, { method: "PUT", body: { stock, version }, headers: { Authorization: `Bearer ${token}` } });
}
