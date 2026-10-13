import { moneda } from "../../utils/moneda";
function AdminReportes({ productos, pedidos }) {
  return (
    <section>
      <h1>Reportes de demostración</h1>
      <p>
        Total de compras simuladas:{" "}
        {moneda(pedidos.reduce((suma, pedido) => suma + pedido.total, 0))}
      </p>
      <h2>Inventario por categoría</h2>
      <ul>
        {[...new Set(productos.map((p) => p.categoria))].map((categoria) => (
          <li key={categoria}>
            {categoria}:{" "}
            {productos
              .filter((p) => p.categoria === categoria)
              .reduce((suma, p) => suma + p.stock, 0)}{" "}
            unidades
          </li>
        ))}
      </ul>
    </section>
  );
}
export default AdminReportes;
