import { Link } from "react-router-dom";
function AdminInicio({ productos, pedidos }) {
  return (
    <section>
      <h1>Panel de administración</h1>
      <div className="row g-3 mb-4">
        {[
          ["Productos", productos.length],
          ["Pedidos", pedidos.length],
          [
            "Stock crítico",
            productos.filter((p) => p.stock <= (p.stockCritico ?? 10)).length,
          ],
        ].map(([titulo, valor]) => (
          <div className="col-12 col-md-4" key={titulo}>
            <article className="card h-100">
              <div className="card-body">
                <h2 className="h5">{titulo}</h2>
                <p className="indicador-admin">{valor}</p>
              </div>
            </article>
          </div>
        ))}
      </div>
      <Link to="/admin/productos" className="btn btn-primary">
        Gestionar productos
      </Link>
    </section>
  );
}
export default AdminInicio;
