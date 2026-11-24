import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { pedirApi } from "../../services/api";

const formatoFecha = new Intl.DateTimeFormat("es-CL", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Santiago",
});

export default function AdminContacto() {
  const { sesion } = useAuth();
  const token = sesion.token;
  const [pagina, setPagina] = useState(0);
  const [revision, setRevision] = useState(0);
  const [consulta, setConsulta] = useState(null);
  const actual = consulta?.pagina === pagina && consulta.revision === revision ? consulta : null;

  useEffect(() => {
    const control = new AbortController();
    pedirApi(`/contacto/mensajes?pagina=${pagina}`, { token, signal: control.signal })
      .then((datos) => {
        if (!control.signal.aborted) setConsulta({ pagina, revision, datos });
      })
      .catch((fallo) => {
        if (!control.signal.aborted) setConsulta({ pagina, revision, error: fallo.message });
      });
    return () => control.abort();
  }, [token, pagina, revision]);

  return (
    <section aria-busy={!actual}>
      <h1>Consultas de contacto</h1>
      {!actual && <p role="status">Cargando consultas…</p>}
      {actual?.error && (
        <div className="alert alert-danger" role="alert">
          <p>{actual.error}</p>
          <button type="button" className="btn btn-outline-secondary" onClick={() => setRevision((valor) => valor + 1)}>
            Volver a intentar
          </button>
        </div>
      )}
      {actual?.datos && (
        <>
          {actual.datos.mensajes.length === 0 ? (
            <p>No hay consultas en esta página.</p>
          ) : (
            <ul className="list-unstyled">
              {actual.datos.mensajes.map(({ id, nombre, correo, mensaje, fechaCreacion }) => (
                <li key={id} className="card mb-3 p-3">
                  <h2 className="h5 text-break">{nombre}</h2>
                  <p className="mb-2 text-break">{correo}</p>
                  <p className="text-muted mb-2">
                    <time dateTime={fechaCreacion}>{formatoFecha.format(new Date(fechaCreacion))}</time>
                  </p>
                  <p className="mb-0 text-break" style={{ whiteSpace: "pre-wrap" }}>{mensaje}</p>
                </li>
              ))}
            </ul>
          )}
          <nav aria-label="Páginas de consultas" className="d-flex align-items-center flex-wrap gap-2">
            <button type="button" className="btn btn-outline-secondary"
              disabled={pagina === 0} onClick={() => setPagina((valor) => valor - 1)}>
              Anterior
            </button>
            <span>Página {pagina + 1}</span>
            <button type="button" className="btn btn-outline-secondary"
              disabled={!actual.datos.haySiguiente} onClick={() => setPagina((valor) => valor + 1)}>
              Siguiente
            </button>
          </nav>
        </>
      )}
    </section>
  );
}
