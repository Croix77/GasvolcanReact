import { moneda } from "../utils/moneda";

export default function PrecioProducto({ precio, oferta = false }) {
  return (
    <div className="precio-y-oferta">
      <p className="precio-producto">
        <span className={precio === 0 ? "producto-gratis" : undefined}>
          {precio == null ? "Precio por confirmar" : precio === 0 ? "Gratis" : moneda(precio)}
        </span>
      </p>
      {oferta && <span className="producto-oferta">En oferta</span>}
    </div>
  );
}
