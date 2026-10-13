import { zonas } from "../data/zonas";
function Nosotros() {
  return (
    <section className="nosotros-pagina">
      <p className="sobre-titulo">CERCA DE TU HOGAR</p>
      <h1>Nosotros</h1>
      <p className="texto-introduccion nosotros-descripcion">
        Gas El Volcán es una distribuidora familiar fundada en 1998 en Chillán,
        Región de Ñuble. Distribuye gas licuado a clientes residenciales y
        comerciales.
      </p>
      <h2 className="mt-4">Cobertura de despacho</h2>
      <div className="row g-3">
        {zonas.map((zona) => (
          <div className="col-12 col-md-6" key={zona.nombre}>
            <article className="card zona-tarjeta h-100">
              <div className="card-body">
                <h3 className="h5">{zona.nombre}</h3>
                <p className="texto-introduccion nosotros-descripcion">
                  {zona.comunas}
                </p>
                <p className="texto-introduccion nosotros-descripcion">
                  {zona.dias} · {zona.horario}
                </p>
                <p className="texto-introduccion nosotros-descripcion">
                  Entrega estimada: {zona.estimacion}
                </p>
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}
export default Nosotros;
