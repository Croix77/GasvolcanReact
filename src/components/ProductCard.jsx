// src/components/ProductCard.jsx

function ProductCard({ producto, onAgregar }) {
  // Protección por si producto llega undefined o nulo
  if (!producto) return null;

  // Verificamos si el stock está en nivel crítico
  const esStockCritico = producto.stock > 0 && producto.stock <= (producto.stockCritico || 5);

  return (
    <article className="card h-100 shadow-sm border-0">
      {/* Imagen del producto */}
      {producto.imagen && (
        <div className="text-center p-3 bg-light border-bottom">
          <img 
            src={producto.imagen} 
            alt={producto.nombre} 
            style={{ height: "140px", objectFit: "contain" }}
            className="img-fluid"
            onError={(e) => {
              e.target.style.display = 'none'; // Si falla la ruta, oculta la imagen para no romper el diseño
            }}
          />
        </div>
      )}

      <div className="card-body d-flex flex-column">
        {/* Categoría */}
        {producto.categoria && (
          <span className="badge bg-secondary mb-2 align-self-start">
            {producto.categoria}
          </span>
        )}

        {/* Nombre del Producto */}
        <h3 className="h5 card-title">{producto.nombre}</h3>

        {/* Descripción */}
        <p className="card-text text-muted small">{producto.descripcion}</p>

        <div className="mt-auto pt-3">
          {/* Precio */}
          {producto.precio !== undefined && (
            <p className="fw-bold text-primary fs-5 mb-1">
              ${producto.precio.toLocaleString("es-CL")}
            </p>
          )}

          {/* Stock */}
          <p className="small mb-2">
            Stock disponible: <strong>{producto.stock}</strong>
          </p>

          {/* Alerta de Stock Crítico */}
          {esStockCritico && (
            <p className="text-danger fw-bold small mb-2">
              ¡Stock crítico! Quedan pocas unidades.
            </p>
          )}

          {/* Alerta de Agotado */}
          {producto.stock === 0 && (
            <p className="text-muted fw-bold small mb-2">
              Producto agotado
            </p>
          )}

          {/* Botón de Acción */}
          <button
            className="btn btn-warning w-100 fw-bold"
            onClick={() => onAgregar && onAgregar(producto)}
            disabled={producto.stock === 0}
          >
            {producto.stock === 0 ? "Agotado" : "Pedir Cilindro"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;