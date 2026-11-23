export const comunasEntrega = [
  "Chillán",
  "Chillán Viejo",
  "El Carmen",
  "Pinto",
  "San Ignacio",
  "Bulnes",
  "Quillón",
];

export const estadosPedido = {
  PENDIENTE: "Pendiente",
  ASIGNADO: "Asignado",
  EN_CAMINO: "En camino",
  ENTREGADO: "Entregado",
};

export function leerCoordenadas({ latitud, longitud }) {
  const valores = { latitud: Number(latitud), longitud: Number(longitud) };
  if (!String(latitud ?? "").trim() || !String(longitud ?? "").trim() || !Number.isFinite(valores.latitud) ||
    !Number.isFinite(valores.longitud) || Math.abs(valores.latitud) > 90 ||
    Math.abs(valores.longitud) > 180) return null;
  return valores;
}
