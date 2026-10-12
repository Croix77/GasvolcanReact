import { moneda } from "../utils/moneda";

function Carrito({ items, cambiarCantidad, eliminar, vaciar }) {
  const cantidad = items.reduce((suma, item) => suma + item.cantidad, 0);
  const total = items.reduce((suma, item) => suma + (item.precio ?? 0) * item.cantidad, 0);
  const pendientes = items.some((item) => item.precio == null);

  return (
    <section id="carrito" aria-labelledby="titulo-carrito" className="mt-5">
      <h2 id="titulo-carrito">Carrito ({cantidad})</h2>
      {items.length === 0 ? <p>Tu carrito está vacío.</p> : (
        <>
          <ul className="list-group mb-3">
            {items.map((item) => (
              <li key={item.id} className="list-group-item d-flex flex-wrap align-items-center gap-3">
                <div className="me-auto text-start">
                  <h3 className="h5">{item.nombre}</h3>
                  <p>{item.precio == null ? "Precio por confirmar" : moneda(item.precio * item.cantidad)}</p>
                </div>
                <label>
                  Cantidad de {item.nombre}
                  <select className="form-select" value={item.cantidad} onChange={(evento) => cambiarCantidad(item.id, Number(evento.target.value))}>
                    {Array.from({ length: 99 }, (_, indice) => indice + 1).map((valor) => <option key={valor} value={valor}>{valor}</option>)}
                  </select>
                </label>
                <button type="button" className="btn btn-outline-danger" onClick={() => eliminar(item.id)} aria-label={`Eliminar ${item.nombre}`}>Eliminar</button>
              </li>
            ))}
          </ul>
          <p className="fw-bold">{pendientes ? "Subtotal de productos con precio confirmado" : "Total"}: {moneda(total)}</p>
          {pendientes && <p className="text-warning-emphasis">El importe final está pendiente de confirmar los precios de los productos seleccionados.</p>}
          <button type="button" className="btn btn-outline-secondary mt-3" onClick={vaciar}>Vaciar carrito</button>
        </>
      )}
    </section>
  );
}

export default Carrito;
