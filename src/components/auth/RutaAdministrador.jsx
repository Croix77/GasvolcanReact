import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
function RutaAdministrador() {
  const { sesion, cargando } = useAuth();
  const ubicacion = useLocation();
  if (cargando) return <p>Cargando sesión...</p>;
  return sesion?.rol === "administrador" ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />
  );
}
export default RutaAdministrador;
