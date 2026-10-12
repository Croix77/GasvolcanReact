import { moneda } from "../utils/moneda";

function ProductCard({ nombre, descripcion, precio, imagen, onAgregar }) {
  return (
    <article className="card h-100 shadow-sm">
      <img src={imagen} alt={nombre} className="card-img-top p-3" style={{ height: "240px", objectFit: "contain" }} />
      <div className="card-body d-flex flex-column">
        <h3 className="h5">{nombre}</h3>
        <p className="card-text">{descripcion}</p>
        <p className="fw-bold text-primary fs-4">{precio == null ? "Precio por confirmar" : moneda(precio)}</p>
        <button type="button" className="btn btn-primary mt-auto" onClick={onAgregar}>Añadir al Carrito</button>
      </div>
    </article>
  );
}

export default ProductCard;
