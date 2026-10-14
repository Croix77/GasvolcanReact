import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import TarjetaProducto from "../components/TarjetaProducto";

function Catalogo({
  productos,
  onAgregar,
  categoriasDisponibles,
  titulo = "CatÃ¡logo de productos",
  esPagina = false,
}) {
  const [busqueda, setBusqueda] = useState("");
  const [parametros, setParametros] = useSearchParams();
  const categoriaSolicitada = parametros.get("categoria") || "";
  const categorias = categoriasDisponibles?.map(
    (categoria) => categoria.nombre,
  ) || [...new Set(productos.map((producto) => producto.categoria))];
  const categoria = categorias.includes(categoriaSolicitada) ? categoriaSolicitada : "";
  function cambiarCategoria(nombre) {
    const nuevos = new URLSearchParams(parametros);
    if (nombre) nuevos.set("categoria", nombre);
    else nuevos.delete("categoria");
    setParametros(nuevos);
  }
  const visibles = productos.filter(
    (producto) =>
      (!categoria || producto.categoria === categoria) &&
      `${producto.nombre} ${producto.descripcion}`
        .toLocaleLowerCase("es")
        .includes(busqueda.trim().toLocaleLowerCase("es")),
  );
  const Titulo = esPagina ? "h1" : "h2";
  return (
    <section aria-labelledby="titulo-catalogo" className="catalogo">
      <div className="catalogo-cabecera">
        <div>
          <p className="sobre-titulo">TODO LO QUE NECESITAS</p>
          <Titulo id="titulo-catalogo">{titulo}</Titulo>
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
          <label htmlFor="categoria">CategorÃ­a</label>
          <select
            id="categoria"
            className="form-select"
            value={categoria}
            onChange={(evento) => cambiarCategoria(evento.target.value)}
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
              nivelTitulo={esPagina ? "h2" : "h3"}
              onAgregar={() => onAgregar(producto)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
export default Catalogo;
