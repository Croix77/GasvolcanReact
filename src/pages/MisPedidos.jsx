import ListaPedidos from "../components/pedidos/ListaPedidos";
function MisPedidos({ pedidos, eliminar }) {
  return (
    <section>
      <h1>Mis pedidos</h1>
      <ListaPedidos pedidos={pedidos} eliminar={eliminar} />
    </section>
  );
}
export default MisPedidos;
