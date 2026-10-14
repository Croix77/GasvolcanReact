import AdminPruebas from "./pages/admin/AdminPruebas";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import NavbarApp from "./components/NavbarApp";
import PiePagina from "./components/PiePagina";
import Bienvenida from "./components/Bienvenida";
import Carrito from "./components/Carrito";
import { useCarrito } from "./hooks/useCarrito";
import { useCatalogo } from "./hooks/useCatalogo";
import Catalogo from "./pages/Catalogo";
import Categorias from "./pages/Categorias";
import DetalleProducto from "./pages/DetalleProducto";
import Nosotros from "./pages/Nosotros";
import Contacto from "./pages/Contacto";
import Checkout from "./pages/Checkout";
import ResultadoCompra from "./pages/ResultadoCompra";
import AdminProductos from "./pages/admin/AdminProductos";
import NoEncontrada from "./pages/NoEncontrada";
import AuthProvider from "./contexts/AuthProvider";
import RutaAdministrador from "./components/auth/RutaAdministrador";
import Login from "./pages/Login";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminInicio from "./pages/admin/AdminInicio";
import AdminPerfil from "./pages/admin/AdminPerfil";
import AdminReportes from "./pages/admin/AdminReportes";
import MisPedidos from "./pages/MisPedidos";
import ListaPedidos from "./components/pedidos/ListaPedidos";
import { usePedidos } from "./hooks/usePedidos";
import { useUsuariosDemo } from "./hooks/useUsuariosDemo";
import AdminCategorias from "./pages/admin/AdminCategorias";
import AdminUsuarios from "./pages/admin/AdminUsuarios";

function ContenidoApp() {
  const catalogo = useCatalogo();
  const carrito = useCarrito(catalogo.productos);
  const [mensaje, setMensaje] = useState("");
  const historial = usePedidos();
  const pedidos = historial.pedidos;
  const usuariosDemo = useUsuariosDemo();

  function agregarProducto(producto) {
    carrito.agregar(producto.id);
    setMensaje(`${producto.nombre}: carrito actualizado.`);
  }
  const listado = (
    <Catalogo
      productos={catalogo.productos}
      categoriasDisponibles={catalogo.categorias}
      onAgregar={agregarProducto}
    />
  );
  return (
    <>
      <a className="saltar-contenido" href="#contenido">
        Saltar al contenido
      </a>
      <NavbarApp
        totalPedidos={carrito.items.reduce(
          (suma, item) => suma + item.cantidad,
          0,
        )}
      />
      <main
        tabIndex={-1}
        id="contenido"
        className="container contenido-principal"
      >
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
          <Route
            path="/catalogo"
            element={
              <Catalogo
                esPagina
                productos={catalogo.productos}
                categoriasDisponibles={catalogo.categorias}
                onAgregar={agregarProducto}
              />
            }
          />
          <Route
            path="/categorias"
            element={
              <Categorias
                productos={catalogo.productos}
                categorias={catalogo.categorias}
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
                esPagina
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
          <Route path="/carrito" element={<Carrito {...carrito} esPagina />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mis-pedidos" element={<MisPedidos {...historial} />} />
          <Route
            path="/checkout"
            element={
              <Checkout
                items={carrito.items}
                vaciar={carrito.vaciar}
                onPedido={historial.agregar}
              />
            }
          />
          <Route path="/compra/:resultado" element={<ResultadoCompra />} />
          <Route element={<RutaAdministrador />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route
                index
                element={
                  <AdminInicio
                    productos={catalogo.productos}
                    pedidos={pedidos}
                  />
                }
              />
              <Route
                path="productos"
                element={<AdminProductos {...catalogo} />}
              />
              <Route
                path="pedidos"
                element={
                  <section>
                    <h1>Pedidos de demostración</h1>
                    <ListaPedidos pedidos={pedidos} />
                  </section>
                }
              />
              <Route
                path="reportes"
                element={
                  <AdminReportes
                    productos={catalogo.productos}
                    pedidos={pedidos}
                  />
                }
              />
              <Route path="perfil" element={<AdminPerfil />} />
              <Route path="pruebas" element={<AdminPruebas />} />
              <Route
                path="categorias"
                element={<AdminCategorias {...catalogo} />}
              />
              <Route
                path="usuarios"
                element={<AdminUsuarios {...usuariosDemo} />}
              />
            </Route>
          </Route>
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
function App() {
  return (
    <AuthProvider>
      <ContenidoApp />
    </AuthProvider>
  );
}
