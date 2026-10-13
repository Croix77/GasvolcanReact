import { useState } from "react";
import TarjetaProducto from "../components/TarjetaProducto";

function Catalogo({
  productos,
  onAgregar,
  categoriasDisponibles,
  titulo = "Catálogo de productos",
}) {
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("");
  const categorias = categoriasDisponibles?.map(
    (categoria) => categoria.nombre,
  ) || [...new Set(productos.map((producto) => producto.categoria))];
  const visibles = productos.filter(
    (producto) =>
      (!categoria || producto.categoria === categoria) &&
      `${producto.nombre} ${producto.descripcion}`
        .toLocaleLowerCase("es")
        .includes(busqueda.trim().toLocaleLowerCase("es")),
  );
  return (
    <section aria-labelledby="titulo-catalogo" className="catalogo">
      <div className="catalogo-cabecera">
        <div>
          <p className="sobre-titulo">TODO LO QUE NECESITAS</p>
          <h2 id="titulo-catalogo">{titulo}</h2>
        </div>
        <p>
          Cilindros y accesorios.
          <br />
          Encuentra el adecuado para tu hogar.
        </p>
      </div>
      <div className="row g-3 filtros-catalogo">
        <div className="col-12 col-md-7">
          <label htmlFor="buscar">Buscar productos</label>
          <input
            id="buscar"
            className="form-control"
            type="search"
            value={busqueda}
            onChange={(evento) => setBusqueda(evento.target.value)}
          />
        </div>
        <div className="col-12 col-md-5">
          <label htmlFor="categoria">Categoría</label>
          <select
            id="categoria"
            className="form-select"
            value={categoria}
            onChange={(evento) => setCategoria(evento.target.value)}
          >
            <option value="">Todas</option>
            {categorias.map((nombre) => (
              <option key={nombre}>{nombre}</option>
            ))}
          </select>
        </div>
      </div>
      <p className="catalogo-cantidad">
        {visibles.length} productos encontrados
      </p>
      {visibles.length === 0 && (
        <p>No hay productos disponibles con estos filtros.</p>
      )}
      <div className="row g-4">
        {visibles.map((producto) => (
          <div key={producto.id} className="col-12 col-md-6 col-lg-4">
            <TarjetaProducto
              {...producto}
              onAgregar={() => onAgregar(producto)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
export default Catalogo;
