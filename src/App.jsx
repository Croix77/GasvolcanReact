import { MAX_UNIDADES_POR_PRODUCTO } from "./utils/compra";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import NavbarApp from "./components/NavbarApp";
import PiePagina from "./components/PiePagina";
import Bienvenida from "./components/Bienvenida";
import Carrito from "./components/Carrito";
import CarritoSidebar from "./components/CarritoSidebar";
import Toast from "./components/Toast";
import { useAuth } from "./hooks/useAuth";
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
import AdminCategorias from "./pages/admin/AdminCategorias";
import AdminUsuarios from "./pages/admin/AdminUsuarios";

function ContenidoApp() {
  const { aviso, cerrarAviso } = useAuth();
  const catalogo = useCatalogo();
  const carrito = useCarrito(catalogo.productos);
  const [toast, setToast] = useState({ visible: false, mensaje: "" });
  const historial = usePedidos();

  function agregarProducto(producto) {
    const actual = carrito.items.find((item) => item.id === producto.id);
    if (actual && actual.cantidad >= MAX_UNIDADES_POR_PRODUCTO) {
      setToast({ visible: true, mensaje: `Máximo ${MAX_UNIDADES_POR_PRODUCTO} unidades de ${producto.nombre} por compra.` });
      return;
    }
    carrito.agregar(producto.id);
    setToast({ visible: true, mensaje: `${producto.nombre} añadido al carrito` });
  }
  const totalItems = carrito.items.reduce((suma, item) => suma + item.cantidad, 0);
  return (
    <>
      <a className="saltar-contenido" href="#contenido">Saltar al contenido</a>
      <NavbarApp totalPedidos={totalItems} />
      <CarritoSidebar items={carrito.items} cambiarCantidad={carrito.cambiarCantidad} eliminar={carrito.eliminar} vaciar={carrito.vaciar} totalItems={totalItems} />
      <main tabIndex={-1} id="contenido" className="container contenido-principal">
        <div role="status" aria-live="polite" aria-atomic="true">
          {aviso && <div className="alert alert-success d-flex align-items-center justify-content-between gap-3"><span>{aviso}</span><button type="button" className="btn-close" aria-label="Cerrar aviso" onClick={cerrarAviso} /></div>}
        </div>
        <Toast mensaje={toast.mensaje} visible={toast.visible} onClose={() => setToast({ visible: false, mensaje: "" })} />
        <Routes>
          <Route path="/" element={<Bienvenida productos={catalogo.productos} onAgregar={agregarProducto} />} />
          <Route path="/catalogo" element={<Catalogo esPagina productos={catalogo.productos} categoriasDisponibles={catalogo.categorias} onAgregar={agregarProducto} />} />
          <Route path="/categorias" element={<Categorias productos={catalogo.productos} categorias={catalogo.categorias} />} />
          <Route path="/ofertas" element={<Catalogo productos={catalogo.productos.filter((p) => p.oferta)} onAgregar={agregarProducto} titulo="Ofertas" esPagina />} />
          <Route path="/productos/:id" element={<DetalleProducto productos={catalogo.productos} onAgregar={agregarProducto} />} />
          <Route path="/carrito" element={<Carrito {...carrito} esPagina />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mis-pedidos" element={<MisPedidos {...historial} />} />
          <Route path="/checkout" element={<Checkout items={carrito.items} vaciar={carrito.vaciar} onPedido={historial.agregar} />} />
          <Route path="/compra/:resultado" element={<ResultadoCompra />} />
          <Route element={<RutaAdministrador />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminInicio productos={catalogo.productos} pedidos={historial.pedidos} />} />
              <Route path="productos" element={<AdminProductos {...catalogo} />} />
              <Route path="pedidos" element={<section><h1>Pedidos</h1><ListaPedidos pedidos={historial.pedidos} /></section>} />
              <Route path="reportes" element={<AdminReportes productos={catalogo.productos} pedidos={historial.pedidos} />} />
              <Route path="perfil" element={<AdminPerfil />} />
              <Route path="categorias" element={<AdminCategorias {...catalogo} />} />
              <Route path="usuarios" element={<AdminUsuarios />} />
            </Route>
          </Route>
          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </main>
      <PiePagina />
    </>
  );
}

function App() {
  return <AuthProvider><ContenidoApp /></AuthProvider>;
}
export default App;
