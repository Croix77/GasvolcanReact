import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccionesPedido from "../components/pedidos/AccionesPedido";
import ListaPedidos from "../components/pedidos/ListaPedidos";
import MapaSeguimiento from "../components/pedidos/MapaSeguimiento";
import { useAuth } from "../hooks/useAuth";
import { usePedidos } from "../hooks/usePedidos";
import { pedirAuth } from "../services/api";

const fechaChile = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "America/Santiago", year: "numeric", month: "2-digit", day: "2-digit",
});
const titulos = {
  administrador: "Pedidos y despacho",
  operadora: "Pedidos y despacho",
  repartidor: "Entregas asignadas",
  vendedor: "Consulta de pedidos",
};

function PedidosDespacho() {
  const { sesion } = useAuth();
  const token = sesion?.token;
  const soloConsulta = sesion?.rol === "vendedor";
  const puedeGestionar = ["administrador", "operadora"].includes(sesion?.rol);
  const [fecha, setFecha] = useState(() => fechaChile.format(new Date()));
  const [consulta, setConsulta] = useState(null);
  const [revision, setRevision] = useState(0);
  const [verMapa, setVerMapa] = useState(false);
  const { pedidos, cargando, error, recargar } = usePedidos(token, puedeGestionar ? fecha : "", soloConsulta ? "pedidos" : "despacho");

  useEffect(() => {
    if (!token || !puedeGestionar) return;
    const controlador = new AbortController();
    pedirAuth("/repartidores", { token, signal: controlador.signal }).then((repartidores) => {
      if (!controlador.signal.aborted) setConsulta({ token, revision, repartidores, error: "" });
    }).catch((fallo) => {
      if (!controlador.signal.aborted) setConsulta({ token, revision, repartidores: [], error: fallo.message });
    });
    return () => controlador.abort();
  }, [puedeGestionar, token, revision]);

  if (!sesion) return null;

  const actual = consulta?.token === token && consulta.revision === revision ? consulta : null;
  const repartidores = actual?.repartidores ?? [];
  return (
    <section>
      <h1>{titulos[sesion.rol]}</h1>
      {puedeGestionar && (
        <div className="d-flex flex-wrap align-items-end gap-2 mb-3">
          <label className="form-label mb-0">
            Día de los pedidos
            <input type="date" value={fecha} className="form-control" onChange={(evento) => setFecha(evento.target.value)} />
          </label>
          <button type="button" className="btn btn-outline-secondary" onClick={() => setFecha(fechaChile.format(new Date()))}>
            Hoy
          </button>
        </div>
      )}
      {puedeGestionar && !actual && <p role="status">Cargando repartidores…</p>}
      {actual?.error && (
        <div role="alert">
          <p>{actual.error}</p>
          <button type="button" className="btn btn-outline-secondary mb-3" onClick={() => setRevision(revision + 1)}>
            Recargar repartidores
          </button>
        </div>
      )}
      {cargando && <p role="status">Cargando pedidos…</p>}
      {error && (
        <div role="alert">
          <p>{error}</p>
          <button type="button" className="btn btn-outline-secondary mb-3" onClick={recargar}>Recargar pedidos</button>
        </div>
      )}
      {!cargando && (!error || pedidos.length > 0) && (
        <>
          {pedidos.length > 0 && !soloConsulta && (
            <>
              <button type="button" className="btn btn-outline-primary mb-3" aria-expanded={verMapa}
                onClick={() => setVerMapa(!verMapa)}>
                {verMapa ? "Ocultar mapa de pedidos" : "Ver mapa de pedidos"}
              </button>
              {verMapa && <MapaSeguimiento pedidos={pedidos} etiqueta="Mapa de pedidos de despacho" />}
            </>
          )}
          <ListaPedidos pedidos={pedidos} mostrarContacto={!soloConsulta} soloResumen={soloConsulta} acciones={(pedido) => (
            soloConsulta
              ? <Link to={"/pedidos/" + pedido.id}>Ver detalle del pedido {pedido.id}</Link>
              : <AccionesPedido pedido={pedido} sesion={sesion} repartidores={repartidores} recargar={recargar} />
          )} />
        </>
      )}
    </section>
  );
}

export default PedidosDespacho;
