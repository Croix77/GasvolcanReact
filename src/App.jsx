import NavbarApp from "./components/NavbarApp";
import PiePagina from "./components/PiePagina";
import Bienvenida from "./components/Bienvenida";
import ProductCard from "./components/ProductCard";
import { productos } from "./data/productos";

function App() {
  return (
    <>
      <NavbarApp />
      <main id="inicio" className="container py-4">
        <Bienvenida />
        <section id="catalogo" aria-labelledby="titulo-catalogo" className="mt-4">
          <h2 id="titulo-catalogo">Catálogo de productos</h2>
          <div className="row g-4 mt-3">
            {productos.map((producto) => (
              <div key={producto.id} className="col-12 col-md-6 col-lg-4">
                <ProductCard {...producto} />
              </div>
            ))}
          </div>
        </section>
      </main>
      <PiePagina />
    </>
  );
}

export default App;
