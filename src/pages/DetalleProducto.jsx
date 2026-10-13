import { Link, useParams } from "react-router-dom";
import { moneda } from "../utils/moneda";
function DetalleProducto({ productos, onAgregar }) {
  const { id } = useParams();
  const producto = productos.find((item) => item.id === id);
  if (!producto)
    return (
      <>
        <h1>Producto no encontrado</h1>
        <Link to="/catalogo">Volver al catálogo</Link>
      </>
    );
  return (
    <section>
      <h1>{producto.nombre}</h1>
      <div className="row g-4">
        <div className="col-md-5">
          {producto.imagen && (
            <img
              className="img-fluid detalle-imagen"
              src={producto.imagen}
              alt={producto.nombre}
            />
          )}
        </div>
        <div className="col-md-7">
          <p>{producto.descripcion}</p>
          <p>Categoría: {producto.categoria}</p>
          <p className="fs-3 fw-bold">{moneda(producto.precio)}</p>
          <p>Stock: {producto.stock}</p>
          <button
            className="btn btn-primary"
            type="button"
            disabled={producto.stock === 0}
            onClick={() => onAgregar(producto)}
          >
            Añadir al Carrito
          </button>
          <Link className="d-block mt-3" to="/catalogo">
            Volver al catálogo
          </Link>
        </div>
      </div>
    </section>
  );
}
export default DetalleProducto;
