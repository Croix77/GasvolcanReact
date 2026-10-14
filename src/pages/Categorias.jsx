import { Link } from "react-router-dom";

export default function Categorias({ categorias, productos }) {
  return (
    <section aria-labelledby="titulo-categorias" className="catalogo">
      <div className="catalogo-cabecera">
        <div>
          <p className="sobre-titulo">ENCUENTRA LO QUE NECESITAS</p>
          <h1 id="titulo-categorias">Categorías</h1>
        </div>
        <p>Elige un tipo de producto para explorar el catálogo.</p>
      </div>
      {categorias.length === 0 && <p>No hay categorías disponibles.</p>}
      <div className="row g-4">
        {categorias.map((categoria) => {
          const asignados = productos.filter(
            (producto) => producto.categoria === categoria.nombre,
          );
          const ejemplos = asignados.slice(0, 2).map((producto) => producto.nombre);
          return (
            <div key={categoria.id} className="col-12 col-md-6">
              <article className="tarjeta-categoria">
                <h2>{categoria.nombre}</h2>
                <p>{ejemplos.length ? `Encuentra ${ejemplos.join(" y ")}.` : "Estamos preparando productos para esta categoría."}</p>
                <p className="catalogo-cantidad">{asignados.length} {asignados.length === 1 ? "producto" : "productos"}</p>
                <Link
                  className="btn btn-primary"
                  aria-label={`Ver productos de ${categoria.nombre}`}
                  to={`/catalogo?${new URLSearchParams({ categoria: categoria.nombre })}`}
                >
                  Ver productos
                </Link>
              </article>
            </div>
          );
        })}
      </div>
    </section>
  );
}
