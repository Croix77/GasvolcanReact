import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TarjetaProducto from "./TarjetaProducto";

function OfertasCarousel({ productos, onAgregar }) {
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    if (productos.length <= 1) return;
    const interval = setInterval(() => {
      setIndice((i) => (i + 1) % productos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [productos.length]);

  if (productos.length === 0) return null;

  return (
    <section className="ofertas-carousel" aria-labelledby="titulo-ofertas">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 id="titulo-ofertas" className="h4 mb-0">
          <span className="sobre-titulo">OFERTAS ESPECIALES</span>
          Ofertas destacadas
        </h2>
        <div className="d-flex gap-2">
          {productos.map((_, i) => (
            <button
              key={i}
              className={`btn btn-sm ${i === indice ? "btn-warning" : "btn-outline-warning"}`}
              onClick={() => setIndice(i)}
              aria-label={`Ver oferta ${i + 1}`}
              aria-current={i === indice ? "true" : "false"}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
      <div className="ofertas-track" style={{ transform: `translateX(-${indice * 100}%)` }}>
        {productos.map((producto) => (
          <div key={producto.id} className="oferta-slide d-flex justify-content-center">
            <div style={{ maxWidth: "380px", width: "100%" }}>
              <TarjetaProducto
                {...producto}
                nivelTitulo="h3"
                onAgregar={() => onAgregar(producto)}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="text-center text-muted small mt-2">
        Oferta {indice + 1} de {productos.length} — Cambia automáticamente cada 4s
      </p>
      <div className="text-center mt-3">
        <Link to="/ofertas" className="btn btn-outline-primary">
          Ver todas las ofertas
        </Link>
      </div>
    </section>
  );
}

export default OfertasCarousel;