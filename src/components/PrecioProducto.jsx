import { moneda } from "../utils/moneda";

export default function PrecioProducto({ precio, precioAnterior, oferta = false }) {
  return (
    <div className="precio-y-oferta">
      <div className="producto-precios">
        {oferta && precio != null && precioAnterior > precio && (
          <p className="precio-anterior">Antes: <del>{moneda(precioAnterior)}</del></p>
        )}
      <p className="precio-producto">
        <span className={precio === 0 ? "producto-gratis" : undefined}>
          {precio == null ? "Precio por confirmar" : precio === 0 ? "Gratis" : moneda(precio)}
        </span>
      </p>
      </div>
      {oferta && <span className="producto-oferta">En oferta</span>}
    </div>
  );
}
