import { moneda } from "../../utils/moneda";
import { estadosPedido } from "../../utils/pedidos";

const formatoFecha = new Intl.DateTimeFormat("es-CL", {
  timeZone: "America/Santiago", dateStyle: "short", timeStyle: "short",
});

function ListaPedidos({ pedidos, acciones, mostrarContacto = false, soloResumen = false }) {
  if (!pedidos.length) return <p>No hay pedidos registrados.</p>;
  return (
    <ul className="list-group">
      {pedidos.map((pedido) => (
        <li className="list-group-item text-break" key={pedido.id}>
          <h2 className="h5">Pedido {pedido.id}</h2>
          <p>{estadosPedido[pedido.estado] ?? pedido.estado} · {moneda(pedido.total)}</p>
          {pedido.fechaCreacion && <p>Pedido realizado el {formatoFecha.format(new Date(pedido.fechaCreacion))}.</p>}
          {!soloResumen && (
            <>
              {pedido.direccion && <p>Entrega en {pedido.direccion}, {pedido.comuna}.</p>}
              {mostrarContacto && pedido.nombre && <p>Contacto: {pedido.nombre} · {pedido.telefono}</p>}
              {mostrarContacto && pedido.correoRepartidor && <p>Repartidor: {pedido.correoRepartidor}</p>}
              <ul className="mb-2">
                {pedido.items.map((item) => <li key={item.id}>{item.nombre} × {item.cantidad}</li>)}
              </ul>
              <p>{pedido.pagoEfectivo ? "Pago en efectivo registrado." : "Pago en efectivo al recibir."}</p>
              {pedido.fechaUbicacion && <p>Última ubicación: {formatoFecha.format(new Date(pedido.fechaUbicacion))}.</p>}
            </>
          )}
          {acciones?.(pedido)}
        </li>
      ))}
    </ul>
  );
}
export default ListaPedidos;
