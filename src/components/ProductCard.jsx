import { moneda } from "../utils/moneda";
import { Link } from "react-router-dom";

function ProductCard({
  id,
  nombre,
  descripcion,
  precio,
  imagen,
  stock,
  categoria,
  stockCritico = 10,
  onAgregar,
}) {
  return (
    <article className="card h-100 shadow-sm">
      {imagen ? (
        <img
          src={imagen}
          alt={nombre}
          className="card-img-top p-3"
          style={{ height: "240px", objectFit: "contain" }}
        />
      ) : (
        <div
          className="producto-sin-imagen"
          aria-label={`Sin fotografía: ${nombre}`}
        >
          Gas El Volcán
        </div>
      )}
      <div className="card-body d-flex flex-column">
        <span className="badge bg-secondary align-self-start mb-2">
          {categoria}
        </span>
        <h3 className="h5">{nombre}</h3>
        <p className="card-text">{descripcion}</p>
        <p className="fw-bold text-primary fs-4">
          {precio == null
            ? "Precio por confirmar"
            : precio === 0
              ? "Gratis"
              : moneda(precio)}
        </p>
        <p className="mb-3">{stock === 0 ? "Agotado" : `Stock: ${stock}`}</p>
        {stock > 0 && stock <= stockCritico && (
          <p className="text-danger">Stock crítico: quedan pocas unidades.</p>
        )}
        <Link className="mb-3" to={`/productos/${id}`}>
          Ver detalle
        </Link>
        <button
          type="button"
          className="btn btn-primary mt-auto"
          onClick={onAgregar}
          disabled={stock === 0}
        >
          Añadir al Carrito
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
