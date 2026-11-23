import { useState } from "react";
import ListaPedidos from "../components/pedidos/ListaPedidos";
import MapaSeguimiento from "../components/pedidos/MapaSeguimiento";

function MisPedidos({ pedidos, cargando, error, recargar }) {
  const [seguimiento, setSeguimiento] = useState(null);
  function acciones(pedido) {
    const abierto = seguimiento === pedido.id;
    return (
      <div>
        <button type="button" className="btn btn-outline-primary" aria-expanded={abierto}
          onClick={() => setSeguimiento(abierto ? null : pedido.id)}>
          {abierto ? "Ocultar seguimiento" : "Ver seguimiento"} del pedido {pedido.id}
        </button>
        {abierto && <MapaSeguimiento pedidos={[pedido]} etiqueta={`Mapa del pedido ${pedido.id}`} />}
      </div>
    );
  }
  return (
    <section className="historial-pagina">
      <h1>Historial de pedidos</h1>
      {cargando && <p role="status">Cargando pedidos…</p>}
      {error && (
        <div role="alert">
          <p>{error}</p>
          <button type="button" className="btn btn-outline-secondary mb-3" onClick={recargar}>Reintentar</button>
        </div>
      )}
      {!cargando && (!error || pedidos.length > 0) && <ListaPedidos pedidos={pedidos} acciones={acciones} />}
    </section>
  );
}
export default MisPedidos;
