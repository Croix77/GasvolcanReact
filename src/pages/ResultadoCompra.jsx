import { Link, useLocation, useParams } from "react-router-dom";
import { moneda } from "../utils/moneda";
function ResultadoCompra() {
  const { resultado } = useParams();
  const { state } = useLocation();
  const pedido = state?.pedido;
  if (!pedido || !["exito", "error"].includes(resultado))
    return (
      <section className="resultado-compra formulario-tarjeta">
        <h1>No hay un resumen de compra disponible</h1>
        <Link to="/carrito">Volver al carrito</Link>
      </section>
    );
  return (
    <section className="resultado-compra formulario-tarjeta">
      <h1>
        {resultado === "exito"
          ? "Compra confirmada"
          : "No se pudo completar la compra"}
      </h1>
      <p>
        {resultado === "exito"
          ? "Puedes consultar el resumen en Mis pedidos."
          : "Tu carrito se conserva para intentar nuevamente."}
      </p>
      <h2>Resumen</h2>
      <ul>
        {pedido.items.map((item) => (
          <li key={item.id}>
            {item.nombre} × {item.cantidad}
          </li>
        ))}
      </ul>
      <p>Total de productos: {moneda(pedido.total)}</p>
      <p>Comuna: {pedido.comuna}</p>
      <Link to={resultado === "exito" ? "/catalogo" : "/checkout"}>
        {resultado === "exito" ? "Volver al catálogo" : "Intentar nuevamente"}
      </Link>
    </section>
  );
}
export default ResultadoCompra;
