import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PrecioProducto from "./PrecioProducto";

function OfertasCarousel({ productos, onAgregar, portada }) {
  const [indice, setIndice] = useState(0);
  const [pausado, setPausado] = useState(false);
  const total = productos.length + (portada ? 1 : 0);
  const indiceActual = total ? indice % total : 0;

  useEffect(() => {
    if (total <= 1 || pausado) return;
    const intervalo = setInterval(() => setIndice((i) => (i + 1) % total), 4000);
    return () => clearInterval(intervalo);
  }, [total, pausado]);

  if (!total) return null;
  const diapositivas = [
    ...(portada ? [{ id: "formatos", contenido: portada }] : []),
    ...productos.map((producto) => ({
      id: producto.id,
      contenido: (
        <article className="oferta-compacta">
          {producto.imagen ? (
            <img className="oferta-compacta-imagen" src={producto.imagen} alt={producto.nombre} />
          ) : (
            <div className="oferta-compacta-marcador" aria-hidden="true">{producto.categoria || "Accesorios"}</div>
          )}
          <h3>{producto.nombre}</h3>
          <PrecioProducto precio={producto.precio} precioAnterior={producto.precioAnterior} oferta={producto.oferta} />
          <div className="d-flex justify-content-center gap-2 flex-wrap">
            <Link className="btn btn-outline-primary btn-sm" to={`/productos/${producto.id}`}>Ver detalle</Link>
            <button className="btn btn-primary btn-sm" type="button" disabled={producto.stock === 0} onClick={() => onAgregar(producto)}>
              {producto.stock === 0 ? "Agotado" : "Añadir al Carrito"}
            </button>
          </div>
        </article>
      ),
    })),
  ];

  return (
    <section className="ofertas-carousel bienvenida-visual" aria-labelledby="titulo-ofertas">
      <h2 id="titulo-ofertas" className="sobre-titulo">{portada ? "FORMATOS Y OFERTAS" : "OFERTAS DESTACADAS"}</h2>
      <div className="ofertas-ventana">
        <div className="ofertas-track" style={{ transform: `translateX(-${indiceActual * 100}%)` }}>
          {diapositivas.map((slide, i) => (
            <div key={slide.id} className="oferta-slide" aria-hidden={i !== indiceActual} inert={i !== indiceActual}>
              {slide.contenido}
            </div>
          ))}
        </div>
      </div>
      <div className="d-flex gap-2 justify-content-center flex-wrap mt-2">
        {diapositivas.map((slide, i) => (
          <button key={slide.id} type="button" className={`btn btn-sm ${i === indiceActual ? "btn-warning" : "btn-outline-secondary"}`}
            onClick={() => setIndice(i)} aria-label={portada ? `Ver destacado ${i + 1}` : `Ver oferta ${i + 1}`}
            aria-current={i === indiceActual ? "true" : "false"}>{i + 1}</button>
        ))}
        {total > 1 && <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setPausado(!pausado)}>{pausado ? "Reanudar" : "Pausar"}</button>}
      </div>
      <p className="small text-muted my-2">{portada ? "Destacado" : "Oferta"} {indiceActual + 1} de {total}
        {total > 1 && !pausado && " - Cambia automáticamente cada 4s"}</p>
      <Link to="/ofertas" className="detalle-enlace">Ver todas las ofertas</Link>
    </section>
  );
}
export default OfertasCarousel;
