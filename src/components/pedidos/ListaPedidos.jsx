import { moneda } from "../../utils/moneda";
function ListaPedidos({ pedidos, eliminar }) {
  if (!pedidos.length)
    return <p>No hay pedidos de demostración registrados.</p>;
  return (
    <ul className="list-group">
      {pedidos.map((pedido) => (
        <li className="list-group-item" key={pedido.id}>
          <h2 className="h5">Pedido {pedido.id.slice(0, 8)}</h2>
          <p>
            {pedido.estado} · {moneda(pedido.total)}
          </p>
          <ul>
            {pedido.items.map((item) => (
              <li key={item.id}>
                {item.nombre} × {item.cantidad}
              </li>
            ))}
          </ul>
          {eliminar && (
            <button
              type="button"
              className="btn btn-outline-danger mt-2"
              onClick={() => eliminar(pedido.id)}
              aria-label={`Eliminar pedido ${pedido.id.slice(0, 8)}`}
            >
              Eliminar registro de demostración
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
export default ListaPedidos;
