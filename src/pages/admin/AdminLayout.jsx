import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
function AdminLayout() {
  const { salir } = useAuth();
  const navegar = useNavigate();
  return (
    <div className="row g-4 administracion-layout">
      <aside className="col-12 col-lg-3">
        <p className="sobre-titulo">ADMINISTRACIÓN</p>
        <nav
          aria-label="Menú administrativo"
          className="list-group administracion-menu"
        >
          {[
            ["/admin", "Panel general"],
            ["/admin/productos", "Productos"],
            ["/admin/categorias", "Categorías"],
            ["/admin/usuarios", "Usuarios"],
            ["/admin/pedidos", "Pedidos"],
            ["/admin/reportes", "Reportes"],
            ["/admin/perfil", "Perfil"],
            ["/admin/pruebas", "Configuración de demostración"],
          ].map(([ruta, nombre]) => (
            <NavLink
              key={ruta}
              to={ruta}
              end={ruta === "/admin"}
              className={({ isActive }) =>
                `list-group-item list-group-item-action ${isActive ? "active" : ""}`
              }
            >
              {nombre}
            </NavLink>
          ))}
          <button
            type="button"
            className="list-group-item list-group-item-action text-danger"
            onClick={() => {
              salir();
              navegar("/login", { replace: true });
            }}
          >
            Cerrar sesión
          </button>
        </nav>
      </aside>
      <div className="col-12 col-lg-9 administracion-contenido">
        <p className="alert alert-warning">
          Administración de demostración local. La restricción de rutas no
          sustituye la autenticación de un servidor.
        </p>
        <Outlet />
      </div>
    </div>
  );
}
export default AdminLayout;
