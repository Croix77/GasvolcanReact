import { Link } from "react-router-dom";
import TarjetaProducto from "./TarjetaProducto";
import FormatosCilindros from "./FormatosCilindros";
import OfertasCarousel from "./OfertasCarousel";

function Bienvenida({ productos, onAgregar }) {
  const ofertas = productos.filter((p) => p.oferta);
  return (
    <>
      <section className="bienvenida" aria-labelledby="titulo-bienvenida">
        <div className="bienvenida-texto">
          <p className="sobre-titulo">DE CHILLÁN, PARA TU HOGAR</p>
          <h1 id="titulo-bienvenida">
            El calor de tu hogar,
            <br />
            <span>más cerca.</span>
          </h1>
          <p className="bienvenida-descripcion">
            Cilindros de gas y accesorios para el día a día. Elige lo que
            necesitas y prepara tu pedido a domicilio con Gas El Volcán.
          </p>
          <div className="d-flex flex-wrap gap-3">
            <Link className="btn btn-primary" to="/catalogo">
              Ver productos <span aria-hidden="true">→</span>
            </Link>
            <Link className="btn btn-outline-secondary" to="/nosotros">
              Consultar cobertura
            </Link>
          </div>
          <p className="bienvenida-nota">
            Distribuidora familiar en la Región de Ñuble desde 1998.
          </p>
        </div>
        <OfertasCarousel
          productos={ofertas}
          onAgregar={onAgregar}
          portada={<FormatosCilindros />}
        />
      </section>
      <div className="servicios-franja">
        <div>
          <span className="servicio-numero" aria-hidden="true">
            01
          </span>
          <p>
            <strong>Elige tu producto</strong>
            <span>Cilindros, reguladores y accesorios.</span>
          </p>
        </div>
        <div>
          <span className="servicio-numero" aria-hidden="true">
            02
          </span>
          <p>
            <strong>Revisa tu despacho</strong>
            <span>Cobertura en Chillán y comunas cercanas.</span>
          </p>
        </div>
        <div>
          <span className="servicio-numero" aria-hidden="true">
            03
          </span>
          <p>
            <strong>Prepara tu pedido</strong>
            <span>Revisa cantidades y datos de entrega.</span>
          </p>
        </div>
      </div>
      <section className="cilindros-inicio" aria-label="Cilindros de 5, 11 y 15 kg">
        <div className="row g-4">
          {["gas-5kg", "gas-11kg", "gas-15kg"].map((id) => {
            const producto = productos.find((item) => item.id === id);
            return producto ? (
              <div className="col-12 col-md-6 col-lg-4" key={id}>
                <TarjetaProducto {...producto} nivelTitulo="h2" onAgregar={() => onAgregar(producto)} />
              </div>
            ) : null;
          })}
        </div>
      </section>
    </>
  );
}
export default Bienvenida;
