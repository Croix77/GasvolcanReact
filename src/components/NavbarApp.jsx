import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink, Link } from "react-router-dom";

function NavbarApp({ totalPedidos = 0 }) {
  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      bg="dark"
      data-bs-theme="dark"
      sticky="top"
    >
      <Container>
        <Navbar.Brand as={Link} to="/">
          🔥 Gas El Volcán
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="menu-principal" label="Abrir menú" />
        <Navbar.Collapse id="menu-principal">
          <Nav className="ms-auto">
            {[
              ["/", "Inicio"],
              ["/catalogo", "Catálogo"],
              ["/categorias", "Categorías"],
              ["/ofertas", "Ofertas"],
              ["/carrito", "Carrito"],
              ["/nosotros", "Nosotros"],
              ["/contacto", "Contacto"],
              ["/admin", "Administración"],
            ].map(([ruta, nombre]) => (
              <Nav.Link
                key={ruta}
                as={NavLink}
                to={ruta}
                end={ruta === "/"}
                eventKey={ruta}
                aria-label={ruta === '/carrito' ? 'Carrito' : undefined}
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
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarApp;
