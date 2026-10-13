import { zonas } from "../data/zonas";
function Nosotros() {
  return (
    <section>
      <h1>Nosotros</h1>
      <p>
        Gas El Volcán es una distribuidora familiar fundada en 1998 en Chillán,
        Región de Ñuble. Distribuye gas licuado a clientes residenciales y
        comerciales.
      </p>
      <h2 className="mt-4">Cobertura de despacho</h2>
      <div className="row g-3">
        {zonas.map((zona) => (
          <div className="col-12 col-md-6" key={zona.nombre}>
            <article className="card h-100">
              <div className="card-body">
                <h3 className="h5">{zona.nombre}</h3>
                <p>{zona.comunas}</p>
                <p>
                  {zona.dias} · {zona.horario}
                </p>
                <p>Entrega estimada: {zona.estimacion}</p>
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}
export default Nosotros;
