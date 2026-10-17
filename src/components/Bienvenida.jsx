import { Link } from "react-router-dom";
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
          portada={
            <div className="carrusel-formatos">
              <div className="bienvenida-cilindros" aria-hidden="true">
                <img className="cilindro-pequeno" src="/img/gas-5kg.png" alt="" />
                <img className="cilindro-grande" src="/img/gas-15kg.png" alt="" />
                <img className="cilindro-mediano" src="/img/gas-11kg.png" alt="" />
              </div>
              <p className="bienvenida-etiqueta">5, 11 y 15 kg · Elige tu formato</p>
            </div>
          }
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
    </>
  );
}
export default Bienvenida;
