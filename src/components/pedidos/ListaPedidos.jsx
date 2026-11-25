import { moneda } from "../../utils/moneda";
function ListaPedidos({ pedidos }) {
  if (!pedidos.length) return <p>No hay pedidos registrados.</p>;
  return (
    <ul className="list-group">
      {pedidos.map((pedido) => (
        <li className="list-group-item" key={pedido.id}>
          <h2 className="h5">Pedido {String(pedido.id).slice(0, 8)}</h2>
          <p>{pedido.estado} · {moneda(pedido.total)}</p>
          <ul>
            {pedido.items.map((item, i) => <li key={`${item.id}-${i}`}>{item.nombre} × {item.cantidad}</li>)}
          </ul>
        </li>
      ))}
    </ul>
  );
}
export default ListaPedidos;
