import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ListaPedidos from "../components/pedidos/ListaPedidos";
function MisPedidos({ pedidos, cargando }) {
  const { sesion, cargando: cargandoSesion } = useAuth();
  const ubicacion = useLocation();
  if (cargandoSesion) return <p>Cargando...</p>;
  if (!sesion) return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />;
  return (
    <section className="historial-pagina">
      <p className="sobre-titulo">TU HISTORIAL</p>
      <h1>Historial de pedidos</h1>
      {cargando ? <p>Cargando pedidos...</p> : <ListaPedidos pedidos={pedidos} />}
    </section>
  );
}
export default MisPedidos;
