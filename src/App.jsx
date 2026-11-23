import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import NavbarApp from "./components/NavbarApp";
import PiePagina from "./components/PiePagina";
import Bienvenida from "./components/Bienvenida";
import Carrito from "./components/Carrito";
import CarritoSidebar from "./components/CarritoSidebar";
import Toast from "./components/Toast";
import { useAuth } from "./hooks/useAuth";
import { useCarrito } from "./hooks/useCarrito";
import { useCatalogo } from "./hooks/useCatalogo";
import { usePedidos } from "./hooks/usePedidos";
import { useUsuarios } from "./hooks/useUsuarios";
import Catalogo from "./pages/Catalogo";
import Categorias from "./pages/Categorias";
import DetalleProducto from "./pages/DetalleProducto";
import Nosotros from "./pages/Nosotros";
import Contacto from "./pages/Contacto";
import Checkout from "./pages/Checkout";
import ResultadoCompra from "./pages/ResultadoCompra";
import NoEncontrada from "./pages/NoEncontrada";
import AuthProvider from "./contexts/AuthProvider";
import RutaProtegida from "./components/auth/RutaProtegida";
import Login from "./pages/Login";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminInicio from "./pages/admin/AdminInicio";
import AdminProductos from "./pages/admin/AdminProductos";
import AdminPerfil from "./pages/admin/AdminPerfil";
import AdminReportes from "./pages/admin/AdminReportes";
import AdminCategorias from "./pages/admin/AdminCategorias";
import AdminUsuarios from "./pages/admin/AdminUsuarios";
import MisPedidos from "./pages/MisPedidos";
import PedidosDespacho from "./pages/PedidosDespacho";
import { MAX_UNIDADES_POR_PRODUCTO } from "./utils/compra";

function ContenidoSesion() {
  const { sesion, salir, aviso, cerrarAviso } = useAuth();
  const administra = sesion?.rol === "administrador";
  const compra = sesion?.rol === "cliente";
  const puedeVerCatalogo = administra || compra || sesion?.rol === "vendedor";
  const catalogo = useCatalogo(puedeVerCatalogo ? sesion.token : null);
  const carrito = useCarrito(catalogo.productos, sesion?.correo ?? "sin-sesion");
  const [toast, setToast] = useState({ visible: false, mensaje: "" });
  const historial = usePedidos(administra || compra ? sesion.token : null);
  const usuarios = useUsuarios(administra ? sesion.token : null);

  function agregarProducto(producto) {
    if (!compra) return;
    const actual = carrito.items.find((item) => item.id === producto.id);
    if (actual?.cantidad >= MAX_UNIDADES_POR_PRODUCTO) {
      setToast({ visible: true, mensaje: `Máximo ${MAX_UNIDADES_POR_PRODUCTO} unidades de ${producto.nombre} por compra.` });
      return;
    }
    carrito.agregar(producto.id);
    setToast({ visible: true, mensaje: `${producto.nombre} añadido al carrito` });
  }

  async function crearPedido(datos) {
    const pedido = await historial.agregar(datos);
    // El servicio confirma el stock disponible y descuenta el pedido en MySQL.
    void catalogo.recargar();
    return pedido;
  }

  const onAgregar = compra ? agregarProducto : undefined;
  const totalItems = carrito.items.reduce((suma, item) => suma + item.cantidad, 0);
  const pedidos = historial.pedidos;
  const vistaCatalogo = (vista) => {
    if (catalogo.cargando && !catalogo.productos.length)
      return <p role="status">Cargando catálogo…</p>;
    if (catalogo.error)
      return <div role="alert"><p>{catalogo.error}</p><button type="button" className="btn btn-outline-secondary" onClick={catalogo.recargar}>Volver a intentar</button></div>;
    return vista;
  };

  return (
    <>
      <a className="saltar-contenido" href="#contenido">Saltar al contenido</a>
      <NavbarApp totalPedidos={compra ? totalItems : 0} />
      {compra && <CarritoSidebar {...carrito} totalItems={totalItems} />}
      <main tabIndex={-1} id="contenido" className="container contenido-principal">
        <div role="status" aria-live="polite" aria-atomic="true">
          {aviso && (
            <div className="alert alert-success d-flex align-items-center justify-content-between gap-3">
              <span>{aviso}</span>
              <button type="button" className="btn-close" aria-label="Cerrar aviso de sesión" onClick={cerrarAviso} />
            </div>
          )}
        </div>
        <Toast mensaje={toast.mensaje} visible={toast.visible} onClose={() => setToast({ visible: false, mensaje: "" })} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<RutaProtegida />}>
            <Route path="/" element={puedeVerCatalogo ? vistaCatalogo(<Bienvenida productos={catalogo.productos} onAgregar={onAgregar} />) : <Navigate to="/despacho" replace />} />
          </Route>
          <Route element={<RutaProtegida roles={["administrador", "cliente", "vendedor"]} />}>
            <Route path="/catalogo" element={vistaCatalogo(<Catalogo esPagina productos={catalogo.productos} categoriasDisponibles={catalogo.categorias} onAgregar={onAgregar} />)} />
            <Route path="/categorias" element={vistaCatalogo(<Categorias productos={catalogo.productos} categorias={catalogo.categorias} />)} />
            <Route path="/ofertas" element={vistaCatalogo(<Catalogo productos={catalogo.productos.filter((producto) => producto.oferta)} onAgregar={onAgregar} titulo="Ofertas" esPagina />)} />
            <Route path="/productos/:id" element={vistaCatalogo(<DetalleProducto productos={catalogo.productos} onAgregar={onAgregar} />)} />
            <Route path="/nosotros" element={<Nosotros />} />
            <Route path="/contacto" element={<Contacto token={sesion?.token} />} />
            <Route path="*" element={<NoEncontrada />} />
          </Route>
          <Route element={<RutaProtegida roles={["cliente"]} />}>
            <Route path="/carrito" element={vistaCatalogo(<Carrito {...carrito} esPagina />)} />
            <Route path="/mis-pedidos" element={<MisPedidos {...historial} />} />
            <Route path="/checkout" element={vistaCatalogo(<Checkout items={carrito.items} vaciar={carrito.vaciar} onPedido={crearPedido} />)} />
            <Route path="/compra/:resultado" element={<ResultadoCompra />} />
          </Route>
          <Route element={<RutaProtegida roles={["administrador", "vendedor", "operadora", "repartidor"]} />}>
            <Route path="/despacho" element={<PedidosDespacho />} />
          </Route>
          <Route element={<RutaProtegida roles={["administrador"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={vistaCatalogo(<AdminInicio productos={catalogo.productos} pedidos={pedidos} />)} />
              <Route path="productos" element={vistaCatalogo(<AdminProductos {...catalogo} />)} />
              <Route path="pedidos" element={<PedidosDespacho />} />
              <Route path="reportes" element={vistaCatalogo(<AdminReportes productos={catalogo.productos} pedidos={pedidos} error={historial.error} />)} />
              <Route path="perfil" element={<AdminPerfil />} />
              <Route path="categorias" element={vistaCatalogo(<AdminCategorias {...catalogo} />)} />
              <Route path="usuarios" element={<AdminUsuarios {...usuarios} correoSesion={sesion?.correo} alCambiarClavePropia={salir} />} />
            </Route>
          </Route>
        </Routes>
      </main>
      <PiePagina />
    </>
  );
}

function ContenidoApp() {
  const { sesion } = useAuth();
  return <ContenidoSesion key={sesion?.correo ?? "sin-sesion"} />;
}

export default function App() {
  return <AuthProvider><ContenidoApp /></AuthProvider>;
}
