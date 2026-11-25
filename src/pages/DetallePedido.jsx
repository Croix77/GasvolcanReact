import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ListaPedidos from "../components/pedidos/ListaPedidos";
import { useAuth } from "../hooks/useAuth";
import { pedirApi } from "../services/api";

export default function DetallePedido() {
  const { id } = useParams();
  const { sesion } = useAuth();
  const token = sesion.token;
  const idValido = /^[1-9]\d{0,18}$/.test(id);
  const [consulta, setConsulta] = useState(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    if (!idValido) return;
    const controlador = new AbortController();
    pedirApi("/pedidos/" + id, { token, signal: controlador.signal })
      .then((pedido) => {
        if (!controlador.signal.aborted) setConsulta({ id, token, intento, pedido });
      })
      .catch((error) => {
        if (!controlador.signal.aborted) setConsulta({ id, token, intento, error });
      });
    return () => controlador.abort();
  }, [id, idValido, intento, token]);

  const actual = consulta?.id === id && consulta.token === token && consulta.intento === intento ? consulta : null;
  const noExiste = !idValido || actual?.error?.status === 404;
  return (
    <section>
      <h1>Detalle del pedido</h1>
      <Link to="/despacho">Volver a pedidos</Link>
      {noExiste && <p role="alert">El pedido no existe.</p>}
      {idValido && !actual && <p role="status">Cargando pedido…</p>}
      {actual?.error && !noExiste && (
        <div role="alert">
          <p>{actual.error.message}</p>
          <button type="button" className="btn btn-outline-secondary" onClick={() => setIntento(intento + 1)}>
            Volver a intentar
          </button>
        </div>
      )}
      {actual?.pedido && <ListaPedidos pedidos={[actual.pedido]} />}
    </section>
  );
}
