import { apiFetch } from "./api";
export async function enviarMensaje(payload, token) {
  return apiFetch("/api/v1/contacto/mensajes", { method: "POST", body: payload, headers: token ? { Authorization: `Bearer ${token}` } : {} });
}
