import ListaPedidos from "../components/pedidos/ListaPedidos";
function MisPedidos({ pedidos, eliminar }) {
  return (
    <section>
      <h1>Mis pedidos de demostración</h1>
      <p>
        Historial local de compras simuladas en este navegador. No contiene
        nombres, teléfonos ni direcciones y no representa pedidos reales.
      </p>
      <ListaPedidos pedidos={pedidos} eliminar={eliminar} />
    </section>
  );
}
export default MisPedidos;
