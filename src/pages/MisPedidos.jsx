import ListaPedidos from "../components/pedidos/ListaPedidos";
function MisPedidos({ pedidos, eliminar }) {
  return (
    <section className="historial-pagina">
      <p className="sobre-titulo">TU HISTORIAL</p>
      <h1>Mis pedidos</h1>
      <ListaPedidos pedidos={pedidos} eliminar={eliminar} />
    </section>
  );
}
export default MisPedidos;
