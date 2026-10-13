import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";

function NavbarApp({ totalPedidos = 0 }) {
  const { sesion, salir } = useAuth();
  const [expandido, setExpandido] = useState(false);
  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      bg="dark"
      data-bs-theme="dark"
      sticky="top"
      expanded={expandido}
      onToggle={setExpandido}
    >
      <Container>
        <Navbar.Brand as={Link} to="/">
          🔥 Gas El Volcán
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="menu-principal"
          label="Abrir menú"
          aria-expanded={expandido}
        />
        <Navbar.Collapse id="menu-principal">
          <Nav className="ms-auto">
            {[
              ["/", "Inicio"],
              ["/catalogo", "Catálogo"],
              ["/categorias", "Categorías"],
              ["/ofertas", "Ofertas"],
              ["/carrito", "Carrito"],
              ["/mis-pedidos", "Mis pedidos"],
              ["/nosotros", "Nosotros"],
              ["/contacto", "Contacto"],
              ...(sesion?.rol === "administrador"
                ? [["/admin", "Administración"]]
                : []),
              ...(!sesion ? [["/login", "Iniciar sesión"]] : []),
            ].map(([ruta, nombre]) => (
              <Nav.Link
                key={ruta}
                as={NavLink}
                to={ruta}
                end={ruta === "/"}
                eventKey={ruta}
                aria-label={ruta === "/carrito" ? "Carrito" : undefined}
              >
                {nombre}
                {ruta === "/carrito" && totalPedidos > 0 && (
                  <span
                    className="badge bg-warning text-dark ms-1"
                    aria-label={`${totalPedidos} unidades en el carrito`}
                  >
                    {totalPedidos}
                  </span>
                )}
              </Nav.Link>
            ))}
            {sesion?.rol === "cliente" && (
              <button
                className="btn btn-outline-light"
                type="button"
                onClick={salir}
              >
                Cerrar sesión
              </button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarApp;
