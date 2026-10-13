import { useState, useEffect } from "react";
import NavbarApp from "./components/Navbarapp";
import PiePagina from "./components/PiePagina";
import Bienvenida from "./components/Bienvenida";
import ProductCard from "./components/ProductCard";
import { productos } from "./data/productos";

function App() {
  // Estado para el carrito/pedidos con persistencia en localStorage (Guía 10)
  const [pedidos, setPedidos] = useState(() => {
    const guardados = localStorage.getItem("pedidosGas");
    return guardados ? JSON.parse(guardados) : [];
  });

  // Sincronizamos con localStorage cada vez que cambia la lista de pedidos
  useEffect(() => {
    localStorage.setItem("pedidosGas", JSON.stringify(pedidos));
  }, [pedidos]);

  // Función para agregar un producto al pedido sin duplicar (o incrementando cantidad)
  function agregarPedido(producto) {
    const yaExiste = pedidos.some((item) => item.codigo === producto.codigo);

    if (yaExiste) {
      // Si ya existe, podemos avisar o ignorar (o bien sumar unidades si prefieres)
      console.log("El producto ya está en tus pedidos:", producto.nombre);
      return;
    }

    setPedidos([...pedidos, producto]);
  }

  return (
    <>
      <NavbarApp totalPedidos={pedidos.length} />
      <main className="container py-4">
        <Bienvenida />

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Catálogo de Productos</h2>
          {/* Indicador visual rápido de cuántos ítems lleva pedidos */}
          <span className="badge bg-primary fs-6">
            Pedidos en curso: {pedidos.length}
          </span>
        </div>

        {/* Contenedor de la grilla de Bootstrap */}
        <div className="row g-4 mt-3">
          {productos && productos.length > 0 ? (
            productos.map((prod) => (
              <div key={prod.codigo} className="col-12 col-md-6 col-lg-4">
                <ProductCard 
                  producto={prod} 
                  onAgregar={agregarPedido} 
                />
              </div>
            ))
          ) : (
            <p className="text-center">No hay productos disponibles.</p>
          )}
        </div>
      </main>
      <PiePagina />
    </>
  );
}

export default App;