import { apiFetch } from "./api";

export async function crearPedido(payload, token) {
  return apiFetch("/api/v1/pedidos", { method: "POST", body: payload, headers: { Authorization: `Bearer ${token}` } });
}
export async function listarPedidos(token) {
  return apiFetch("/api/v1/pedidos", { headers: { Authorization: `Bearer ${token}` } });
}
export async function listarZonas() {
  return apiFetch("/api/v1/zonas", { auth: false });
}
