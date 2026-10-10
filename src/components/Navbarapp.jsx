import { Container, Nav, Navbar } from "react-bootstrap";

function NavbarApp() {
  return (
    <Navbar expand="md" bg="dark" data-bs-theme="dark" sticky="top">
      <Container>
        <Navbar.Brand href="#inicio">🔥 Gasvolcan</Navbar.Brand>
        <Navbar.Toggle aria-controls="menu-principal" />
        <Navbar.Collapse id="menu-principal">
          <Nav className="ms-auto">
            <Nav.Link href="#inicio">Inicio</Nav.Link>
            <Nav.Link href="#catalogo">Catálogo</Nav.Link>
            <Nav.Link href="#admin">Administración</Nav.Link>
            <Nav.Link href="#carrito">🛒 Carrito</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarApp;