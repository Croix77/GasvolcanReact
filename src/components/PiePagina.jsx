import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
function PiePagina() {
  return (
    <footer className="pie-pagina">
      <Container>
        <div className="pie-contenido">
          <div>
            <p className="pie-marca">
              Gas El Volcán<span>.</span>
            </p>
            <p>El calor de tu hogar, más cerca.</p>
            <small>Chillán · Región de Ñuble</small>
          </div>
          <div>
            <h2>Tu pedido</h2>
            <Link to="/catalogo">Explorar productos</Link>
            <Link to="/carrito">Revisar carrito</Link>
            <Link to="/mis-pedidos">Consultar mis pedidos</Link>
          </div>
          <div>
            <h2>Estamos cerca</h2>
            <Link to="/nosotros">Zonas y horarios de despacho</Link>
            <Link to="/contacto">Preparar una consulta</Link>
            <p>Cilindros y accesorios para el hogar.</p>
          </div>
        </div>
        <p className="pie-legal">
          © {new Date().getFullYear()} Distribuidora Gas El Volcán. Todos los
          derechos reservados.
        </p>
      </Container>
    </footer>
  );
}
export default PiePagina;
