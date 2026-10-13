import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink, Link } from "react-router-dom";

function NavbarApp() {
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
              >
                {nombre}
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarApp;
