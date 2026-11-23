import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { pedirNegocio } from "../services/api";

function Nosotros() {
  const token = useAuth().sesion?.token;
  const [consulta, setConsulta] = useState(null);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    if (!token) return;
    const controlador = new AbortController();
    pedirNegocio("/zonas", { token, signal: controlador.signal })
      .then((zonas) => {
        if (!controlador.signal.aborted) setConsulta({ token, revision, zonas });
      })
      .catch((error) => {
        if (!controlador.signal.aborted) setConsulta({ token, revision, error: error.message });
      });
    return () => controlador.abort();
  }, [token, revision]);

  const actual = consulta?.token === token && consulta?.revision === revision ? consulta : null;
  return (
    <section className="nosotros-pagina">
      <h1>Nosotros</h1>
      <p className="texto-introduccion nosotros-descripcion">
        Gas El Volcán es una distribuidora familiar fundada en 1998 en Chillán,
        Región de Ñuble. Distribuye gas licuado a clientes residenciales y comerciales.
      </p>
      <h2 className="mt-4">Cobertura de despacho</h2>
      {!actual && <p role="status">Cargando zonas de despacho…</p>}
      {actual?.error && (
        <div role="alert">
          <p>{actual.error}</p>
          <button type="button" className="btn btn-outline-secondary" onClick={() => setRevision(revision + 1)}>
            Reintentar
          </button>
        </div>
      )}
      <div className="row g-3">
        {actual?.zonas?.map((zona) => (
          <div className="col-12 col-md-6" key={zona.nombre}>
            <article className="card zona-tarjeta h-100">
              <div className="card-body">
                <h3 className="h5">{zona.nombre}</h3>
                <p className="texto-introduccion nosotros-descripcion">{zona.comunas}</p>
                <p className="texto-introduccion nosotros-descripcion">{zona.dias} · {zona.horario}</p>
                <p className="texto-introduccion nosotros-descripcion">Entrega estimada: {zona.estimacion}</p>
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}
export default Nosotros;
