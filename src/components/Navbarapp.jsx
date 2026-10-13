// src/components/Navbarapp.jsx
import { Container, Nav, Navbar, Button } from "react-bootstrap";

function NavbarApp({ totalPedidos }) {
  return (
    <Navbar expand="md" bg="dark" data-bs-theme="dark" sticky="top">
      <Container>
        <Navbar.Brand href="#inicio">🔥 Gas el volcan</Navbar.Brand>
        <Navbar.Toggle aria-controls="menu-principal" />
        <Navbar.Collapse id="menu-principal">
          <Nav className="ms-auto align-items-center">
            <Nav.Link href="#inicio">Inicio</Nav.Link>
            <Nav.Link href="#catalogo">Catálogo</Nav.Link>
            <Nav.Link href="#nosotros">Nosotros</Nav.Link>
            <Nav.Link href="#contacto">Contacto</Nav.Link>
            
            {/* Enlace de Carrito con indicador dinámico */}
            <Nav.Link href="#carrito" className="ms-lg-2">
              <Button variant="outline-warning" size="sm" className="position-relative">
                🛒 Carrito
                {totalPedidos > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {totalPedidos}
                  </span>
                )}
              </Button>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarApp;