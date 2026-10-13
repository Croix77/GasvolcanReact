import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import NavbarApp from "./components/NavbarApp";
import PiePagina from "./components/PiePagina";
import Bienvenida from "./components/Bienvenida";
import Carrito from "./components/Carrito";
import { useCarrito } from "./hooks/useCarrito";
import { useCatalogo } from "./hooks/useCatalogo";
import Catalogo from "./pages/Catalogo";
import DetalleProducto from "./pages/DetalleProducto";
import Nosotros from "./pages/Nosotros";
import Contacto from "./pages/Contacto";
import Checkout from "./pages/Checkout";
import ResultadoCompra from "./pages/ResultadoCompra";
import Administracion from "./pages/admin/AdminProductos";
import NoEncontrada from "./pages/NoEncontrada";

function App() {
  const catalogo = useCatalogo();
  const carrito = useCarrito(catalogo.productos);
  const [mensaje, setMensaje] = useState("");
  const [pedidos, setPedidos] = useState([]);

  function agregarProducto(producto) {
    carrito.agregar(producto.id);
    setMensaje(`${producto.nombre}: carrito actualizado.`);
  }
  const listado = (
    <Catalogo productos={catalogo.productos} onAgregar={agregarProducto} />
  );
  return (
    <>
      <NavbarApp />
      <main id="contenido" className="container py-4">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Bienvenida />
                {listado}
                <Carrito {...carrito} />
              </>
            }
          />
          <Route path="/catalogo" element={listado} />
          <Route
            path="/categorias"
            element={
              <Catalogo
                productos={catalogo.productos}
                onAgregar={agregarProducto}
                titulo="Categorías"
              />
            }
          />
          <Route
            path="/ofertas"
            element={
              <Catalogo
                productos={catalogo.productos.filter(
                  (producto) => producto.oferta,
                )}
                onAgregar={agregarProducto}
                titulo="Ofertas"
              />
            }
          />
          <Route
            path="/productos/:id"
            element={
              <DetalleProducto
                productos={catalogo.productos}
                onAgregar={agregarProducto}
              />
            }
          />
          <Route path="/carrito" element={<Carrito {...carrito} />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route
            path="/checkout"
            element={
              <Checkout
                items={carrito.items}
                vaciar={carrito.vaciar}
                onPedido={(pedido) =>
                  setPedidos((actual) => [...actual, pedido])
                }
              />
            }
          />
          <Route path="/compra/:resultado" element={<ResultadoCompra />} />
          <Route
            path="/admin"
            element={<Administracion {...catalogo} pedidos={pedidos} />}
          />
          <Route path="*" element={<NoEncontrada />} />
        </Routes>
        <p role="status" className="mt-3">
          {mensaje}
        </p>
      </main>
      <PiePagina />
    </>
  );
}

export default App;
