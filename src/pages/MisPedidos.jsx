import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ListaPedidos from "../components/pedidos/ListaPedidos";
function MisPedidos({ pedidos, eliminar }) {
  const { sesion } = useAuth();
  const ubicacion = useLocation();
  if (!sesion) return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />;
  return (
    <section className="historial-pagina">
      <p className="sobre-titulo">TU HISTORIAL</p>
      <h1>Historial de pedidos</h1>
      <ListaPedidos pedidos={pedidos} eliminar={eliminar} />
    </section>
  );
}
export default MisPedidos;
