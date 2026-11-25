import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { etiquetasRol } from "../services/sesion";

function NavbarApp({ totalPedidos = 0 }) {
  const { sesion, salir } = useAuth();
  const tieneTienda = ["administrador", "cliente"].includes(sesion?.rol);
  const vende = sesion?.rol === "vendedor";
  const despacha = ["operadora", "repartidor"].includes(sesion?.rol);
  const inicio = vende ? "/catalogo" : despacha ? "/despacho" : "/";
  const enlaces = sesion
    ? [
        ...(tieneTienda ? [
          ["/", "Inicio"], ["/catalogo", "Catálogo"], ["/categorias", "Categorías"],
          ["/ofertas", "Ofertas"], ["/nosotros", "Nosotros"], ["/contacto", "Contacto"],
        ] : []),
        ...(sesion.rol === "cliente" ? [["/carrito", "Carrito"], ["/mis-pedidos", "Historial de pedidos"]] : []),
        ...(sesion.rol === "administrador" ? [["/admin", "Administración"]] : []),
        ...(vende ? [["/catalogo", "Productos"]] : []),
        ...(vende || despacha ? [["/despacho", "Pedidos"]] : []),
      ]
    : [["/login", "Iniciar sesión"]];
  const [expandido, setExpandido] = useState(false);
  return (
    <Navbar
      collapseOnSelect
      expand="xl"
      className="navegacion"
      sticky="top"
      expanded={expandido}
      onToggle={setExpandido}
    >
      <Container>
        <Navbar.Brand as={Link} to={inicio} aria-label="Gas El Volcán">
          <img
            className="marca-banner"
            src="/img/banner-gas-el-volcan.png"
            alt="Gas El Volcán, distribución de gas a domicilio"
            width="320"
            height="120"
          />
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="menu-principal"
          label="Abrir menú"
          aria-expanded={expandido}
        />
        <Navbar.Collapse id="menu-principal">
          <Nav className="ms-auto">
            {enlaces.map(([ruta, nombre]) => (
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
            {sesion && (
              <span className="sesion-rol">
                Conectado: {etiquetasRol[sesion.rol]}
              </span>
            )}
            {sesion && (
              <button
                className="btn btn-outline-secondary"
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
