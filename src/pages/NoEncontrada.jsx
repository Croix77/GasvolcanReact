import { Link } from "react-router-dom";
function NoEncontrada() {
  return (
    <section>
      <h1>Página no encontrada</h1>
      <p>La dirección solicitada no está disponible.</p>
      <Link to="/">Volver al inicio</Link>
    </section>
  );
}
export default NoEncontrada;
