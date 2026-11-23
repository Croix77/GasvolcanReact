import MapaPedidos from "./MapaPedidos";

export default function MapaSeguimiento({ pedidos, etiqueta = "Mapa de seguimiento" }) {
  const puntos = [];
  for (const pedido of pedidos) {
    if (Number.isFinite(pedido.latitudEntrega) && Number.isFinite(pedido.longitudEntrega)) {
      puntos.push({
        id: pedido.id,
        latitud: pedido.latitudEntrega,
        longitud: pedido.longitudEntrega,
        tipo: "entrega",
        etiqueta: `Entrega · pedido ${pedido.id}`,
      });
    }
    if (Number.isFinite(pedido.latitudRepartidor) && Number.isFinite(pedido.longitudRepartidor)) {
      puntos.push({
        id: pedido.id,
        latitud: pedido.latitudRepartidor,
        longitud: pedido.longitudRepartidor,
        tipo: "repartidor",
        etiqueta: `Última posición del repartidor · pedido ${pedido.id}`,
      });
    }
  }
  if (!puntos.length) return <p>No hay ubicaciones registradas para mostrar en el mapa.</p>;
  return (
    <div className="my-3">
      <MapaPedidos puntos={puntos} etiqueta={etiqueta} />
      <p className="mt-2 mb-0 small">Naranja: punto de entrega. Azul: última posición del repartidor.</p>
    </div>
  );
}
