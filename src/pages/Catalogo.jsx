import { useState } from "react";
import ProductCard from "../components/ProductCard";

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
    <section aria-labelledby="titulo-catalogo">
      <h2 id="titulo-catalogo">{titulo}</h2>
      <div className="row g-3 my-3">
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
      <p>{visibles.length} productos encontrados</p>
      {visibles.length === 0 && (
        <p>No hay productos disponibles con estos filtros.</p>
      )}
      <div className="row g-4 mt-3">
        {visibles.map((producto) => (
          <div key={producto.id} className="col-12 col-md-6 col-lg-4">
            <ProductCard {...producto} onAgregar={() => onAgregar(producto)} />
          </div>
        ))}
      </div>
    </section>
  );
}
export default Catalogo;
