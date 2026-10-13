import { moneda } from "../utils/moneda";
import { Link } from "react-router-dom";

function TarjetaProducto({
  id,
  nombre,
  descripcion,
  precio,
  imagen,
  stock,
  categoria,
  stockCritico = 10,
  onAgregar,
  nivelTitulo = "h3",
}) {
  const Titulo = nivelTitulo;
  return (
    <article className="card tarjeta-producto h-100">
      {imagen ? (
        <img
          src={imagen}
          alt={nombre}
          className="card-img-top producto-imagen"
          loading="lazy"
        />
      ) : (
        <div
          className="producto-sin-imagen"
          aria-label={`Sin fotografía: ${nombre}`}
        >
          <span aria-hidden="true" className="producto-inicial">
            {categoria?.charAt(0) || "G"}
          </span>
          <span>{categoria || "Accesorios"}</span>
          <small>Consulta sus características</small>
        </div>
      )}
      <div className="card-body d-flex flex-column">
        <span className="categoria-producto align-self-start mb-2">
          {categoria}
        </span>
        <Titulo className="h5">{nombre}</Titulo>
        <p className="card-text">{descripcion}</p>
        <p className="precio-producto">
          {precio == null
            ? "Precio por confirmar"
            : precio === 0
              ? "Gratis"
              : moneda(precio)}
        </p>
        <p className="stock-producto mb-3">
          {stock === 0 ? "Agotado" : `Stock: ${stock}`}
        </p>
        {stock > 0 && stock <= stockCritico && (
          <p className="text-danger">Stock crítico: quedan pocas unidades.</p>
        )}
        <Link className="detalle-enlace mb-3" to={`/productos/${id}`}>
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

export default TarjetaProducto;
