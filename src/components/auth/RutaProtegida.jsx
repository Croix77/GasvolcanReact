import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function RutaProtegida({ roles }) {
  const { sesion } = useAuth();
  const ubicacion = useLocation();
  if (!sesion)
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname + ubicacion.search }} />;
  if (roles && !roles.includes(sesion.rol))
    return <section><h1>Acceso restringido</h1><p>Tu cuenta no tiene permiso para abrir esta página.</p></section>;
  return <Outlet />;
}
